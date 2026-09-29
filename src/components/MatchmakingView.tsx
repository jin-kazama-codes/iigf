import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Sliders, 
  FileText
} from 'lucide-react';
import { DEMO_EXHIBITORS } from '../data/mockData';
import { Exhibitor, RFQ } from '../types';

interface MatchmakingViewProps {
  onOpenExhibitorModal: (exhibitor: Exhibitor) => void;
  onBookMeeting: (exhibitor: Exhibitor) => void;
  onSaveNewRfq: (rfq: RFQ) => void;
}

export const MatchmakingView: React.FC<MatchmakingViewProps> = ({
  onOpenExhibitorModal,
  onBookMeeting,
  onSaveNewRfq
}) => {
  const [activeTab, setActiveTab] = useState<'forward' | 'reverse'>('forward');

  // Forward Matchmaking state
  const [productFocus, setProductFocus] = useState("Women's sustainable casualwear");
  const [targetMoq, setTargetMoq] = useState(500);
  const [targetMarket, setTargetMarket] = useState('UK');
  const [budgetTier, setBudgetTier] = useState('Mid-market');
  const [isMatchingForward, setIsMatchingForward] = useState(false);
  const [forwardMatches, setForwardMatches] = useState<Exhibitor[]>(DEMO_EXHIBITORS.slice(0, 5));

  // Reverse Matchmaking state
  const [naturalRequirement, setNaturalRequirement] = useState(
    'I need 10,000 organic cotton women’s T-shirts for the UK market with quick 60-day shipment.'
  );
  const [isProcessingReverse, setIsProcessingReverse] = useState(false);
  const [structuredRfq, setStructuredRfq] = useState<{
    product: string;
    material: string;
    quantity: number;
    market: string;
    moq: number;
    timeline: string;
  } | null>(null);
  const [reverseMatches, setReverseMatches] = useState<Exhibitor[]>([]);

  const handleRunForwardMatch = () => {
    setIsMatchingForward(true);
    setTimeout(() => {
      setIsMatchingForward(false);
      setForwardMatches(DEMO_EXHIBITORS.slice(0, 5));
    }, 400);
  };

  const handleProcessReverseRequirement = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!naturalRequirement.trim()) return;

    setIsProcessingReverse(true);
    setTimeout(() => {
      setIsProcessingReverse(false);
      const extracted = {
        product: "Women's Ribbed & Crew-Neck T-shirts",
        material: "100% GOTS Certified Organic Cotton (180-200 GSM)",
        quantity: 10000,
        market: "United Kingdom",
        moq: 1000,
        timeline: "60–90 days"
      };
      setStructuredRfq(extracted);
      setReverseMatches([DEMO_EXHIBITORS[0], DEMO_EXHIBITORS[1], DEMO_EXHIBITORS[3]]);
    }, 400);
  };

  const handleDispatchStructuredRfq = () => {
    if (!structuredRfq) return;
    const newRfq: RFQ = {
      id: `rfq-${Date.now()}`,
      title: `${structuredRfq.quantity.toLocaleString()} Units ${structuredRfq.material} ${structuredRfq.product}`,
      buyerName: 'Sarah Williams',
      buyerCompany: 'Meridian Apparel UK Ltd',
      buyerCountry: 'United Kingdom',
      productCategory: structuredRfq.product,
      fabric: structuredRfq.material,
      targetQuantity: structuredRfq.quantity,
      targetPricePerUnit: '$4.20 - $4.90 FOB',
      targetMoq: structuredRfq.moq,
      timelineDays: 60,
      targetMarket: structuredRfq.market,
      status: 'Open',
      createdAt: 'Today',
      matchedExhibitorIds: reverseMatches.map(m => m.id)
    };
    onSaveNewRfq(newRfq);
    alert('RFQ dispatched successfully to matched exhibitors! Check your Buyer Dashboard.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6">
        <span className="text-xs font-bold text-[#E6005C] uppercase tracking-wider block">
          Algorithmic Sourcing Intelligence · 75th IIGF
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
          AI Matchmaking & Reverse RFQ
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
          Tell us what you're looking for. IIGF AI analyzes supplier manufacturing capacity, social compliance audits, and export reliability to rank the most relevant exhibitors.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex border-b border-slate-200 mb-8 bg-white rounded-t-xl p-1 shadow-xs">
        <button
          onClick={() => setActiveTab('forward')}
          className={`flex-1 py-3 px-4 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'forward'
              ? 'bg-[#E6005C] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Forward Matchmaking (Spec-Driven)</span>
        </button>

        <button
          onClick={() => setActiveTab('reverse')}
          className={`flex-1 py-3 px-4 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'reverse'
              ? 'bg-[#E6005C] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-300" />
          <span>Reverse Matchmaking (Post Natural Requirement)</span>
        </button>
      </div>

      {/* FORWARD MATCHMAKING */}
      {activeTab === 'forward' && (
        <div className="space-y-6">
          <div className="bg-[#E6005C] text-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              <Sliders className="w-4 h-4" />
              <span>Input Buyer Procurement Criteria</span>
            </div>
            <h2 className="text-lg font-black text-white mb-4 uppercase">Buyer Sourcing Parameters</h2>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-white/90 font-bold mb-1">Product Category Focus</label>
                <input
                  type="text"
                  value={productFocus}
                  onChange={(e) => setProductFocus(e.target.value)}
                  className="w-full bg-white text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/90 font-bold mb-1">Target MOQ Limit</label>
                <select
                  value={targetMoq}
                  onChange={(e) => setTargetMoq(Number(e.target.value))}
                  className="w-full bg-white text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-none"
                >
                  <option value={300}>300 units</option>
                  <option value={500}>500 units</option>
                  <option value={1000}>1,000 units</option>
                </select>
              </div>

              <div>
                <label className="block text-white/90 font-bold mb-1">Destination Market</label>
                <select
                  value={targetMarket}
                  onChange={(e) => setTargetMarket(e.target.value)}
                  className="w-full bg-white text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="UK">United Kingdom</option>
                  <option value="EU">European Union</option>
                  <option value="USA">United States</option>
                </select>
              </div>

              <div>
                <label className="block text-white/90 font-bold mb-1">Price / Quality Tier</label>
                <select
                  value={budgetTier}
                  onChange={(e) => setBudgetTier(e.target.value)}
                  className="w-full bg-white text-slate-900 rounded-lg px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="Mid-market">Mid-Market Premium</option>
                  <option value="Luxury-boutique">Artisanal / Boutique</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between pt-4 border-t border-pink-400/50">
              <div className="text-xs text-white/90 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>Comparing against 426 verified Indian exhibitors</span>
              </div>

              <button
                onClick={handleRunForwardMatch}
                disabled={isMatchingForward}
                className="px-5 py-2 bg-[#EB8B2D] hover:bg-[#d67b22] text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Recalculate AI Matches</span>
              </button>
            </div>
          </div>

          {/* Forward Results List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
              Ranked Match Results
            </h3>

            {forwardMatches.map((ex, index) => (
              <div
                key={ex.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-[#E6005C] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50 hover:bg-white"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#E6005C] text-white text-xs font-black flex items-center justify-center shrink-0">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{ex.name}</h4>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {ex.matchScore || 85}% Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {ex.location} · {ex.hall} ({ex.stall}) · MOQ: {ex.moq} pcs
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenExhibitorModal(ex)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 cursor-pointer"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => onBookMeeting(ex)}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#E6005C] hover:bg-[#C2004D] rounded shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Meeting</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REVERSE MATCHMAKING */}
      {activeTab === 'reverse' && (
        <div className="space-y-6">
          <div className="bg-[#E6005C] text-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              <FileText className="w-4 h-4" />
              <span>Post Your Requirement</span>
            </div>
            <h2 className="text-lg font-black text-white mb-2 uppercase">Natural Language Sourcing RFQ</h2>
            <p className="text-xs text-pink-100 mb-4 max-w-2xl leading-relaxed">
              Type your sourcing need naturally. IIGF AI will convert it into a structured commercial RFQ and match certified manufacturers.
            </p>

            <form onSubmit={handleProcessReverseRequirement} className="space-y-3">
              <textarea
                rows={3}
                value={naturalRequirement}
                onChange={(e) => setNaturalRequirement(e.target.value)}
                placeholder="Example: 'I need 10,000 organic cotton women’s T-shirts for the UK market'..."
                className="w-full bg-white text-slate-900 rounded-lg p-3 text-xs sm:text-sm placeholder-slate-400 focus:outline-none"
              />

              <div className="flex items-center justify-between">
                <span className="text-xs text-pink-100">AI structured extraction</span>
                <button
                  type="submit"
                  disabled={isProcessingReverse || !naturalRequirement.trim()}
                  className="px-5 py-2.5 bg-[#EB8B2D] hover:bg-[#d67b22] text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Convert & Match</span>
                </button>
              </div>
            </form>
          </div>

          {structuredRfq && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">AI-Generated Structured Requirement</h3>
                <button
                  onClick={handleDispatchStructuredRfq}
                  className="px-4 py-2 bg-[#E6005C] hover:bg-[#C2004D] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Save & Broadcast RFQ
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block">Product:</span>
                  <span className="font-bold text-slate-900">{structuredRfq.product}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Material:</span>
                  <span className="font-bold text-slate-900">{structuredRfq.material}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Quantity:</span>
                  <span className="font-bold text-slate-900">{structuredRfq.quantity.toLocaleString()} units</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
