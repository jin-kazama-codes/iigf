import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Sparkles, 
  Navigation, 
  RotateCw
} from 'lucide-react';
import { Meeting } from '../types';

interface AgendaViewProps {
  meetings: Meeting[];
  onOpenCompanionWithStall: (hall: string, stall: string) => void;
  onOpenMeetingCopilot: (meeting: Meeting) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  meetings,
  onOpenCompanionWithStall,
  onOpenMeetingCopilot
}) => {
  const [selectedDay, setSelectedDay] = useState('14 July 2026');

  const timelineItems = [
    {
      time: '09:30 AM',
      type: 'event',
      title: 'VIP Buyer Accreditation & Welcome Coffee',
      location: 'Gate 4 VIP Buyer Lounge, Bharat Mandapam',
      badge: 'Arrival',
      notes: 'Pick up physical RFID visitor badge & AI Fair Companion smart lanyard.'
    },
    {
      time: '10:00 AM',
      type: 'meeting',
      title: 'ABC Textiles — Demo Exhibitor',
      location: 'Hall 2 — Stall B-17',
      hall: 'Hall 2',
      stall: 'Stall B-17',
      badge: 'Confirmed Meeting',
      meetingId: 'meet-101',
      notes: 'Review GOTS organic cotton summer 2027 jersey collection and private-label MOQ terms.'
    },
    {
      time: '10:45 AM',
      type: 'meeting',
      title: 'XYZ Garments — Demo Exhibitor',
      location: 'Hall 2 — Stall D-08',
      hall: 'Hall 2',
      stall: 'Stall D-08',
      badge: 'Confirmed Meeting',
      meetingId: 'meet-102',
      notes: 'Evaluate EcoVero woven dresses, sample tech packs, and UK customs compliance history.'
    },
    {
      time: '12:30 PM',
      type: 'event',
      title: 'International Networking Lunch & Trend Presentation',
      location: 'Central Pavilion Banquet Lounge',
      badge: 'Hospitality',
      notes: 'Keynote on "Global Circular Fashion Standards" by AEPC export delegates.'
    },
    {
      time: '02:00 PM',
      type: 'meeting',
      title: 'FashionWorks India — Demo Exhibitor',
      location: 'Hall 1 — Stall A-12',
      hall: 'Hall 1',
      stall: 'Stall A-12',
      badge: 'Confirmed Meeting',
      meetingId: 'meet-103',
      notes: 'Discuss bespoke handblock resortwear capsules and Fair Trade delivery cycles.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#E6005C] uppercase tracking-wider block">
            Personal Fair Itinerary · 75th IIGF
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
            My IIGF Day
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dynamic timeline synchronizing your exhibitor meetings, fashion shows, and networking events.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          {['14 July 2026', '15 July 2026', '16 July 2026'].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-3 py-1.5 rounded-md font-bold transition-colors cursor-pointer ${
                selectedDay === d
                  ? 'bg-[#E6005C] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* AI Route Optimization Banner (IIGF Pink Theme) */}
      <div className="bg-[#E6005C] text-white p-5 rounded-2xl mb-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-amber-300 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white uppercase">AI Route Optimization Active</span>
              <span className="text-[10px] font-bold bg-white text-[#E6005C] px-2 py-0.5 rounded">
                Transit Reduced 42%
              </span>
            </div>
            <p className="text-xs text-pink-100 mt-1 max-w-2xl leading-relaxed">
              Route grouped sequentially across Hall 2 (Stalls B-17 & D-08) before lunch, avoiding unnecessary hall backtracking.
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('Route re-synchronized across halls!')}
          className="px-3.5 py-2 bg-white text-[#E6005C] hover:bg-pink-50 text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Re-optimize</span>
        </button>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative">
        <div className="space-y-5">
          {timelineItems.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#E6005C] transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#E6005C]">{item.time}</span>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-100 text-[#E6005C]">
                    {item.badge}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-[#E6005C]" />
                  <span>{item.location}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {item.notes}
              </p>

              <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                {item.hall && item.stall ? (
                  <button
                    onClick={() => onOpenCompanionWithStall(item.hall, item.stall)}
                    className="text-xs font-bold text-[#E6005C] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate on Map ({item.stall})</span>
                  </button>
                ) : <div />}

                {item.type === 'meeting' && (
                  <button
                    onClick={() => {
                      const m = meetings.find(meet => meet.stall === item.stall) || meetings[0];
                      onOpenMeetingCopilot(m);
                    }}
                    className="px-3 py-1 bg-white hover:bg-pink-50 text-[#E6005C] border border-pink-200 rounded text-xs font-bold shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-[#E6005C]" />
                    <span>Meeting Copilot</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
