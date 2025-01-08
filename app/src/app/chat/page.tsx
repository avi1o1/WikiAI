"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const getCookie = (name) => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=").map((c) => c.trim());
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
};

interface ChatResponse {
  message: string;
  model_response: string;
  source: string;
}

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const fetchChatHistory = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/history/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch chat history");
      const data = await response.json();

      // Create pairs of messages (user message + AI response)
      const formattedMessages = data.messages.reduce((acc, msg) => {
        // Add user message
        acc.push({
          content: msg.message,
          isUser: true,
          sources: msg.sources,
          timestamp: new Date(msg.timestamp),
        });

        // Add AI response if it exists
        if (msg.model_response) {
          acc.push({
            content: msg.model_response,
            isUser: false,
            timestamp: new Date(msg.timestamp),
          });
        }

        return acc;
      }, []);

      setMessages(formattedMessages);
    } catch (err) {
      setError("Failed to load chat history");
      console.error(err);
    }
  };

  const sendMessageToBackend = async (userId: string, message: string): Promise<ChatResponse | null> => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/chat/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: message }),
      });
  
      if (!response.ok) throw new Error("Failed to send message");
  
      const data = await response.json();
      return data; // Return full response object
    } catch (err) {
      setError("Failed to send message");
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const userNumber = getCookie("WikiAI_user_number");
    const hasStarted = getCookie("WikiAI_started");

    if (!userNumber || !hasStarted) {
      router.push("/");
      return;
    }

    fetchChatHistory(userNumber);
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (content, isUser = true, sources?: string) => {
    setMessages((prev) => [
      ...prev,
      { content, isUser, timestamp: new Date(), sources },
    ]);
  };

  // Update handleSend
const handleSend = async () => {
  if (inputMessage.trim()) {
    const userId = getCookie("WikiAI_user_number");
    if (!userId) {
      router.push("/");
      return;
    }

    addMessage(inputMessage.trim(), true);
    setInputMessage("");

    const response = await sendMessageToBackend(userId, inputMessage.trim());
    if (response) {
      addMessage(response.model_response, false, response.source);
    }
  }
};

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-bg-dark text-text-light min-h-screen flex flex-col font-sans">
      <Header />

      <div className="flex-grow flex flex-col max-w-4xl mx-auto w-full p-4">
        {error && (
          <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>
        )}

        <div className="flex-grow bg-bg-accent rounded-lg p-4 mb-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"} mb-4`}
              >
                <div
                  className={`relative max-w-[70%] rounded-2xl p-4 ${
                    msg.isUser
                      ? "bg-primary-green text-bg-dark rounded-br-none"
                      : "bg-primary-blue text-[#007BFF] rounded-bl-none"
                  }`}
                >
                <p className="break-words">{msg.content}</p>
                  {!msg.isUser && msg.sources && (
                    <div className="mt-2 pt-2 border-t border-[#007BFF]/20 text-xs">
                      <p className="font-semibold mb-1 text-[#00FF85]">Sources:</p>
                      {msg.sources.split(',').map((source, i) => {
                        const [title, url] = source.split(': ');
                        return (
                          <p key={i} className="text-[#007BFF]/70 hover:text-[#00FF85]">
                            {title}: <a 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary-blue hover:text-primary-green underline"
                            >
                              {url}
                            </a>
                          </p>
                        );
                      })}
                    </div>
                  )}
                  <span
                    className={`text-xs mt-1 ${
                      msg.isUser ? "text-bg-dark/70 text-right" : "text-[#007BFF]/70 text-left"
                    } block`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-lg p-3 bg-primary-blue text-[#007BFF]">
                  <div className="text-center p-2 bounce-container">
                    <div className="bounce-dot"></div>
                    <div className="bounce-dot"></div>
                    <div className="bounce-dot"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-grow p-3 rounded-lg bg-bg-accent text-black focus:outline-none focus:ring-2 mb-5"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
