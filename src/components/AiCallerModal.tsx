import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PhoneCall,
  PhoneOff,
  Play,
  Pause,
  RefreshCw,
  Calendar,
  Building2,
  X,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Languages,
  Shirt
} from 'lucide-react';
import { ThreeHolographicSphere } from './ThreeHolographicSphere';
import { useTheme } from '../context/ThemeContext';

export interface ToolActionData {
  toolType: 'calendar' | 'crm' | 'whatsapp' | 'banking' | 'triage';
  title: string;
  subtitle?: string;
  badge?: string;
  doctorName?: string;
  specialty?: string;
  slots?: { time: string; label: string; status: 'free' | 'booked' | 'selected'; badge?: string }[];
  crmFields?: { label: string; value: string; highlight?: boolean }[];
  whatsappMessage?: { to: string; text: string; time?: string };
}

export interface DemoStep {
  step: number;
  statusBadgeEn: string;
  statusBadgeHi: string;
  speaker: 'Buyer' | 'Serali' | 'Exhibitor' | 'System';
  speakerLabelEn: string;
  speakerLabelHi: string;
  speakerType: 'user' | 'agent' | 'system';
  textEn: string;
  textHi: string;
  toolAction?: ToolActionData;
}

// Scenario 1: Global Buyer Sourcing & B2B Matchmaking (75th IIGF)
const SOURCING_STEPS: DemoStep[] = [
  {
    step: 1,
    statusBadgeEn: 'VOICE INBOUND · UK SOURCING',
    statusBadgeHi: 'कॉल का कारण · खरीदार',
    speaker: 'Buyer',
    speakerLabelEn: 'SARAH WILLIAMS (UK BUYER)',
    speakerLabelHi: 'सारा विलियम्स (यूके खरीदार)',
    speakerType: 'user',
    textEn: "Hello IIGF Support! I am a UK retail buyer looking for certified organic cotton knitwear with low MOQ below 500 pieces for SS27.",
    textHi: "नमस्ते आई.आई.जी.एफ सपोर्ट! मैं यूके से एक रिटेल खरीदार हूं और मुझे 500 से कम MOQ में 100% ऑर्गेनिक कॉटन निटवियर निर्माता चाहिए।",
    toolAction: {
      toolType: 'triage',
      title: 'AI Multimodal Sourcing Triage',
      subtitle: '75th IIGF Matchmaker Engine',
      badge: 'RAG · 426 EXPORTERS',
      crmFields: [
        { label: 'Buyer', value: 'Sarah Williams (Meridian Apparel UK)', highlight: true },
        { label: 'Sourcing Query', value: '100% GOTS Organic Cotton Knits' },
        { label: 'Max MOQ Target', value: '≤ 500 pcs · Lead Time: 45 Days' },
        { label: 'Primary Cluster Match', value: 'Tirupur Knitwear Export Hub' }
      ]
    }
  },
  {
    step: 2,
    statusBadgeEn: 'AI AGENT CONNECTED',
    statusBadgeHi: 'आईआईजीएफ एजेंट सक्रिय',
    speaker: 'Serali',
    speakerLabelEn: 'IIGF AI CONCIERGE (SERALI)',
    speakerLabelHi: 'सेराली (IIGF AI एजेंट)',
    speakerType: 'agent',
    textEn: "Namaste Sarah, welcome to the 75th India International Garment Fair. I have matched you with ABC Textiles at Hall 2, Stall B-17, who specialize in GOTS single jersey knits with MOQ 300.",
    textHi: "नमस्ते सारा, 75वें इंडिया इंटरनेशनल गारमेंट फेयर में आपका स्वागत है। मैंने आपको हॉल 2, स्टॉल B-17 पर ABC टेक्सटाइल्स से मैच किया है, जो 300 MOQ में ऑर्गेनिक निट्स बनाते हैं।",
    toolAction: {
      toolType: 'crm',
      title: 'Exhibitor Dossier & Audit',
      subtitle: 'Bharat Mandapam Registry',
      badge: '94% FIDELITY MATCH',
      crmFields: [
        { label: 'Matched Manufacturer', value: 'ABC Textiles (Tirupur Cluster)' },
        { label: 'Hall & Stall', value: 'Hall 2 · Stall B-17 (Knitwear Bay)' },
        { label: 'Audits & Compliance', value: 'GOTS, OEKO-TEX Standard 100, BSCI' }
      ]
    }
  },
  {
    step: 3,
    statusBadgeEn: 'QUERYING LIVE STALL SLOTS',
    statusBadgeHi: 'लाइव मीटिंग स्लॉट जांच',
    speaker: 'Buyer',
    speakerLabelEn: 'SARAH WILLIAMS (UK BUYER)',
    speakerLabelHi: 'सारा विलियम्स (यूके खरीदार)',
    speakerType: 'user',
    textEn: "That sounds ideal. Can you book a 30-minute private meeting with their export director on the opening day, 14th July around 11:30 AM?",
    textHi: "यह बिल्कुल सही है! क्या आप 14 जुलाई को सुबह 11:30 बजे उनके एक्सपोर्ट डायरेक्टर के साथ मेरी 30 मिनट की मीटिंग बुक कर सकती हैं?",
    toolAction: {
      toolType: 'calendar',
      title: 'Hall 2 B2B Schedule Engine',
      subtitle: 'Tuesday 14 July 2026',
      badge: 'LIVE STALL INVENTORY',
      doctorName: 'Rajesh Kumar (Export Director)',
      specialty: 'ABC TEXTILES · STALL B-17',
      slots: [
        { time: '10:30 AM', label: 'B2B Meeting', status: 'free' },
        { time: '11:00 AM', label: 'B2B Meeting', status: 'free' },
        { time: '11:30 AM', label: 'B2B Meeting', status: 'free' }
      ]
    }
  },
  {
    step: 4,
    statusBadgeEn: 'LOCKING B2B STALL SLOT',
    statusBadgeHi: 'मीटिंग स्लॉट लॉकिंग',
    speaker: 'Serali',
    speakerLabelEn: 'IIGF AI CONCIERGE (SERALI)',
    speakerLabelHi: 'सेराली (IIGF AI एजेंट)',
    speakerType: 'agent',
    textEn: "Certainly! I am locking the 11:30 AM private slot on Tuesday 14th July with Export Director Rajesh Kumar in Hall 2. Shall I confirm this for you?",
    textHi: "बिल्कुल! मैं 14 जुलाई को सुबह 11:30 बजे एक्सपोर्ट डायरेक्टर राजेश कुमार के साथ हॉल 2 में आपका स्लॉट लॉक कर रही हूं। क्या मैं इसे कन्फर्म कर दूं?",
    toolAction: {
      toolType: 'calendar',
      title: 'Hall 2 B2B Schedule Engine',
      subtitle: 'Tuesday 14 July 2026',
      badge: 'PROVISIONAL LOCK',
      doctorName: 'Rajesh Kumar (Export Director)',
      specialty: 'ABC TEXTILES · STALL B-17',
      slots: [
        { time: '10:30 AM', label: 'B2B Meeting', status: 'free' },
        { time: '11:00 AM', label: 'B2B Meeting', status: 'free' },
        { time: '11:30 AM', label: 'B2B Meeting', status: 'selected', badge: 'LOCKING...' }
      ]
    }
  },
  {
    step: 5,
    statusBadgeEn: 'MEETING CONFIRMED & SYNCED',
    statusBadgeHi: 'मीटिंग कन्फर्म व सिंक',
    speaker: 'Buyer',
    speakerLabelEn: 'SARAH WILLIAMS (UK BUYER)',
    speakerLabelHi: 'सारा विलियम्स (यूके खरीदार)',
    speakerType: 'user',
    textEn: "Yes please, confirm and send the digital badge invite and location coordinates.",
    textHi: "हां कृपया कन्फर्म करें और मुझे डिजिटल बैज व लोकेशन भेज दीजिए।",
    toolAction: {
      toolType: 'calendar',
      title: 'Hall 2 B2B Schedule Engine',
      subtitle: 'Tuesday 14 July 2026',
      badge: 'CONFIRMED ✓',
      doctorName: 'Rajesh Kumar (Export Director)',
      specialty: 'ABC TEXTILES · STALL B-17',
      slots: [
        { time: '10:30 AM', label: 'B2B Meeting', status: 'free' },
        { time: '11:00 AM', label: 'B2B Meeting', status: 'free' },
        { time: '11:30 AM', label: 'B2B Meeting', status: 'booked', badge: 'CONFIRMED ✓' }
      ]
    }
  },
  {
    step: 6,
    statusBadgeEn: 'DISPATCHING WHATSAPP DOSSIER',
    statusBadgeHi: 'व्हाट्सएप व बैज भेजा गया',
    speaker: 'Serali',
    speakerLabelEn: 'IIGF AI CONCIERGE (SERALI)',
    speakerLabelHi: 'सेराली (IIGF AI एजेंट)',
    speakerType: 'agent',
    textEn: "All set! Your B2B meeting is confirmed. I have dispatched ABC Textiles' SS27 product catalog, swatch specs, and Gate 4 VIP fast-track directions to your WhatsApp.",
    textHi: "बहुत बढ़िया! आपकी मीटिंग कन्फर्म हो गई है। मैंने ABC टेक्सटाइल्स का कैटलॉग, स्वैच डिटेल्स और गेट 4 VIP रूट आपके WhatsApp पर भेज दिया है।",
    toolAction: {
      toolType: 'whatsapp',
      title: 'IIGF WhatsApp VIP Gateway',
      subtitle: 'Twilio Cloud API · Sent',
      badge: 'DELIVERED ✓✓',
      whatsappMessage: {
        to: '+44 7911 123456 (Sarah Williams)',
        text: 'Hi Sarah, 75th IIGF B2B Meeting Confirmed with ABC Textiles (Hall 2, Stall B-17) on Tuesday 14 July at 11:30 AM. VIP Fast-Track Pass: https://iigf.in/pass/v892',
        time: '11:32 AM'
      }
    }
  }
];

