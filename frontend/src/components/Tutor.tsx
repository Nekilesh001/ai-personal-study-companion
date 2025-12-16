import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useStudy } from "../context/StudyContext";

interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function Tutor() {
  const navigate = useNavigate();
  const { addToSavedContent } = useStudy();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI tutor. Ask me anything about your studies and I'll help explain concepts, solve problems, or clarify doubts. What would you like to learn today?",
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [showActions, setShowActions] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const askTutor = async () => {
    if (!question.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      content: question.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);
    
    try {
      const response = await api.post("/tutor", {
        question: userMessage.content
      });
      
      const aiAnswer = response.data.answer;

const aiMessage: ChatMessage = {
  id: Date.now() + 1,
  type: 'ai',
  content: aiAnswer,
  timestamp: new Date()
};

setMessages(prev => [...prev, aiMessage]);

//AUTO-SAVE TO NOTEBOOK (MEMORY LAYER)
addToSavedContent(aiAnswer);

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "Sorry, I couldn't process your question. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askTutor();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: "Hello! I'm your AI tutor. Ask me anything about your studies and I'll help explain concepts, solve problems, or clarify doubts. What would you like to learn today?",
        timestamp: new Date()
      }
    ]);
  };

  const saveContent = (content: string) => {
    addToSavedContent(content);
    if (window.confirm("Content saved! Would you like to view your notebook?")) {
      navigate("/notebook");
    }
  };

  const generateQuizFromContent = async (content: string) => {
    try {
      const response = await api.post("/quiz-from-content", {
        content: content
      });
      // Navigate to quiz with generated questions
      navigate("/quiz", { state: { questions: response.data.questions } });
    } catch (error) {
      alert("Failed to generate quiz. Please try again.");
    }
  };

  const generateFlashcardsFromContent = async (content: string) => {
    try {
      const response = await api.post("/flashcards-from-content", {
        content: content
      });
      // Navigate to flashcards with generated cards
      navigate("/flashcards", { state: { flashcards: response.data.flashcards } });
    } catch (error) {
      alert("Failed to generate flashcards. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-4 h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-full">
              <span className="text-white text-xl">🤖</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">AI Tutor</h1>
              <p className="text-sm text-gray-600">Your personal learning assistant</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={clearChat}
              className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 text-sm"
            >
              Clear Chat
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm"
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 bg-white shadow-lg overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-purple-500 text-white'
                  }`}>
                    {message.type === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className={`p-4 rounded-2xl max-w-md ${
                    message.type === 'user'
                      ? 'bg-indigo-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-2 opacity-70 ${
                      message.type === 'user' ? 'text-indigo-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    
                    {/* Action buttons for AI messages */}
                    {message.type === 'ai' && message.content.length > 100 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => saveContent(message.content)}
                          className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                        >
                          💾 Save
                        </button>
                        <button
                          onClick={() => generateQuizFromContent(message.content)}
                          className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                        >
                          🧠 Quiz
                        </button>
                        <button
                          onClick={() => generateFlashcardsFromContent(message.content)}
                          className="bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600"
                        >
                          🃏 Cards
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                  🤖
                </div>
                <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-b-xl shadow-lg p-4">
          <div className="flex space-x-3">
            <textarea
              ref={inputRef}
              className="flex-1 border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors resize-none"
              rows={2}
              placeholder="Ask your question here... (Press Enter to send, Shift+Enter for new line)"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={askTutor}
              disabled={loading || !question.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed font-semibold transform hover:scale-105 transition-all duration-200"
            >
              {loading ? "🤔" : "📤"}
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            💡 Try asking: "Explain machine learning", "Help me with calculus", "What is photosynthesis?"
          </div>
        </div>
      </div>
    </div>
  );
}
