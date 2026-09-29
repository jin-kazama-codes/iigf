import React, { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Mic, 
  Paperclip, 
  Sparkles, 
  ChevronDown,
  Bot,
  User,
  Check
} from 'lucide-react';
import { DEMO_EXHIBITORS } from '../data/mockData';
import { Exhibitor } from '../types';

interface FloatingChatWidgetProps {
  onOpenExhibitorModal: (exhibitor: Exhibitor) => void;
  onBookMeeting: (exhibitor: Exhibitor) => void;
}

export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({
  onOpenExhibitorModal,
  onBookMeeting
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<Array<{
    sender: 'bot' | 'user';
    text: string;
    time: string;
  }>>([
    {
      sender: 'bot',
      text: 'Namaste! Welcome to IIGF AI Concierge. How can I help with your garment sourcing or visitor pass today?',
      time: 'Just now'
    }
  ]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal.trim();
    if (!text) return;

    const newMsg = {
      sender: 'user' as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputVal('');

    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = 'Thank you for your enquiry. I have verified 426 exhibitors in Halls 1, 2, and 3. Would you like me to recommend suppliers with low MOQ or book an appointment?';

      if (lower.includes('women') || lower.includes('knit') || lower.includes('organic')) {
        reply = 'I found 14 matching exporters including ABC Textiles (Stall B-17) and XYZ Garments (Stall D-08). Both have verified GOTS certificates and UK export history.';
      } else if (lower.includes('date') || lower.includes('venue')) {
        reply = 'The 75th IIGF is scheduled for 14-17 July 2026 at Bharat Mandapam, Pragati Maidan, New Delhi.';
      }

      setMessages(prev => [...prev, {
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 400);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Expanded Chat Box (Exact Screenshot 5 Widget) */}
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-96 overflow-hidden flex flex-col h-[480px] animate-scale-up">
          {/* Magenta Header (Screenshot 5) */}
          <div className="bg-[#E6005C] text-white p-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white text-[#E6005C] flex items-center justify-center font-bold text-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">Have a question?</h4>
                <span className="text-[10px] text-pink-100 block -mt-0.5">IIGF AI Event Assistant</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-[#C2004D] p-1 rounded cursor-pointer"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#FDF2F5]/40 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl shadow-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#E6005C] text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-pink-100 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  <span className={`block text-[9px] mt-1 ${m.sender === 'user' ? 'text-pink-100 text-right' : 'text-slate-400'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-2.5 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus-within:border-[#E6005C]"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-xs text-slate-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleSend("Can you find organic cotton knitwear exhibitors below MOQ 500?")}
                className="text-slate-400 hover:text-[#E6005C] p-1 cursor-pointer"
                title="Quick Prompt"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
              <button
                type="submit"
                className="p-1.5 bg-[#E6005C] hover:bg-[#C2004D] text-white rounded text-xs cursor-pointer"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
            <div className="text-[10px] text-center text-slate-400 mt-1">
              Powered by Bharat Tex & IIGF AI
            </div>
          </div>
        </div>
      ) : (
        /* Floating Pink Chat Bubble Button (Screenshot 5) */
        <button
          onClick={() => setIsOpen(true)}
          className="w-13 h-13 rounded-full bg-[#E6005C] hover:bg-[#C2004D] text-white shadow-2xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
