
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { getNutritionAdvice } from '../services/geminiService';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface AIAssistantProps {
  userContext: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ userContext }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Welcome to your elite performance portal. How can I assist your nutritional strategy today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    const aiResponse = await getNutritionAdvice(userMessage, userContext);
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    setLoading(false);
  };

  return (
    <div className="bg-[#141414] border border-[#222] rounded-[2.5rem] flex flex-col h-[500px] overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-[#222] flex items-center justify-between">
        <h2 className="text-[#c5a059] font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
          <Sparkles size={14} /> AI Nutrition Strategist
        </h2>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl flex gap-3 ${
              msg.role === 'user' ? 'bg-[#c5a059] text-black' : 'bg-[#1a1a1a] text-slate-300'
            }`}>
              {msg.role === 'assistant' && <Bot size={18} className="flex-shrink-0 mt-1" />}
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
              {msg.role === 'user' && <User size={18} className="flex-shrink-0 mt-1" />}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#1a1a1a] p-4 rounded-2xl flex gap-3">
              <Loader2 size={18} className="animate-spin text-[#c5a059]" />
              <span className="text-xs text-slate-500 italic">Processing elite strategies...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#0a0a0a] border-t border-[#222]">
        <div className="relative">
          <input
            type="text"
            placeholder="Ask about your diet or performance..."
            className="w-full bg-[#141414] border border-[#222] rounded-full py-3 pl-6 pr-14 text-sm focus:outline-none focus:border-[#c5a059] transition-colors"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="absolute right-2 top-1.5 p-2 bg-[#c5a059] text-black rounded-full hover:scale-105 transition-transform disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
