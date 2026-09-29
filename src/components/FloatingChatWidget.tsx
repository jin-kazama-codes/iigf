import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Mic, 
  Sparkles, 
  ChevronDown,
  Building2,
  Calendar,
  MapPin,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { DEMO_EXHIBITORS } from '../data/mockData';
import { Exhibitor } from '../types';

interface FloatingChatWidgetProps {
  onOpenExhibitorModal: (exhibitor: Exhibitor) => void;
  onBookMeeting: (exhibitor: Exhibitor) => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  recommendedExhibitors?: Exhibitor[];
  actionPrompt?: {
    label: string;
    action: () => void;
  };
}

export const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({
  onOpenExhibitorModal,
  onBookMeeting
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'bot',
      text: 'Namaste! Welcome to the 75th IIGF AI Assistant. How can I help with your garment sourcing, stall locations, or meeting schedule today?',
      time: 'Just now'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lower = text.toLowerCase();

      let reply = 'I have analyzed the 75th IIGF database (426 exhibitors, Bharat Mandapam, New Delhi).';
      let recommended: Exhibitor[] = [];

      if (lower.includes('women') || lower.includes('knit') || lower.includes('organic') || lower.includes('sustainable') || lower.includes('moq')) {
        reply = 'I found top verified Indian manufacturers matching your sustainability & low MOQ criteria:';
        recommended = [DEMO_EXHIBITORS[0], DEMO_EXHIBITORS[1]];
      } else if (lower.includes('date') || lower.includes('when') || lower.includes('time') || lower.includes('venue') || lower.includes('location')) {
        reply = 'The 75th India International Garment Fair is taking place from 14 to 17 July 2026 at Bharat Mandapam (Pragati Maidan), New Delhi-110001, India.';
      } else if (lower.includes('buyer') || lower.includes('register') || lower.includes('pass') || lower.includes('hotel')) {
        reply = 'Overseas buyers receive complimentary access, VIP lounge entry at Gate 4, and hotel shuttle transfers between Aerocity / Central Delhi and Bharat Mandapam.';
      } else if (lower.includes('print') || lower.includes('jaipur') || lower.includes('silk')) {
        reply = 'For artisanal block prints, pure silks, and kaftans, here are top recommended exhibitors in Hall 1:';
        recommended = [DEMO_EXHIBITORS[2]];
      } else if (lower.includes('denim') || lower.includes('bengaluru') || lower.includes('wash')) {
        reply = 'Here are our certified eco-denim and tailored casualwear manufacturers in Hall 3:';
        recommended = [DEMO_EXHIBITORS[3]];
      } else {
        reply = `I understand you are asking about "${text}". Across Halls 1, 2, and 3, our AI matchmaker connects you directly with certified exporters with verified GOTS, BSCI, and ISO audits.`;
        recommended = [DEMO_EXHIBITORS[0]];
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedExhibitors: recommended.length > 0 ? recommended : undefined
      };

      setMessages(prev => [...prev, botMsg]);
    }, 450);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputVal(transcript);
            handleSend(transcript);
          }
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
      } catch (e) {
        setIsListening(false);
      }
    } else {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        const sampleQuery = "Find sustainable women's knitwear manufacturers below MOQ 500";
        setInputVal(sampleQuery);
        handleSend(sampleQuery);
      }, 1000);
    }
  };

  const quickChips = [
    "Find low MOQ organic knits",
    "Where is Hall 2?",
    "When is the 75th IIGF?",
    "Exhibitors from Jaipur"
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Expanded Chat Box (Exact IIGF Pink Theme) */}
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-96 overflow-hidden flex flex-col h-[520px] animate-scale-up">
          {/* Header */}
          <div className="bg-[#E6005C] text-white p-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white text-[#E6005C] flex items-center justify-center font-bold text-xs shadow-xs">
                <Sparkles className="w-4 h-4 text-[#E6005C]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white tracking-wide uppercase">IIGF AI Assistant</h4>
                <span className="text-[10px] text-pink-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  Online · 426 Exhibitors Connected
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-[#C2004D] p-1.5 rounded-lg cursor-pointer transition-colors"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#FDF2F5]/50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] p-3 rounded-xl shadow-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#E6005C] text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-pink-100 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Exhibitor Cards inside Chat Response */}
                  {m.recommendedExhibitors && m.recommendedExhibitors.length > 0 && (
                    <div className="mt-2.5 space-y-2 pt-2 border-t border-slate-100">
                      {m.recommendedExhibitors.map((ex) => (
                        <div
                          key={ex.id}
                          className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 text-left space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#E6005C] bg-pink-50 px-1.5 py-0.5 rounded border border-pink-200">
                              {ex.hall} ({ex.stall})
                            </span>
                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                              {ex.matchScore || 94}% Match
                            </span>
                          </div>
                          <div className="font-bold text-xs text-slate-900">{ex.name}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{ex.tagline}</div>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => {
                                onOpenExhibitorModal(ex);
                                setIsOpen(false);
                              }}
                              className="text-[10px] font-bold text-slate-700 underline hover:text-[#E6005C] cursor-pointer"
                            >
                              View Dossier
                            </button>
                            <button
                              onClick={() => {
                                onBookMeeting(ex);
                                setIsOpen(false);
                              }}
                              className="px-2 py-0.5 bg-[#E6005C] hover:bg-[#C2004D] text-white text-[10px] font-bold rounded cursor-pointer ml-auto"
                            >
                              Book Slot
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className={`block text-[9px] mt-1 ${m.sender === 'user' ? 'text-pink-100 text-right' : 'text-slate-400'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white p-2.5 rounded-xl border border-pink-100 w-24">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E6005C] animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#E6005C] animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#E6005C] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1 overflow-x-auto text-[11px]">
            {quickChips.map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 bg-white hover:bg-pink-50 border border-slate-200 hover:border-pink-300 text-slate-700 hover:text-[#E6005C] rounded-full whitespace-nowrap transition-colors cursor-pointer text-[10px] font-medium shrink-0"
              >
                {chip}
              </button>
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
                placeholder="Ask about exhibitors, knits, dates..."
                className="flex-1 bg-transparent text-xs text-slate-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  isListening ? 'bg-[#E6005C] text-white animate-pulse' : 'text-slate-400 hover:text-[#E6005C]'
                }`}
                title="Voice Search"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
              <button
                type="submit"
                className="p-1.5 bg-[#E6005C] hover:bg-[#C2004D] text-white rounded text-xs cursor-pointer shadow-xs"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
            <div className="text-[9px] text-center text-slate-400 mt-1">
              75th IIGF AI Sourcing Engine
            </div>
          </div>
        </div>
      ) : (
        /* Floating Pink Chat Bubble Button */
        <button
          onClick={() => setIsOpen(true)}
          className="w-13 h-13 rounded-full bg-[#E6005C] hover:bg-[#C2004D] text-white shadow-2xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105 group"
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
        </button>
      )}
    </div>
  );
};
