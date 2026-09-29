import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  PlayCircle, 
  Compass, 
  Search, 
  Building2, 
  Calendar, 
  Languages, 
  FileText, 
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { NavTab } from './Header';
import { DEMO_EXHIBITORS } from '../data/mockData';
import { Exhibitor, Meeting } from '../types';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: NavTab) => void;
  onOpenConciergeModal: () => void;
  onOpenExhibitorModal: (exhibitor: Exhibitor) => void;
  onBookMeeting: (exhibitor: Exhibitor) => void;
  onOpenMeetingCopilot: (meeting: Meeting) => void;
  onCloseAllModals?: () => void;
}

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenConciergeModal,
  onOpenExhibitorModal,
  onBookMeeting,
  onOpenMeetingCopilot,
  onCloseAllModals
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const executeStepAction = (stepIndex: number) => {
    if (onCloseAllModals) {
      onCloseAllModals();
    }
    tourSteps[stepIndex].runAction();
  };

  const tourSteps = [
    {
      step: 1,
      title: 'STEP 1: Visitor Lands on IIGF AI',
      desc: 'The buyer or exhibitor lands on the IIGF AI intelligence portal. Notice the clean Indian trade fair visual language and prominent conversational search.',
      actionLabel: 'Go to Homepage',
      runAction: () => onSelectTab('home')
    },
    {
      step: 2,
      title: 'STEP 2: Clicks "Ask IIGF AI"',
      desc: 'The visitor activates the AI conversational interface. Let\'s open the AI Concierge assistant.',
      actionLabel: 'Open AI Concierge',
      runAction: () => {
        onSelectTab('concierge');
      }
    },
    {
      step: 3,
      title: 'STEP 3: Enters Natural Language Query',
      desc: 'Buyer inputs: "I am a UK buyer looking for sustainable women’s casualwear with MOQ below 500."',
      actionLabel: 'Examine Sourcing Matcher',
      runAction: () => {
        onSelectTab('home');
      }
    },
    {
      step: 4,
      title: 'STEP 4: AI Understands Requirements',
      desc: 'The IIGF AI intelligence core parses key parameters: Geography=UK, Category=Women’s Casualwear, MOQ ≤ 500, Audits=GOTS/Sustainability.',
      actionLabel: 'View Matchmaking Hub',
      runAction: () => onSelectTab('matchmaking')
    },
    {
      step: 5,
      title: 'STEP 5: AI Returns Matching Exhibitors',
      desc: 'Dynamic ranking displays top matches: ABC Textiles (94%), XYZ Garments (91%), FashionWorks India (87%), with explicit reasons why each matches.',
      actionLabel: 'View Top Matches in Buyer Dashboard',
      runAction: () => onSelectTab('buyer-dashboard')
    },
    {
      step: 6,
      title: 'STEP 6: Buyer Opens an Exhibitor Profile',
      desc: 'The buyer inspects ABC Textiles (Hall 2, Stall B-17). The profile highlights specialized organic fabrics, GOTS certification, and why AI recommends them.',
      actionLabel: 'Open ABC Textiles Dossier',
      runAction: () => onOpenExhibitorModal(DEMO_EXHIBITORS[0])
    },
    {
      step: 7,
      title: 'STEP 7: Buyer Books a Meeting',
      desc: 'Buyer reserves a 30-minute slot on 14 October at 11:30 AM in Hall 2, Stall B-17. The system confirms the appointment without conflicts.',
      actionLabel: 'Open Meeting Scheduler',
      runAction: () => onBookMeeting(DEMO_EXHIBITORS[0])
    },
    {
      step: 8,
      title: 'STEP 8: Personalized Event Schedule',
      desc: '"My IIGF Day" automatically generates a route-optimized agenda, reducing walking time across Pragati Maidan halls by 42%.',
      actionLabel: 'Open "My IIGF Day" Agenda',
      runAction: () => onSelectTab('meetings')
    },
    {
      step: 9,
      title: 'STEP 9: AI Fair & Trip Planner for Global Buyers',
      desc: 'Overseas buyers receive an autonomous 4-day itinerary syncing DEL airport transfers, hotel check-ins, route-optimized booth meetings, live Google Maps route lines, and curated Delhi dining.',
      actionLabel: 'Open AI Fair & Trip Planner',
      runAction: () => onSelectTab('fair-planner')
    },
    {
      step: 10,
      title: 'STEP 10: Real-Time AI Translation During Meeting',
      desc: 'At Stall B-17, the UK buyer speaks English and the Indian master weaver speaks Hindi. The AI Fair Companion performs real-time audio translation.',
      actionLabel: 'Open Translation Simulator',
      runAction: () => onSelectTab('companion')
    },
    {
      step: 11,
      title: 'STEP 11: Meeting Generates AI Summary',
      desc: 'Post-meeting audio memo extracts buyer requirements (100% GOTS organic cotton) and exhibitor commitments (ship swatches to London).',
      actionLabel: 'Open Meeting Copilot Summary',
      runAction: () => {
        onOpenMeetingCopilot({
          id: 'meet-101',
          exhibitorId: 'ex-1',
          exhibitorName: 'ABC Textiles — Demo Exhibitor',
          hall: 'Hall 2',
          stall: 'Stall B-17',
          date: '14 Oct 2026',
          time: '11:30 AM',
          durationMinutes: 30,
          status: 'Confirmed',
          purpose: 'Private label organic cotton sample review',
          buyerName: 'Sarah Williams',
          buyerCompany: 'Meridian Apparel UK Ltd'
        });
      }
    },
    {
      step: 12,
      title: 'STEP 12: AI Generates Automated Follow-Up',
      desc: 'Generates polished WhatsApp and commercial email follow-ups with FOB pricing and swatch tracking, ready for 1-click human approval.',
      actionLabel: 'Review Follow-up Automation',
      runAction: () => {
        onSelectTab('exhibitor-copilot');
      }
    },
    {
      step: 13,
      title: 'STEP 13: Exhibitor Sees Lead in AI Sales Copilot',
      desc: 'ABC Textiles sales team tracks Sarah Williams as a HIGH INTENT lead (Score 94) inside their AI Copilot dashboard.',
      actionLabel: 'Open Exhibitor Sales Copilot',
      runAction: () => onSelectTab('exhibitor-copilot')
    },
    {
      step: 14,
      title: 'STEP 14: Organizer Sees Entire Journey in Command Center',
      desc: 'IIGF fair management monitors the completed interaction across 12,842 buyers, macro country flows, and asks natural language queries via "Ask IIGF Data".',
      actionLabel: 'Open Organizer Command Center',
      runAction: () => onSelectTab('command-center')
    }
  ];

  const currentStepData = tourSteps[currentStep - 1];

  const handleNext = () => {
    if (currentStep < tourSteps.length) {
      const nextStepNum = currentStep + 1;
      setCurrentStep(nextStepNum);
      executeStepAction(nextStepNum - 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      const prevStepNum = currentStep - 1;
      setCurrentStep(prevStepNum);
      executeStepAction(prevStepNum - 1);
    }
  };

  const handleClose = () => {
    if (onCloseAllModals) {
      onCloseAllModals();
    }
    onClose();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-[#0B1B3D] text-white rounded-2xl shadow-2xl border-2 border-[#D97706] overflow-hidden animate-slide-up">
      {/* Top Banner */}
      <div className="bg-[#11274F] p-4 flex items-center justify-between border-b border-[#1E3A68]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#D97706] flex items-center justify-center text-white font-bold text-xs">
            <PlayCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              End-to-End Hero Demo Walkthrough
            </h4>
            <span className="text-[11px] text-slate-300">Section 35 Core Flow Verification</span>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="bg-[#07132B] px-4 py-2 flex items-center justify-between text-[11px] text-slate-300 border-b border-[#1A345E]">
        <span>Step {currentStep} of {tourSteps.length}</span>
        <div className="flex items-center gap-1">
          {tourSteps.map((s) => (
            <button
              key={s.step}
              onClick={() => {
                setCurrentStep(s.step);
                executeStepAction(s.step - 1);
              }}
              title={s.title}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                s.step === currentStep
                  ? 'bg-[#F59E0B] w-4'
                  : s.step < currentStep
                  ? 'bg-emerald-500'
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-5 space-y-3 text-xs">
        <h5 className="text-sm font-bold text-[#FBBF24]">
          {currentStepData.title}
        </h5>
        <p className="text-slate-200 leading-relaxed text-xs">
          {currentStepData.desc}
        </p>

        {/* Action Button that switches page/modal */}
        <div className="pt-2">
          <button
            onClick={() => executeStepAction(currentStep - 1)}
            className="w-full py-2 bg-[#162F56] hover:bg-[#1E3F74] text-slate-200 hover:text-white rounded-lg border border-[#274B7F] font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{currentStepData.actionLabel}</span>
          </button>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-3 bg-[#07132B] border-t border-[#1E3A68] flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="px-3 py-1.5 text-xs text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        {currentStep < tourSteps.length ? (
          <button
            onClick={handleNext}
            className="px-4 py-1.5 bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleClose}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Finish Tour</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
