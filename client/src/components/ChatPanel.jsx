import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Loader2, Bot, User } from 'lucide-react';
import { sendChatMessage } from '../services/api.js';

export default function ChatPanel({ reportData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hi! I analyzed this company. Ask me any follow-up questions!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(reportData, userMessage);
      setMessages(prev => [...prev, { role: 'ai', content: response.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error connecting to the server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all z-40 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageSquare className="text-white" size={24} />
      </button>

      {/* Chat Panel */}
      <div className={`fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] bg-surface border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 z-50 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="text-primary" size={18} />
            </div>
            <h3 className="font-bold text-white">AI Assistant</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-background/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-4 py-2 text-sm bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700 flex items-center gap-2">
                <Loader2 className="animate-spin text-primary" size={14} /> Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 border-t border-gray-800 bg-surface">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this report..."
              className="w-full bg-background border border-gray-700 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-white placeholder-gray-500"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-primary rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              <Send size={14} className="ml-0.5" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
