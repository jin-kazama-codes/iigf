import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Sparkles, 
  Navigation, 
  RotateCw, 
  Plus, 
  Video, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  CheckSquare, 
  Square, 
  Download, 
  Share2, 
  FileText, 
  User, 
  Building2, 
  X, 
  PhoneCall, 
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Meeting } from '../types';

interface AgendaViewProps {
  meetings: Meeting[];
  onOpenCompanionWithStall: (hall: string, stall: string) => void;
  onOpenMeetingCopilot: (meeting: Meeting) => void;
}

type CalendarViewMode = 'work-week' | 'day' | 'agenda';

interface CalendarEventItem {
  id: string;
  title: string;
  category: 'b2b' | 'runway' | 'seminar' | 'hospitality';
  categoryLabel: string;
  day: string; // '14 Jul', '15 Jul', '16 Jul', '17 Jul'
  dateNumber: number;
  dayName: string; // 'Tue', 'Wed', 'Thu', 'Fri'
  startTime: string; // '10:00 AM'
  endTime: string; // '10:30 AM'
  startHour: number; // 10.0
  durationHours: number; // 0.5 (30 mins), 1.0 (60 mins)
  location: string;
  hall?: string;
  stall?: string;
  organizer: string;
  attendees: string[];
  notes: string;
  status: 'Confirmed' | 'In Progress' | 'Upcoming';
  color: string;
  borderColor: string;
  bgColor: string;
  darkBgColor: string;
  meetingRef?: Meeting;
}

const FAIR_DAYS = [
  { day: '14 Jul', dayName: 'Tue', dateNumber: 14, fullDate: 'Tuesday, 14 July 2026', title: 'Day 1 · Inauguration & Tirupur Knits' },
  { day: '15 Jul', dayName: 'Wed', dateNumber: 15, fullDate: 'Wednesday, 15 July 2026', title: 'Day 2 · Noida Wovens & Jaipur Artisans' },
  { day: '16 Jul', dayName: 'Thu', dateNumber: 16, fullDate: 'Thursday, 16 July 2026', title: 'Day 3 · Sustainable Denim & Runway' },
  { day: '17 Jul', dayName: 'Fri', dateNumber: 17, fullDate: 'Friday, 17 July 2026', title: 'Day 4 · Global Deal Closing & Valedictory' },
];

const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

