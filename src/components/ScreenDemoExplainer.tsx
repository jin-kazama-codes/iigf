import React, { useState } from 'react';
import { 
  Info, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Lightbulb, 
  Target, 
  Play, 
  X,
  Presentation,
  ShieldCheck
} from 'lucide-react';
import { NavTab } from './Header';

interface ScreenExplainerData {
  title: string;
  badge: string;
  targetUser: string;
  simplePitch: string;
  keyFeatures: string[];
  demoActions: string[];
  businessValue: string;
}

const SCREEN_EXPLAINERS: Record<NavTab, ScreenExplainerData> = {
  home: {
    title: '75th IIGF Homepage & Multimodal AI Sourcing Engine',
    badge: 'Flagship Showcase',
    targetUser: 'Overseas Buyers, Indian Exporters & General Visitors',
    simplePitch: 'The official digital front door of the 75th India International Garment Fair. Replaces static PDFs with an AI sourcing bar where buyers can type natural language prompts or upload tech-packs to instantly discover matching Indian manufacturers.',
    keyFeatures: [
      'Multimodal Search: Accepts text descriptions, voice prompts, and uploaded tech-pack PDFs.',
      'Instant Match scoring against 426 certified Indian garment exporters.',
      'Official Ministry of Textiles & AEPC branding with Bharat TEX 2026 synergy.',
      'Interactive 3D runway showcase and past edition export milestones.'
    ],
    demoActions: [
      'Type or click sample prompt: "Sustainable women\'s wear manufacturers below MOQ 500".',
      'Notice the AI immediately ranks ABC Textiles (Tirupur) & XYZ Garments (Noida) with match scores.',
      'Click "Book Meeting" to show frictionless transition to stall appointments.'
    ],
    businessValue: 'Increases buyer-to-exhibitor discovery rates by over 300% on the opening fair day.'
  },
  concierge: {
    title: 'Autonomous AI Registration & Sourcing Concierge',
    badge: 'Conversational AI',
    targetUser: 'First-time & Returning International Buyers',
    simplePitch: 'Eliminates tedious multi-page web forms. Overseas buyers chat naturally in English, Hindi, German, Japanese or French to complete their official fair accreditation and hotel booking in under 90 seconds.',
    keyFeatures: [
      'Zero-form natural conversation extracting buyer country, company size, fabric focus & MOQ.',
      'Real-time badge generation with instant QR Code & RFID sync.',
      'Complimentary 5-star hotel shuttle and lounge allocation.',
      'Bilingual live speech voice synthesizer and transcript.'
    ],
    demoActions: [
      'Click any quick prompt (e.g. "I am a UK buyer sourcing organic knitwear").',
      'Watch the AI extract attributes in real-time and generate the Fast-Track VIP Badge.',
      'Show how the generated badge updates the live buyer dashboard.'
    ],
    businessValue: 'Cuts buyer registration abandonment from 42% down to less than 4%.'
  },
  'buyer-dashboard': {
    title: 'Buyer Portal, Sourcing Dossier & Matchmaking Feed',
    badge: 'Buyer Experience Hub',
    targetUser: 'Accredited Global Sourcing Directors & Merchandisers',
    simplePitch: 'A personalized command hub for the buyer. Displays their digital NFC Fair Badge, dynamically recommended exhibitors ranked by compliance score, upcoming meetings, and instant export to WhatsApp & Apple Wallet.',
    keyFeatures: [
      'Live Digital Buyer NFC Smart Pass with barcode for Gate 4 VIP express entry.',
      'Ranked feed of matching Indian suppliers tailored to buyer criteria.',
      'One-click export of fair agenda to Google Calendar (.ICS) & WhatsApp.',
      'Real-time status of hotel limousine pickup and B2B stall appointments.'
    ],
    demoActions: [
      'Show the VIP Buyer Pass for "Sarah Williams (Meridian Apparel UK)".',
      'Click "Export to Calendar" or "Send to WhatsApp" to show automated omnichannel delivery.',
      'Filter matches by MOQ or Sustainability Grade (A+).'
    ],
    businessValue: 'Delivers a frictionless, premium VIP experience for high-value overseas retail chains.'
  },
  exhibitors: {
    title: '426 Exhibitors Directory & Indian Apparel Cluster Map',
    badge: 'Supplier Registry',
    targetUser: 'Buyers, Sourcing Agents & Fair Attendees',
    simplePitch: 'A searchable directory of 426 Indian apparel manufacturers across Tirupur (Knits), Noida (Wovens), Jaipur (Block Prints), Bengaluru (Denim), Surat (Silks) & Ludhiana (Sweaters).',
    keyFeatures: [
      'Multi-dimensional filtering by Indian Textile Cluster, Hall (1, 2, 3), Fabric Type, and MOQ.',
      'Sustainability Rating (A+ to B) verifying GOTS, OEKO-TEX, SEDEX & BSCI certifications.',
      'Direct stall location mapping with turn-by-turn guidance in Bharat Mandapam.',
      'One-click Dossier inspection with downloadable product lookbooks.'
    ],
    demoActions: [
      'Filter by Cluster: Click "Tirupur" to isolate knitwear specialists.',
      'Toggle MOQ slider down to "≤ 300 pcs" to show small-batch exporters.',
      'Click "View Dossier" on ABC Textiles to show audit certifications and factory capacity.'
    ],
    businessValue: 'Empowers global buyers to discover pre-vetted, export-compliant Indian factories in seconds.'
  },
  matchmaking: {
    title: 'AI Multimodal B2B Matchmaker Matrix',
    badge: 'Core Intelligence Engine',
    targetUser: 'B2B Matchmaking Delegates & Sourcing Consultants',
    simplePitch: 'The algorithmic matchmaking core. Analyzes buyer product specifications, target FOB price point, fabric GSM, and delivery lead times against exhibitor capabilities to score compatibility from 0% to 100%.',
    keyFeatures: [
      'Multi-factor scoring algorithm weighing category match, MOQ compatibility, and audit badges.',
      'Explainable AI reasoning showing exactly why a manufacturer was matched.',
      'Side-by-side factory comparison tool (Capacity, Lead Time, Audit Status).',
      'Direct meeting scheduler locking 30-minute private stall appointments.'
    ],
    demoActions: [
      'Highlight the 94% Match Score on ABC Textiles and expand "Why AI Matched".',
      'Point out the verified GOTS and OEKO-TEX compliance verification badge.',
      'Click "Book 30m Slot" to demonstrate instant stall calendar reservation.'
    ],
    businessValue: 'Ensures every meeting held at the fair has high commercial intent and deal potential.'
  },
  meetings: {
    title: 'B2B Meetings, Live Agenda & AI Sales Assistant Copilot',
    badge: 'Commercial Operations',
    targetUser: 'Buyers & Exhibitor Sales Representatives',
    simplePitch: 'Manages all scheduled B2B appointments throughout the 4 fair days. Features a live AI Meeting Copilot that transcribes conversations, provides real-time currency/FOB conversions, and drafts instant Letters of Intent (LOI).',
    keyFeatures: [
      'Organized chronological meeting schedule across Halls 1, 2, and 3.',
      'Live Meeting Assistant: Real-time speech transcription & negotiation prompts.',
      'Instant Letter of Intent (LOI) generation with terms, FOB pricing, and signatures.',
      'Automatic sync to Outlook, Apple Calendar, and WhatsApp alerts.'
    ],
    demoActions: [
      'Click "Open Live Meeting Copilot" on the 11:30 AM appointment with ABC Textiles.',
      'Show how the AI transcribes speech and calculates FOB London pricing with freight.',
      'Click "Draft Letter of Intent" to generate the official deal document.'
    ],
    businessValue: 'Accelerates deal velocity from multi-week email follow-ups into same-day signed contracts.'
  },
  companion: {
    title: 'Fairground Indoor Navigation & Digital Twin Floor Plan',
    badge: 'Venue Experience',
    targetUser: 'All In-Person Fair Attendees & Buyers',
    simplePitch: 'Solves the #1 complaint at large trade expos: getting lost in massive exhibition halls. A GPS and indoor beacon digital twin of Bharat Mandapam providing turn-by-turn routing between stalls, lounges, and runway auditoriums.',
    keyFeatures: [
      'Interactive vector maps of Hall 1, Hall 2, Hall 3, VIP Lounge, and Food Village.',
      'Point-to-point step-by-step navigation with walking time estimations.',
      'Color-coded product bays: Pink (Knits), Orange (Wovens), Green (Artisanal), Indigo (Denim).',
      'Real-time stall occupancy and live seminar schedule alerts.'
    ],
    demoActions: [
      'Select starting point: "Gate 4 VIP Entry" and destination: "Hall 2 · Stall B-17".',
      'Click "Calculate Walking Route" to display the highlighted indoor path and 2-minute ETA.',
      'Click on any stall to preview the manufacturer profile.'
    ],
    businessValue: 'Maximizes buyer footfall efficiency so buyers can attend 8+ meetings per day with ease.'
  },
  'fair-planner': {
    title: 'AI Fair & Trip Planner for Global Buyers',
    badge: 'Autonomous Travel & Trade',
    targetUser: 'International Buyers Visiting New Delhi',
    simplePitch: 'A complete 4-day itinerary tailored to the buyer\'s flight schedule. Integrates live plotted Google Maps routes with turn-by-turn directions, verified Google Business Profile reviews for partner hotels, and curated fine dining.',
    keyFeatures: [
      '4-Day Plotted Journey: Arrival, B2B meetings, National Crafts Museum tour, and airport return.',
      'Live Google Maps Polyline Routes connecting Indira Gandhi Airport, The Taj Mahal Hotel, and Bharat Mandapam.',
      'Google Local Guide ratings, verified reviews, and price indicators for top spots (Bukhara, Indian Accent).',
      'Multi-format export: Google Calendar (.ICS), PDF Guide, and WhatsApp packet.'
    ],
    demoActions: [
      'Switch between Day 1, Day 2, Day 3, and Day 4 to show different plotted journeys.',
      'Toggle "Split View (List + Map)" to showcase interactive Google Maps pins and route directions.',
      'Click on a restaurant (Bukhara / Indian Accent) to display verified Michelin & Google reviews.'
    ],
    businessValue: 'Elevates IIGF from a standard exhibition into a world-class luxury international business destination.'
  },
  'exhibitor-copilot': {
    title: 'Exhibitor AI Sales Copilot & Multilingual Lead CRM',
    badge: 'Exhibitor ROI Engine',
    targetUser: 'Indian Exporters & Stall Sales Teams',
    simplePitch: 'Gives Indian exhibitors an enterprise AI assistant in their pocket. Instantly scans buyer badges, qualifies buyer purchasing power, removes language barriers with Japanese/German/French translation, and logs deals to CRM.',
    keyFeatures: [
      'Rapid Buyer Badge QR Scanner & automated lead scoring (Hot/Warm/Cold).',
      'Real-time Multilingual Speech Translation bridging foreign buyer queries with stall staff.',
      'Instant tech-pack fabric analyzer matching factory machine gauge and GSM capacity.',
      'Auto-generated digital lookbooks and WhatsApp follow-up packets sent in 1-click.'
    ],
    demoActions: [
      'Simulate scanning a buyer badge or selecting "Sarah Williams (UK Sourcing)".',
      'Show the AI Lead Score (94% Hot Lead) with breakdown of purchasing authority ($2.5M).',
      'Demonstrate voice translation from English to Hindi for the production master.'
    ],
    businessValue: 'Helps Indian MSME exporters close 3x more export orders without hiring expensive translators.'
  },
  'command-center': {
    title: 'IGFA Organizer Operations Command Center',
    badge: 'Executive Oversight',
    targetUser: 'AEPC Secretariat, IGFA Fair Directors & Ministry Officials',
    simplePitch: 'Real-time telemetry and executive control room for fair organizers. Tracks real-time footfall across Halls 1, 2, and 3, monitors overseas buyer arrivals by country, and triggers instant broadcast alerts.',
    keyFeatures: [
      'Live Footfall & Stall Density Heatmap across Bharat Mandapam.',
      'Geographical breakdown of registered buyers (USA, UK, EU, Japan, Australia, UAE).',
      'Total estimated B2B deal volume pipeline ticker ($48.2M+).',
      'Instant Broadcast Notification dispatcher to all attendee mobile badges.'
    ],
    demoActions: [
      'Point to the real-time counters: 1,420+ Registered Buyers, 426 Exhibitors, 89% Hall Density.',
      'Demonstrate the "Emergency / VIP Broadcast Dispatcher" sending an alert across all badges.',
      'Review the high-level export pipeline analytics.'
    ],
    businessValue: 'Provides government and council stakeholders with complete real-time transparency and security.'
  },
  architecture: {
    title: 'Enterprise Architecture, Security & Cloud Infrastructure',
    badge: 'Technical Dossier',
    targetUser: 'CTOs, CIOs, Enterprise Architects & IT Leadership',
    simplePitch: 'Demonstrates the robust, scalable technical stack powering the platform. Built on modern React 19, TypeScript, Google Cloud Vertex AI, LiveKit WebRTC, and Zero-Trust role-based access control (RBAC).',
    keyFeatures: [
      'Sub-50ms latency search powered by Vector Embeddings & Google Cloud Vertex AI.',
      'Enterprise Zero-Trust Security compliant with GDPR, Indian DPDP Act, and ISO 27001.',
      'Edge CDN distribution ensuring instantaneous loading across Europe, USA, and Asia.',
      'Full PWA offline caching and resilient service worker synchronization.'
    ],
    demoActions: [
      'Walk through the 4-layer architecture diagram: Client Edge, AI Orchestration, Core Services, and Security.',
      'Highlight the 99.99% SLA uptime and real-time WebRTC audio streaming pipelines.'
    ],
    businessValue: 'Guarantees bank-grade security, enterprise scalability, and compliance for national-scale expos.'
  }
};

