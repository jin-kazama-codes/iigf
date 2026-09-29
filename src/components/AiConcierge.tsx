import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Calendar, 
  Building2, 
  Compass, 
  CheckCircle2, 
  RefreshCw,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { DEMO_EXHIBITORS } from '../data/mockData';
import { Exhibitor } from '../types';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  matchedExhibitors?: Exhibitor[];
  suggestedPrompts?: string[];
}

interface AiConciergeProps {
  onOpenExhibitorModal: (exhibitor: Exhibitor) => void;
  onBookMeeting: (exhibitor: Exhibitor) => void;
  onOpenRegisterModal: () => void;
  onNavigateToMeetings?: () => void;
}

export const AiConcierge: React.FC<AiConciergeProps> = ({
  onOpenExhibitorModal,
  onBookMeeting,
  onOpenRegisterModal,
  onNavigateToMeetings
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Namaste and welcome to the 75th IIGF AI Concierge! I am your 24/7 intelligent assistant for the India International Garment Fair at Bharat Mandapam, New Delhi. How may I assist your sourcing schedule today?',
      timestamp: 'Just now',
      suggestedPrompts: [
        'Find sustainable women’s apparel manufacturers',
        'Recommend low MOQ exhibitors (under 500 units)',
        'Where is the buyer registration lounge?',
        'Show me Tirupur organic cotton knits'
      ]
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickActionTopics = [
    { label: 'Find Exhibitors', query: 'Find exhibitors specializing in sustainable women\'s knitwear' },
    { label: 'Find Products', query: 'Show manufacturers producing organic cotton tops and linen dresses' },
    { label: 'Book a Meeting', query: 'I want to schedule a 30-minute meeting with an export-ready exhibitor' },
    { label: 'My Schedule', query: 'What does my current meeting schedule and agenda look like?' },
    { label: 'Event Information', query: 'What are the fair dates, timings, entry gates, and venue hall layouts?' },
    { label: 'Travel Assistance', query: 'What are recommended hotels near Bharat Mandapam and airport shuttles?' },
    { label: 'Registration Help', query: 'How does international buyer accreditation work at IIGF?' }
  ];

  const handleSend = (userText: string = inputVal) => {
    const text = userText.trim();
    if (!text) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lower = text.toLowerCase();

      let replyText = '';
      let matches: Exhibitor[] | undefined = undefined;
      let nextPrompts: string[] | undefined = undefined;

      if (lower.includes('uk') || lower.includes('women') || lower.includes('casualwear') || lower.includes('sustain')) {
        replyText = "I found 14 relevant exhibitors matching your criteria. 5 have especially strong matches based on product category, sustainability capabilities, MOQ (300-500 pcs), and verified UK export credentials.";
        matches = DEMO_EXHIBITORS.slice(0, 3);
        nextPrompts = [
          'Book a meeting with ABC Textiles',
          'Show me their certifications and lab test reports',
          'What is the walking distance between Hall 1 and Hall 2?'
        ];
      } else if (lower.includes('moq') || lower.includes('500') || lower.includes('units')) {
        replyText = "For batch orders below 500 units, we have 48 verified Indian manufacturers with dedicated low-MOQ sampling lines. Here are three recommended partners in Tirupur and Jaipur:";
        matches = [DEMO_EXHIBITORS[0], DEMO_EXHIBITORS[2], DEMO_EXHIBITORS[5]];
        nextPrompts = [
          'Can they do custom woven labels?',
          'What are typical freight lead times to Europe?',
          'Add to my shortlisted manufacturers'
        ];
      } else if (lower.includes('event') || lower.includes('date') || lower.includes('venue')) {
        replyText = "The 75th India International Garment Fair takes place from 14 to 17 July 2026 at the Bharat Mandapam Exhibition Complex, Pragati Maidan, New Delhi. Halls are open daily from 09:30 AM to 06:30 PM.";
        nextPrompts = ['Show interactive hall floor plan', 'Where is the buyer registration lounge?'];
      } else {
        replyText = `Analyzing your request: "${text}". Here are the top verified manufacturers aligned with your specifications:`;
        matches = DEMO_EXHIBITORS.slice(0, 2);
        nextPrompts = ['Send RFQ to these exhibitors', 'Filter by GOTS Organic Certification only'];
      }

      setMessages(prev => [...prev, {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchedExhibitors: matches,
        suggestedPrompts: nextPrompts
      }]);
    }, 350);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Title & Description Banner (IIGF Pink Theme) */}
      <div className="bg-[#E6005C] text-white rounded-2xl p-6 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
            <Bot className="w-4 h-4" />
            <span>Dedicated Event AI Concierge · 75th IIGF</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">
            IIGF AI Concierge
          </h2>
          <p className="text-xs text-pink-100 mt-1 max-w-xl">
            Ask any sourcing question. Find exhibitors, verify certifications, inspect MOQ guidelines, and coordinate your visit itinerary.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setMessages([messages[0]])}
            className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold rounded border border-white/30 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Chat</span>
          </button>
          <button
            onClick={onOpenRegisterModal}
            className="px-3.5 py-1.5 bg-[#EB8B2D] hover:bg-[#d67b22] text-white text-xs font-bold rounded shadow-xs cursor-pointer"
          >
            Register with AI
          </button>
        </div>
      </div>

      {/* Quick Action Pills Row */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {quickActionTopics.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(item.query)}
            className="px-3 py-1.5 bg-white hover:bg-pink-50 text-slate-700 hover:text-[#E6005C] text-xs font-medium rounded-full border border-slate-200 shadow-xs transition-colors cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Conversation Canvas */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                  msg.sender === 'user'
                    ? 'bg-slate-800 text-white'
                    : 'bg-[#E6005C] text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="max-w-[85%] sm:max-w-[75%] space-y-2">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#E6005C] text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`block text-[10px] mt-1 ${msg.sender === 'user' ? 'text-pink-100 text-right' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* Embedded Matched Exhibitor Cards */}
                {msg.matchedExhibitors && msg.matchedExhibitors.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {msg.matchedExhibitors.map((ex) => (
                        <div
                          key={ex.id}
                          className="bg-white border border-slate-200 rounded-xl p-3 hover:border-[#E6005C] transition-colors shadow-xs"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                                {ex.matchScore || 92}% Match
                              </span>
                              <h4 className="text-xs font-bold text-slate-900 mt-1">{ex.name}</h4>
                              <p className="text-[11px] text-slate-500">{ex.location}</p>
                            </div>
                            <span className="text-[10px] font-bold text-[#EB8B2D] bg-amber-50 px-1.5 py-0.5 rounded">
                              {ex.hall} ({ex.stall})
                            </span>
                          </div>

                          <div className="mt-2 text-[11px] text-slate-600 line-clamp-2">
                            {ex.tagline}
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <button
                              onClick={() => onOpenExhibitorModal(ex)}
                              className="text-slate-600 hover:text-[#E6005C] font-semibold underline text-[11px]"
                            >
                              Profile
                            </button>
                            <button
                              onClick={() => onBookMeeting(ex)}
                              className="px-2.5 py-1 bg-[#E6005C] hover:bg-[#C2004D] text-white font-bold rounded text-[11px] flex items-center gap-1 cursor-pointer"
                            >
                              <Calendar className="w-3 h-3" />
                              <span>Book Slot</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Prompts */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(prompt)}
                        className="text-[11px] bg-pink-50 hover:bg-pink-100 text-[#E6005C] px-2.5 py-1 rounded-full border border-pink-200 transition-colors cursor-pointer font-medium"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-500 text-xs pl-11">
              <span className="text-[#E6005C] font-semibold">IIGF AI Concierge is searching supplier catalogues...</span>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask anything: 'Find organic knits', 'Where is Hall 2?', 'Plan my visit'..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#E6005C] focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="px-4 py-2 bg-[#E6005C] hover:bg-[#C2004D] text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
