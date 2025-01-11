import os
import bs4
import wikipedia

import json
from datetime import datetime
from typing import List, Optional, Dict

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware

from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.graph import MessagesState, StateGraph, END
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_core.tools import tool
from langchain_core.messages import SystemMessage
from langgraph.checkpoint.memory import MemorySaver
from langchain_nvidia_ai_endpoints import ChatNVIDIA, NVIDIAEmbeddings

import sqlite3
import logging
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

WIKI_SEARCH_RESULTS_COUNT = int(os.getenv("WIKI_SEARCH_RESULTS_COUNT", 3))
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", 1000))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", 200))
SIMILARITY_SEARCH_K = int(os.getenv("SIMILARITY_SEARCH_K", 5))

# Initialize Modules
class Query(BaseModel):
    text: str

class SearchResult(BaseModel):
    sources: List[Dict[str, str]]
    answer: str

class User(BaseModel):
    user_id: str
    name: Optional[str] = None

class Message(BaseModel):
    text: str

class ConversationHistory(BaseModel):
    messages: List[Dict]
    source: Optional[Dict] = None

class DatabaseManager:
    """ Database manager for storing user and conversation data. """
    def __init__(self, db_path="WikiAI.db"):
        self.db_path = db_path
        self.init_db()

    def init_db(self):
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()

        # Update users table to use user_id
        c.execute('''
            CREATE TABLE IF NOT EXISTS users
            (user_id TEXT PRIMARY KEY, name TEXT)
        ''')

        # Update conversations table to use user_id
        c.execute('''
            CREATE TABLE IF NOT EXISTS conversations
            (id INTEGER PRIMARY KEY AUTOINCREMENT,
             user_id TEXT,
             message TEXT,
             timestamp TEXT,
             source TEXT,
             model_response TEXT)
        ''')

        conn.commit()
        conn.close()

    def add_user(self, user_id: str, name: Optional[str] = None):
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        c.execute('INSERT OR REPLACE INTO users (user_id, name) VALUES (?, ?)',
                  (user_id, name))
        conn.commit()
        conn.close()

    def add_conversation(self, user_id: str, message: str, source: dict, model_response: str):
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        timestamp = datetime.now().isoformat()
        c.execute('''
            INSERT INTO conversations
            (user_id, message, timestamp, source, model_response)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, message, timestamp, json.dumps(source), model_response))
        conn.commit()
        conn.close()

    def get_conversation_history(self, user_id: str) -> List[Dict]:
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        c.execute('''
            SELECT message, timestamp, source, model_response
            FROM conversations
            WHERE user_id = ?
            ORDER BY timestamp
        ''', (user_id,))
        rows = c.fetchall()
        conn.close()

        return [
            {
                'message': row[0],
                'timestamp': row[1],
                'source': json.loads(row[2]),
                'model_response': row[3]
            }
            for row in rows
        ]


# Function to retrieve relevant Wikipedia articles
def findWikiArticles(query, cnt=WIKI_SEARCH_RESULTS_COUNT):
    content = {}
    articles = []

    try:
        # Override Wikipedia's BeautifulSoup configuration
        wikipedia.BeautifulSoup = lambda content: bs4.BeautifulSoup(content, features="html.parser")
        
        # Search for articles
        search_results = wikipedia.search(query, results=cnt)
        
        # Get content for each result
        for title in search_results:
            try:
                wiki_page = wikipedia.page(title, auto_suggest=False)
                content[wiki_page.url] = wiki_page.content
                articles.append((wiki_page.title, wiki_page.url))
            except wikipedia.exceptions.DisambiguationError as e:
                # Handle disambiguation by taking first suggestion
                if e.options:
                    try:
                        wiki_page = wikipedia.page(e.options[0], auto_suggest=False)
                        content[wiki_page.url] = wiki_page.content
                    except:
                        continue
            except Exception as e:
                print(f"Error fetching article {title}: {str(e)}")
                continue
                
    except Exception as e:
        print(f"Error in Wikipedia search: {str(e)}")
    
    # if not content:
    #     print("No relevant articles found.")
    # else:
    #     print(f"\n    Source Articles Used:")
    #     for article in articles:
    #         print(f"\t{article[0]}: {article[1]}")
    return (content, articles)

# Define the retrieval tool
@tool(response_format="content_and_artifact")
def retrieve(query: str):
    """Retrieve information related to a query."""
    global vector_store
    retrieved_docs = vector_store.similarity_search(query, k=SIMILARITY_SEARCH_K)
    serialized = "\n\n".join(
        (f"Source: {doc.metadata}\n" f"Content: {doc.page_content}")
        for doc in retrieved_docs
    )
    return serialized, retrieved_docs

# Generating tool call
def query_or_respond(state: MessagesState):
    """Generate tool call for retrieval / respond."""
    global llm
    llm_with_tools = llm.bind_tools([retrieve])
    response = llm_with_tools.invoke(state["messages"])
    return {"messages": [response]}

# Generating response
def generate(state: MessagesState):
    """Generate answer based on extracted content."""
    global llm
    # Get generated ToolMessages
    recent_tool_messages = []
    for message in reversed(state["messages"]):
        if message.type == "tool":
            recent_tool_messages.append(message)
        else:
            break
    tool_messages = recent_tool_messages[::-1]

    # Format into prompt
    docs_content = "\n\n".join(doc.content for doc in tool_messages)
    system_message_content = (
        "You are a knowledgeable assistant focused on providing accurate Wikipedia-based information. "
        "Use the provided context to answer questions concisely and precisely. However, don't mention about the context itself. "
        "If the context only partially addresses the question, share what you can confidently say based on it. "
        "If the context is insufficient, clearly state which parts you cannot address. "
        "Aim to be helpful while staying grounded in the provided sources - do not make assumptions or add external information. "
        "Keep responses focused and brief, ideally within 3-5 sentences.\n\n"
        f"{docs_content}"
    )
    conversation_messages = [
        message
        for message in state["messages"]
        if message.type in ("human", "system")
        or (message.type == "ai" and not message.tool_calls)
    ]
    prompt = [SystemMessage(system_message_content)] + conversation_messages

    # Run
    response = llm.invoke(prompt)
    return {"messages": [response]}

def setup():
    global llm, embeddings, vector_store
    global memory, graph, config

    # Set the environment variables
    os.environ["LANGCHAIN_TRACING_V2"] = "true"
    os.environ.get("LANGCHAIN_API_KEY")
    os.environ.get("NVIDIA_API_KEY")

    # Initialize models
    llm = ChatNVIDIA(model="meta/llama-3.1-405b-instruct")
    embeddings = NVIDIAEmbeddings(model="NV-Embed-QA")
    vector_store = InMemoryVectorStore(embeddings)
    
    # Set up the graph
    graph_builder = StateGraph(MessagesState)
    tools = ToolNode([retrieve])
    graph_builder.add_node(query_or_respond)
    graph_builder.add_node(tools)
    graph_builder.add_node(generate)
    graph_builder.set_entry_point("query_or_respond")
    graph_builder.add_conditional_edges(
        "query_or_respond",
        tools_condition,
        {END: END, "tools": "tools"},
    )
    graph_builder.add_edge("tools", "generate")
    graph_builder.add_edge("generate", END)

    # Set up memory and compile graph
    memory = MemorySaver()
    graph = graph_builder.compile(checkpointer=memory)
    config = {"configurable": {"thread_id": "WikiUser"}}


# Initialize core components
db_manager = DatabaseManager()

app = FastAPI(title="WikiAI Backend API")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],    # TODO: Added to avoid CORS issues
    allow_credentials=True,
    allow_methods=["*"],                        # Allows all methods
    allow_headers=["*"],                        # Allows all headers
)

logger = logging.getLogger(__name__)
global llm, embeddings, vector_store, memory, graph, config
users_db = {}                                   # In-memory database for users
conversations_db = {}                           # In-memory database for conversations


# FastAPI endpoints
@app.post("/users/", response_model=dict)
async def create_user(user: User):
    """Create a new user in the system"""
    try:
        db_manager.add_user(user.user_id, user.name)
        return {"message": "User created successfully", "user_id": user.user_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.get("/history/{user_id}", response_model=ConversationHistory)
async def get_history(user_id: str):
    """Get conversation history for a user"""
    try:
        history = db_manager.get_conversation_history(user_id)
        return ConversationHistory(messages=history)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat/{user_id}", response_model=dict)
async def chat(user_id: str, message: Message):
    """Process a chat message using WikiAI and return source with response"""

    global vector_store
    try:
        # Find and process relevant Wikipedia articles
        content, sources = findWikiArticles(message.text)
        
        # Convert text content to Documents
        if content:
            docs = [
                Document(
                    page_content=content,
                    metadata={"source": url}
                ) for url, content in content.items()
            ]

            # Split and store documents
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)
            all_splits = text_splitter.split_documents(docs)
            vector_store.add_documents(documents=all_splits)

        # Process question and generate response
        responses = []
        for step in graph.stream(
            {"messages": [{"role": "user", "content": message.text}]},
            stream_mode="values",
            config=config,
        ):
            responses = step["messages"]
        
        # Create source dictionary for storage
        source_dict = {
            "articles": [
                {
                    "title": article[0],
                    "url": article[1]
                } for article in sources
            ]
        }
        
        # Store the conversation in the database
        db_manager.add_conversation(
            user_id=user_id,
            message=message.text,
            source=source_dict,
            model_response=responses[-1].content
        )
        
        return {
            "message": message.text,
            "source": ",".join([f"{article[0]}: {article[1]}" for article in sources]),
            "model_response": responses[-1].content
        }
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your request"
        ) from e


# Start the server
if __name__ == "__main__":
    # Configuration
    host = "0.0.0.0"
    port = 8000

    # Print startup message
    print(f"""
    ===============================================
    WikiAI Backend Server Unit
    ===============================================

    Server starting up...

    Available endpoints:
    - POST   /users/                  Create new user
    - POST   /chat/{{user_id}}           Send message
    - GET    /history/{{user_id}}        Get chat history
    - POST   /close_conversation/{{user_id}} Close session

    Server will be available at:
    http://{host}:{port}

    Documentation will be available at:
    http://{host}:{port}/docs

    Press Ctrl+C to stop the server
    ===============================================
    """)

    # Run server
    setup()
    print("Server setup complete. Starting server...")
    uvicorn.run(app, host=host, port=port)