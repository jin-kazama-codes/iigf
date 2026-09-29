import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Mic, 
  Paperclip, 
  ArrowRight, 
  Building2, 
  CheckCircle2, 
  Calendar, 
  MapPin,
  ChevronRight,
  Globe,
  Users,
  Shirt,
  Scissors,
  Star,
  Layers,
  Award
} from 'lucide-react';
import { DEMO_EXHIBITORS, QUICK_SEARCH_PROMPTS } from '../data/mockData';
import { Exhibitor } from '../types';
import { NavTab } from './Header';

interface HeroSectionProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenRegisterModal: () => void;
  onOpenExhibitorModal: (exhibitor: Exhibitor) => void;
  onBookMeeting: (exhibitor: Exhibitor) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectTab,
  onOpenRegisterModal,
  onOpenExhibitorModal,
  onBookMeeting
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [matchedResults, setMatchedResults] = useState<Exhibitor[]>([]);
  const [aiAnalysisSummary, setAiAnalysisSummary] = useState('');
  const [uploadedCatalogue, setUploadedCatalogue] = useState<string | null>(null);

  const handleSearch = (searchQuery: string = query) => {
    const q = searchQuery.trim() || query.trim();
    if (!q) return;

    setIsSearching(true);
    setHasSearched(true);

    setTimeout(() => {
      setIsSearching(false);
      const lower = q.toLowerCase();

      let filtered = DEMO_EXHIBITORS.filter((ex) => {
        if (lower.includes('child') || lower.includes('kid') || lower.includes('baby')) {
          return ex.categories.some(c => c.toLowerCase().includes('child') || c.toLowerCase().includes('baby'));
        }
        if (lower.includes('knit') || lower.includes('sweater')) {
          return ex.categories.some(c => c.toLowerCase().includes('knit') || c.toLowerCase().includes('sweater')) || ex.fabrics.some(f => f.toLowerCase().includes('terry') || f.toLowerCase().includes('wool'));
        }
        if (lower.includes('sustain') || lower.includes('organic')) {
          return ex.sustainabilityRating === 'A+' || ex.categories.includes('Sustainable Fashion');
        }
        if (lower.includes('moq') || lower.includes('500') || lower.includes('300')) {
          return ex.moq <= 400;
        }
        if (lower.includes('uk') || lower.includes('united kingdom')) {
          return ex.exportMarkets.includes('United Kingdom');
        }
        return ex.categories.includes("Women's Wear") || ex.categories.includes('Casualwear');
      });

      if (filtered.length === 0) {
        filtered = DEMO_EXHIBITORS.slice(0, 4);
      }

      setMatchedResults(filtered);
      setAiAnalysisSummary(
        `I found ${filtered.length + 7} exhibitors matching your sourcing query. Here are the top ${Math.min(filtered.length, 4)} verified Indian manufacturers matched on product category, MOQ thresholds, sustainability certifications, and export track records.`
      );
    }, 400);
  };

  const handleQuickPrompt = (prompt: string) => {
    setQuery(prompt);
    handleSearch(prompt);
  };

  const handleVoiceToggle = () => {
    if (isVoiceActive) {
      setIsVoiceActive(false);
    } else {
      setIsVoiceActive(true);
      setQuery('Listening: "Sustainable women\'s wear manufacturers below MOQ 500"...');
      setTimeout(() => {
        setIsVoiceActive(false);
        const naturalPrompt = "I am a UK buyer looking for sustainable women's casualwear with MOQ below 500";
        setQuery(naturalPrompt);
        handleSearch(naturalPrompt);
      }, 1200);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setUploadedCatalogue(fileName);
      const prompt = `Analyzing uploaded buyer tech-pack: "${fileName}" for women's organic cotton knitwear specifications`;
      setQuery(prompt);
      handleSearch(prompt);
    }
  };

  return (
    <div className="bg-white">
      {/* 1. HERO BANNER WITH AUTHENTIC IIGF BORDER & RAMP MODELS (Screenshot 1) */}
      <section className="relative bg-gradient-to-r from-[#DE0057] via-[#E6005C] to-[#C2004D] text-white overflow-hidden shadow-inner">
        {/* Top Traditional Indian Decorative Border Ribbon */}
        <div className="w-full h-2 bg-gradient-to-r from-amber-400 via-pink-300 to-amber-400" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Official Government & Fair Branding */}
            <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <div className="bg-white/15 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-white border border-white/20">
                  Supported by Ministry of Textiles · Govt. of India
                </div>
                <div className="bg-[#EB8B2D] px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-wider text-white">
                  Bharat TEX 2026
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block">
                  INCORPORATING
                </span>
                <div className="text-3xl sm:text-4xl font-black text-amber-300 font-serif tracking-tight">
                  IIGF
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight leading-none font-sans">
                  75<sup className="text-base">th</sup> INDIA INTERNATIONAL GARMENT FAIR
                </h1>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-tight pt-1">
                  14 to 17 July 2026
                </div>
                <p className="text-sm font-semibold text-white/90">
                  Bharat Mandapam, New Delhi-110001
                </p>
              </div>

              <p className="text-xs text-white/85 leading-relaxed max-w-md mx-auto lg:mx-0">
                Discover the right exhibitors, connect with global buyers, remove language barriers, and turn every fair interaction into business opportunities.
              </p>
            </div>

            {/* Right Column: 2 Visual Fashion Runway / Exhibition Cards (Screenshot 1) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Runway Image Card 1 */}
              <div className="relative rounded-xl overflow-hidden shadow-sm border-2 border-white/30 bg-pink-900/40 aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=480&q=70"
                  alt="IIGF Fashion Runway Collection"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                  <span className="text-[10px] font-bold text-amber-300 uppercase">Spring / Summer Runway</span>
                  <span className="text-xs font-bold text-white">Contemporary Women's Apparel</span>
                </div>
              </div>

              {/* Runway Image Card 2 */}
              <div className="relative rounded-xl overflow-hidden shadow-sm border-2 border-white/30 bg-pink-900/40 aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=480&q=70"
                  alt="IIGF Designer Apparel Showcase"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                  <span className="text-[10px] font-bold text-amber-300 uppercase">Export Pavilion</span>
                  <span className="text-xs font-bold text-white">Artisanal Knits & Sustainable Textiles</span>
                </div>
              </div>
            </div>
          </div>

          {/* EMBEDDED AI MULTIMODAL SOURCING SEARCH BOX */}
          <div className="mt-8 max-w-4xl mx-auto bg-white text-slate-800 rounded-xl p-4 sm:p-5 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="hero-sourcing-search" className="flex items-center gap-2 text-xs font-bold text-[#E6005C] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#E6005C]" />
                <span>What are you looking for? — Ask IIGF AI Sourcing</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">426 Certified Indian Exhibitors</span>
            </div>

            <div className="relative flex items-center bg-slate-50 border-2 border-pink-100 focus-within:border-[#E6005C] rounded-lg transition-colors">
              <textarea
                id="hero-sourcing-search"
                rows={2}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                placeholder="I’m looking for sustainable women’s apparel manufacturers with MOQ below 500…"
                className="w-full py-2.5 pl-3.5 pr-32 bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 resize-none focus:outline-none"
              />

              <div className="absolute right-2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  title="Voice Input"
                  className={`p-2 rounded transition-colors cursor-pointer ${
                    isVoiceActive ? 'bg-[#E6005C] text-white animate-pulse' : 'text-slate-500 hover:text-[#E6005C] hover:bg-pink-50'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                </button>

                <label 
                  title="Upload tech-pack or catalogue" 
                  className="p-2 text-slate-500 hover:text-[#E6005C] hover:bg-pink-50 rounded transition-colors cursor-pointer"
                >
                  <Paperclip className="w-4 h-4" />
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg,.zip" onChange={handleFileUpload} className="hidden" />
                </label>

                <button
                  type="button"
                  onClick={() => handleSearch()}
                  disabled={isSearching}
                  className="px-4 py-2 bg-[#E6005C] hover:bg-[#C2004D] text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSearching ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Search</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {uploadedCatalogue && (
              <div className="mt-2 text-xs text-emerald-700 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Uploaded tech pack attached: {uploadedCatalogue}</span>
              </div>
            )}

            {/* Quick Prompts Row */}
            <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-500 font-bold text-[11px] shrink-0">Try:</span>
              {QUICK_SEARCH_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(p)}
                  className="px-2.5 py-1 bg-pink-50/80 hover:bg-pink-100 text-[#E6005C] border border-pink-200 rounded text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* AI MATCH RESULTS CONTAINER */}
          {hasSearched && (
            <div className="mt-6 max-w-4xl mx-auto bg-white text-slate-900 rounded-xl p-5 shadow-2xl border border-pink-200">
              <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-[#E6005C]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">IIGF AI Matchmaker Results</h3>
                    <p className="text-xs text-slate-600">{aiAnalysisSummary}</p>
                  </div>
                </div>
                <button
                  onClick={() => onSelectTab('matchmaking')}
                  className="text-xs text-[#E6005C] hover:underline font-bold flex items-center gap-1 whitespace-nowrap"
                >
                  <span>Advanced Criteria</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchedResults.slice(0, 4).map((ex) => (
                  <div
                    key={ex.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-[#E6005C] bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {ex.matchScore || 90}% Match
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">{ex.name}</h4>
                          <p className="text-xs text-slate-500">{ex.location} · {ex.hall} ({ex.stall})</p>
                        </div>
                        <span className="text-[10px] font-bold text-[#EB8B2D] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {ex.hub}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">{ex.tagline}</p>

                      <div className="mt-2.5 bg-pink-50/70 p-2 rounded text-[11px] text-[#C2004D] space-y-0.5">
                        <span className="font-bold block">Why AI Matched:</span>
                        <div className="line-clamp-1">{ex.matchReasons?.[0]}</div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between">
                      <button
                        onClick={() => onOpenExhibitorModal(ex)}
                        className="text-xs font-semibold text-slate-700 underline hover:text-[#E6005C] cursor-pointer"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => onBookMeeting(ex)}
                        className="px-3 py-1 bg-[#E6005C] hover:bg-[#C2004D] text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>Book Meeting</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Traditional Indian Decorative Border Ribbon */}
        <div className="w-full h-2 bg-gradient-to-r from-amber-400 via-pink-300 to-amber-400" />
      </section>

      {/* 2. THREE COLORFUL CARDS (Exact Screenshot 1 Representation) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Buyer Registration (Hot Pink) */}
          <button
            onClick={() => onSelectTab('buyer-dashboard')}
            className="bg-[#E6005C] hover:bg-[#C2004D] text-white p-6 rounded-2xl shadow-md transition-colors text-center flex flex-col items-center justify-center cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full border-2 border-white/60 flex items-center justify-center mb-3">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-extrabold uppercase tracking-wide">Buyer Registration</h3>
            <p className="text-xs text-white/90 mt-1">Accreditation, Hotel Support & AI Matching</p>
          </button>

          {/* Card 2: Buying / Sourcing Consultant (Warm Amber/Orange) */}
          <button
            onClick={() => onSelectTab('matchmaking')}
            className="bg-[#EB8B2D] hover:bg-[#d67b22] text-white p-6 rounded-2xl shadow-md transition-colors text-center flex flex-col items-center justify-center cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full border-2 border-white/60 flex items-center justify-center mb-3">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-extrabold uppercase tracking-wide">Sourcing Consultant</h3>
            <p className="text-xs text-white/90 mt-1">Post Sourcing RFQ & Discover Exporters</p>
          </button>

          {/* Card 3: Exhibitor Registration (Emerald Green) */}
          <button
            onClick={() => onSelectTab('exhibitors')}
            className="bg-[#008751] hover:bg-[#007345] text-white p-6 rounded-2xl shadow-md transition-colors text-center flex flex-col items-center justify-center cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full border-2 border-white/60 flex items-center justify-center mb-3">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-extrabold uppercase tracking-wide">Exhibitors Zone</h3>
            <p className="text-xs text-white/90 mt-1">Stall Directory, Floor Plan & AI Sales Copilot</p>
          </button>
        </div>
      </section>

      {/* 3. "ABOUT IIGF" SECTION & PAST FAIR STATS (Exact Screenshot 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: 2x2 Photo Collage */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-3">
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=70"
              alt="IIGF Delegates Walking"
              className="rounded-xl object-cover h-40 w-full shadow-xs border border-slate-200"
              loading="lazy"
              decoding="async"
            />
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=70"
              alt="IIGF Garment Exhibition Racks"
              className="rounded-xl object-cover h-40 w-full shadow-xs border border-slate-200"
              loading="lazy"
              decoding="async"
            />
            <img
              src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=70"
              alt="IIGF Exhibition Hall Entrance"
              className="rounded-xl object-cover h-40 w-full shadow-xs border border-slate-200"
              loading="lazy"
              decoding="async"
            />
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=70"
              alt="IIGF Digital Interactive Kiosks"
              className="rounded-xl object-cover h-40 w-full shadow-xs border border-slate-200"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Right: Description & Red/Pink tabbed Date/Location Callout Cards */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <span className="text-xs font-bold text-[#E6005C] uppercase tracking-wider block mb-1">
                About The Exhibition
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                India International Garment Fair
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The India International Garment Fair (IIGF) is a premier platform that offers unparalleled benefits to both exhibitors and overseas buyers. It is a premier B2B only trade fair that showcases the best of India's garment industry.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Held bi-annually in New Delhi, INDIA, IIGF provides a platform for Indian exporters to connect with overseas buyers, showcasing their latest designs, trends, and products. With a focus on promoting India's apparel exports, IIGF attracts buyers from around the world.
            </p>

            <button
              onClick={() => onSelectTab('architecture')}
              className="text-xs font-bold text-[#E6005C] border-b-2 border-[#E6005C] pb-0.5 hover:text-[#C2004D] cursor-pointer inline-block"
            >
              Read More
            </button>

            {/* Date & Location Cards with Corner Tabs (Screenshot 2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Date Card */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#E6005C] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">
                  Date
                </div>
                <div className="w-8 h-8 rounded bg-pink-50 text-[#E6005C] flex items-center justify-center mb-2">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="text-sm font-bold text-slate-900">14-15-16-17</div>
                <div className="text-xs text-slate-600 font-medium">July 2026</div>
              </div>

              {/* Location Card */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#E6005C] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">
                  Location
                </div>
                <div className="w-8 h-8 rounded bg-pink-50 text-[#E6005C] flex items-center justify-center mb-2">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-sm font-bold text-slate-900">Bharat Mandapam</div>
                <div className="text-xs text-slate-600 font-medium">New Delhi, India</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Outlined Statistics Counters (Screenshot 2) */}
        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <div className="w-12 h-12 rounded-full border border-pink-300 bg-pink-50/60 text-[#E6005C] flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-3xl font-extrabold text-[#E6005C] tabular-nums">1400 +</div>
            <div className="text-xs font-semibold text-slate-600 mt-0.5 uppercase tracking-wide">Registered Buyer</div>
          </div>

          <div className="p-4 border-y md:border-y-0 md:border-x border-slate-200">
            <div className="w-12 h-12 rounded-full border border-pink-300 bg-pink-50/60 text-[#E6005C] flex items-center justify-center mx-auto mb-2">
              <Globe className="w-6 h-6" />
            </div>
            <div className="text-3xl font-extrabold text-[#E6005C] tabular-nums">500 +</div>
            <div className="text-xs font-semibold text-slate-600 mt-0.5 uppercase tracking-wide">Sourcing Consultant</div>
          </div>

          <div className="p-4">
            <div className="w-12 h-12 rounded-full border border-pink-300 bg-pink-50/60 text-[#E6005C] flex items-center justify-center mx-auto mb-2">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="text-3xl font-extrabold text-[#E6005C] tabular-nums">400 +</div>
            <div className="text-xs font-semibold text-slate-600 mt-0.5 uppercase tracking-wide">Participants</div>
          </div>
        </div>
      </section>

      {/* 4. "EXHIBITORS PROFILE" (Exact Screenshot 4) */}
      <section className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-xs font-extrabold text-[#E6005C] uppercase tracking-wider block">IIGF</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pb-2 inline-block border-b-2 border-[#E6005C]">
              EXHIBITORS PROFILE
            </h2>
          </div>

          {/* 4 Pink Outlined Icons Grid (Screenshot 4) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-12">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#E6005C] transition-colors">
              <div className="w-16 h-16 rounded-full border-2 border-[#E6005C] flex items-center justify-center mx-auto mb-3 text-[#E6005C]">
                <Shirt className="w-8 h-8" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">MEN WEAR</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">MANUFACTURER / SUPPLIER</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#E6005C] transition-colors">
              <div className="w-16 h-16 rounded-full border-2 border-[#E6005C] flex items-center justify-center mx-auto mb-3 text-[#E6005C]">
                <Scissors className="w-8 h-8" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">WOMEN WEAR</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">MANUFACTURER / SUPPLIER</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#E6005C] transition-colors">
              <div className="w-16 h-16 rounded-full border-2 border-[#E6005C] flex items-center justify-center mx-auto mb-3 text-[#E6005C]">
                <Shirt className="w-8 h-8" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">CHILDREN WEAR</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">MANUFACTURER / SUPPLIER</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-[#E6005C] transition-colors">
              <div className="w-16 h-16 rounded-full border-2 border-[#E6005C] flex items-center justify-center mx-auto mb-3 text-[#E6005C]">
                <Layers className="w-8 h-8" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">FASHION ACCESSORIES</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">MANUFACTURER / SUPPLIER</p>
            </div>
          </div>

          {/* "Why should you consider IIGF ?" Banner (Screenshot 4) */}
          <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-[#C2004D] via-[#A60042] to-[#731E4D] text-white p-8 sm:p-12 relative shadow-lg">
            <div className="max-w-2xl space-y-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight pb-2 border-b border-white/30">
                Why should you consider India International Garment Fair ?
              </h3>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                In this era of globalization when there is a growing need for better supply chain management, the fair helps in achieving this objective by providing exposure to various manufacturers from different parts of the world.
              </p>

              <ul className="space-y-2 text-xs sm:text-sm text-white/95">
                <li className="flex items-start gap-2">
                  <span className="text-amber-300 font-bold">➤</span>
                  <span>IIGF is the flagship event that witnesses participation of more than 300 exporters.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-300 font-bold">➤</span>
                  <span>The show has a proven track record of more than 3 decades.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-300 font-bold">➤</span>
                  <span>More than 70 nations' buyers choose India as their preferred sourcing destination.</span>
                </li>
              </ul>

              <button
                onClick={onOpenRegisterModal}
                className="mt-4 px-4 py-2 bg-white text-[#E6005C] font-bold text-xs rounded hover:bg-pink-50 transition-colors cursor-pointer"
              >
                Register as Buyer Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. "BEST DISPLAY AWARD" & "OUR CLIENT SAY'S" (Exact Screenshot 3) */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Best Display Award Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <div className="lg:col-span-5 h-60 lg:h-auto">
              <img
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=480&q=70"
                alt="Audience at Fashion Show"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="lg:col-span-7 bg-[#E6005C] text-white p-8 sm:p-10 space-y-4">
              <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight">
                BEST DISPLAY AWARD
              </h3>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                To foster creativity and excellence in exhibition displays, a "Best Display Award" is presented at each edition of the exhibition. A distinguished panel of judges is appointed to evaluate and select the most outstanding displays.
              </p>
              <div className="text-xs space-y-1 text-white/90 font-medium">
                <div>1. Overall use of space (30 Points)</div>
                <div>2. Thematic Display (10 Points)</div>
                <div>3. Innovative use of space (10 Points)</div>
                <div>4. Originality of Display (10 Points)</div>
                <div>5. Interplay between products & display (10 Points)</div>
              </div>
            </div>
          </div>

          {/* Testimonial Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <h3 className="text-xl font-extrabold text-slate-900 pb-1 border-b-2 border-[#E6005C] inline-block">
                Our Client Say's
              </h3>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                See what past attendees have to say about their exciting and memorable experiences at our fair/event, and get ready to join the fun and excitement this year.
              </p>
            </div>

            <div className="lg:col-span-8 bg-[#FDF2F4] border border-pink-200 p-6 sm:p-8 rounded-2xl text-center space-y-3">
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed max-w-xl mx-auto">
                "Just to say thank you for the wonderful arrangements for us. It was honestly very beneficial for us in terms of knowledge and sources in the industry."
              </p>
              <div className="flex justify-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <div className="text-xs font-bold text-slate-900">
                Neesya Rao, Sagit Marketing (Neymally), Malaysia
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