// Scenario 2: VIP Buyer Fair Concierge & Hotel Logistics
const LOGISTICS_STEPS: DemoStep[] = [
  {
    step: 1,
    statusBadgeEn: 'AIRPORT TRANSIT ENQUIRY',
    statusBadgeHi: 'हवाई अड्डा व होटल सहायता',
    speaker: 'Buyer',
    speakerLabelEn: 'KARAN SHARMA (OVERSEAS DELEGATE)',
    speakerLabelHi: 'करण शर्मा (विदेशी प्रतिनिधि)',
    speakerType: 'user',
    textEn: "Hello! My flight arrives at Delhi Airport Terminal 3 tomorrow at 8:15 AM. How do I access the official IIGF VIP limousine to The Taj Mahal Hotel?",
    textHi: "नमस्ते! मेरी फ्लाइट कल सुबह 8:15 बजे दिल्ली एयरपोर्ट T3 पर आ रही है। ताज महल होटल के लिए IIGF VIP कार कैसे मिलेगी?",
    toolAction: {
      toolType: 'crm',
      title: 'Overseas Buyer Hospitality Record',
      subtitle: 'Ministry of Textiles Delegate',
      badge: 'VIP COMPLIMENTARY',
      crmFields: [
        { label: 'Delegate', value: 'Karan Sharma (+91 98201 44021)', highlight: true },
        { label: 'Flight', value: 'BA 143 · London Heathrow (LHR) ➔ DEL T3' },
        { label: 'Allocated Hotel', value: 'The Taj Mahal Hotel, Man Singh Road' }
      ]
    }
  },
  {
    step: 2,
    statusBadgeEn: 'CHAUFFEUR ASSIGNED',
    statusBadgeHi: 'वीआईपी ड्राइवर असाइन',
    speaker: 'Serali',
    speakerLabelEn: 'IIGF AI CONCIERGE (SERALI)',
    speakerLabelHi: 'सेराली (IIGF AI एजेंट)',
    speakerType: 'agent',
    textEn: "Welcome Karan! Chauffeur Ramesh (+91 98110 55210) will be waiting at Terminal 3 Gate 5 with an IIGF VIP placard. Your express hotel check-in has been pre-cleared.",
    textHi: "स्वागत है करण! T3 गेट 5 पर ड्राइवर रमेश (+91 98110 55210) IIGF प्लेकार्ड के साथ तैयार रहेंगे। आपके होटल का एक्सप्रेस चेक-इन एक्टिव कर दिया गया है।",
    toolAction: {
      toolType: 'crm',
      title: 'GPS Chauffeur Telemetry',
      subtitle: 'VIP Corridor Express',
      badge: 'CHAUFFEUR ACTIVE',
      crmFields: [
        { label: 'Pickup Point', value: 'Terminal 3 International Gate 5' },
        { label: 'Vehicle', value: 'Toyota Innova Crysta (DL 1Z B 8920)' },
        { label: 'ETA to Hotel', value: '20 mins via VIP Priority Corridor' }
      ]
    }
  },
  {
    step: 3,
    statusBadgeEn: 'FAIR BADGE & SHUTTLE READY',
    statusBadgeHi: 'स्मार्ट बैज व शटल एक्टिव',
    speaker: 'Serali',
    speakerLabelEn: 'IIGF AI CONCIERGE (SERALI)',
    speakerLabelHi: 'सेराली (IIGF AI एजेंट)',
    speakerType: 'agent',
    textEn: "Your RFID NFC Smart Badge will be presented at hotel check-in, and the private electric coach departs every 20 minutes from the hotel porch to Bharat Mandapam Gate 4.",
    textHi: "आपका RFID स्मार्ट बैज होटल चेक-इन पर मिल जाएगा, और भारत मंडपम गेट 4 के लिए हर 20 मिनट पर होटल से प्राइवेट इलेक्ट्रिक बस चलेगी।",
    toolAction: {
      toolType: 'whatsapp',
      title: 'WhatsApp Logistics Dispatch',
      subtitle: 'Chauffeur & Badge Info',
      badge: 'DELIVERED ✓✓',
      whatsappMessage: {
        to: '+91 98201 44021 (Karan Sharma)',
        text: 'IIGF VIP Transfer Confirmed: Chauffeur Ramesh (DL 1Z B 8920) at DEL T3 Gate 5. Taj Mahal Hotel Check-in: #TMH-8812. Have a wonderful fair!',
        time: '8:20 AM'
      }
    }
  }
];

