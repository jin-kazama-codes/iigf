import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Languages, 
  Sparkles, 
  Volume2, 
  Mic, 
  ArrowRight, 
  Compass
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
  const [activeSubTab, setActiveSubTab] = useState<'map' | 'translation'>('map');
  const [activeHall, setActiveHall] = useState<'Hall 1' | 'Hall 2' | 'Hall 3'>(
    (initialTargetStall?.hall as any) || 'Hall 2'
  );
  const [selectedStall, setSelectedStall] = useState<string>(
    initialTargetStall?.stall || 'Stall B-17'
  );

  // Translation Simulator State
  const [buyerLanguage, setBuyerLanguage] = useState('English');
  const [exhibitorLanguage, setExhibitorLanguage] = useState('Hindi');
  const [buyerSpeech, setBuyerSpeech] = useState('Can you produce 2,000 units per month with GOTS certification?');
  const [translatedText, setTranslatedText] = useState(
    'हाँ, हम GOTS सर्टिफाइड 100% ऑर्गेनिक कॉटन के साथ प्रति माह 2,000 यूनिट्स आसानी से डिलीवर कर सकते हैं।'
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleAudioPlayback = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#E6005C] uppercase tracking-wider block">
            On-Site Fair Intelligence · 75th IIGF
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
            IIGF AI Fair Companion
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Indoor stall navigation, waypoint guidance at Bharat Mandapam, and real-time multilingual voice translation.
          </p>
        </div>

        {/* Sub-tab toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
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

          <button
            onClick={() => setActiveSubTab('translation')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'translation'
                ? 'bg-[#E6005C] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>AI Real-Time Translation</span>
          </button>
        </div>
      </div>

      {/* FLOOR MAP VIEW */}
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
                        ? 'bg-[#E6005C] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>

              <span className="text-xs text-slate-500 font-semibold">Bharat Mandapam Ground Level</span>
            </div>

            {/* Visual Floorplan */}
            <div className="bg-slate-900 rounded-xl p-6 min-h-[360px] flex flex-col justify-between border border-slate-800 text-white relative">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold bg-slate-800 px-2.5 py-1 rounded">
                  {activeHall} — Exhibition Layout
                </span>
                <span className="text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                  Target: {selectedStall}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
                <div
                  onClick={() => setSelectedStall('Stall B-17')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedStall === 'Stall B-17'
                      ? 'bg-emerald-600/30 border-emerald-400 shadow-md'
                      : 'bg-slate-800/80 border-slate-700'
                  }`}
                >
                  <span className="text-xs font-black text-emerald-400">STALL B-17</span>
                  <h4 className="font-bold text-sm text-white mt-1">ABC Textiles</h4>
                  <p className="text-[11px] text-slate-400">Organic Knits · Tirupur</p>
                </div>

                <div
                  onClick={() => setSelectedStall('Stall D-08')}
                  className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-500 cursor-pointer"
                >
                  <span className="text-xs font-bold text-blue-400">STALL D-08</span>
                  <h4 className="font-bold text-sm text-white mt-1">XYZ Garments</h4>
                  <p className="text-[11px] text-slate-400">Wovens · Noida</p>
                </div>

                <div
                  onClick={() => setSelectedStall('Stall A-12')}
                  className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-500 cursor-pointer"
                >
                  <span className="text-xs font-bold text-slate-400">STALL A-12</span>
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

      {/* REAL-TIME TRANSLATION VIEW */}
      {activeSubTab === 'translation' && (
        <div className="space-y-6">
          <div className="bg-[#E6005C] text-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-xl font-black uppercase text-white">
              B2B Multilingual Trade Translator
            </h2>
            <p className="text-xs text-pink-100 mt-1 max-w-2xl leading-relaxed">
              Communicate naturally with international buyers and Indian textile artisans with zero-latency translation across fabric weaves, GSM weights, certifications, and trade terms.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Buyer Box */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase block">Buyer ({buyerLanguage})</span>
                <textarea
                  rows={4}
                  value={buyerSpeech}
                  onChange={(e) => setBuyerSpeech(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#E6005C]"
                />
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer ${
                    isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-900 text-white'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isRecording ? 'Listening...' : '🎙 Speak Buyer Input'}</span>
                </button>
              </div>

              {/* Exhibitor Box */}
              <div className="bg-pink-50/60 rounded-xl p-5 border border-pink-200 space-y-3">
                <span className="text-xs font-bold text-[#E6005C] uppercase block">Exhibitor ({exhibitorLanguage})</span>
                <div className="bg-white border border-pink-200 rounded-lg p-3 text-xs sm:text-sm text-slate-900 min-h-[96px] leading-relaxed">
                  {translatedText}
                </div>
                <button
                  onClick={handleAudioPlayback}
                  className="px-4 py-2 bg-[#E6005C] hover:bg-[#C2004D] text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlayingAudio ? 'Playing...' : '🔊 Play Translation'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