export const ScreenDemoExplainer: React.FC<{ currentTab: NavTab }> = ({ currentTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const data = SCREEN_EXPLAINERS[currentTab] || SCREEN_EXPLAINERS.home;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      {/* Collapsed Pill Button / Header Bar */}
      <div 
        className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-xs ${
          isOpen
            ? 'bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white border-pink-500/50 shadow-xl ring-1 ring-pink-500/30'
            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-amber-300/80 dark:border-slate-800 hover:border-[#E6005C] dark:hover:border-pink-500'
        }`}
      >
        <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-[#EB8B2D] text-slate-950 flex items-center justify-center shrink-0 shadow-sm font-black">
              <Lightbulb className="w-5 h-5 text-slate-950" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#E6005C] dark:text-pink-400 flex items-center gap-1">
                  <Presentation className="w-3.5 h-3.5" />
                  <span>Client Demo Guide & Value Pitch</span>
                </span>
                <span className="px-2 py-0.5 bg-amber-400/20 text-amber-700 dark:text-amber-300 text-[10px] font-bold rounded-full border border-amber-400/30">
                  {data.badge}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                {data.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isOpen
                  ? 'bg-pink-600 hover:bg-pink-700 text-white shadow-sm'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xs'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>{isOpen ? 'Hide Client Pitch' : 'View Screen Info & Pitch'}</span>
              {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expanded Details Panel */}
        {isOpen && (
          <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/90 space-y-5 animate-fadeIn text-xs">
            {/* 1. Simple Pitch */}
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 block mb-1">
                Executive Value Pitch (Say this to the Client):
              </span>
              <p className="text-sm text-slate-200 font-medium leading-relaxed">
                "{data.simplePitch}"
              </p>
              <div className="mt-2 text-[11px] text-pink-300 font-bold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>Primary Target Audience: {data.targetUser}</span>
              </div>
            </div>

            {/* 2. Key Features & Live Demo Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Features */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-cyan-300 block">
                  Core Innovations to Highlight:
                </span>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  {data.keyFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What to Click & Demonstrate */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block">
                  Recommended Demo Action Sequence:
                </span>
                <ul className="space-y-1.5 text-slate-300 text-[11px]">
                  {data.demoActions.map((act, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Play className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 3. Business Impact / ROI summary */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-slate-400 text-[11px]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-semibold">Business Impact:</span>
                <span className="text-emerald-300">{data.businessValue}</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer self-end"
              >
                Collapse Explainer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