export const AgendaView: React.FC<AgendaViewProps> = ({
  meetings,
  onOpenCompanionWithStall,
  onOpenMeetingCopilot
}) => {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('work-week');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // 0 = 14 Jul (Tue)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventItem | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);
  
  // Category filters
  const [filters, setFilters] = useState({
    b2b: true,
    runway: true,
    seminar: true,
    hospitality: true
  });

  const activeDay = FAIR_DAYS[selectedDayIndex];

  // Comprehensive Schedule across all 4 days
  const allEvents: CalendarEventItem[] = useMemo(() => {
    return [
      // Day 1 (14 Jul)
      {
        id: 'evt-101',
        title: 'VIP Buyer Accreditation & Welcome Coffee',
        category: 'hospitality',
        categoryLabel: 'Hospitality & VIP Entry',
        day: '14 Jul',
        dayName: 'Tue',
        dateNumber: 14,
        startTime: '09:00 AM',
        endTime: '09:45 AM',
        startHour: 9.0,
        durationHours: 0.75,
        location: 'Gate 4 VIP Buyer Lounge, Bharat Mandapam',
        organizer: 'AEPC Protocol Desk',
        attendees: ['Sarah Williams', 'Karan Sharma', 'AEPC Delegate Team'],
        notes: 'Collect physical RFID Smart Pass, AI Fair Companion lanyard, and voucher for luxury lounge.',
        status: 'Confirmed',
        color: '#0284C7',
        borderColor: '#38BDF8',
        bgColor: 'bg-sky-50 text-sky-900 border-sky-400',
        darkBgColor: 'dark:bg-sky-950/70 dark:text-sky-200 dark:border-sky-500'
      },
      {
        id: 'evt-102',
        title: 'ABC Textiles — Summer 2027 Organic Knits',
        category: 'b2b',
        categoryLabel: 'B2B Stall Meeting',
        day: '14 Jul',
        dayName: 'Tue',
        dateNumber: 14,
        startTime: '10:00 AM',
        endTime: '10:45 AM',
        startHour: 10.0,
        durationHours: 0.75,
        location: 'Hall 2 — Stall B-17',
        hall: 'Hall 2',
        stall: 'Stall B-17',
        organizer: 'Rajesh Kumar (Export Director)',
        attendees: ['Sarah Williams', 'Rajesh Kumar (ABC Textiles)'],
        notes: 'Review 180 GSM GOTS single jersey swatches, low MOQ 300 terms, and UK warehouse DDP pricing.',
        status: 'Confirmed',
        color: '#5B5FC7', // Teams Purple
        borderColor: '#E6005C',
        bgColor: 'bg-pink-50/90 text-slate-900 border-[#E6005C]',
        darkBgColor: 'dark:bg-pink-950/50 dark:text-pink-100 dark:border-pink-500',
        meetingRef: meetings[0]
      },
      {
        id: 'evt-103',
        title: 'XYZ Garments — EcoVero Woven Dresses & Blouses',
        category: 'b2b',
        categoryLabel: 'B2B Stall Meeting',
        day: '14 Jul',
        dayName: 'Tue',
        dateNumber: 14,
        startTime: '11:00 AM',
        endTime: '11:45 AM',
        startHour: 11.0,
        durationHours: 0.75,
        location: 'Hall 2 — Stall D-08',
        hall: 'Hall 2',
        stall: 'Stall D-08',
        organizer: 'Sunita Sharma (Design Head)',
        attendees: ['Sarah Williams', 'Sunita Sharma (XYZ Garments)'],
        notes: 'Sample tech packs review, custom digital floral prints, and UK customs compliance audit.',
        status: 'In Progress',
        color: '#5B5FC7',
        borderColor: '#5B5FC7',
        bgColor: 'bg-indigo-50/90 text-slate-900 border-indigo-500',
        darkBgColor: 'dark:bg-indigo-950/50 dark:text-indigo-100 dark:border-indigo-400',
        meetingRef: meetings[1]
      },
      {
        id: 'evt-104',
        title: '75th IIGF Grand Inauguration & Ministerial Keynote',
        category: 'seminar',
        categoryLabel: 'Fair Milestone',
        day: '14 Jul',
        dayName: 'Tue',
        dateNumber: 14,
        startTime: '12:30 PM',
        endTime: '01:30 PM',
        startHour: 12.5,
        durationHours: 1.0,
        location: 'Plenary Auditorium 1, Bharat Mandapam',
        organizer: 'Ministry of Textiles & AEPC',
        attendees: ['Union Minister of Textiles', 'AEPC Chairman', 'Global Sourcing Delegations'],
        notes: 'Official launch of 75th Edition milestone, announcement of India-EU FTA textile tariff corridors.',
        status: 'Confirmed',
        color: '#D97706',
        borderColor: '#F59E0B',
        bgColor: 'bg-amber-50 text-amber-950 border-amber-500',
        darkBgColor: 'dark:bg-amber-950/60 dark:text-amber-100 dark:border-amber-400'
      },
      {
        id: 'evt-105',
        title: 'FashionWorks India — Handblock & Khadi Capsule',
        category: 'b2b',
        categoryLabel: 'B2B Stall Meeting',
        day: '14 Jul',
        dayName: 'Tue',
        dateNumber: 14,
        startTime: '02:00 PM',
        endTime: '02:45 PM',
        startHour: 14.0,
        durationHours: 0.75,
        location: 'Hall 1 — Stall A-12',
        hall: 'Hall 1',
        stall: 'Stall A-12',
        organizer: 'Anand Singh (Founder)',
        attendees: ['Sarah Williams', 'Anand Singh (FashionWorks India)'],
        notes: 'Hand block resortwear capsules, Fair Trade organic dyeing cycles, and FOB London quotes.',
        status: 'Confirmed',
        color: '#5B5FC7',
        borderColor: '#10B981',
        bgColor: 'bg-emerald-50 text-slate-900 border-emerald-500',
        darkBgColor: 'dark:bg-emerald-950/50 dark:text-emerald-100 dark:border-emerald-400',
        meetingRef: meetings[2]
      },
      {
        id: 'evt-106',
        title: 'Runway Gala: "Crafts of India — SS27 Forecast"',
        category: 'runway',
        categoryLabel: 'Official Runway Show',
        day: '14 Jul',
        dayName: 'Tue',
        dateNumber: 14,
        startTime: '04:30 PM',
        endTime: '05:30 PM',
        startHour: 16.5,
        durationHours: 1.0,
        location: 'Runway Amphitheatre, Hall 3',
        organizer: 'Fashion Design Council of India (FDCI)',
        attendees: ['International Buyers', 'Fashion Press', 'Artisan Guilds'],
        notes: 'Live showcase of 60 ready-to-wear silhouettes crafted by Indian master weavers and top exporters.',
        status: 'Confirmed',
        color: '#9333EA',
        borderColor: '#A855F7',
        bgColor: 'bg-purple-50 text-purple-950 border-purple-500',
        darkBgColor: 'dark:bg-purple-950/60 dark:text-purple-100 dark:border-purple-400'
      },

      // Day 2 (15 Jul)
      {
        id: 'evt-201',
        title: 'Shahi Exports — Denim & Circular Outerwear',
        category: 'b2b',
        categoryLabel: 'B2B Stall Meeting',
        day: '15 Jul',
        dayName: 'Wed',
        dateNumber: 15,
        startTime: '10:00 AM',
        endTime: '11:00 AM',
        startHour: 10.0,
        durationHours: 1.0,
        location: 'Hall 3 — Stall C-04',
        hall: 'Hall 3',
        stall: 'Stall C-04',
        organizer: 'Vikram Ahuja',
        attendees: ['Sarah Williams', 'Vikram Ahuja'],
        notes: 'Laser ozone washed denim jackets, recycled elastane blend stretch jeans, zero water discharge demo.',
        status: 'Confirmed',
        color: '#5B5FC7',
        borderColor: '#3B82F6',
        bgColor: 'bg-blue-50 text-slate-900 border-blue-500',
        darkBgColor: 'dark:bg-blue-950/50 dark:text-blue-100 dark:border-blue-400'
      },
      {
        id: 'evt-202',
        title: 'Seminar: EU Digital Product Passport & ESG Audits',
        category: 'seminar',
        categoryLabel: 'Knowledge Session',
        day: '15 Jul',
        dayName: 'Wed',
        dateNumber: 15,
        startTime: '11:30 AM',
        endTime: '12:30 PM',
        startHour: 11.5,
        durationHours: 1.0,
        location: 'Conference Room 2B, Mezzanine',
        organizer: 'Global Textile Compliance Forum',
        attendees: ['EU Trade Delegates', 'Sourcing Heads'],
        notes: 'Technical framework for QR-based DPP garment labeling required by European customs by 2027.',
        status: 'Confirmed',
        color: '#D97706',
        borderColor: '#F59E0B',
        bgColor: 'bg-amber-50 text-amber-950 border-amber-500',
        darkBgColor: 'dark:bg-amber-950/60 dark:text-amber-100 dark:border-amber-400'
      },
      {
        id: 'evt-203',
        title: 'Aura Embroideries — Occasion Wear & Luxury Kaftans',
        category: 'b2b',
        categoryLabel: 'B2B Stall Meeting',
        day: '15 Jul',
        dayName: 'Wed',
        dateNumber: 15,
        startTime: '02:30 PM',
        endTime: '03:15 PM',
        startHour: 14.5,
        durationHours: 0.75,
        location: 'Hall 1 — Stall B-04',
        hall: 'Hall 1',
        stall: 'Stall B-04',
        organizer: 'Sunil Manchanda',
        attendees: ['Sarah Williams', 'Sunil Manchanda'],
        notes: 'Hand zardozi and chikankari resortwear tops, Knightsbridge department store packaging specs.',
        status: 'Confirmed',
        color: '#5B5FC7',
        borderColor: '#EC4899',
        bgColor: 'bg-pink-50 text-slate-900 border-pink-500',
        darkBgColor: 'dark:bg-pink-950/50 dark:text-pink-100 dark:border-pink-400'
      },

      // Day 3 (16 Jul)
      {
        id: 'evt-301',
        title: 'Little Angels Apparels — GOTS Babywear & Muslin',
        category: 'b2b',
        categoryLabel: 'B2B Stall Meeting',
        day: '16 Jul',
        dayName: 'Thu',
        dateNumber: 16,
        startTime: '10:30 AM',
        endTime: '11:15 AM',
        startHour: 10.5,
        durationHours: 0.75,
        location: 'Hall 2 — Stall F-14',
        hall: 'Hall 2',
        stall: 'Stall F-14',
        organizer: 'S. Narayanan',
        attendees: ['Sarah Williams', 'S. Narayanan'],
        notes: 'Nickel-free snaps, baby rib sleepsuits, pull-test lab reports, and UK multi-pack logistics.',
        status: 'Confirmed',
        color: '#5B5FC7',
        borderColor: '#10B981',
        bgColor: 'bg-emerald-50 text-slate-900 border-emerald-500',
        darkBgColor: 'dark:bg-emerald-950/50 dark:text-emerald-100 dark:border-emerald-400'
      },
      {
        id: 'evt-302',
        title: 'Sustainable Threads — Ocean Bound Poly & Chanderi',
        category: 'b2b',
        categoryLabel: 'B2B Stall Meeting',
        day: '16 Jul',
        dayName: 'Thu',
        dateNumber: 16,
        startTime: '01:30 PM',
        endTime: '02:15 PM',
        startHour: 13.5,
        durationHours: 0.75,
        location: 'Hall 2 — Stall E-22',
        hall: 'Hall 2',
        stall: 'Stall E-22',
        organizer: 'Mehul Choksi',
        attendees: ['Sarah Williams', 'Mehul Choksi'],
        notes: 'Fluid evening fabrics made from certified ocean plastics, yarn-to-garment QR traceability.',
        status: 'Confirmed',
        color: '#5B5FC7',
        borderColor: '#06B6D4',
        bgColor: 'bg-cyan-50 text-slate-900 border-cyan-500',
        darkBgColor: 'dark:bg-cyan-950/50 dark:text-cyan-100 dark:border-cyan-400'
      },
      {
        id: 'evt-303',
        title: 'Buyer Delegation VIP Dinner at Bukhara (ITC Maurya)',
        category: 'hospitality',
        categoryLabel: 'Official VIP Hospitality',
        day: '16 Jul',
        dayName: 'Thu',
        dateNumber: 16,
        startTime: '07:30 PM',
        endTime: '10:00 PM',
        startHour: 19.5,
        durationHours: 2.5,
        location: 'Bukhara, ITC Maurya, Diplomatic Enclave',
        organizer: 'AEPC Host Committee',
        attendees: ['Global Retail Buyers', 'Ministry Dignitaries'],
        notes: 'Private dinner and networking with the AEPC Executive Council and leading Indian exporters.',
        status: 'Confirmed',
        color: '#0284C7',
        borderColor: '#38BDF8',
        bgColor: 'bg-sky-50 text-sky-950 border-sky-500',
        darkBgColor: 'dark:bg-sky-950/60 dark:text-sky-100 dark:border-sky-400'
      },

      // Day 4 (17 Jul)
      {
        id: 'evt-401',
        title: 'Commercial LOI Finalization & FOB Contracting',
        category: 'b2b',
        categoryLabel: 'Contract Execution',
        day: '17 Jul',
        dayName: 'Fri',
        dateNumber: 17,
        startTime: '10:00 AM',
        endTime: '11:30 AM',
        startHour: 10.0,
        durationHours: 1.5,
        location: 'VIP Commercial Deal Lounge, Hall 2 Mezzanine',
        hall: 'Hall 2',
        stall: 'VIP Lounge 4',
        organizer: 'Sarah Williams & ABC Textiles',
        attendees: ['Sarah Williams', 'Rajesh Kumar', 'AEPC Legal Officer'],
        notes: 'Sign off digital Letters of Intent (LOI) for 5,000 units SS27 organic jersey range.',
        status: 'Confirmed',
        color: '#5B5FC7',
        borderColor: '#E6005C',
        bgColor: 'bg-pink-50 text-slate-900 border-pink-500',
        darkBgColor: 'dark:bg-pink-950/50 dark:text-pink-100 dark:border-pink-400'
      },
      {
        id: 'evt-402',
        title: '75th IIGF Valedictory & Best Exporter Awards',
        category: 'seminar',
        categoryLabel: 'Official Ceremony',
        day: '17 Jul',
        dayName: 'Fri',
        dateNumber: 17,
        startTime: '03:00 PM',
        endTime: '04:30 PM',
        startHour: 15.0,
        durationHours: 1.5,
        location: 'Grand Auditorium, Bharat Mandapam',
        organizer: 'AEPC & IGFA Secretariat',
        attendees: ['All Exhibitors', 'Buyers', 'Ministry Officials'],
        notes: 'Celebration of $48M+ in negotiated export contracts and presentation of Sustainable Innovation Trophies.',
        status: 'Confirmed',
        color: '#D97706',
        borderColor: '#F59E0B',
        bgColor: 'bg-amber-50 text-amber-950 border-amber-500',
        darkBgColor: 'dark:bg-amber-950/60 dark:text-amber-100 dark:border-amber-400'
      }
    ];
  }, [meetings]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return allEvents.filter(e => {
      if (e.category === 'b2b' && !filters.b2b) return false;
      if (e.category === 'runway' && !filters.runway) return false;
      if (e.category === 'seminar' && !filters.seminar) return false;
      if (e.category === 'hospitality' && !filters.hospitality) return false;
      return true;
    });
  }, [allEvents, filters]);

  // Download Outlook / Teams .ICS Calendar File
  const handleExportIcs = () => {
    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//75th IIGF Fair Secretariat//Calendar 1.0//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nX-WR-CALNAME:75th IIGF Trade Fair Agenda\nX-WR-TIMEZONE:Asia/Kolkata\n`;
    
    filteredEvents.forEach(evt => {
      const dtStart = `202607${evt.dateNumber < 10 ? '0' + evt.dateNumber : evt.dateNumber}T${Math.floor(evt.startHour) < 10 ? '0' + Math.floor(evt.startHour) : Math.floor(evt.startHour)}${(evt.startHour % 1) * 60 === 0 ? '00' : '30'}00`;
      const endHour = evt.startHour + evt.durationHours;
      const dtEnd = `202607${evt.dateNumber < 10 ? '0' + evt.dateNumber : evt.dateNumber}T${Math.floor(endHour) < 10 ? '0' + Math.floor(endHour) : Math.floor(endHour)}${(endHour % 1) * 60 === 0 ? '00' : '30'}00`;
      
      icsContent += `BEGIN:VEVENT\nUID:${evt.id}-iigf2026@indiaapparelfair.com\nDTSTAMP:20260701T000000Z\nDTSTART:${dtStart}\nDTEND:${dtEnd}\nSUMMARY:${evt.title}\nLOCATION:${evt.location}\nDESCRIPTION:${evt.notes} | Organizer: ${evt.organizer}\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
    });

    icsContent += `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '75th_IIGF_Teams_Calendar.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
      {/* ── 1. MICROSOFT TEAMS TOP NAV BAR & TOOLBAR ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden mb-4">
        {/* Main Teams Header Ribbon */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-950/60">
          {/* Left: Teams Calendar Identity & Date Range Navigation */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#5B5FC7] text-white flex items-center justify-center font-black shadow-xs shrink-0">
              <CalendarIcon className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  75th IIGF Fair Calendar
                </h1>
                <span className="px-2 py-0.5 bg-[#5B5FC7]/10 text-[#5B5FC7] dark:bg-[#5B5FC7]/30 dark:text-indigo-300 text-[10px] font-extrabold rounded-md border border-[#5B5FC7]/20">
                  Microsoft Teams View
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-[#5B5FC7]" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  July 14 – 17, 2026
                </span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span className="text-[11px]">(UTC+05:30) New Delhi (IST)</span>
              </div>
            </div>
          </div>

          {/* Right: Teams View Switchers & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Today Navigation */}
            <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
              <button
                onClick={() => setSelectedDayIndex(prev => Math.max(0, prev - 1))}
                disabled={selectedDayIndex === 0}
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                title="Previous Fair Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedDayIndex(0)}
                className="px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border-x border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                Day 1 (Today)
              </button>
              <button
                onClick={() => setSelectedDayIndex(prev => Math.min(FAIR_DAYS.length - 1, prev + 1))}
                disabled={selectedDayIndex === FAIR_DAYS.length - 1}
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                title="Next Fair Day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* View Mode Switcher (Work week / Day / Agenda) */}
            <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-bold">
              <button
                onClick={() => setViewMode('work-week')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'work-week'
                    ? 'bg-white dark:bg-slate-900 text-[#5B5FC7] dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Work week (4 Days)
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'day'
                    ? 'bg-white dark:bg-slate-900 text-[#5B5FC7] dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setViewMode('agenda')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'agenda'
                    ? 'bg-white dark:bg-slate-900 text-[#5B5FC7] dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Agenda List
              </button>
            </div>

            {/* Teams "Meet Now / AI Copilot" Purple Button */}
            <button
              onClick={() => {
                const targetMeeting = meetings[0];
                onOpenMeetingCopilot(targetMeeting);
              }}
              className="px-3.5 py-1.5 bg-[#5B5FC7] hover:bg-[#4F52B2] text-white text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="Launch Live AI Sales Copilot"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Meet now</span>
            </button>

            {/* Sync Outlook / .ICS Button */}
            <button
              onClick={handleExportIcs}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              title="Download Microsoft Teams & Outlook .ICS Calendar"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Sync Outlook (.ics)</span>
            </button>
          </div>
        </div>

        {/* Fair Day Quick Switcher Strip */}
        <div className="px-4 py-2 bg-white dark:bg-slate-900 flex items-center justify-between gap-2 overflow-x-auto text-xs border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Trade Fair Days:
            </span>
            {FAIR_DAYS.map((fd, idx) => (
              <button
                key={fd.day}
                onClick={() => setSelectedDayIndex(idx)}
                className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedDayIndex === idx
                    ? 'bg-[#E6005C] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{fd.dayName} {fd.dateNumber}</span>
                <span className="text-[10px] opacity-80 font-medium">({fd.title.split('·')[1]?.trim()})</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E6005C]" />
              <span>8 Scheduled Meetings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>2 Runway Galas</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. MAIN LAYOUT: LEFT TEAMS SIDEBAR + MAIN CALENDAR CANVAS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Teams Sidebar (Collapsible Mini Month Calendar + Category Filters + AI Route Telemetry) */}
        {isSidebarOpen && (
          <div className="lg:col-span-3 space-y-4">
            {/* Teams Mini Month Calendar (July 2026) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  July 2026
                </span>
                <span className="text-[10px] font-bold text-[#5B5FC7] dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                  75th IIGF Week
                </span>
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 mb-1">
                <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {/* Blank days before July 14 */}
                <span className="text-slate-300 dark:text-slate-700 py-1">12</span>
                <span className="text-slate-300 dark:text-slate-700 py-1">13</span>
                
                {/* 14, 15, 16, 17 Highlighted Fair Days */}
                {[14, 15, 16, 17].map((dateNum, idx) => (
                  <button
                    key={dateNum}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`py-1.5 rounded-lg font-black transition-all cursor-pointer relative ${
                      selectedDayIndex === idx
                        ? 'bg-[#5B5FC7] text-white shadow-xs'
                        : 'bg-pink-50 dark:bg-pink-950/40 text-[#E6005C] dark:text-pink-300 hover:bg-pink-100'
                    }`}
                  >
                    <span>{dateNum}</span>
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#E6005C] dark:bg-pink-400" />
                  </button>
                ))}

                <span className="text-slate-400 py-1">18</span>
                <span className="text-slate-400 py-1">19</span>
                <span className="text-slate-400 py-1">20</span>
                <span className="text-slate-400 py-1">21</span>
              </div>
            </div>

            {/* My Fair Calendars / Category Filters */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#5B5FC7]" />
                  <span>My Fair Calendars</span>
                </span>
                <button
                  onClick={() => setFilters({ b2b: true, runway: true, seminar: true, hospitality: true })}
                  className="text-[10px] font-bold text-[#5B5FC7] hover:underline cursor-pointer"
                >
                  Select All
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.b2b}
                    onChange={(e) => setFilters({ ...filters, b2b: e.target.checked })}
                    className="w-4 h-4 rounded text-[#5B5FC7] focus:ring-[#5B5FC7]"
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5B5FC7]" />
                  <span className="font-semibold">B2B Stall Meetings (Halls 1-3)</span>
                </label>

                <label className="flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.runway}
                    onChange={(e) => setFilters({ ...filters, runway: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-600"
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span className="font-semibold">Official Runway Galas & Trends</span>
                </label>

                <label className="flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.seminar}
                    onChange={(e) => setFilters({ ...filters, seminar: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-600"
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-semibold">Inauguration & Policy Keynotes</span>
                </label>

                <label className="flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.hospitality}
                    onChange={(e) => setFilters({ ...filters, hospitality: e.target.checked })}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-600"
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span className="font-semibold">VIP Buyer Hospitality & Shuttles</span>
                </label>
              </div>
            </div>

            {/* AI Route Optimization Banner (Teams Style Card) */}
            <div className="bg-gradient-to-br from-[#E6005C] to-[#C2004D] text-white p-4 rounded-2xl shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-black uppercase tracking-wider">AI Route Telemetry</span>
                </div>
                <span className="text-[10px] font-bold bg-white text-[#E6005C] px-1.5 py-0.5 rounded">
                  -42% Walking
                </span>
              </div>
              <p className="text-[11px] text-pink-100 leading-snug">
                Appointments arranged sequentially across Hall 2 (Stalls B-17 & D-08) before lunch to avoid backtracking.
              </p>
              <button
                onClick={() => alert('AI Route re-synchronized across all 426 exhibitors!')}
                className="w-full py-1.5 bg-white hover:bg-pink-50 text-[#E6005C] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Re-optimize Schedule</span>
              </button>
            </div>
          </div>
        )}

        {/* ── 3. MAIN TEAMS CALENDAR CANVAS ── */}
        <div className={`${isSidebarOpen ? 'lg:col-span-9' : 'lg:col-span-12'} space-y-4`}>
          {/* VIEW MODE: WORK-WEEK (4 FAIR DAYS GRID) */}
          {viewMode === 'work-week' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
              {/* Header Days Row */}
              <div className="grid grid-cols-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 text-xs sticky top-0 z-20">
                {/* Time Gutter Header */}
                <div className="p-3 text-center border-r border-slate-200 dark:border-slate-800 font-bold text-slate-400">
                  Time (IST)
                </div>

                {/* 4 Fair Days Columns */}
                {FAIR_DAYS.map((fd, idx) => (
                  <div
                    key={fd.day}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`p-2.5 text-center border-r border-slate-200 dark:border-slate-800 last:border-r-0 cursor-pointer transition-colors ${
                      selectedDayIndex === idx
                        ? 'bg-indigo-50/60 dark:bg-indigo-950/40 text-[#5B5FC7] dark:text-indigo-300'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">
                      {fd.dayName}
                    </span>
                    <div className="flex items-center justify-center gap-1.5 mt-0.5">
                      <span className={`text-base font-black ${selectedDayIndex === idx ? 'text-[#5B5FC7] dark:text-indigo-300' : 'text-slate-900 dark:text-white'}`}>
                        {fd.dateNumber}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Jul
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots & Event Grid */}
              <div className="relative overflow-y-auto max-h-[640px] divide-y divide-slate-100 dark:divide-slate-800/60">
                {HOURS.map((hour) => (
                  <div key={hour} className="grid grid-cols-5 min-h-[72px] relative group">
                    {/* Time Gutter Label */}
                    <div className="p-2 border-r border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 text-right pr-3 bg-slate-50/40 dark:bg-slate-950/40 select-none">
                      {hour === 12 ? '12:00 PM' : hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                    </div>

                    {/* 4 Day Columns */}
                    {FAIR_DAYS.map((fd) => {
                      const eventsInSlot = filteredEvents.filter(
                        e => e.day === fd.day && Math.floor(e.startHour) === hour
                      );

                      return (
                        <div
                          key={fd.day}
                          className="border-r border-slate-200/60 dark:border-slate-800/40 last:border-r-0 p-1 relative hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          {eventsInSlot.map((evt) => (
                            <div
                              key={evt.id}
                              onClick={() => setSelectedEvent(evt)}
                              className={`rounded-xl p-2.5 border-l-4 shadow-xs hover:shadow-md transition-all cursor-pointer mb-1 ${evt.bgColor} ${evt.darkBgColor} hover:scale-[1.01]`}
                              style={{ borderLeftColor: evt.color }}
                            >
                              <div className="flex items-start justify-between gap-1">
                                <span className="text-[10px] font-black uppercase tracking-wider text-[#5B5FC7] dark:text-indigo-300">
                                  {evt.startTime} – {evt.endTime}
                                </span>
                                {evt.hall && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-white/80 dark:bg-slate-900/80 rounded border border-slate-200 dark:border-slate-700">
                                    {evt.stall}
                                  </span>
                                )}
                              </div>

                              <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5">
                                {evt.title}
                              </h4>

                              <div className="flex items-center justify-between gap-1 mt-1.5 text-[10px] text-slate-600 dark:text-slate-300">
                                <span className="line-clamp-1 flex items-center gap-1">
                                  <MapPin className="w-2.5 h-2.5 text-[#E6005C] shrink-0" />
                                  <span>{evt.location.split(',')[0]}</span>
                                </span>

                                {evt.category === 'b2b' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (evt.meetingRef) onOpenMeetingCopilot(evt.meetingRef);
                                    }}
                                    className="p-1 bg-[#5B5FC7] hover:bg-[#4F52B2] text-white rounded font-bold shadow-xs shrink-0"
                                    title="Open Live AI Copilot"
                                  >
                                    <Sparkles className="w-2.5 h-2.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW MODE: DAY VIEW (DETAILED HOURLY TIMELINE) */}
          {viewMode === 'day' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
              {/* Day Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-[#5B5FC7] uppercase tracking-wider block">
                    {activeDay.dayName} · 75th IIGF Trade Day
                  </span>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    {activeDay.fullDate}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 bg-pink-100 text-[#E6005C] dark:bg-pink-950/60 dark:text-pink-300 rounded-xl">
                    {activeDay.title}
                  </span>
                </div>
              </div>

              {/* Day Timeline */}
              <div className="p-4 space-y-3">
                {filteredEvents
                  .filter(e => e.day === activeDay.day)
                  .map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className={`p-4 rounded-xl border-l-4 shadow-xs hover:shadow-md transition-all cursor-pointer ${evt.bgColor} ${evt.darkBgColor}`}
                      style={{ borderLeftColor: evt.color }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#5B5FC7] dark:text-indigo-300">
                            {evt.startTime} – {evt.endTime}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700">
                            {evt.categoryLabel}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-[#E6005C]" />
                          <span>{evt.location}</span>
                        </div>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1">
                        {evt.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                        {evt.notes}
                      </p>

                      <div className="pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>Host: <strong>{evt.organizer}</strong></span>
                        </div>

                        <div className="flex items-center gap-2">
                          {evt.hall && evt.stall && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenCompanionWithStall(evt.hall!, evt.stall!);
                              }}
                              className="px-3 py-1 bg-white hover:bg-pink-50 text-[#E6005C] border border-pink-200 dark:bg-slate-800 dark:border-pink-500/40 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Navigation className="w-3 h-3" />
                              <span>Stall Map ({evt.stall})</span>
                            </button>
                          )}

                          {evt.category === 'b2b' && evt.meetingRef && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenMeetingCopilot(evt.meetingRef!);
                              }}
                              className="px-3.5 py-1 bg-[#5B5FC7] hover:bg-[#4F52B2] text-white rounded-lg text-xs font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Live AI Copilot</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* VIEW MODE: AGENDA LIST (ALL EVENTS CHRONOLOGICAL) */}
          {viewMode === 'agenda' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs p-6 space-y-6">
              {FAIR_DAYS.map((fd) => {
                const dayEvts = filteredEvents.filter(e => e.day === fd.day);
                if (dayEvts.length === 0) return null;

                return (
                  <div key={fd.day} className="space-y-3">
                    <div className="flex items-center gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                      <div className="w-9 h-9 rounded-xl bg-[#5B5FC7] text-white flex flex-col items-center justify-center font-black leading-none shadow-xs">
                        <span className="text-[9px] uppercase">{fd.dayName}</span>
                        <span className="text-sm">{fd.dateNumber}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">
                          {fd.fullDate}
                        </h3>
                        <span className="text-xs text-[#E6005C] font-bold">
                          {fd.title}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2.5 pl-3 border-l-2 border-slate-200 dark:border-slate-800">
                      {dayEvts.map((evt) => (
                        <div
                          key={evt.id}
                          onClick={() => setSelectedEvent(evt)}
                          className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-900 hover:border-[#5B5FC7] transition-all cursor-pointer"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-[#5B5FC7] dark:text-indigo-400">
                                {evt.startTime} – {evt.endTime}
                              </span>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                {evt.title}
                              </h4>
                            </div>

                            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#E6005C]" />
                              <span>{evt.location}</span>
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                            {evt.notes}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── 4. TEAMS MEETING DETAIL SLIDE-OVER / MODAL ── */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-xs"
                  style={{ backgroundColor: selectedEvent.color }}
                >
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B5FC7] dark:text-indigo-400 block">
                    {selectedEvent.categoryLabel}
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white line-clamp-1">
                    {selectedEvent.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Date, Time & Location */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Time & Date</span>
                <span className="font-extrabold text-slate-900 dark:text-white block mt-0.5">
                  {selectedEvent.dayName}, {selectedEvent.dateNumber} July 2026
                </span>
                <span className="text-slate-600 dark:text-slate-300">
                  {selectedEvent.startTime} – {selectedEvent.endTime}
                </span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Location</span>
                <span className="font-extrabold text-slate-900 dark:text-white block mt-0.5 line-clamp-1">
                  {selectedEvent.location}
                </span>
                {selectedEvent.stall && (
                  <span className="text-[#E6005C] font-bold">{selectedEvent.stall}</span>
                )}
              </div>
            </div>

            {/* Attendees */}
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Confirmed Attendees</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedEvent.attendees.map((att, aIdx) => (
                  <span 
                    key={aIdx} 
                    className="px-2.5 py-1 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-lg font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                  >
                    <User className="w-3 h-3 text-[#5B5FC7]" />
                    <span>{att}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Agenda Notes */}
            <div className="text-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Meeting Agenda & Specs</span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                {selectedEvent.notes}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              {selectedEvent.hall && selectedEvent.stall ? (
                <button
                  onClick={() => {
                    const hall = selectedEvent.hall!;
                    const stall = selectedEvent.stall!;
                    setSelectedEvent(null);
                    onOpenCompanionWithStall(hall, stall);
                  }}
                  className="px-3.5 py-2 bg-white hover:bg-pink-50 text-[#E6005C] border border-pink-200 dark:bg-slate-800 dark:border-pink-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Stall Map ({selectedEvent.stall})</span>
                </button>
              ) : <div />}

              {selectedEvent.category === 'b2b' && selectedEvent.meetingRef && (
                <button
                  onClick={() => {
                    const m = selectedEvent.meetingRef!;
                    setSelectedEvent(null);
                    onOpenMeetingCopilot(m);
                  }}
                  className="px-4 py-2 bg-[#5B5FC7] hover:bg-[#4F52B2] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Join Live AI Sales Copilot</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
