import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Sparkles, 
  Calendar, 
  Bookmark, 
  Send, 
  CheckCircle2, 
  Globe, 
  Phone, 
  Mail,
  Layers
} from 'lucide-react';
import { Exhibitor } from '../types';

interface ExhibitorDetailModalProps {
  exhibitor: Exhibitor | null;
  isOpen: boolean;
  isShortlisted: boolean;
  onClose: () => void;
  onToggleShortlist: (id: string) => void;
  onBookMeeting: (exhibitor: Exhibitor) => void;
  onSendRfq: (exhibitor: Exhibitor) => void;
}

export const ExhibitorDetailModal: React.FC<ExhibitorDetailModalProps> = ({
  exhibitor,
  isOpen,
  isShortlisted,
  onClose,
  onToggleShortlist,
  onBookMeeting,
  onSendRfq
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'capabilities' | 'samples'>('overview');

  if (!isOpen || !exhibitor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Top Header Banner (IIGF Pink Theme) */}
        <div className="bg-[#E6005C] text-white p-6 relative border-b border-[#C2004D]">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-xl bg-white text-[#E6005C] flex items-center justify-center text-xl font-black shadow font-serif">
                {exhibitor.hub.substring(0, 2).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-amber-300 bg-white/15 px-2 py-0.5 rounded">
                    {exhibitor.hall} · {exhibitor.stall}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-300 bg-black/20 px-2 py-0.5 rounded">
                    Verified Exporter
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1 uppercase">{exhibitor.name}</h2>
                <p className="text-xs text-pink-100 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  <span>{exhibitor.location}</span>
                  <span>·</span>
                  <span>Hub: {exhibitor.hub}</span>
                </p>
              </div>
            </div>

            {exhibitor.matchScore && (
              <div className="bg-white/15 border border-white/20 p-2.5 rounded-lg text-center shrink-0">
                <span className="text-[10px] text-pink-100 uppercase font-bold block">Match Fidelity</span>
                <span className="text-xl font-black text-amber-300">{exhibitor.matchScore}%</span>
              </div>
            )}
          </div>

          <p className="text-xs text-white/90 mt-3 leading-relaxed max-w-2xl">
            {exhibitor.tagline}
          </p>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'overview'
                ? 'border-[#E6005C] text-[#E6005C]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Overview & AI Recommendation
          </button>
          <button
            onClick={() => setActiveTab('capabilities')}
            className={`py-3 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'capabilities'
                ? 'border-[#E6005C] text-[#E6005C]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Manufacturing & Audits
          </button>
          <button
            onClick={() => setActiveTab('samples')}
            className={`py-3 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'samples'
                ? 'border-[#E6005C] text-[#E6005C]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Swatch Samples & Contacts
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[440px] overflow-y-auto space-y-4 text-xs">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-pink-50/80 border border-pink-200 rounded-xl p-4 text-xs">
                <div className="flex items-center gap-2 text-[#E6005C] font-bold mb-1.5">
                  <Sparkles className="w-4 h-4 text-[#E6005C]" />
                  <span>Why AI Recommends This Exhibitor:</span>
                </div>
                <p className="text-slate-700 leading-relaxed mb-2">
                  This exhibitor matches your procurement brief because they specialize in women’s sustainable casualwear, support low-volume private-label production (MOQ {exhibitor.moq} pcs), and maintain extensive verified export compliance with UK high-street brands.
                </p>
                <div className="space-y-1 pl-4 list-disc text-slate-800">
                  {exhibitor.matchReasons?.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">About Company</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{exhibitor.description}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">MOQ</span>
                  <span className="text-xs font-bold text-slate-900">{exhibitor.moq} pcs</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Capacity</span>
                  <span className="text-xs font-bold text-slate-900">{exhibitor.maxCapacityMonthly.toLocaleString()} pcs</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Lead Time</span>
                  <span className="text-xs font-bold text-slate-900">{exhibitor.leadTimeDays} days</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Sustainability</span>
                  <span className="text-xs font-bold text-emerald-700">Class {exhibitor.sustainabilityRating}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'capabilities' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Audits & Certifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {exhibitor.certifications.map((cert, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">Export Destinations</h4>
                <div className="flex flex-wrap gap-1.5">
                  {exhibitor.exportMarkets.map((m, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 rounded text-slate-800 font-medium">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'samples' && (
            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 text-sm">{exhibitor.contactPerson}</span>
                <p className="text-xs text-slate-500">Chief Export Officer</p>
                <div className="flex items-center gap-4 text-slate-600 pt-1">
                  <span>{exhibitor.phone}</span>
                  <span>·</span>
                  <span>{exhibitor.email}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => onToggleShortlist(exhibitor.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              isShortlisted
                ? 'bg-pink-100 text-[#E6005C] border-pink-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>{isShortlisted ? 'In Shortlist' : 'Add to Shortlist'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onSendRfq(exhibitor);
              }}
              className="px-3.5 py-2 bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Send RFQ
            </button>

            <button
              onClick={() => {
                onClose();
                onBookMeeting(exhibitor);
              }}
              className="px-4 py-2 bg-[#E6005C] hover:bg-[#C2004D] text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Request Meeting</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
