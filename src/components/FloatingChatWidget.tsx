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
  ArrowRight,
  PhoneCall
} from 'lucide-react';
import { DEMO_EXHIBITORS } from '../data/mockData';
import { Exhibitor } from '../types';

interface FloatingChatWidgetProps {
  onOpenExhibitorModal: (exhibitor: Exhibitor) => void;
  onBookMeeting: (exhibitor: Exhibitor) => void;
  onOpenAiCaller?: () => void;
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
  onBookMeeting,
  onOpenAiCaller
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

  const handleSend = (userText: string = inputVal) => {
    const text = userText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lower = text.toLowerCase();
      let botResponse: ChatMessage;

      if (lower.includes('call') || lower.includes('speak') || lower.includes('voice') || lower.includes('talk')) {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: 'You can speak directly with our real-time AI Voice Concierge with 3D Holographic Audio.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionPrompt: {
            label: '🎙️ Launch AI Voice Caller',
            action: () => {
              if (onOpenAiCaller) onOpenAiCaller();
            }
          }
        };
      } else if (lower.includes('organic') || lower.includes('knit') || lower.includes('cotton') || lower.includes('sustain')) {
        const matched = DEMO_EXHIBITORS.filter(e => e.sustainabilityRating === 'A+' || e.categories.includes('Knitted Garments')).slice(0, 2);
        botResponse = {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: `Found ${matched.length} certified Indian manufacturers matching organic knits:`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendedExhibitors: matched
        };
      } else if (lower.includes('badge') || lower.includes('register') || lower.includes('pass')) {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: 'Overseas buyer registration includes complimentary Fast-Track VIP badge at Gate 4 and express entry across all 3 halls.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else if (lower.includes('hotel') || lower.includes('airport') || lower.includes('shuttle')) {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: 'Official 5-Star Partner hotels (The Taj Mahal Hotel, JW Marriott Aerocity) have complimentary electric coach shuttles departing every 20 minutes to Bharat Mandapam Gate 4.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: 'I have analyzed your query across 426 exhibitors at the 75th IIGF. Would you like to schedule a B2B meeting or review sample catalogs?',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendedExhibitors: DEMO_EXHIBITORS.slice(0, 2)
        };
      }

      setMessages((prev) => [...prev, botResponse]);
    }, 600);
  };

  const handleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        const sampleQuery = "Find sustainable organic cotton suppliers with MOQ below 500";
        setInputVal(sampleQuery);
        handleSend(sampleQuery);
      }, 1000);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {isOpen ? (
        <div className="bg-white dark:bg-slate-900 w-80 sm:w-96 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[480px] overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-[#E6005C] dark:bg-[#A30041] text-white p-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">75th IIGF AI Assistant</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-pink-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online · Sourcing Concierge</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {onOpenAiCaller && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenAiCaller();
                  }}
                  className="px-2 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] rounded flex items-center gap-1 cursor-pointer"
                  title="Voice Call AI"
                >
                  <PhoneCall className="w-3 h-3 text-slate-950" />
                  <span>Call AI</span>
                </button>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-3 shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-[#E6005C] text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>

                  {/* Action prompt if available */}
                  {msg.actionPrompt && (
                    <button
                      onClick={msg.actionPrompt.action}
                      className="mt-2 w-full py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[11px] rounded flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    >
                      {msg.actionPrompt.label}
                    </button>
                  )}

                  {/* Exhibitors Recommendation Cards */}
                  {msg.recommendedExhibitors && (
                    <div className="mt-2.5 space-y-2">
                      {msg.recommendedExhibitors.map((ex) => (
                        <div
                          key={ex.id}
                          className="bg-pink-50/70 dark:bg-slate-800/80 p-2.5 rounded-lg border border-pink-200 dark:border-slate-700 text-slate-900 dark:text-white space-y-1 text-[11px]"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#E6005C] dark:text-pink-400">{ex.name}</span>
                            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                              {ex.matchScore || 92}% Match
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 text-[10px] line-clamp-1">{ex.tagline}</p>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">{ex.hall} ({ex.stall}) · MOQ {ex.moq}</div>
                          <div className="flex items-center gap-2 pt-1 border-t border-pink-200/60 dark:border-slate-700">
                            <button
                              onClick={() => {
                                setIsOpen(false);
                                onOpenExhibitorModal(ex);
                              }}
                              className="text-[10px] font-bold text-[#E6005C] dark:text-pink-400 hover:underline cursor-pointer"
                            >
                              View Dossier
                            </button>
                            <span>·</span>
                            <button
                              onClick={() => {
                                setIsOpen(false);
                                onBookMeeting(ex);
                              }}
                              className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                            >
                              Book 30m Slot
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E6005C] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#E6005C] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#E6005C] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-1"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask about exhibitors, halls, MOQ..."
                className="flex-1 bg-transparent px-2 py-1 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
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
            <div className="text-[9px] text-center text-slate-400 dark:text-slate-500 mt-1">
              75th IIGF AI Sourcing Engine
            </div>
          </div>
        </div>
      ) : (
        /* Floating Pink Chat Bubble Button + Call Icon */
        <div className="flex flex-col items-center gap-2">
          {onOpenAiCaller && (
            <button
              onClick={onOpenAiCaller}
              className="px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xl flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 animate-bounce"
              title="Speak with AI Voice Agent"
            >
              <PhoneCall className="w-3.5 h-3.5 text-slate-950" />
              <span>AI Caller</span>
            </button>
          )}

          <button
            onClick={() => setIsOpen(true)}
            className="w-13 h-13 rounded-full bg-[#E6005C] hover:bg-[#C2004D] text-white shadow-2xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105 group"
            aria-label="Open AI Assistant"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
          </button>
        </div>
      )}
    </div>
  );
};
