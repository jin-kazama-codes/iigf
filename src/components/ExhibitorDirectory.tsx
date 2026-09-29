import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Filter, 
  MapPin, 
  Calendar, 
  Bookmark, 
  CheckCircle2, 
  Building2,
  X
} from 'lucide-react';
import { Exhibitor } from '../types';

interface ExhibitorDirectoryProps {
  exhibitors: Exhibitor[];
  shortlist: string[];
  onToggleShortlist: (id: string) => void;
  onOpenExhibitorModal: (exhibitor: Exhibitor) => void;
  onBookMeeting: (exhibitor: Exhibitor) => void;
}

export const ExhibitorDirectory: React.FC<ExhibitorDirectoryProps> = ({
  exhibitors,
  shortlist,
  onToggleShortlist,
  onOpenExhibitorModal,
  onBookMeeting
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [selectedHub, setSelectedHub] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMaxMoq, setSelectedMaxMoq] = useState<number>(1000);
  const [selectedCert, setSelectedCert] = useState<string>('All');
  const [selectedMarket, setSelectedMarket] = useState<string>('All');
  const [aiActiveFilterNotice, setAiActiveFilterNotice] = useState<string | null>(null);

  const hubs = ['All', 'Tirupur', 'Jaipur', 'Noida', 'Bengaluru', 'Surat', 'Ludhiana'];
  const categories = ['All', "Women's Wear", 'Casualwear', 'Sustainable Fashion', 'Knitwear', "Men's Wear", "Children's Wear"];
  const certs = ['All', 'GOTS', 'OEKO-TEX', 'SEDEX', 'Fair Trade', 'WRAP'];
  const markets = ['All', 'United Kingdom', 'Germany', 'France', 'USA', 'Japan'];

  const handleAiFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsAiProcessing(true);
    setTimeout(() => {
      setIsAiProcessing(false);
      const lower = aiPrompt.toLowerCase();

      if (lower.includes('uk') || lower.includes('private-label') || lower.includes('retailer')) {
        setSelectedMarket('United Kingdom');
        setSelectedMaxMoq(500);
        setSelectedCategory("Women's Wear");
        setAiActiveFilterNotice('AI configured filters: Category="Women\'s Wear", MOQ ≤ 500, Market="United Kingdom"');
      } else if (lower.includes('organic') || lower.includes('sustain')) {
        setSelectedCert('GOTS');
        setSelectedCategory('Sustainable Fashion');
        setAiActiveFilterNotice('AI configured filters: Certification="GOTS", Category="Sustainable Fashion"');
      } else if (lower.includes('knit') || lower.includes('sweater')) {
        setSelectedCategory('Knitwear');
        setSelectedHub('Tirupur');
        setAiActiveFilterNotice('AI configured filters: Category="Knitwear", Hub="Tirupur"');
      } else {
        setSelectedCategory("Women's Wear");
        setSelectedMaxMoq(400);
        setAiActiveFilterNotice(`AI configured filters for: "${aiPrompt}"`);
      }
    }, 300);
  };

  const clearAiNotice = () => {
    setAiActiveFilterNotice(null);
    setSelectedHub('All');
    setSelectedCategory('All');
    setSelectedMaxMoq(1000);
    setSelectedCert('All');
    setSelectedMarket('All');
    setAiPrompt('');
  };

  const filteredExhibitors = useMemo(() => {
    return exhibitors.filter((ex) => {
      const q = searchQuery.toLowerCase();
      if (q) {
        const matchesName = ex.name.toLowerCase().includes(q);
        const matchesTag = ex.tagline.toLowerCase().includes(q);
        const matchesDesc = ex.description.toLowerCase().includes(q);
        const matchesCat = ex.categories.some(c => c.toLowerCase().includes(q));
        const matchesFabric = ex.fabrics.some(f => f.toLowerCase().includes(q));
        if (!matchesName && !matchesTag && !matchesDesc && !matchesCat && !matchesFabric) {
          return false;
        }
      }

      if (selectedHub !== 'All' && ex.hub !== selectedHub) return false;
      if (selectedCategory !== 'All' && !ex.categories.includes(selectedCategory)) return false;
      if (ex.moq > selectedMaxMoq) return false;
      if (selectedCert !== 'All' && !ex.certifications.some(c => c.includes(selectedCert))) return false;
      if (selectedMarket !== 'All' && !ex.exportMarkets.includes(selectedMarket)) return false;

      return true;
    });
  }, [exhibitors, searchQuery, selectedHub, selectedCategory, selectedMaxMoq, selectedCert, selectedMarket]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6">
        <span className="text-xs font-bold text-[#E6005C] uppercase tracking-wider block">
          Official Fair Directory · 75th Edition · 426 Registered Exporters
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
          Explore Exhibitors
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
          Search certified Indian apparel manufacturers across Tirupur, Jaipur, Noida, Bengaluru, Surat, and Ludhiana.
        </p>
      </div>

      {/* "Ask AI to Find" Natural Language Filter (IIGF Pink Theme) */}
      <div className="bg-[#E6005C] text-white p-4 sm:p-5 rounded-2xl mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="ai-directory-search-input" className="text-xs font-bold flex items-center gap-1.5 text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ask AI to Find & Set Smart Filters</span>
          </label>
          <span className="text-[11px] text-pink-100 font-medium">Natural Language Filter</span>
        </div>

        <form onSubmit={handleAiFilter} className="flex flex-col sm:flex-row items-center gap-2">
          <input
            id="ai-directory-search-input"
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Try: 'Find manufacturers suitable for a UK private-label retailer with MOQ below 500'..."
            className="flex-1 w-full bg-white text-slate-900 rounded-lg px-3.5 py-2 text-xs sm:text-sm placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isAiProcessing || !aiPrompt.trim()}
            className="w-full sm:w-auto px-4 py-2 bg-[#EB8B2D] hover:bg-[#d67b22] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply AI Match</span>
          </button>
        </form>

        {aiActiveFilterNotice && (
          <div className="mt-3 bg-white/15 p-2.5 rounded text-xs text-white flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-amber-300" />
              {aiActiveFilterNotice}
            </span>
            <button onClick={clearAiNotice} className="text-white hover:text-pink-200 cursor-pointer p-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 mb-8 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company name, fabric (e.g. linen, cotton), category..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#E6005C]"
            />
          </div>

          <div className="text-xs text-slate-600 font-semibold">
            Showing <strong className="text-[#E6005C]">{filteredExhibitors.length}</strong> of {exhibitors.length} exhibitors
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Hub</label>
            <select
              value={selectedHub}
              onChange={(e) => setSelectedHub(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800"
            >
              {hubs.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Max MOQ</label>
            <select
              value={selectedMaxMoq}
              onChange={(e) => setSelectedMaxMoq(Number(e.target.value))}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800"
            >
              <option value={300}>≤ 300 units</option>
              <option value={400}>≤ 400 units</option>
              <option value={500}>≤ 500 units</option>
              <option value={1000}>All MOQ</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Audit</label>
            <select
              value={selectedCert}
              onChange={(e) => setSelectedCert(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800"
            >
              {certs.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Export Market</label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800"
            >
              {markets.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Exhibitor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExhibitors.map((ex) => {
          const isShortlisted = shortlist.includes(ex.id);
          return (
            <div
              key={ex.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-[#E6005C] transition-all shadow-xs flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-[#E6005C] bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                      {ex.hall} · {ex.stall}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Verified
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleShortlist(ex.id)}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      isShortlisted ? 'bg-pink-100 text-[#E6005C]' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900">{ex.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{ex.location}</span>
                </p>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2">{ex.tagline}</p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {ex.fabrics.slice(0, 3).map((f, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {f}
                    </span>
                  ))}
                  {ex.categories.slice(0, 2).map((c, i) => (
                    <span key={i} className="text-[10px] bg-pink-50 text-[#E6005C] px-2 py-0.5 rounded font-semibold">
                      {c}
                    </span>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">MOQ:</span>
                    <span className="font-bold text-slate-800">{ex.moq} pcs</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Lead Time:</span>
                    <span className="font-bold text-slate-800">{ex.leadTimeDays} days</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenExhibitorModal(ex)}
                  className="text-xs font-bold text-slate-700 hover:text-[#E6005C] underline cursor-pointer"
                >
                  View Profile & Specs
                </button>

                <button
                  onClick={() => onBookMeeting(ex)}
                  className="px-3.5 py-1.5 bg-[#E6005C] hover:bg-[#C2004D] text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Slot</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
