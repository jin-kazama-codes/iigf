import React from 'react';
import { 
  Building2, 
  Calendar, 
  Bookmark, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Plus
} from 'lucide-react';
import { BuyerProfile, Exhibitor, Meeting, RFQ } from '../types';

interface BuyerDashboardProps {
  buyerProfile: BuyerProfile;
  exhibitors: Exhibitor[];
  meetings: Meeting[];
  rfqs: RFQ[];
  shortlist: string[];
  onToggleShortlist: (id: string) => void;
  onOpenExhibitorModal: (exhibitor: Exhibitor) => void;
  onBookMeeting: (exhibitor: Exhibitor) => void;
  onOpenReverseRfqModal: () => void;
  onNavigateToMeetings: () => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({
  buyerProfile,
  exhibitors,
  meetings,
  rfqs,
  shortlist,
  onToggleShortlist,
  onOpenExhibitorModal,
  onBookMeeting,
  onOpenReverseRfqModal,
  onNavigateToMeetings
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Profile Banner (IIGF Pink Theme) */}
      <div className="bg-[#E6005C] text-white rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Sourcing Dashboard · 75th IIGF</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              Welcome, {buyerProfile.name}
            </h1>
            <p className="text-xs sm:text-sm text-pink-100 mt-1 flex flex-wrap items-center gap-2">
              <span className="font-bold text-white">{buyerProfile.company}</span>
              <span>·</span>
              <span>{buyerProfile.country} {buyerProfile.flag}</span>
              <span>·</span>
              <span className="text-amber-300 font-bold">Buying Intent: {buyerProfile.buyingIntent} ({buyerProfile.intentScore})</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenReverseRfqModal}
              className="px-4 py-2 bg-[#EB8B2D] hover:bg-[#d67b22] text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post Sourcing RFQ</span>
            </button>
            <button
              onClick={onNavigateToMeetings}
              className="px-4 py-2 bg-white text-[#E6005C] hover:bg-pink-50 text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#E6005C]" />
              <span>My Fair Agenda</span>
            </button>
          </div>
        </div>

        {/* Quick Sourcing Preferences Line */}
        <div className="mt-6 pt-4 border-t border-pink-400/50 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-pink-100">
          <div>
            <span className="text-white/80 font-semibold">Target Categories: </span>
            <span className="font-bold text-white">{buyerProfile.productCategories.join(', ')}</span>
          </div>
          <span className="text-pink-300 hidden sm:inline">|</span>
          <div>
            <span className="text-white/80 font-semibold">Target MOQ: </span>
            <span className="font-bold text-white">{buyerProfile.targetMoq}</span>
          </div>
          <span className="text-pink-300 hidden sm:inline">|</span>
          <div>
            <span className="text-white/80 font-semibold">Audits: </span>
            <span className="font-bold text-white">{buyerProfile.certificationsNeeded.join(', ')}</span>
          </div>
        </div>
      </div>

      {/* 5 Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Recommended</span>
            <Building2 className="w-4 h-4 text-[#E6005C]" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">12</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Verified Exporters</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Upcoming Meetings</span>
            <Calendar className="w-4 h-4 text-[#EB8B2D]" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">{meetings.length}</div>
          <span className="text-[11px] text-slate-500 font-medium">Halls 1, 2 & 3</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Shortlisted</span>
            <Bookmark className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">{shortlist.length}</div>
          <span className="text-[11px] text-slate-500 font-medium">Saved for review</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Open RFQs</span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">{rfqs.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Active matching</span>
        </div>

        <div className="bg-[#FDF2F4] p-4 rounded-xl border border-pink-200 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[#E6005C] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Top Match</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-[#E6005C] tabular-nums">94%</div>
          <span className="text-[11px] text-pink-800 font-semibold">ABC Textiles</span>
        </div>
      </div>

      {/* Main Section: Top Matches */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Top Sourcing Matches</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked dynamically by the IIGF Matchmaker based on women's casualwear, MOQ &lt; 500, and UK market export history.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#E6005C]">
            Showing top {exhibitors.length} certified exporters
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exhibitors.map((ex) => {
            const isShortlisted = shortlist.includes(ex.id);
            return (
              <div
                key={ex.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#E6005C] transition-all shadow-xs flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {ex.matchScore || 90}% Match
                      </span>
                      <span className="text-[11px] font-bold text-[#EB8B2D]">
                        {ex.hub}
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
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ex.location}</span>
                    <span>·</span>
                    <span className="text-[#E6005C] font-semibold">{ex.hall} ({ex.stall})</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {ex.tagline}
                  </p>

                  <div className="mt-3 bg-pink-50/60 rounded-lg p-2.5 border border-pink-100 space-y-1">
                    <div className="text-[11px] font-bold text-[#E6005C] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Why this is a match:</span>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-0.5 pl-4 list-disc marker:text-[#E6005C]">
                      {ex.matchReasons?.slice(0, 3).map((r, i) => (
                        <li key={i} className="leading-tight">{r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 text-[11px] block">MOQ:</span>
                      <span className="font-bold text-slate-800">{ex.moq} pcs</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Certifications:</span>
                      <span className="font-bold text-slate-800 truncate block">{ex.certifications[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenExhibitorModal(ex)}
                    className="text-xs font-bold text-slate-700 hover:text-[#E6005C] underline cursor-pointer"
                  >
                    View Dossier
                  </button>

                  <button
                    onClick={() => onBookMeeting(ex)}
                    className="px-3.5 py-1.5 bg-[#E6005C] hover:bg-[#C2004D] text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Slot</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
