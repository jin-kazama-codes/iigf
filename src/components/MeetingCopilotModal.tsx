import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  Mail, 
  Send, 
  Check, 
  Copy
} from 'lucide-react';
import { Meeting } from '../types';

interface MeetingCopilotModalProps {
  meeting: Meeting | null;
  isOpen: boolean;
  onClose: () => void;
  onFollowUpDispatched: (meetingId: string) => void;
}

export const MeetingCopilotModal: React.FC<MeetingCopilotModalProps> = ({
  meeting,
  isOpen,
  onClose,
  onFollowUpDispatched
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'drafts'>('summary');
  const [selectedChannel, setSelectedChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [isCopied, setIsCopied] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);

  if (!isOpen || !meeting) return null;

  const summaryData = {
    buyerRequirements: [
      'GOTS certified 100% organic combed cotton jersey (180 GSM)',
      'Flexible private-label MOQ starting at 500 units per colorway',
      'Tested to UK high street shrinkage & colorfastness tolerances',
      'Delivery window for Spring/Summer 2027'
    ],
    exhibitorCommitments: [
      'Dispatch digital high-resolution SS27 lookbook within 24 hours',
      'Ship physical fabric swatch cards to London office',
      'Submit FOB Mumbai itemized costing breakdown'
    ],
    aiRecommendedFollowUp: 'Send catalogue within 24 hours while buyer momentum from the stall visit is high.',
    messages: {
      whatsapp: `Hi ${meeting.buyerName}, thank you for visiting ${meeting.exhibitorName} at IIGF Hall 2 today! As discussed, here is the direct link to our SS27 GOTS Organic Cotton catalog: [abctextiles-demo.in/ss27-catalog]. We are preparing your custom swatch pack for London shipment. Let me know if you need any tech-pack adjustments! - Rajesh K.`,
      email: `Subject: Follow-up from 75th IIGF Delhi — ${meeting.exhibitorName} & ${meeting.buyerCompany}

Dear ${meeting.buyerName},

Thank you for spending time with our executive team at Stall B-17 during the India International Garment Fair today.

Per our discussion:
1. Product Interest: GOTS Certified Organic Cotton Women's Casualwear
2. Target Volume: 500 units/style private-label run
3. Compliance: Verified GOTS and SEDEX SMETA certificates attached

As promised, our team has couriered your requested fabric swatch kit to your London office. Please find our complete FOB pricing matrix attached.

Warm regards,
Rajesh K. Sundaram
Head of International Exports, ${meeting.exhibitorName}`
    }
  };

  const handleCopy = () => {
    const text = selectedChannel === 'whatsapp' ? summaryData.messages.whatsapp : summaryData.messages.email;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSend = () => {
    setIsDispatched(true);
    onFollowUpDispatched(meeting.id);
    setTimeout(() => {
      setIsDispatched(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Header (IIGF Pink Theme) */}
        <div className="bg-[#E6005C] text-white p-5 flex items-center justify-between border-b border-[#C2004D]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white text-[#E6005C] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase">AI Meeting Copilot</h3>
              <p className="text-[11px] text-pink-100">
                Automated audio transcript summarization & follow-up generator
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('summary')}
            className={`py-3 px-4 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'summary'
                ? 'border-[#E6005C] text-[#E6005C]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Structured Meeting Summary
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`py-3 px-4 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'drafts'
                ? 'border-[#E6005C] text-[#E6005C]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Auto-Generated Follow-up Drafts
          </button>
        </div>

        <div className="p-6 max-h-[440px] overflow-y-auto space-y-4 text-xs">
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E6005C]" />
                  Buyer Requirements ({meeting.buyerName})
                </h4>
                <ul className="space-y-1.5 pl-4 list-disc text-slate-700 marker:text-[#E6005C] leading-relaxed">
                  {summaryData.buyerRequirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Exhibitor Commitments ({meeting.exhibitorName})
                </h4>
                <ul className="space-y-1.5 pl-4 list-disc text-slate-700 marker:text-emerald-600 leading-relaxed">
                  {summaryData.exhibitorCommitments.map((com, i) => (
                    <li key={i}>{com}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-pink-50/80 border border-pink-200 rounded-xl p-3.5 text-slate-800 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#E6005C] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs text-[#E6005C] block">AI Action Timing:</span>
                  <p className="text-xs">{summaryData.aiRecommendedFollowUp}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('drafts')}
                className="w-full py-2.5 bg-[#E6005C] hover:bg-[#C2004D] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>View Generated Follow-up Messages</span>
              </button>
            </div>
          )}

          {activeTab === 'drafts' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedChannel('whatsapp')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    selectedChannel === 'whatsapp'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Message</span>
                </button>

                <button
                  onClick={() => setSelectedChannel('email')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    selectedChannel === 'email'
                      ? 'bg-[#E6005C] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Formal Commercial Email</span>
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-200">
                  <span>To: {meeting.buyerName} ({meeting.buyerCompany})</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-slate-700 hover:text-slate-900 font-bold cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="text-slate-800 text-xs leading-relaxed whitespace-pre-line bg-white p-3.5 rounded-lg border border-slate-200">
                  {selectedChannel === 'whatsapp'
                    ? summaryData.messages.whatsapp
                    : summaryData.messages.email}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-500">Requires 1-click approval</span>
                <button
                  onClick={handleSend}
                  disabled={isDispatched}
                  className="px-5 py-2.5 bg-[#E6005C] hover:bg-[#C2004D] text-white font-bold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isDispatched ? 'Dispatched!' : 'Approve & Dispatch Follow-Up'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