// Scenario 3: Master Weaver & Multilingual Stall Support
const TRANSLATION_STEPS: DemoStep[] = [
  {
    step: 1,
    statusBadgeEn: 'MULTILINGUAL LIVE TRANSLATION',
    statusBadgeHi: 'लाइव अनुवाद · मास्टर बुनकर',
    speaker: 'Buyer',
    speakerLabelEn: 'KENJI TAKAHASHI (TOKYO BUYER)',
    speakerLabelHi: 'केन्जी ताकाहाशी (टोक्यो खरीदार)',
    speakerType: 'user',
    textEn: "Konnichiwa! We want to order 800 hand-block vegetable dyed silk scarves. Can the artisan guarantee natural indigo fastness for Japanese standards?",
    textHi: "नमस्ते! हम 800 हैंड-ब्लॉक नेचुरल डाइड सिल्क स्कार्फ ऑर्डर करना चाहते हैं। क्या यह जापानी स्टैंडर्ड्स के अनुसार कलर-फास्ट है?",
    toolAction: {
      toolType: 'triage',
      title: 'Speech & Dialect Translation',
      subtitle: 'Japanese / English ➔ Hindi Dialect',
      badge: 'ACCURACY 99.2%',
      crmFields: [
        { label: 'Buyer Query', value: 'Vegetable Dye Silk Scarves (800 pcs)' },
        { label: 'Testing Standard', value: 'JIS L 0844 Japanese Color Fastness', highlight: true },
        { label: 'Exhibitor', value: 'FashionWorks India (Jaipur Artisan Collective)' }
      ]
    }
  },
  {
    step: 2,
    statusBadgeEn: 'TRANSLATING TO MASTER WEAVER',
    statusBadgeHi: 'मास्टर कारीगर को हिंदी अनुवाद',
    speaker: 'Serali',
    speakerLabelEn: 'IIGF AI CONCIERGE (SERALI)',
    speakerLabelHi: 'सेराली (IIGF AI एजेंट)',
    speakerType: 'agent',
    textEn: "Master Weaver Ramkishan confirms that their Bagru natural indigo uses organic harda mordants meeting JIS Level 4 colorfastness. Lab dip swatches can be shipped via DHL today.",
    textHi: "मास्टर बुनकर रामकिशन जी ने पुष्टि की है कि उनकी बगरू नेचुरल डाई जापानी JIS लेवल 4 मानकों को पूरा करती है। आज ही टेस्टेड स्वैच भेजे जा सकते हैं।",
    toolAction: {
      toolType: 'crm',
      title: 'Lab Dip & Courier Protocol',
      subtitle: 'DHL Global Express Bay',
      badge: 'SAMPLE TRACKED',
      crmFields: [
        { label: 'Artisan', value: 'Ramkishan Chippa (Master Craftsman)' },
        { label: 'Fabric Spec', value: '100% Chanderi Silk 60 GSM' },
        { label: 'Air Courier Tracking', value: 'DHL Express #7729-1092-JP' }
      ]
    }
  },
  {
    step: 3,
    statusBadgeEn: 'COMMERCIAL LOI DISPATCHED',
    statusBadgeHi: 'ऑर्डर लेटर व अनुबंध जारी',
    speaker: 'Serali',
    speakerLabelEn: 'IIGF AI CONCIERGE (SERALI)',
    speakerLabelHi: 'सेराली (IIGF AI एजेंट)',
    speakerType: 'agent',
    textEn: "The bilingual Letter of Intent (LOI) with Tokyo FOB terms of $18.50 per piece has been generated and sent to both parties for digital signing.",
    textHi: "टोक्यो FOB $18.50 प्रति पीस की दर से डिजिटल लेटर ऑफ इंटेंट (LOI) तैयार करके दोनों पक्षों को हस्ताक्षर हेतु भेज दिया गया है।",
    toolAction: {
      toolType: 'whatsapp',
      title: 'Bilingual Contract Gateway',
      subtitle: 'Digital Signature Ready',
      badge: 'SIGNATURE SENT',
      whatsappMessage: {
        to: 'kenji@tokyofashion.jp / +81 90 1234 5678',
        text: 'IIGF Contract Dossier: 800 pcs Bagru Silk Scarves FOB Tokyo $18.50. Sign LOI: https://iigf.in/sign/jp894',
        time: '3:45 PM'
      }
    }
  }
];

