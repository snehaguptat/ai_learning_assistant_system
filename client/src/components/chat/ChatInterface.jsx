import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import aiService from "../../services/aiService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Spinner from "../common/Spinner.jsx";
import MarkdownRenderer from "../common/MarkdownRenderer.jsx";

const ChatInterface = () => {
  const { id: documentId } = useParams();
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setInitialLoading(true);
        const response = await aiService.getChatHistory(documentId);
        setHistory(response.data);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchChatHistory();
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    setHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);
    try {
      const response = await aiService.chat(documentId, userMessage.content);
      const assistantMessage = {
        role: "assistant",
        content: response.data.answer,
        timestamp: new Date(),
        relevantChunks: response.data.relevantChunks,
      };
      setHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setHistory((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.role === "user";
    return (
      <div
        key={index}
        className={`flex items-start gap-3 my-5 animate-fade-up ${isUser ? "justify-end" : ""}`}
      >
        {!isUser && (
          <div className="icon-tile icon-tile-accent w-9 h-9">
            <Sparkles className="w-4 h-4" strokeWidth={2} />
          </div>
        )}
        <div
          className={`max-w-[85%] md:max-w-xl px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-accent text-accent-fg rounded-br-sm"
              : "bg-surface border border-line text-fg rounded-bl-sm"
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
          ) : (
            <MarkdownRenderer content={msg.content} />
          )}
        </div>
        {isUser && (
          <div className="icon-tile w-9 h-9 font-display font-semibold text-sm text-fg">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </div>
    );
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col h-[70vh] card items-center justify-center">
        <div className="icon-tile icon-tile-accent w-14 h-14 rounded-xl mb-4">
          <MessageSquare className="w-6 h-6" strokeWidth={2} />
        </div>
        <Spinner />
        <p className="eyebrow mt-1">Loading chat history</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-[70vh] card overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 px-5 md:px-8 py-4 overflow-y-auto bg-canvas/50">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="icon-tile icon-tile-accent w-14 h-14 rounded-xl mb-5">
              <MessageSquare className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-semibold text-fg mb-2">
              Start a conversation
            </h3>
            <p className="text-sm text-fg-muted">
              Ask me anything about the document.
            </p>
          </div>
        ) : (
          history.map(renderMessage)
        )}
        <div ref={messagesEndRef} />
        {loading && (
          <div className="flex items-center gap-3 my-5">
            <div className="icon-tile icon-tile-accent w-9 h-9">
              <Sparkles className="w-4 h-4" strokeWidth={2} />
            </div>
            <div className="flex items-center px-4 h-10 rounded-2xl rounded-bl-sm bg-surface border border-line">
              <div className="flex gap-1.5">
                <span
                  className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-line bg-surface">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center justify-between gap-3"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a follow-up question..."
            className="field h-12 flex-1"
            disabled={loading}
          />
          {/* will be disabled when there is loading and there is no message in the message field */}
          <button
            type="submit"
            className="btn btn-primary w-12 h-12 px-0!"
            disabled={loading || !message.trim()}
            aria-label="Send message"
          >
            <Send className="w-[18px] h-[18px]" strokeWidth={2.25} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
