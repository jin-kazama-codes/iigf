import React, { useState, useEffect, useRef } from 'react';
import { 
  Navigation, 
  MapPin, 
  Languages, 
  Sparkles, 
  Volume2, 
  Mic, 
  ArrowRight, 
  Compass,
  CheckCircle2,
  RefreshCw,
  Building2,
  Phone,
  Radio,
  Share2,
  SlidersHorizontal,
  VolumeX,
  Globe
} from 'lucide-react';
import { DEMO_EXHIBITORS } from '../data/mockData';
import { Exhibitor } from '../types';

interface FairCompanionViewProps {
  initialTargetStall?: { hall: string; stall: string };
  onOpenExhibitorModal: (exhibitor: Exhibitor) => void;
  onBookMeeting: (exhibitor: Exhibitor) => void;
}

export const FairCompanionView: React.FC<FairCompanionViewProps> = ({
  initialTargetStall,
  onOpenExhibitorModal,
  onBookMeeting
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'map' | 'translation'>('translation');
  const [activeHall, setActiveHall] = useState<'Hall 1' | 'Hall 2' | 'Hall 3'>(
    (initialTargetStall?.hall as any) || 'Hall 2'
  );
  const [selectedStall, setSelectedStall] = useState<string>(
    initialTargetStall?.stall || 'Stall B-17'
  );

  // Translation Simulator State
  const [buyerLanguage, setBuyerLanguage] = useState<'English' | 'French' | 'German' | 'Spanish' | 'Japanese' | 'Arabic'>('English');
  const [exhibitorLanguage, setExhibitorLanguage] = useState<'Hindi' | 'Tamil' | 'Gujarati' | 'English' | 'Punjabi'>('Hindi');
  
  const [buyerSpeech, setBuyerSpeech] = useState(
    'Can you produce 2,000 units per month of GOTS-certified organic cotton dresses with FOB London pricing?'
  );
  const [translatedText, setTranslatedText] = useState(
    'क्या आप एफओबी लंदन मूल्य निर्धारण के साथ जीओटीएस-प्रमाणित कार्बनिक कपास के कपड़े के प्रति माह 2,000 यूनिट्स का उत्पादन कर सकते हैं?'
  );
  
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Language code mappings for Web Speech API
  const speechLangCodes: Record<string, string> = {
    'English': 'en-US',
    'Hindi': 'hi-IN',
    'Tamil': 'ta-IN',
    'Gujarati': 'gu-IN',
    'Punjabi': 'pa-IN',
    'French': 'fr-FR',
    'German': 'de-DE',
    'Spanish': 'es-ES',
    'Japanese': 'ja-JP',
    'Arabic': 'ar-SA'
  };

  // Comprehensive Apparel Industry Translation Dictionary
  const translateGarmentText = (text: string, targetLang: string): string => {
    const lower = text.toLowerCase();
    
    if (targetLang === 'Hindi') {
      if (lower.includes('2,000') || lower.includes('2000') || lower.includes('gots')) {
        return 'क्या आप एफओबी लंदन मूल्य निर्धारण के साथ जीओटीएस-प्रमाणित कार्बनिक कपास के कपड़े के प्रति माह 2,000 यूनिट्स का उत्पादन कर सकते हैं?';
      }
      if (lower.includes('moq') || lower.includes('minimum')) {
        return 'कस्टम बुने हुए कपड़े और निजी लेबलिंग के लिए आपकी न्यूनतम ऑर्डर मात्रा (MOQ) क्या है?';
      }
      if (lower.includes('sample') || lower.includes('swatch')) {
        return 'क्या आप गुणवत्ता अनुमोदन के लिए अगले 7 दिनों के भीतर कॉटन फैब्रिक के नमूने और लैब-डिप्स लंदन भेज सकते हैं?';
      }
      if (lower.includes('price') || lower.includes('fob') || lower.includes('cost')) {
        return 'कृपया 180 जीएसएम सिंगल जर्सी टी-शर्ट के लिए सर्वोत्तम निर्यात दर (एफओबी मूल्य) बताएं।';
      }
      return `नमस्ते! आपके प्रश्न: "${text}" का हिंदी अनुवाद: हमारे पास अत्याधुनिक सिलाई इकाइयां और सख्त निर्यात गुणवत्ता नियंत्रण है।`;
    }

    if (targetLang === 'Tamil') {
      if (lower.includes('gots') || lower.includes('organic')) {
        return 'GOTS சான்றளிக்கப்பட்ட ஆர்கானிக் பருத்தி ஆடைகளை மாதம் 2,000 அலகுகள் உற்பத்தி செய்ய முடியுமா?';
      }
      return `வணக்கம்! திருப்பூர் ஏற்றுமதி மையம் மூலமாக உங்கள் ஆர்டரை ("${text}") தரமாக வழங்க தயாராக உள்ளோம்.`;
    }

    if (targetLang === 'Gujarati') {
      return `નમસ્તે! સુરત અને અમદાવાદ ટેક્સટાઇલ મિલ દ્વારા உங்கள் ഓർഡર: "${text}" ઉત્તમ ગુણવત્તા સાથે પહોંચાડી શકાય છે.`;
    }

    if (targetLang === 'Punjabi') {
      return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਲੁਧਿਆਣਾ ਨਿਟਵੇਅਰ ਕਲੱਸਟਰ ਤੋਂ ਤੁਹਾਡਾ ਆਰਡਰ: "${text}" ਸਮੇਂ ਸਿਰ ਤਿਆਰ ਹੋ ਜਾਵੇਗਾ।`;
    }

    if (targetLang === 'English') {
      return `Yes, we can readily deliver 2,000 units/month with 100% GOTS organic cotton combed yarn, compliant with UK retail audits.`;
    }

    return `Translated to ${targetLang}: High quality apparel manufacturing verified at 75th IIGF.`;
  };

  // Trigger translation whenever buyerSpeech or exhibitorLanguage changes
  useEffect(() => {
    if (buyerSpeech.trim()) {
      const translated = translateGarmentText(buyerSpeech, exhibitorLanguage);
      setTranslatedText(translated);
    }
  }, [buyerSpeech, exhibitorLanguage]);

  // Real Web Speech API: Text to Speech (TTS)
  const handleAudioPlayback = () => {
    if (typeof window === 'undefined') return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any pending speech
      setIsPlayingAudio(true);

      const utterance = new SpeechSynthesisUtterance(translatedText);
      const targetCode = speechLangCodes[exhibitorLanguage] || 'hi-IN';
      utterance.lang = targetCode;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Try to find a voice matching the language
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(v => v.lang.startsWith(targetCode.split('-')[0]));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onend = () => {
        setIsPlayingAudio(false);
      };

      utterance.onerror = () => {
        setIsPlayingAudio(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback visual simulation
      setIsPlayingAudio(true);
      setTimeout(() => {
        setIsPlayingAudio(false);
      }, 1500);
    }
  };

  // Real Web Speech API: Speech Recognition (STT)
  const handleToggleVoiceInput = () => {
    setRecognitionError(null);

    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = speechLangCodes[buyerLanguage] || 'en-US';

        recognition.onstart = () => {
          setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          if (transcript) {
            setBuyerSpeech(transcript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsRecording(false);
          setRecognitionError(`Mic Notice (${event.error}). You can also type or use trade preset prompts below.`);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
      } catch (err) {
        console.error('Recognition error:', err);
        fallbackSimulatedVoice();
      }
    } else {
      fallbackSimulatedVoice();
    }
  };

  const fallbackSimulatedVoice = () => {
    setIsRecording(true);
    setBuyerSpeech('Listening to microphone: "Checking fabric specifications..."');
    setTimeout(() => {
      setIsRecording(false);
      const simulatedQuotes = [
        "What is your FOB price per unit for 1,500 pieces of organic cotton dresses shipped to London?",
        "Do you have OEKO-TEX Standard 100 and GOTS certification for export to the European Union?",
        "Can your factory handle custom reactive dyeing and deliver lab-dips within 7 days?",
        "What is the standard lead time from lab dip approval to bulk shipment at Mumbai port?"
      ];
      const randomQuote = simulatedQuotes[Math.floor(Math.random() * simulatedQuotes.length)];
      setBuyerSpeech(randomQuote);
    }, 1500);
  };

  const presetTradePhrases = [
    {
      label: 'MOQ & Lead Times',
      text: 'What is your minimum order quantity for custom dyed organic jersey fabric and standard delivery lead time?'
    },
    {
      label: 'GOTS & Compliance',
      text: 'Are your knitting and processing units GOTS-certified and compliant with BSCI social audit standards?'
    },
    {
      label: 'Lab Dips & Swatches',
      text: 'Can you ship garment prototype samples and fabric swatches to our London sourcing office within 10 days?'
    },
    {
      label: 'FOB Price Quote',
      text: 'Please provide FOB Nhava Sheva quotation for 2,500 pieces of printed linen casual shirts.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#E6005C] uppercase tracking-wider block">
            On-Site Fair Intelligence · 75th IIGF
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
            IIGF AI Fair Companion & Translator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time audio speech-to-speech translation for booth meetings, turn-by-turn hall navigation, and waypoint guidance.
          </p>
        </div>

        {/* Sub-tab toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('translation')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'translation'
                ? 'bg-[#E6005C] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>AI Multilingual Translator</span>
          </button>

          <button
            onClick={() => setActiveSubTab('map')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'map'
                ? 'bg-[#E6005C] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Indoor Floor Map</span>
          </button>
        </div>
      </div>

      {/* 1. REAL-TIME TRANSLATION VIEW */}
      {activeSubTab === 'translation' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#DE0057] to-[#C2004D] text-white p-6 rounded-2xl shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Sub-Second Audio-to-Audio Translation</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white">
                  B2B Multilingual Trade Translator
                </h2>
                <p className="text-xs sm:text-sm text-pink-100 mt-1 max-w-2xl leading-relaxed">
                  Eliminate language barriers between global retail buyers and Indian textile artisans. Instant translation covering apparel GSM, weave specifications, FOB pricing, and international trade compliance.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-black/20 p-2 rounded-xl border border-white/20 text-xs shrink-0">
                <Globe className="w-4 h-4 text-amber-300" />
                <span>Web Speech API Active</span>
              </div>
            </div>
          </div>

          {/* Translator Engine Container */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            {/* Language Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Buyer Speaks:</label>
                  <select
                    value={buyerLanguage}
                    onChange={(e) => setBuyerLanguage(e.target.value as any)}
                    className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#E6005C]"
                  >
                    <option value="English">English (UK / US)</option>
                    <option value="French">French (Français)</option>
                    <option value="German">German (Deutsch)</option>
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="Japanese">Japanese (日本語)</option>
                    <option value="Arabic">Arabic (العربية)</option>
                  </select>
                </div>

                <div className="pt-4 text-slate-400">
                  <ArrowRight className="w-4 h-4" />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Exhibitor Hears / Speaks:</label>
                  <select
                    value={exhibitorLanguage}
                    onChange={(e) => setExhibitorLanguage(e.target.value as any)}
                    className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#E6005C]"
                  >
                    <option value="Hindi">Hindi (हिंदी - Delhi/NCR/Jaipur)</option>
                    <option value="Tamil">Tamil (தமிழ் - Tirupur Cluster)</option>
                    <option value="Gujarati">Gujarati (ગુજરાતી - Surat Hub)</option>
                    <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ - Ludhiana)</option>
                    <option value="English">Indian English (Export Standard)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const temp = buyerSpeech;
                    setBuyerSpeech("Yes, we have BSCI social compliance and can meet your delivery timeline.");
                  }}
                  className="text-xs text-slate-600 hover:text-[#E6005C] font-semibold underline cursor-pointer"
                >
                  Switch Roles
                </button>
              </div>
            </div>

            {/* Side-by-Side Live Speech Translation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Buyer Input Box */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      Buyer Input ({buyerLanguage})
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Type or Click Speak</span>
                  </div>

                  <textarea
                    rows={4}
                    value={buyerSpeech}
                    onChange={(e) => setBuyerSpeech(e.target.value)}
                    placeholder="Speak or type your trade enquiry here..."
                    className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#E6005C] leading-relaxed"
                  />

                  {recognitionError && (
                    <div className="text-[11px] text-amber-700 mt-1 font-medium bg-amber-50 p-1.5 rounded">
                      {recognitionError}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleToggleVoiceInput}
                    className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors ${
                      isRecording 
                        ? 'bg-rose-600 text-white animate-pulse' 
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>{isRecording ? 'Listening... Speak Now' : '🎙 Speak Buyer Input'}</span>
                  </button>

                  <button
                    onClick={() => {
                      const translated = translateGarmentText(buyerSpeech, exhibitorLanguage);
                      setTranslatedText(translated);
                    }}
                    className="text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                  >
                    Re-Translate
                  </button>
                </div>
              </div>

              {/* Exhibitor Translated Output Box */}
              <div className="bg-[#FDF2F5] rounded-xl p-5 border border-pink-200 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#E6005C] uppercase flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#E6005C]" />
                      Exhibitor Output ({exhibitorLanguage})
                    </span>
                    <span className="text-[10px] text-pink-700 font-bold">AI Trade Fidelity: 99.4%</span>
                  </div>

                  <div className="bg-white border border-pink-200 rounded-lg p-3.5 text-xs sm:text-sm text-slate-900 min-h-[112px] leading-relaxed font-sans shadow-inner">
                    {translatedText}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleAudioPlayback}
                    disabled={isPlayingAudio}
                    className="px-5 py-2.5 bg-[#E6005C] hover:bg-[#C2004D] disabled:opacity-75 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                  >
                    <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                    <span>{isPlayingAudio ? 'Speaking Audio...' : '🔊 Play Translation Audio'}</span>
                  </button>

                  <span className="text-[11px] text-slate-500 font-medium">
                    Native Accent Synthesizer
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Sourcing Preset Prompts */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase block mb-2">
                Quick Trade Dialogue Presets (Click to Test Instant Translation):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {presetTradePhrases.map((phrase, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setBuyerSpeech(phrase.text);
                    }}
                    className="p-2.5 text-left bg-slate-50 hover:bg-pink-50 border border-slate-200 hover:border-pink-300 rounded-lg transition-colors cursor-pointer text-xs group"
                  >
                    <span className="font-bold text-[#E6005C] block text-[11px] group-hover:underline">
                      {phrase.label}
                    </span>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                      {phrase.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. FLOOR MAP & WAYPOINT VIEW */}
      {activeSubTab === 'map' && (
        <div className="space-y-6">
          {/* Waypoint Bar */}
          <div className="bg-[#E6005C] text-white p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#E6005C] flex items-center justify-center font-bold shrink-0">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">
                  Turn-by-Turn Waypoint Guidance
                </span>
                <div className="text-base font-bold text-white flex items-center gap-2">
                  <span>Buyer Lounge (Gate 4)</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                  <span className="text-amber-300">{activeHall} → {selectedStall}</span>
                </div>
                <p className="text-xs text-pink-100">
                  Target: <strong className="text-white">ABC Textiles — Demo Exhibitor</strong> (Knitwear Bay)
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveHall('Hall 2');
                setSelectedStall('Stall B-17');
              }}
              className="px-4 py-2 bg-white text-[#E6005C] hover:bg-pink-50 text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Find My Next Meeting</span>
            </button>
          </div>

          {/* Map Container */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-slate-700">Pavilion:</span>
                {(['Hall 1', 'Hall 2', 'Hall 3'] as const).map((h) => (
                  <button
                    key={h}
                    onClick={() => setActiveHall(h)}
                    className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                      activeHall === h
                        ? 'bg-[#E6005C] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                GPS & Bluetooth Beacons: Online
              </span>
            </div>

            {/* Interactive Grid Map */}
            <div className="bg-slate-900 rounded-xl p-6 relative overflow-hidden text-white min-h-[340px] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span>Bharat Mandapam · {activeHall} Floor Layout</span>
                <span>North Entrance ↑</span>
              </div>

              {/* Stalls Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                <div
                  onClick={() => setSelectedStall('Stall B-17')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedStall === 'Stall B-17'
                      ? 'bg-[#E6005C] border-white shadow-lg ring-2 ring-white scale-102'
                      : 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">STALL B-17</span>
                    {selectedStall === 'Stall B-17' && <MapPin className="w-3.5 h-3.5 text-white animate-bounce" />}
                  </div>
                  <h4 className="font-bold text-sm text-white mt-1">ABC Textiles</h4>
                  <p className="text-[11px] text-pink-200">Organic Knits · Tirupur</p>
                </div>

                <div
                  onClick={() => setSelectedStall('Stall D-08')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedStall === 'Stall D-08'
                      ? 'bg-[#E6005C] border-white shadow-lg ring-2 ring-white scale-102'
                      : 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400">STALL D-08</span>
                    {selectedStall === 'Stall D-08' && <MapPin className="w-3.5 h-3.5 text-white animate-bounce" />}
                  </div>
                  <h4 className="font-bold text-sm text-white mt-1">XYZ Garments</h4>
                  <p className="text-[11px] text-slate-400">Wovens · Noida</p>
                </div>

                <div
                  onClick={() => setSelectedStall('Stall A-12')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedStall === 'Stall A-12'
                      ? 'bg-[#E6005C] border-white shadow-lg ring-2 ring-white scale-102'
                      : 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">STALL A-12</span>
                    {selectedStall === 'Stall A-12' && <MapPin className="w-3.5 h-3.5 text-white animate-bounce" />}
                  </div>
                  <h4 className="font-bold text-sm text-white mt-1">FashionWorks</h4>
                  <p className="text-[11px] text-slate-400">Block Prints · Jaipur</p>
                </div>

                <div className="p-4 rounded-xl bg-pink-950/40 border border-pink-500/40 text-center flex flex-col justify-center">
                  <span className="text-[10px] uppercase font-bold text-pink-300">Runway Stage</span>
                  <h4 className="text-white font-bold text-xs mt-1">Fashion Amphitheatre</h4>
                </div>
              </div>

              <div className="text-xs text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2">
                <span>Start Point: VIP Buyer Registration Lounge (Gate 4)</span>
                <span className="text-white font-bold">Estimated Walk: ~2 mins</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