interface AiCallerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiCallerModal: React.FC<AiCallerModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [scenarioKey, setScenarioKey] = useState<'sourcing' | 'logistics' | 'translation'>('sourcing');
  const [language, setLanguage] = useState<'hi' | 'en'>('en');
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMode, setActiveMode] = useState<'simulation' | 'live-voice'>('simulation');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isFooterHovered, setIsFooterHovered] = useState(false);

  // Live Mic Voice Call state
  const [isCalling, setIsCalling] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [agentResponse, setAgentResponse] = useState('');
  const [isAgentSpeakingLive, setIsAgentSpeakingLive] = useState(false);
  const [isUserSpeakingLive, setIsUserSpeakingLive] = useState(false);

  const recognitionRef = useRef<any>(null);
  const currentUtterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const playbackTimerRef = useRef<any>(null);

  // Current scenario steps
  const steps = useMemo(() => {
    switch (scenarioKey) {
      case 'sourcing':
        return SOURCING_STEPS;
      case 'logistics':
        return LOGISTICS_STEPS;
      case 'translation':
        return TRANSLATION_STEPS;
    }
  }, [scenarioKey]);

  const currentStep = steps[stepIndex] || steps[0];

  const isUserSpeaking = activeMode === 'live-voice' 
    ? isUserSpeakingLive 
    : (isPlaying && currentStep.speakerType === 'user');

  const isAgentSpeaking = activeMode === 'live-voice' 
    ? isAgentSpeakingLive 
    : (isPlaying && currentStep.speakerType === 'agent');

  // Dynamic texts based on active language
  const activeStatusBadge = language === 'hi' ? currentStep.statusBadgeHi : currentStep.statusBadgeEn;
  const activeSpeakerLabel = language === 'hi' ? currentStep.speakerLabelHi : currentStep.speakerLabelEn;
  const activeMainText = language === 'hi' ? currentStep.textHi : currentStep.textEn;
  const activeTranslationText = language === 'hi' ? currentStep.textEn : currentStep.textHi;

  const handleSelectScenario = (key: 'sourcing' | 'logistics' | 'translation') => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch {}
    }
    setScenarioKey(key);
    setStepIndex(0);
    setIsPlaying(false);
  };

  // Safe Cleanup on modal close or unmount
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        try { window.speechSynthesis.cancel(); } catch {}
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if (playbackTimerRef.current) {
        clearTimeout(playbackTimerRef.current);
      }
    };
  }, [isOpen, onClose]);

  // Speech synthesis for interactive playback
  const speakCurrentStep = useCallback((step: DemoStep, lang: 'hi' | 'en') => {
    if (typeof window === 'undefined' || !window.speechSynthesis || isAudioMuted) return;

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      const textToSpeak = lang === 'hi' ? step.textHi : step.textEn;
      const utter = new SpeechSynthesisUtterance(textToSpeak);
      currentUtterRef.current = utter;

      const voices = window.speechSynthesis.getVoices();
      const isAgent = step.speakerType === 'agent';

      if (lang === 'hi') {
        const hiVoice = voices.find(v => v.lang && v.lang.startsWith('hi')) ||
          voices.find(v => v.lang === 'en-IN') ||
          voices.find(v => v.name && (v.name.includes('India') || v.name.includes('Hindi')));
        if (hiVoice) utter.voice = hiVoice;
        utter.lang = 'hi-IN';
        utter.rate = isAgent ? 1.0 : 0.95;
        utter.pitch = isAgent ? 1.05 : 0.95;
      } else {
        const enVoice = voices.find(v => v.lang === 'en-GB' || v.lang === 'en-IN') ||
          voices.find(v => v.lang && v.lang.startsWith('en'));
        if (enVoice) utter.voice = enVoice;
        utter.lang = 'en-US';
        utter.rate = 1.0;
        utter.pitch = isAgent ? 1.05 : 0.95;
      }

      utter.onend = () => {
        if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current);
        playbackTimerRef.current = setTimeout(() => {
          setStepIndex(prev => {
            if (prev < steps.length - 1) {
              return prev + 1;
            } else {
              setIsPlaying(false);
              return prev;
            }
          });
        }, 800);
      };

      utter.onerror = () => {
        // Safe fallback
      };

      window.speechSynthesis.speak(utter);
    } catch {
      // Fallback
    }
  }, [isAudioMuted, steps.length]);

  // Simulation play loop
  useEffect(() => {
    if (!isOpen) return;

    if (!isPlaying) {
      if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        try { window.speechSynthesis.cancel(); } catch {}
      }
      return;
    }

    speakCurrentStep(currentStep, language);

    const text = language === 'hi' ? currentStep.textHi : currentStep.textEn;
    const fallbackDuration = Math.max(4500, (text.length / 12) * 1000 + 2000);

    const safetyTimer = setTimeout(() => {
      setStepIndex(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, fallbackDuration);

    return () => {
      clearTimeout(safetyTimer);
      if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current);
    };
  }, [isOpen, isPlaying, stepIndex, language, scenarioKey, isAudioMuted, currentStep, speakCurrentStep, steps.length]);

  // Live Speech Recognition
  const handleToggleLiveCall = () => {
    if (isCalling) {
      setIsCalling(false);
      setIsUserSpeakingLive(false);
      setIsAgentSpeakingLive(false);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        try { window.speechSynthesis.cancel(); } catch {}
      }
    } else {
      setIsCalling(true);
      setUserTranscript('Listening for your voice... speak now (e.g., "Find organic cotton suppliers in Hall 2")');
      setAgentResponse('IIGF Voice Neural Core Connected · Ready for your sourcing request');

      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';

          recognition.onstart = () => {
            setIsUserSpeakingLive(true);
          };

          recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const transcript = event.results[current][0].transcript;
            setUserTranscript(transcript);

            if (event.results[current].isFinal) {
              setIsUserSpeakingLive(false);
              setIsAgentSpeakingLive(true);

              let reply = "I have located 3 certified Indian exhibitors in Bharat Mandapam Hall 2 matching your requirements. ABC Textiles at Stall B-17 has GOTS organic cotton samples ready.";
              if (transcript.toLowerCase().includes('hotel') || transcript.toLowerCase().includes('airport')) {
                reply = "The official IIGF VIP limousine is waiting at Terminal 3 Gate 5, and your Taj Mahal Hotel check-in is confirmed.";
              } else if (transcript.toLowerCase().includes('badge') || transcript.toLowerCase().includes('gate')) {
                reply = "Your Fast-Track Overseas Buyer RFID badge is ready for collection at Gate 4 VIP lounge.";
              }

              setAgentResponse(reply);

              if (typeof window !== 'undefined' && window.speechSynthesis && !isAudioMuted) {
                try {
                  const utter = new SpeechSynthesisUtterance(reply);
                  utter.lang = language === 'hi' ? 'hi-IN' : 'en-US';
                  utter.onend = () => {
                    setIsAgentSpeakingLive(false);
                  };
                  window.speechSynthesis.speak(utter);
                } catch {
                  setTimeout(() => setIsAgentSpeakingLive(false), 3000);
                }
              } else {
                setTimeout(() => setIsAgentSpeakingLive(false), 3000);
              }
            }
          };

          recognition.onerror = () => {
            setIsUserSpeakingLive(false);
          };

          recognitionRef.current = recognition;
          recognition.start();
        } else {
          setUserTranscript("Microphone listening: 'Looking for organic cotton single jersey knits MOQ 300'");
          setTimeout(() => {
            setIsUserSpeakingLive(false);
            setIsAgentSpeakingLive(true);
            const reply = "Matched with ABC Textiles (Tirupur Cluster, Stall B-17). Booking your 11:30 AM appointment now.";
            setAgentResponse(reply);
            if (typeof window !== 'undefined' && window.speechSynthesis && !isAudioMuted) {
              try {
                const utter = new SpeechSynthesisUtterance(reply);
                utter.onend = () => setIsAgentSpeakingLive(false);
                window.speechSynthesis.speak(utter);
              } catch {
                setTimeout(() => setIsAgentSpeakingLive(false), 3000);
              }
            }
          }, 2000);
        }
      } catch (err) {
        console.warn('Speech recognition fallback:', err);
        setUserTranscript("Connecting to AI Voice Core...");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: isDark ? '#07090D' : '#0B1120',
        color: '#F8FAFC',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        userSelect: 'none',
        transition: 'background 0.3s ease, color 0.3s ease',
      }}
    >
      {/* Exact Brand Guidelines Holographic Gradient Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(ellipse 110% 65% at 50% 100%, rgba(223, 183, 74, 0.42) 0%, rgba(223, 183, 74, 0.22) 30%, rgba(14, 16, 22, 0.85) 60%, #07090D 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `linear-gradient(180deg, #07090D 0%, #07090D 50%, rgba(7, 9, 13, 0.8) 70%, rgba(223, 183, 74, 0.28) 100%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* Top Header / Bar */}
      <header
        style={{
          position: 'relative',
          zIndex: 20,
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(16px)',
          background: 'rgba(7, 9, 13, 0.75)',
          gap: 12,
          flexWrap: 'wrap'
        }}
      >
        {/* Left: IIGF Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src="https://www.indiaapparelfair.com/75th/img/logo.png"
            alt="75th IIGF"
            style={{ height: 26, width: 'auto', objectFit: 'contain', filter: 'brightness(1.1)' }}
          />
          <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.15)', paddingLeft: 10 }}>
            <span style={{ color: '#E6005C', fontSize: 11, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block' }}>
              IIGF AI VOICE AGENT
            </span>
            <span style={{ color: '#94A3B8', fontSize: 9, fontWeight: 600 }}>
              Live Sourcing & Support
            </span>
          </div>
        </div>

        {/* Center: Scenario Switcher + Language Switcher + Mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Scenarios */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: 3,
              borderRadius: 10,
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {[
              { id: 'sourcing', label: 'B2B Sourcing', icon: Shirt },
              { id: 'logistics', label: 'VIP Logistics', icon: Building2 },
              { id: 'translation', label: 'Weaver Translation', icon: Languages },
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = scenarioKey === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectScenario(tab.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '5px 10px',
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 11,
                    fontWeight: 600,
                    background: isSelected ? '#DFB74A' : 'transparent',
                    color: isSelected ? '#07090D' : '#94A3B8',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Icon size={12} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Bilingual Switcher (Hindi / English) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: 3,
              borderRadius: 10,
              border: '1px solid rgba(223, 183, 74, 0.3)',
            }}
          >
            <button
              onClick={() => {
                setLanguage('en');
                if (isPlaying) speakCurrentStep(currentStep, 'en');
              }}
              style={{
                padding: '5px 8px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 700,
                background: language === 'en' ? '#DFB74A' : 'transparent',
                color: language === 'en' ? '#07090D' : '#94A3B8',
                transition: 'all 0.2s ease',
              }}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => {
                setLanguage('hi');
                if (isPlaying) speakCurrentStep(currentStep, 'hi');
              }}
              style={{
                padding: '5px 8px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 700,
                background: language === 'hi' ? '#DFB74A' : 'transparent',
                color: language === 'hi' ? '#07090D' : '#94A3B8',
                transition: 'all 0.2s ease',
              }}
            >
              🇮🇳 हिंदी
            </button>
          </div>

          {/* Mode Switcher */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: 3,
              borderRadius: 10,
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <button
              onClick={() => {
                if (isCalling) handleToggleLiveCall();
                setActiveMode('simulation');
              }}
              style={{
                padding: '5px 10px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 600,
                background: activeMode === 'simulation' ? 'rgba(223, 183, 74, 0.2)' : 'transparent',
                color: activeMode === 'simulation' ? '#DFB74A' : '#64748B',
              }}
            >
              Story Demo
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                if (typeof window !== 'undefined' && window.speechSynthesis) {
                  try { window.speechSynthesis.cancel(); } catch {}
                }
                setActiveMode('live-voice');
              }}
              style={{
                padding: '5px 10px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 600,
                background: activeMode === 'live-voice' ? 'rgba(0, 212, 255, 0.2)' : 'transparent',
                color: activeMode === 'live-voice' ? '#00D4FF' : '#64748B',
              }}
            >
              Live Mic
            </button>
          </div>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 8,
              padding: 8,
              color: isAudioMuted ? '#EF4444' : '#94A3B8',
              cursor: 'pointer',
            }}
          >
            {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.speechSynthesis) {
                try { window.speechSynthesis.cancel(); } catch {}
              }
              onClose();
            }}
            title="Return to Website"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 8,
              padding: '6px 14px',
              color: '#E2E8F0',
              cursor: 'pointer',
              fontSize: 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <X size={14} /> Close
          </button>
        </div>
      </header>

      {/* Center Stage: Dual 3D Holographic Spheres + Right Tool Info Sidebar */}
      <main
        style={{
          flex: 1,
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '0 20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: 1060,
            position: 'relative',
            zIndex: 5,
            margin: '0 auto',
            padding: '0 12px',
          }}
        >
          {/* Left 3D Sphere: Buyer / Caller (Gold Variant) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              position: 'relative',
              zIndex: 5,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: 'relative',
                width: 320,
                height: 320,
                maxWidth: '38vw',
                maxHeight: '38vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ThreeHolographicSphere variant="gold" isSpeaking={Boolean(isUserSpeaking)} isDark={true} />
            </div>

            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  color: '#DFB74A',
                  fontSize: 13,
                  fontWeight: 900,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  textShadow: '0 0 12px rgba(223, 183, 74, 0.6)',
                }}
              >
                {scenarioKey === 'sourcing' ? 'SARAH WILLIAMS' : scenarioKey === 'logistics' ? 'KARAN SHARMA' : 'KENJI TAKAHASHI'}
              </div>
              <div
                style={{
                  color: '#94A3B8',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginTop: 2,
                }}
              >
                {isUserSpeaking ? (language === 'hi' ? 'बोल रहे हैं...' : 'SPEAKING...') : (language === 'hi' ? 'कॉलिंग इन' : 'CALLING IN')}
              </div>
            </div>
          </div>

          {/* Central Connecting Audio Wave Particle Bridge */}
          <div
            style={{
              flex: 1,
              height: 40,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: 30 }}>
              {[...Array(24)].map((_, i) => {
                const isSpeakingActive = isUserSpeaking || isAgentSpeaking;
                const flowDirection = isUserSpeaking ? 1 : -1;
                const pSize = i % 4 === 0 ? 2.5 : i % 2 === 0 ? 2.0 : 1.5;
                const pColor = flowDirection > 0
                  ? (i % 3 === 0 ? '#DFB74A' : '#F59E0B')
                  : (i % 3 === 0 ? '#38BDF8' : '#6366F1');

                return (
                  <motion.div
                    key={`${i}-${isUserSpeaking ? 'user' : isAgentSpeaking ? 'agent' : 'idle'}`}
                    initial={
                      isSpeakingActive
                        ? {
                            left: flowDirection > 0 ? '0%' : '100%',
                            opacity: 0,
                            scale: 0.6,
                          }
                        : {
                            left: `${(i / 24) * 100}%`,
                            opacity: 0.35,
                            scale: 1,
                          }
                    }
                    animate={
                      isSpeakingActive
                        ? {
                            left: flowDirection > 0 ? ['0%', '100%'] : ['100%', '0%'],
                            y: [Math.sin(i * 0.7) * 5, Math.cos(i * 0.7) * -5, Math.sin(i * 0.7) * 5],
                            opacity: [0, 0.85, 0.85, 0],
                            scale: [0.7, 1.1, 0.7],
                          }
                        : {
                            y: [Math.sin(i * 0.8) * 3, Math.cos(i * 0.8) * -3, Math.sin(i * 0.8) * 3],
                            opacity: 0.35,
                          }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: 2.2,
                      delay: isSpeakingActive ? (i / 24) * 2.2 : 0,
                      ease: 'linear',
                    }}
                    style={{
                      position: 'absolute',
                      top: '45%',
                      width: pSize,
                      height: pSize,
                      borderRadius: '50%',
                      background: pColor,
                      boxShadow: `0 0 4px ${pColor}`,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Right 3D Sphere: SERALI / IIGF AI Agent (Cyan Variant) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              position: 'relative',
              zIndex: 5,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: 'relative',
                width: 320,
                height: 320,
                maxWidth: '38vw',
                maxHeight: '38vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ThreeHolographicSphere variant="cyan" isSpeaking={Boolean(isAgentSpeaking)} isDark={true} />
            </div>

            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  color: '#38bdf8',
                  fontSize: 13,
                  fontWeight: 900,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  textShadow: '0 0 12px rgba(56, 189, 248, 0.7)',
                }}
              >
                SERALI (IIGF AI)
              </div>
              <div
                style={{
                  color: '#94A3B8',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginTop: 2,
                }}
              >
                {isAgentSpeaking ? (language === 'hi' ? 'जवाब दे रही हैं...' : 'ANSWERING...') : (language === 'hi' ? 'कनेक्टेड' : 'CONNECTED')}
              </div>
            </div>
          </div>
        </div>

        {/* Right Floating Sidebar: Real-Time Tool Calling Info Card */}
        <div
          className="hidden md:block"
          style={{
            position: 'absolute',
            right: 28,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 310,
            zIndex: 20,
            pointerEvents: 'auto',
          }}
        >
          <AnimatePresence mode="wait">
            {currentStep.toolAction && (
              <motion.div
                key={`${scenarioKey}-${stepIndex}-${currentStep.toolAction.title}`}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 15, scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  background: 'rgba(10, 17, 26, 0.92)',
                  border: '1px solid rgba(0, 212, 255, 0.25)',
                  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.7), 0 0 24px rgba(0, 212, 255, 0.12)',
                  borderRadius: 14,
                  padding: '16px 18px',
                  backdropFilter: 'blur(24px)',
                }}
              >
                {/* Tool Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Calendar size={13} color="#38BDF8" />
                    <span style={{ color: '#94A3B8', fontSize: 11, fontWeight: 700 }}>
                      {currentStep.toolAction.title}
                    </span>
                  </div>
                  <span style={{ color: '#64748B', fontSize: 10, fontWeight: 600 }}>
                    {currentStep.toolAction.subtitle || 'Real-time'}
                  </span>
                </div>

                {/* Stall / Contact Header */}
                {currentStep.toolAction.doctorName && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ color: '#F8FAFC', fontSize: 12, fontWeight: 800 }}>
                      {currentStep.toolAction.doctorName}
                    </div>
                    <div style={{ color: '#38BDF8', fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 1 }}>
                      {currentStep.toolAction.specialty}
                    </div>
                  </div>
                )}

                {/* Calendar Slots */}
                {currentStep.toolAction.slots && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {currentStep.toolAction.slots.map((slot, sIdx) => {
                      const isSelected = slot.status === 'selected';
                      const isBooked = slot.status === 'booked';
                      return (
                        <div
                          key={sIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            borderRadius: 6,
                            background: isBooked
                              ? 'rgba(0, 150, 120, 0.25)'
                              : isSelected
                                ? 'rgba(223, 183, 74, 0.2)'
                                : 'rgba(255, 255, 255, 0.03)',
                            border: isBooked
                              ? '1px solid rgba(0, 150, 120, 0.5)'
                              : isSelected
                                ? '1px solid rgba(223, 183, 74, 0.6)'
                                : '1px solid rgba(255, 255, 255, 0.05)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <span style={{ color: isSelected || isBooked ? '#FFFFFF' : '#CBD5E1', fontSize: 10, fontWeight: 700 }}>
                            <span style={{ color: '#38BDF8', marginRight: 4 }}>{slot.time}</span> {slot.label}
                          </span>
                          <span
                            style={{
                              color: isBooked ? '#00E5A3' : isSelected ? '#DFB74A' : '#64748B',
                              fontSize: 8,
                              fontWeight: 800,
                            }}
                          >
                            {slot.badge || 'FREE'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* CRM Fields */}
                {currentStep.toolAction.crmFields && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {currentStep.toolAction.crmFields.map((field, fIdx) => (
                      <div key={fIdx} style={{ fontSize: 10 }}>
                        <div style={{ color: '#64748B', fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase', marginBottom: 1 }}>
                          {field.label}
                        </div>
                        <div style={{ color: field.highlight ? '#DFB74A' : '#E2E8F0', fontWeight: field.highlight ? 700 : 600 }}>
                          {field.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* WhatsApp Message */}
                {currentStep.toolAction.whatsappMessage && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <div style={{ color: '#64748B', fontSize: 8.5, fontWeight: 700 }}>
                      To: {currentStep.toolAction.whatsappMessage.to}
                    </div>
                    <div
                      style={{
                        background: 'rgba(0, 150, 120, 0.15)',
                        borderLeft: '2px solid #00E5A3',
                        padding: '6px 8px',
                        borderRadius: 4,
                        color: '#E2E8F0',
                        fontSize: 9.5,
                        lineHeight: 1.35,
                      }}
                    >
                      {currentStep.toolAction.whatsappMessage.text}
                    </div>
                    <div style={{ textAlign: 'right', color: '#00E5A3', fontSize: 8, fontWeight: 800 }}>
                      ✓✓ DELIVERED
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Subtitles Bar (Cinematic Transcripts & Hover Controls) */}
      <footer
        onMouseEnter={() => setIsFooterHovered(true)}
        onMouseLeave={() => setIsFooterHovered(false)}
        style={{
          position: 'relative',
          zIndex: 20,
          padding: '16px 24px 24px',
          background: 'linear-gradient(180deg, transparent 0%, rgba(7, 9, 13, 0.8) 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ maxWidth: 860, margin: '0 auto', width: '100%' }}>
          {/* Active Speaker Label */}
          <div
            style={{
              color: currentStep.speakerType === 'user' ? '#DFB74A' : '#00D4FF',
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}
          >
            {activeMode === 'live-voice' ? 'LIVE VOICE STREAM' : activeSpeakerLabel}
          </div>

          {/* Primary Transcript Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMode === 'live-voice' ? `${userTranscript}-${agentResponse}` : `${scenarioKey}-${stepIndex}-${language}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
            >
              <div
                style={{
                  color: '#FFFFFF',
                  fontSize: 18,
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                {activeMode === 'live-voice' ? (isUserSpeakingLive ? userTranscript : agentResponse || userTranscript) : activeMainText}
              </div>

              {/* Subtitle Translation */}
              <div
                style={{
                  color: '#94A3B8',
                  fontSize: 12,
                  fontStyle: 'italic',
                  marginTop: 4,
                  lineHeight: 1.35,
                }}
              >
                {activeMode === 'live-voice' ? 'AI Voice Neural Engine · Auto-translating live speech' : activeTranslationText}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Hover Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: 860,
            margin: '0 auto',
            width: '100%',
            paddingTop: 4,
            opacity: isFooterHovered ? 1 : 0.85,
            transition: 'opacity 0.2s ease',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {/* Step Pills */}
          <div style={{ display: 'flex', gap: 5 }}>
            {steps.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => {
                  setStepIndex(idx);
                  setIsPlaying(false);
                  if (typeof window !== 'undefined' && window.speechSynthesis) {
                    try { window.speechSynthesis.cancel(); } catch {}
                  }
                }}
                style={{
                  width: idx === stepIndex ? 32 : 16,
                  height: 4,
                  borderRadius: 2,
                  border: 'none',
                  cursor: 'pointer',
                  background: idx === stepIndex
                    ? '#DFB74A'
                    : idx < stepIndex
                      ? 'rgba(223, 183, 74, 0.4)'
                      : 'rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </div>

          {/* Control Buttons */}
          {activeMode === 'simulation' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => {
                  if (stepIndex > 0) {
                    setStepIndex(prev => prev - 1);
                    setIsPlaying(false);
                  }
                }}
                disabled={stepIndex === 0}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 8,
                  padding: '5px 8px',
                  color: stepIndex === 0 ? '#64748B' : '#CBD5E1',
                  cursor: stepIndex === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                <ChevronLeft size={13} />
              </button>

              <button
                onClick={() => {
                  if (!isPlaying && stepIndex === steps.length - 1) {
                    setStepIndex(0);
                  }
                  setIsPlaying(!isPlaying);
                }}
                style={{
                  background: '#DFB74A',
                  color: '#07090D',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontWeight: 900,
                  fontSize: 11,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  boxShadow: '0 0 15px rgba(223, 183, 74, 0.3)',
                }}
              >
                {isPlaying ? <><Pause size={12} /> PAUSE</> : <><Play size={12} /> PLAY DEMO</>}
              </button>

              <button
                onClick={() => {
                  if (stepIndex < steps.length - 1) {
                    setStepIndex(prev => prev + 1);
                    setIsPlaying(false);
                  }
                }}
                disabled={stepIndex === steps.length - 1}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 8,
                  padding: '5px 8px',
                  color: stepIndex === steps.length - 1 ? '#64748B' : '#CBD5E1',
                  cursor: stepIndex === steps.length - 1 ? 'not-allowed' : 'pointer',
                }}
              >
                <ChevronRight size={13} />
              </button>

              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.speechSynthesis) {
                    try { window.speechSynthesis.cancel(); } catch {}
                  }
                  setStepIndex(0);
                  setIsPlaying(true);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  fontSize: 10,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  marginLeft: 4,
                }}
              >
                <RefreshCw size={11} /> Restart
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={handleToggleLiveCall}
                style={{
                  background: isCalling ? '#EF4444' : '#00D4FF',
                  color: '#07090D',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 16px',
                  cursor: 'pointer',
                  fontWeight: 900,
                  fontSize: 11,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: `0 0 15px ${isCalling ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 212, 255, 0.4)'}`,
                }}
              >
                {isCalling ? <><PhoneOff size={13} /> END CALL</> : <><PhoneCall size={13} /> SPEAK WITH AI AGENT</>}
              </button>
              {isCalling && (
                <span style={{ color: '#00E5A3', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  ● Audio Connected
                </span>
              )}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};
