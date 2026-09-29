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
  MessageSquare, 
  Briefcase
} from 'lucide-react';
import { ORGANIZER_CRM_METRICS } from '../data/mockData';

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
        answer = `Analyzed 75th IIGF data for: "${q}". Event conversion velocity is 18.4% ahead of the previous edition, with cross-border RFQs pacing at $42M.`;
      }

      setCopilotHistory(prev => [{ q, answer, tableData }, ...prev]);
      setOrganizerQuery('');
    }, 400);
  };

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
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 block">
              CRM Navigation
            </span>
            {sidebarModules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer text-left ${
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
                onClick={() => handleOrganizerCopilotAsk("Which buyers haven't booked meetings?")}
                className="px-2.5 py-1 bg-[#E6005C] hover:bg-[#C2004D] text-white rounded font-bold text-[11px] cursor-pointer"
              >
                View Buyers
              </button>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-3 space-y-6">
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
      </div>
    </div>
  );
};
