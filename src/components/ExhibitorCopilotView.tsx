import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  Search, 
  Mail,
  MessageSquare
} from 'lucide-react';
import { DEMO_LEADS } from '../data/mockData';
import { LeadItem } from '../types';

interface ExhibitorCopilotViewProps {
  onOpenMeetingCopilotForLead: (lead: LeadItem) => void;
}

export const ExhibitorCopilotView: React.FC<ExhibitorCopilotViewProps> = ({
  onOpenMeetingCopilotForLead
}) => {
  const [leads, setLeads] = useState<LeadItem[]>(DEMO_LEADS);
  const [searchLead, setSearchLead] = useState('');
  const [filterIntent, setFilterIntent] = useState<'ALL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [quickFollowUpModalLead, setQuickFollowUpModalLead] = useState<LeadItem | null>(null);
  const [dispatchedNotice, setDispatchedNotice] = useState<string | null>(null);

  const filteredLeads = leads.filter((lead) => {
    if (filterIntent !== 'ALL' && lead.intent !== filterIntent) return false;
    if (searchLead) {
      const q = searchLead.toLowerCase();
      return (
        lead.buyerName.toLowerCase().includes(q) ||
        lead.buyerCompany.toLowerCase().includes(q) ||
        lead.country.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleQuickDispatch = (channel: 'whatsapp' | 'email') => {
    if (!quickFollowUpModalLead) return;
    setDispatchedNotice(`Automated AI ${channel.toUpperCase()} follow-up dispatched to ${quickFollowUpModalLead.buyerName} (${quickFollowUpModalLead.buyerCompany})!`);
    setLeads(prev => prev.map(l => l.id === quickFollowUpModalLead.id ? { ...l, status: 'Follow-up Sent' } : l));
    setQuickFollowUpModalLead(null);
    setTimeout(() => setDispatchedNotice(null), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Copilot Header (IIGF Pink Theme) */}
      <div className="bg-[#E6005C] text-white rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Exhibitor Portal · ABC Textiles (Hall 2, Stall B-17)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              Your AI Sales Copilot
            </h1>
            <p className="text-xs sm:text-sm text-pink-100 mt-1 max-w-2xl">
              Real-time stall badge scans, visitor intent telemetry, automated lead scoring, and 1-click WhatsApp/Email follow-ups.
            </p>
          </div>

          <div className="bg-white text-[#E6005C] font-bold text-xs px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E6005C] animate-pulse" />
            Booth Scanner Active
          </div>
        </div>

        {/* 6 Mandatory Metrics */}
        <div className="mt-8 pt-6 border-t border-pink-400/50 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white/15 p-3 rounded-xl">
            <span className="text-[10px] text-pink-100 uppercase font-bold block">Buyer Visits</span>
            <span className="text-2xl font-black text-white tabular-nums">127</span>
          </div>
          <div className="bg-white/15 p-3 rounded-xl">
            <span className="text-[10px] text-pink-100 uppercase font-bold block">Qualified Leads</span>
            <span className="text-2xl font-black text-white tabular-nums">42</span>
          </div>
          <div className="bg-white/15 p-3 rounded-xl">
            <span className="text-[10px] text-pink-100 uppercase font-bold block">Meetings</span>
            <span className="text-2xl font-black text-white tabular-nums">18</span>
          </div>
          <div className="bg-white/15 p-3 rounded-xl">
            <span className="text-[10px] text-pink-100 uppercase font-bold block">RFQs Generated</span>
            <span className="text-2xl font-black text-white tabular-nums">11</span>
          </div>
          <div className="bg-white/15 p-3 rounded-xl">
            <span className="text-[10px] text-pink-100 uppercase font-bold block">High Intent</span>
            <span className="text-2xl font-black text-amber-300 tabular-nums">8</span>
          </div>
          <div className="bg-white/15 p-3 rounded-xl border border-amber-300">
            <span className="text-[10px] text-amber-300 uppercase font-bold block">Pending Follow-ups</span>
            <span className="text-2xl font-black text-white tabular-nums">4</span>
          </div>
        </div>
      </div>

      {dispatchedNotice && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{dispatchedNotice}</span>
        </div>
      )}

      {/* Main Section: AI Lead Intelligence */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">AI Lead Intelligence</h2>
            <p className="text-xs text-slate-500">
              Ranked in real-time by buyer procurement volume, European retail accreditation, and stall interaction depth.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchLead}
                onChange={(e) => setSearchLead(e.target.value)}
                placeholder="Search leads..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-[#E6005C]"
              />
            </div>

            <select
              value={filterIntent}
              onChange={(e) => setFilterIntent(e.target.value as any)}
              className="py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
            >
              <option value="ALL">All Intents</option>
              <option value="HIGH">High Intent</option>
              <option value="MEDIUM">Medium Intent</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-[#E6005C] transition-all bg-slate-50/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{lead.buyerName}</h3>
                  <span className="text-xs text-slate-500">{lead.flag} {lead.country}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs font-semibold text-slate-700">{lead.buyerCompany}</span>
                  <span className="text-[10px] font-black text-[#E6005C] bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                    {lead.intent} INTENT — {lead.intentScore}
                  </span>
                </div>

                <div className="text-xs text-slate-600">
                  <span>Interested in: <strong>{lead.interests.join(', ')}</strong></span>
                  <span className="mx-2">·</span>
                  <span>MOQ Requirement: <strong>{lead.moqRequirement}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setQuickFollowUpModalLead(lead)}
                  className="px-3 py-1.5 bg-[#E6005C] hover:bg-[#C2004D] text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Follow-up</span>
                </button>

                <button
                  onClick={() => onOpenMeetingCopilotForLead(lead)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Meeting Copilot
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Follow-up Modal */}
      {quickFollowUpModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="bg-[#E6005C] text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase">
                AI Follow-up Generator for {quickFollowUpModalLead.buyerName}
              </h3>
              <button onClick={() => setQuickFollowUpModalLead(null)} className="text-white hover:text-pink-200 cursor-pointer">
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Generated WhatsApp Draft:</label>
                <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 text-slate-800 leading-relaxed">
                  "Hello {quickFollowUpModalLead.buyerName}, thank you for visiting ABC Textiles (Stall B-17) at the 75th IIGF today. As discussed, please find our GOTS organic cotton collection link and volume tiered pricing for your {quickFollowUpModalLead.moqRequirement} units requirement!"
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleQuickDispatch('whatsapp')}
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </button>
                <button
                  onClick={() => handleQuickDispatch('email')}
                  className="py-2.5 bg-[#E6005C] hover:bg-[#C2004D] text-white font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Official Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
