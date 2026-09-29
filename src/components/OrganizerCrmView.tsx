import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Building2, 
  Calendar, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  Send, 
  Activity, 
  Briefcase,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  MapPin,
  Globe,
  Radio,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { ORGANIZER_CRM_METRICS, DEMO_EXHIBITORS } from '../data/mockData';

export const OrganizerCrmView: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [organizerQuery, setOrganizerQuery] = useState('');
  const [copilotHistory, setCopilotHistory] = useState<Array<{
    q: string;
    answer: string;
    tableData?: any[];
  }>>([
    {
      q: 'How many UK buyers have registered for the 75th Edition?',
      answer: '438 UK buyers have registered for the 75th IIGF. 127 have been classified as HIGH INTENT with average annual sourcing volume exceeding £1.5M. The primary focus is organic cotton knitwear and low MOQ private-label wovens.',
    }
  ]);
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);

  // Sub-module filters
  const [buyerSearch, setBuyerSearch] = useState('');
  const [buyerCountryFilter, setBuyerCountryFilter] = useState('All');
  const [exhibitorHubFilter, setExhibitorHubFilter] = useState('All');

  const sidebarModules = [
    { id: 'dashboard', label: 'Command Center', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'buyers', label: 'Buyers CRM', icon: <Users className="w-4 h-4" /> },
    { id: 'exhibitors', label: 'Exhibitors', icon: <Building2 className="w-4 h-4" /> },
    { id: 'events', label: 'Event Operations', icon: <Activity className="w-4 h-4" /> },
    { id: 'meetings', label: 'B2B Meetings', icon: <Calendar className="w-4 h-4" /> },
    { id: 'leads', label: 'Lead Intelligence', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'rfqs', label: 'Commercial RFQs', icon: <FileText className="w-4 h-4" /> },
    { id: 'analytics', label: 'Macro Analytics', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  // Rich mock CRM data
  const MOCK_REGISTERED_BUYERS = [
    { id: 'b-1', name: 'Sarah Williams', company: 'Meridian Apparel UK Ltd', country: 'United Kingdom', flag: '🇬🇧', intent: 'High', score: 94, volume: '£2.4M', categories: 'Organic Knits, Casualwear', meetings: 3 },
    { id: 'b-2', name: 'Charlotte Dubois', company: 'Harrods Sourcing UK', country: 'United Kingdom', flag: '🇬🇧', intent: 'High', score: 96, volume: '£4.8M', categories: 'Pure Silk, Kaftans', meetings: 0 },
    { id: 'b-3', name: 'Henrik Lindqvist', company: 'Stockholm EcoWear', country: 'Sweden', flag: '🇸🇪', intent: 'High', score: 92, volume: '€1.8M', categories: 'Organic Cotton Basics', meetings: 2 },
    { id: 'b-4', name: 'Matteo Rossi', company: 'Milano Fashion Group', country: 'Italy', flag: '🇮🇹', intent: 'High', score: 91, volume: '€3.2M', categories: 'Linen Tops, Resortwear', meetings: 1 },
    { id: 'b-5', name: 'David Vance', company: 'Nordic Department Stores', country: 'Germany', flag: '🇩🇪', intent: 'Medium', score: 82, volume: '€2.1M', categories: 'Outerwear, Sweaters', meetings: 2 },
    { id: 'b-6', name: 'Kenji Takahashi', company: 'Tokyo Ginza Retail Co.', country: 'Japan', flag: '🇯🇵', intent: 'High', score: 95, volume: '$3.6M', categories: 'Artisanal Block Prints, Indigo', meetings: 4 },
    { id: 'b-7', name: 'Elena Rostova', company: 'EuroStyle Boutique Group', country: 'France', flag: '🇫🇷', intent: 'Medium', score: 79, volume: '€1.4M', categories: 'Women\'s Dresses, Silks', meetings: 1 },
    { id: 'b-8', name: 'Lucas Meyer', company: 'Berlin Fashion House', country: 'Germany', flag: '🇩🇪', intent: 'High', score: 89, volume: '€2.9M', categories: 'Sustainable Denim, Wovens', meetings: 3 },
  ];

  const MOCK_LIVE_MEETINGS = [
    { id: 'm-1', buyer: 'Sarah Williams (UK)', exhibitor: 'ABC Textiles (Tirupur)', hall: 'Hall 2', stall: 'Stall B-17', time: '11:30 AM', date: '14 July 2026', status: 'Confirmed', intent: 'High (94%)' },
    { id: 'm-2', buyer: 'Kenji Takahashi (Japan)', exhibitor: 'FashionWorks India (Jaipur)', hall: 'Hall 1', stall: 'Stall A-12', time: '02:00 PM', date: '14 July 2026', status: 'In Progress', intent: 'High (95%)' },
    { id: 'm-3', buyer: 'Lucas Meyer (Germany)', exhibitor: 'Global Apparel Co. (Bengaluru)', hall: 'Hall 3', stall: 'Stall C-22', time: '03:30 PM', date: '15 July 2026', status: 'Confirmed', intent: 'High (89%)' },
    { id: 'm-4', buyer: 'Henrik Lindqvist (Sweden)', exhibitor: 'XYZ Garments (Noida)', hall: 'Hall 2', stall: 'Stall D-08', time: '10:00 AM', date: '15 July 2026', status: 'Scheduled', intent: 'High (92%)' },
    { id: 'm-5', buyer: 'David Vance (Germany)', exhibitor: 'Heritage Knitwear (Ludhiana)', hall: 'Hall 1', stall: 'Stall E-04', time: '04:15 PM', date: '16 July 2026', status: 'Scheduled', intent: 'Medium (82%)' },
  ];

  const MOCK_RFQS = [
    { id: 'rfq-1', title: 'SS27 Organic Cotton Slub Tops (5,000 pcs)', buyer: 'Meridian Apparel UK', budget: '$42,000', moq: 500, delivery: 'Oct 2026', responses: 6, status: 'Active Bidding' },
    { id: 'rfq-2', title: 'Hand-Block Printed Silk Midi Dresses', buyer: 'Harrods Sourcing UK', budget: '$65,000', moq: 300, delivery: 'Nov 2026', responses: 4, status: 'Reviewing Samples' },
    { id: 'rfq-3', title: 'Recycled Ocean Polyester Athletic Leggings', buyer: 'Nordic Stores Germany', budget: '$88,000', moq: 1000, delivery: 'Dec 2026', responses: 8, status: 'Active Bidding' },
    { id: 'rfq-4', title: 'Eco-Wash Rigid Denim Over-Shirts', buyer: 'Berlin Fashion House', budget: '$54,000', moq: 400, delivery: 'Jan 2027', responses: 5, status: 'Contract Draft' },
  ];

  const handleOrganizerCopilotAsk = (customQ?: string) => {
    const q = customQ || organizerQuery;
    if (!q.trim()) return;

    setIsCopilotThinking(true);
    setTimeout(() => {
      setIsCopilotThinking(false);
      const lower = q.toLowerCase();

      let answer = '';
      let tableData: any[] | undefined = undefined;

      if (lower.includes('uk') || lower.includes('british')) {
        answer = '438 UK buyers have registered. 127 have been classified as high intent. 23 exhibitors currently specialize in their exact requirements.';
      } else if (lower.includes('haven\'t booked') || lower.includes('no meeting')) {
        answer = 'Found 17 high-intent international buyers who registered but haven’t booked a scheduled meeting yet:';
        tableData = [
          { name: 'Charlotte Dubois', company: 'Harrods Sourcing UK', market: 'UK', intent: 'High (96)', interest: 'Pure Silk & Kaftans' },
          { name: 'Henrik Lindqvist', company: 'Stockholm EcoWear', market: 'Sweden', intent: 'High (92)', interest: 'Organic Jersey Basics' },
          { name: 'Matteo Rossi', company: 'Milano Fashion Group', market: 'Italy', intent: 'High (91)', interest: 'Linen Blouses' }
        ];
      } else {
        answer = `Analyzed 75th IIGF data for: "${q}". Event conversion velocity is 18.4% ahead of the previous edition, with cross-border RFQs pacing at $42M across all 3 exhibition halls.`;
      }

      setCopilotHistory(prev => [{ q, answer, tableData }, ...prev]);
      setOrganizerQuery('');
    }, 400);
  };

  const filteredBuyers = MOCK_REGISTERED_BUYERS.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(buyerSearch.toLowerCase()) || 
                        b.company.toLowerCase().includes(buyerSearch.toLowerCase()) ||
                        b.categories.toLowerCase().includes(buyerSearch.toLowerCase());
    const matchCountry = buyerCountryFilter === 'All' || b.country === buyerCountryFilter;
    return matchSearch && matchCountry;
  });

  const filteredExhibitors = DEMO_EXHIBITORS.filter(ex => {
    return exhibitorHubFilter === 'All' || ex.hub === exhibitorHubFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#E6005C] uppercase tracking-wider block">
            Organizer Executive Portal · 75th IIGF
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
            IIGF AI Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time event intelligence, attendee telemetry, and natural language analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Event Telemetry Synchronized
          </span>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-bold mb-1 flex items-center justify-between">
            <span>Total Buyers</span>
            <Users className="w-3.5 h-3.5 text-[#E6005C]" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {ORGANIZER_CRM_METRICS.totalBuyers.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">+18% vs 74th</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-bold mb-1 flex items-center justify-between">
            <span>Exhibitors</span>
            <Building2 className="w-3.5 h-3.5 text-[#EB8B2D]" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {ORGANIZER_CRM_METRICS.totalExhibitors}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Halls 1, 2, & 3</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-bold mb-1 flex items-center justify-between">
            <span>Meetings</span>
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {ORGANIZER_CRM_METRICS.totalMeetings.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">78% completed</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-bold mb-1 flex items-center justify-between">
            <span>Qualified Leads</span>
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {ORGANIZER_CRM_METRICS.qualifiedLeads.toLocaleString()}
          </div>
          <span className="text-[10px] text-purple-700 font-bold">65.6% conversion</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-bold mb-1 flex items-center justify-between">
            <span>Open RFQs</span>
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {ORGANIZER_CRM_METRICS.openRfqs.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">$42M est. volume</span>
        </div>

        <div className="bg-[#FDF2F4] p-4 rounded-xl border border-pink-200 shadow-xs">
          <div className="text-[11px] text-[#E6005C] font-bold mb-1 flex items-center justify-between">
            <span>High-Intent</span>
            <Briefcase className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-black text-[#E6005C] tabular-nums">
            {ORGANIZER_CRM_METRICS.highIntentBuyers}
          </div>
          <span className="text-[10px] text-pink-700 font-semibold">Immediate buyers</span>
        </div>
      </div>

      {/* Main CRM Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 block">
              CRM Navigation
            </span>
            {sidebarModules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer text-left ${
                  activeModule === mod.id
                    ? 'bg-[#E6005C] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {mod.icon}
                <span>{mod.label}</span>
              </button>
            ))}
          </div>

          {/* AI Operational Insight Box */}
          <div className="bg-[#FDF2F4] border border-pink-200 rounded-2xl p-4 text-xs space-y-2.5 shadow-xs">
            <div className="flex items-center gap-2 text-[#E6005C] font-bold">
              <Sparkles className="w-4 h-4 text-[#E6005C]" />
              <span>AI Operational Insight:</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              UK buyers are showing strong demand for sustainable women’s casualwear. 23 exhibitors match this demand. <strong>17 high-intent buyers</strong> have not yet booked meetings.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  setActiveModule('buyers');
                  setBuyerCountryFilter('United Kingdom');
                }}
                className="px-2.5 py-1 bg-[#E6005C] hover:bg-[#C2004D] text-white rounded font-bold text-[11px] cursor-pointer"
              >
                Filter UK Buyers
              </button>
            </div>
          </div>
        </div>

        {/* Right Content Panels */}
        <div className="lg:col-span-3 space-y-6">
          {/* MODULE 1: DASHBOARD / COMMAND CENTER */}
          {activeModule === 'dashboard' && (
            <div className="space-y-6">
              {/* AI Organizer Copilot ("Ask IIGF Data") */}
              <div className="bg-[#E6005C] text-white rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Organizer Copilot · Ask IIGF Data</span>
                  </div>
                  <span className="text-[11px] text-pink-100 font-medium">Natural Language SQL / Analytics</span>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleOrganizerCopilotAsk();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={organizerQuery}
                    onChange={(e) => setOrganizerQuery(e.target.value)}
                    placeholder="Ask IIGF Data: 'How many UK buyers have registered?', 'Show me exhibitors with no meetings'..."
                    className="flex-1 bg-white text-slate-900 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isCopilotThinking || !organizerQuery.trim()}
                    className="px-4 py-2.5 bg-[#EB8B2D] hover:bg-[#d67b22] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Query</span>
                  </button>
                </form>

                {/* Quick Prompts */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => handleOrganizerCopilotAsk("How many UK buyers have registered?")}
                    className="px-2.5 py-1 bg-white/15 hover:bg-white/25 text-white rounded text-[11px] font-medium cursor-pointer"
                  >
                    "How many UK buyers registered?"
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOrganizerCopilotAsk("Which buyers haven't booked meetings?")}
                    className="px-2.5 py-1 bg-white/15 hover:bg-white/25 text-white rounded text-[11px] font-medium cursor-pointer"
                  >
                    "Which buyers haven't booked meetings?"
                  </button>
                </div>

                {/* Copilot Q&A Stream */}
                <div className="space-y-3 pt-3 border-t border-pink-400/50 max-h-56 overflow-y-auto">
                  {copilotHistory.map((item, idx) => (
                    <div key={idx} className="bg-white text-slate-900 p-3.5 rounded-xl space-y-2 text-xs shadow-xs">
                      <div className="font-bold text-[#E6005C] flex items-center gap-1.5">
                        <span>Q:</span>
                        <span>{item.q}</span>
                      </div>
                      <div className="text-slate-700 leading-relaxed font-sans">
                        {item.answer}
                      </div>

                      {item.tableData && (
                        <div className="mt-2 rounded border border-slate-200 overflow-x-auto">
                          <table className="w-full text-left text-[11px] text-slate-700">
                            <thead className="bg-slate-100 uppercase text-[10px] text-slate-600">
                              <tr>
                                {Object.keys(item.tableData[0]).map((k, i) => (
                                  <th key={i} className="py-1 px-2.5">{k}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {item.tableData.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-pink-50">
                                  {Object.values(row).map((v: any, cIdx) => (
                                    <td key={cIdx} className="py-1 px-2.5 font-medium">{v}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                    Buyer Country Distribution
                  </h3>
                  <div className="space-y-2">
                    {ORGANIZER_CRM_METRICS.topCountries.slice(0, 5).map((c, i) => (
                      <div key={i} className="space-y-1 text-xs">
                        <div className="flex items-center justify-between font-medium">
                          <span>{c.flag} {c.country}</span>
                          <span className="font-bold text-slate-900">{c.count.toLocaleString()} ({c.share}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#E6005C] h-1.5 rounded-full" style={{ width: `${c.share * 4}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                    Garment Category Demand
                  </h3>
                  <div className="space-y-2">
                    {ORGANIZER_CRM_METRICS.categoryDemand.slice(0, 4).map((cat, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs">
                        <div>
                          <span className="font-bold text-slate-800 block">{cat.category}</span>
                          <span className="text-slate-500 text-[11px]">{cat.count.toLocaleString()} requests</span>
                        </div>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                          {cat.change}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 2: BUYERS CRM */}
          {activeModule === 'buyers' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase">Registered Buyers CRM</h3>
                  <p className="text-xs text-slate-500">12,842 international verified trade buyers across 70+ nations</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={buyerSearch}
                    onChange={(e) => setBuyerSearch(e.target.value)}
                    placeholder="Search by buyer name, company, or category..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#E6005C]"
                  />
                </div>

                <select
                  value={buyerCountryFilter}
                  onChange={(e) => setBuyerCountryFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
                >
                  <option value="All">All Countries</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Italy">Italy</option>
                  <option value="Japan">Japan</option>
                  <option value="France">France</option>
                </select>
              </div>

              {/* Buyers Table */}
              <div className="rounded-xl border border-slate-200 overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Buyer & Company</th>
                      <th className="py-2.5 px-3">Country</th>
                      <th className="py-2.5 px-3">Intent Score</th>
                      <th className="py-2.5 px-3">Annual Volume</th>
                      <th className="py-2.5 px-3">Target Categories</th>
                      <th className="py-2.5 px-3">Meetings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBuyers.map((b) => (
                      <tr key={b.id} className="hover:bg-pink-50/50 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{b.name}</div>
                          <div className="text-[11px] text-slate-500">{b.company}</div>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {b.flag} {b.country}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.intent === 'High' ? 'bg-pink-100 text-[#E6005C]' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {b.intent} ({b.score})
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{b.volume}</td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-600">{b.categories}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {b.meetings} booked
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODULE 3: EXHIBITORS */}
          {activeModule === 'exhibitors' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase">Exhibitor Directory & Stall Traffic</h3>
                  <p className="text-xs text-slate-500">426 certified Indian garment exporters across 3 pavilions</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Filter Hub:</span>
                  <select
                    value={exhibitorHubFilter}
                    onChange={(e) => setExhibitorHubFilter(e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
                  >
                    <option value="All">All Hubs</option>
                    <option value="Tirupur">Tirupur (Knits)</option>
                    <option value="Jaipur">Jaipur (Prints)</option>
                    <option value="Noida">Noida (Wovens)</option>
                    <option value="Bengaluru">Bengaluru (Eco-Denim)</option>
                    <option value="Surat">Surat (Silks)</option>
                    <option value="Ludhiana">Ludhiana (Sweaters)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredExhibitors.map((ex) => (
                  <div key={ex.id} className="p-4 rounded-xl border border-slate-200 hover:border-pink-300 bg-slate-50/40 hover:bg-white transition-colors space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#E6005C] bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                          {ex.hall} · {ex.stall}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">{ex.name}</h4>
                        <p className="text-xs text-slate-500">{ex.location} · {ex.hub}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {ex.sustainabilityRating}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{ex.tagline}</p>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Capacity: {ex.maxCapacityMonthly}</span>
                      <span className="font-bold text-slate-800">MOQ: {ex.moq}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE 4: EVENT OPERATIONS */}
          {activeModule === 'events' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase">Live Event Operations & Hall Density</h3>
                <p className="text-xs text-slate-500">Real-time Bluetooth beacon footfalls, badge scans, and pavilion capacity telemetry</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">Hall 1 (Prints & Resort)</span>
                    <span className="text-xs font-bold text-emerald-600">68% Capacity</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '68%' }} />
                  </div>
                  <div className="text-[11px] text-slate-500">Current Occupancy: 3,420 attendees</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">Hall 2 (Knits & Casuals)</span>
                    <span className="text-xs font-bold text-[#E6005C]">84% Capacity</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#E6005C] h-2 rounded-full" style={{ width: '84%' }} />
                  </div>
                  <div className="text-[11px] text-slate-500">Current Occupancy: 4,890 attendees (Peak)</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">Hall 3 (Denim & Wovens)</span>
                    <span className="text-xs font-bold text-blue-600">52% Capacity</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '52%' }} />
                  </div>
                  <div className="text-[11px] text-slate-500">Current Occupancy: 2,640 attendees</div>
                </div>
              </div>

              {/* Gate Entry Velocity */}
              <div className="p-4 rounded-xl bg-pink-50/60 border border-pink-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-[#E6005C]">
                  <Activity className="w-4 h-4" />
                  <span>Gate Entry Influx Velocity: 142 Badge Scans / Minute</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Gate 4 (VIP Overseas Buyer Lounge) has 0 queue time. Automated fast-track registration has processed 94.2% of pre-registered international delegates.
                </p>
              </div>
            </div>
          )}

          {/* MODULE 5: B2B MEETINGS */}
          {activeModule === 'meetings' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase">Live B2B Meeting Allocation Matrix</h3>
                  <p className="text-xs text-slate-500">3,420 scheduled buyer-manufacturer meetings across 75th IIGF</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  96.8% Conflict-Free Resolution
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Buyer</th>
                      <th className="py-2.5 px-3">Exhibitor & Stall</th>
                      <th className="py-2.5 px-3">Time & Date</th>
                      <th className="py-2.5 px-3">Match Intent</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MOCK_LIVE_MEETINGS.map((m) => (
                      <tr key={m.id} className="hover:bg-pink-50/50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{m.buyer}</td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-800">{m.exhibitor}</div>
                          <div className="text-[11px] text-slate-500">{m.hall} · {m.stall}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{m.time}</div>
                          <div className="text-[11px] text-slate-500">{m.date}</div>
                        </td>
                        <td className="py-2.5 px-3 text-[#E6005C] font-bold">{m.intent}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            m.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                            m.status === 'In Progress' ? 'bg-pink-100 text-[#E6005C] animate-pulse' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODULE 6: LEAD INTELLIGENCE */}
          {activeModule === 'leads' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase">AI Lead Scoring & Commercial Conversion</h3>
                <p className="text-xs text-slate-500">Autonomous lead qualification telemetry and pipeline forecasting</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-pink-50 border border-pink-200">
                  <span className="text-[10px] font-bold text-[#E6005C] uppercase">Tier 1 High Intent (90-100%)</span>
                  <div className="text-2xl font-black text-[#E6005C] mt-1">1,240 Leads</div>
                  <p className="text-[11px] text-slate-600 mt-1">Est. Export Value: $28.5M</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-800 uppercase">Tier 2 Qualified (75-89%)</span>
                  <div className="text-2xl font-black text-amber-900 mt-1">1,820 Leads</div>
                  <p className="text-[11px] text-slate-600 mt-1">Est. Export Value: $18.2M</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-600 uppercase">Tier 3 Discovery (Below 75%)</span>
                  <div className="text-2xl font-black text-slate-800 mt-1">860 Leads</div>
                  <p className="text-[11px] text-slate-600 mt-1">Nurturing via Automated Follow-Up</p>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 7: COMMERCIAL RFQS */}
          {activeModule === 'rfqs' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase">Live Commercial RFQs Stream</h3>
                <p className="text-xs text-slate-500">Global buyer garment tenders matched with Indian manufacturing clusters</p>
              </div>

              <div className="space-y-3">
                {MOCK_RFQS.map((rfq) => (
                  <div key={rfq.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {rfq.status}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">{rfq.title}</h4>
                      <p className="text-xs text-slate-500">Buyer: {rfq.buyer} · Target Delivery: {rfq.delivery}</p>
                    </div>

                    <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4 shrink-0">
                      <div className="text-sm font-black text-[#E6005C]">{rfq.budget}</div>
                      <div className="text-[11px] text-slate-500">{rfq.responses} Bids Submitted</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODULE 8: MACRO ANALYTICS */}
          {activeModule === 'analytics' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase">Macro Trade Fair & Export Cluster Analytics</h3>
                <p className="text-xs text-slate-500">Cross-border sourcing trends, regional cluster performance, and fair economic multiplier</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">Top Sourcing Clusters (Order Volume)</span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span>Tirupur (Knits & Innerwear)</span>
                      <span className="text-[#E6005C] font-bold">$18.4M</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Noida / NCR (Tailored Wovens)</span>
                      <span className="text-[#E6005C] font-bold">$12.1M</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Jaipur (Block Prints & Resortwear)</span>
                      <span className="text-[#E6005C] font-bold">$8.6M</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Bengaluru (Denim & Sustainable Basics)</span>
                      <span className="text-[#E6005C] font-bold">$6.2M</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">Top Buyer Continents</span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span>Europe (UK, Germany, France, Italy)</span>
                      <span className="text-emerald-700 font-bold">54.2%</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>North America (USA, Canada)</span>
                      <span className="text-emerald-700 font-bold">26.8%</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Asia-Pacific (Japan, Australia)</span>
                      <span className="text-emerald-700 font-bold">12.5%</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Middle East & Africa (UAE, Saudi Arabia)</span>
                      <span className="text-emerald-700 font-bold">6.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
