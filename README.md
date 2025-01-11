# WikiAI - Your Smart Knowledge Navigator 📚🤖

## Introduction

Welcome to WikiAI, where advanced AI meets the vast knowledge base of Wikipedia!

Our intelligent research assistant is designed to find and decode the exact information you need - no links or manual searching required. Simply ask your question, and let our AI do the heavy lifting.

### Project Goals

1. Provide precise and relevant answers using AI-powered search.
2. Simplify navigation through complex topics effortlessly.
3. Offer global accessibility to information from anywhere in the world.

## System Design and Architecture

### Overview

The web-app is structured to deliver a seamless knowledge discovery experience:

- **The Interface (UI)**: A user-friendly frontend that makes accessing information a breeze.
- **The Engine (Backend)**: A powerful combination of AI-driven search and intelligent data synthesis.

### Key Technologies

- **LangChain Core**: The brain behind the screen, powered by NVIDIA AI Endpoints.
- **FastAPI**: To match with your curiosity. No waiting, just answers!
- **Next.js**: Ready for your next big question that you'll quiz us with.

### Data Flow

1. You ask a question, and our AI scans Wikipedia's vast knowledge base for relevant articles.
3. The necessary information is extracted form the pages and synthesized into clear, accessible answers.
4. You receive comprehensive, easy-to-understand responses with proper context along with the source article links.

## Features

- **AI-Powered Search**: Leverage cutting-edge AI to find precise and relevant answers.
- **Simplified Navigation**: Navigate through complex topics effortlessly.
- **Global Accessibility**: Access information from anywhere in the world with ease.
- **Context-Aware Recommendations**: Explore related topics and delve deeper into your research.
- **Custom Summaries**: Get tailored, concise answers based on your queries.
- **Context Retention**: Our AI retains context to provide coherent and relevant answers across multiple queries.
- **Source Attribution**: Provides sources for the information to ensure credibility and transparency.
- **Relevant Article Search**: Searches relevant articles to give the best possible answer.

## How to Use

WikiAI is an easy to use application. However, not yet being deployed, one has to run it locally on your machine. But don't worry, we've got you covered!

Follow these steps to clone, set up, and run WikiAI:


### 1. Clone the Repository
```sh
git clone https://github.com/avi1o1/WikiAI.git
cd WikiAI
```

### 2. Create a Virtual Environment and Install Dependencies
Just run the following file to set up the environment and install the necessary packages (Note, you'll need to have Python installed on your machine and might need to give executable permissions to the file):
```sh
chmod +x setup.sh    # (Optional) to give executable permissions
./setup.sh
```

### 3. Set up the Environment Variables
Create a `.env` file in the `.\` directory and add the following environment variables:
```sh
LANGCHAIN_API_KEY=YOUR_API_KEY
NVIDIA_API_KEY=YOUR_API_KEY
WIKI_SEARCH_RESULTS_COUNT=5
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
SIMILARITY_SEARCH_K=5
```
You may adjust the values of the variables as per your requirements. For the `LANGCHAIN_API_KEY` and `NVIDIA_API_KEY`, you need to sign up on the respective platforms to get the API keys.

### 4. Start the Servers
We now need to start the FastAPI server for the backend and Next.js server for the frontend. Run the following script to start both servers:
```sh
chmod +x run.sh    # (Optional) to give executable permissions
./run.sh
```
Now, you have both the servers running. The FastAPI server will be running on `http://localhost:8000` and the Next.js server will be running on `http://localhost:3000`.

### 5. Access the Web Application
Open your browser and navigate to `http://localhost:3000` to access the WikiAI web application. You can now start asking questions in the chat page and exploring the vast knowledge base of Wikipedia!

### 6. Stop the Servers
Once you're done using the application, you can simply stop all the servers using the following script:
```sh
chmod +x stop.sh    # (Optional) to give executable permissions
./stop.sh
```

## Snapshots
Following are some snapshots of the WikiAI web application, you may refer to [./snapshots](./snapshots) for more snapshots.
## Future Scope
We're not stopping here! Our future plans include:

1. **Enhanced Knowledge Graphs**: Visualizing interconnections between concepts for better comprehension.
2. **Advanced Analytics**: Gaining insights from trends and patterns in your research.
3. **Personalized Recommendations**: Tailoring content based on your preferences and interests.
4. **Multi-Language Support**: Expanding our reach to cater to a global audience.
5. **Voice Search Integration**: Making information access even more convenient with voice commands.
6. **Advanced Search Filters**: Refine search results with powerful filters.

## Acknowledgements
- **Wikipedia**: For providing a vast knowledge base that powers our research assistant.
- **NVIDIA**: For their cutting-edge AI technology that drives our search engine.
- **Team HearU**: Frontend design inspiration for the website (https://github.com/Arihant25/HearU).

## Note:
Remember, WikiAI is here to assist you in researching a topic; and providing you with the most relevant information. However, it is always recommended to cross-verify the information from multiple sources for accuracy and credibility.