import React, { useState } from 'react';
import { Header, NavTab } from './components/Header';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { AiConcierge } from './components/AiConcierge';
import { BuyerDashboard } from './components/BuyerDashboard';
import { ExhibitorDirectory } from './components/ExhibitorDirectory';
import { ExhibitorDetailModal } from './components/ExhibitorDetailModal';
import { MatchmakingView } from './components/MatchmakingView';
import { MeetingSchedulerModal } from './components/MeetingSchedulerModal';
import { AgendaView } from './components/AgendaView';
import { FairCompanionView } from './components/FairCompanionView';
import { ExhibitorCopilotView } from './components/ExhibitorCopilotView';
import { MeetingCopilotModal } from './components/MeetingCopilotModal';
import { OrganizerCrmView } from './components/OrganizerCrmView';
import { ArchitectureView } from './components/ArchitectureView';
import { BuyerRegistrationModal } from './components/BuyerRegistrationModal';
import { GuidedTourModal } from './components/GuidedTourModal';
import { FloatingChatWidget } from './components/FloatingChatWidget';
import { BuyerTripPlannerView } from './components/BuyerTripPlannerView';
import { ThemeProvider } from './context/ThemeContext';
import { 
  DEMO_EXHIBITORS, 
  DEMO_BUYER_DEFAULT, 
  INITIAL_MEETINGS, 
  INITIAL_RFQS 
} from './data/mockData';
import { Exhibitor, BuyerProfile, Meeting, RFQ, LeadItem } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile>(DEMO_BUYER_DEFAULT);
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>(DEMO_EXHIBITORS);
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS);
  const [rfqs, setRfqs] = useState<RFQ[]>(INITIAL_RFQS);
  const [shortlist, setShortlist] = useState<string[]>(['ex-1', 'ex-3']);

  // Modals state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isConciergeModalOpen, setIsConciergeModalOpen] = useState(false);
  const [selectedExhibitorForModal, setSelectedExhibitorForModal] = useState<Exhibitor | null>(null);
  const [selectedExhibitorForMeeting, setSelectedExhibitorForMeeting] = useState<Exhibitor | null>(null);
  const [meetingForCopilot, setMeetingForCopilot] = useState<Meeting | null>(null);
  const [isGuidedTourOpen, setIsGuidedTourOpen] = useState(false);
  const [companionInitialStall, setCompanionInitialStall] = useState<{ hall: string; stall: string } | undefined>(undefined);

  // Centralized helper to close all overlapping modals
  const closeAllModals = () => {
    setIsRegisterModalOpen(false);
    setIsConciergeModalOpen(false);
    setSelectedExhibitorForModal(null);
    setSelectedExhibitorForMeeting(null);
    setMeetingForCopilot(null);
  };

  const handleOpenRegisterModal = () => {
    closeAllModals();
    setIsRegisterModalOpen(true);
  };

  const handleOpenExhibitorModal = (ex: Exhibitor) => {
    closeAllModals();
    setSelectedExhibitorForModal(ex);
  };

  const handleOpenBookMeeting = (ex: Exhibitor) => {
    closeAllModals();
    setSelectedExhibitorForMeeting(ex);
  };

  const handleOpenMeetingCopilot = (meeting: Meeting) => {
    closeAllModals();
    setMeetingForCopilot(meeting);
  };

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleToggleShortlist = (id: string) => {
    setShortlist((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      const exName = exhibitors.find((e) => e.id === id)?.name || 'Exhibitor';
      showToast(exists ? `Removed ${exName} from shortlist` : `Added ${exName} to buyer shortlist`);
      return next;
    });
  };

  const handleConfirmMeeting = (meeting: Meeting) => {
    setMeetings((prev) => [meeting, ...prev]);
    showToast(`Meeting confirmed with ${meeting.exhibitorName} on ${meeting.date} at ${meeting.time}!`);
  };

  const handleSaveNewRfq = (rfq: RFQ) => {
    setRfqs((prev) => [rfq, ...prev]);
    showToast(`New commercial RFQ: "${rfq.title}" dispatched to suppliers!`);
  };

  const handleFollowUpDispatched = (meetingId: string) => {
    showToast('AI follow-up message dispatched via WhatsApp and recorded in IIGF CRM.');
  };

  const handleOpenCompanionWithStall = (hall: string, stall: string) => {
    closeAllModals();
    setCompanionInitialStall({ hall, stall });
    setCurrentTab('companion');
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-[#050811] dark:dark-cyber-grid flex flex-col font-sans text-slate-800 dark:text-slate-100 antialiased selection:bg-[#E6005C]/20 selection:text-[#C2004D] transition-colors duration-300">
        {/* Header with Top Bar Contract */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          closeAllModals();
          setCurrentTab(tab);
          window.scrollTo({ top: 0 });
        }}
        onOpenRegisterModal={handleOpenRegisterModal}
        onOpenConciergeModal={() => {
          closeAllModals();
          setCurrentTab('concierge');
          window.scrollTo({ top: 0 });
        }}
        onStartGuidedTour={() => {
          closeAllModals();
          setIsGuidedTourOpen(true);
        }}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div>
            <HeroSection
              onSelectTab={(tab) => {
                closeAllModals();
                setCurrentTab(tab);
              }}
              onOpenRegisterModal={handleOpenRegisterModal}
              onOpenExhibitorModal={handleOpenExhibitorModal}
              onBookMeeting={handleOpenBookMeeting}
            />

            {/* Quick Teaser for Sourcing Features */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="bg-white rounded-2xl border border-pink-100 p-8 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <span className="text-xs font-bold text-[#E6005C] uppercase tracking-wider block">
                      Explore End-to-End Capabilities
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 mt-1">
                      Connecting Global Buyers, Indian Exporters & Fair Organizers
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                      Experience how the AI layer elevates the India International Garment Fair with verified supplier discovery, multilingual booth conversations, automated lead scoring, and unified CRM telemetry.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        closeAllModals();
                        setCurrentTab('buyer-dashboard');
                      }}
                      className="px-4 py-2 bg-[#E6005C] hover:bg-[#C2004D] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Buyer Dashboard
                    </button>
                    <button
                      onClick={() => {
                        closeAllModals();
                        setCurrentTab('exhibitor-copilot');
                      }}
                      className="px-4 py-2 bg-[#EB8B2D] hover:bg-[#d67b22] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Exhibitor Copilot
                    </button>
                    <button
                      onClick={() => {
                        closeAllModals();
                        setCurrentTab('command-center');
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 transition-colors cursor-pointer"
                    >
                      Organizer CRM
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'concierge' && (
          <AiConcierge
            onOpenExhibitorModal={handleOpenExhibitorModal}
            onBookMeeting={handleOpenBookMeeting}
            onOpenRegisterModal={handleOpenRegisterModal}
            onNavigateToMeetings={() => {
              closeAllModals();
              setCurrentTab('meetings');
            }}
          />
        )}

        {currentTab === 'buyer-dashboard' && (
          <BuyerDashboard
            buyerProfile={buyerProfile}
            exhibitors={exhibitors}
            meetings={meetings}
            rfqs={rfqs}
            shortlist={shortlist}
            onToggleShortlist={handleToggleShortlist}
            onOpenExhibitorModal={handleOpenExhibitorModal}
            onBookMeeting={handleOpenBookMeeting}
            onOpenReverseRfqModal={() => {
              closeAllModals();
              setCurrentTab('matchmaking');
            }}
            onNavigateToMeetings={() => {
              closeAllModals();
              setCurrentTab('meetings');
            }}
          />
        )}

        {currentTab === 'exhibitors' && (
          <ExhibitorDirectory
            exhibitors={exhibitors}
            shortlist={shortlist}
            onToggleShortlist={handleToggleShortlist}
            onOpenExhibitorModal={handleOpenExhibitorModal}
            onBookMeeting={handleOpenBookMeeting}
          />
        )}

        {currentTab === 'matchmaking' && (
          <MatchmakingView
            onOpenExhibitorModal={handleOpenExhibitorModal}
            onBookMeeting={handleOpenBookMeeting}
            onSaveNewRfq={handleSaveNewRfq}
          />
        )}

        {currentTab === 'meetings' && (
          <AgendaView
            meetings={meetings}
            onOpenCompanionWithStall={handleOpenCompanionWithStall}
            onOpenMeetingCopilot={handleOpenMeetingCopilot}
          />
        )}

        {currentTab === 'companion' && (
          <FairCompanionView
            initialTargetStall={companionInitialStall}
            onOpenExhibitorModal={handleOpenExhibitorModal}
            onBookMeeting={handleOpenBookMeeting}
          />
        )}

        {currentTab === 'fair-planner' && (
          <BuyerTripPlannerView
            onSelectTab={(tab) => {
              closeAllModals();
              setCurrentTab(tab);
            }}
            onOpenExhibitorModal={handleOpenExhibitorModal}
            onBookMeeting={handleOpenBookMeeting}
          />
        )}

        {currentTab === 'exhibitor-copilot' && (
          <ExhibitorCopilotView
            onOpenMeetingCopilotForLead={(lead: LeadItem) => {
              handleOpenMeetingCopilot({
                id: `meet-lead-${lead.id}`,
                exhibitorId: 'ex-1',
                exhibitorName: 'ABC Textiles — Demo Exhibitor',
                hall: 'Hall 2',
                stall: 'Stall B-17',
                date: '14 Oct 2026',
                time: '11:30 AM',
                durationMinutes: 30,
                status: 'Confirmed',
                purpose: `Sourcing discussion for ${lead.interests.join(', ')}`,
                buyerName: lead.buyerName,
                buyerCompany: lead.buyerCompany
              });
            }}
          />
        )}

        {currentTab === 'command-center' && <OrganizerCrmView />}

        {currentTab === 'architecture' && <ArchitectureView />}
      </main>

      {/* Footer */}
      <Footer onSelectTab={(tab) => {
        closeAllModals();
        setCurrentTab(tab);
      }} />

      {/* Floating Pink Chat Widget (Screenshot 5) */}
      <FloatingChatWidget 
        onOpenExhibitorModal={handleOpenExhibitorModal}
        onBookMeeting={handleOpenBookMeeting}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl border border-[#E6005C] shadow-xl text-xs font-semibold flex items-center gap-2 animate-slide-down">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MODALS */}
      {/* 1. Buyer Registration Wizard Modal */}
      <BuyerRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onCompleteRegistration={(profile) => {
          setBuyerProfile(profile);
          closeAllModals();
          setCurrentTab('buyer-dashboard');
          showToast(`Welcome ${profile.name}! Your AI Buyer Profile is ready.`);
        }}
      />

      {/* 2. Exhibitor Detail Modal */}
      <ExhibitorDetailModal
        exhibitor={selectedExhibitorForModal}
        isOpen={Boolean(selectedExhibitorForModal)}
        isShortlisted={selectedExhibitorForModal ? shortlist.includes(selectedExhibitorForModal.id) : false}
        onClose={() => setSelectedExhibitorForModal(null)}
        onToggleShortlist={handleToggleShortlist}
        onBookMeeting={(ex) => {
          handleOpenBookMeeting(ex);
        }}
        onSendRfq={(ex) => {
          closeAllModals();
          setCurrentTab('matchmaking');
          showToast(`Prepared RFQ specification for ${ex.name}`);
        }}
      />

      {/* 3. Meeting Scheduler Modal */}
      <MeetingSchedulerModal
        exhibitor={selectedExhibitorForMeeting}
        isOpen={Boolean(selectedExhibitorForMeeting)}
        onClose={() => setSelectedExhibitorForMeeting(null)}
        onConfirmMeeting={handleConfirmMeeting}
        onNavigateToDirections={(hall, stall) => {
          handleOpenCompanionWithStall(hall, stall);
        }}
      />

      {/* 4. Meeting Copilot Modal */}
      <MeetingCopilotModal
        meeting={meetingForCopilot}
        isOpen={Boolean(meetingForCopilot)}
        onClose={() => setMeetingForCopilot(null)}
        onFollowUpDispatched={handleFollowUpDispatched}
      />

      {/* 5. Hero Guided Tour Modal */}
      <GuidedTourModal
        isOpen={isGuidedTourOpen}
        onClose={() => {
          closeAllModals();
          setIsGuidedTourOpen(false);
        }}
        onCloseAllModals={closeAllModals}
        onSelectTab={(tab) => {
          closeAllModals();
          setCurrentTab(tab);
        }}
        onOpenConciergeModal={() => {
          closeAllModals();
          setCurrentTab('concierge');
        }}
        onOpenExhibitorModal={handleOpenExhibitorModal}
        onBookMeeting={handleOpenBookMeeting}
        onOpenMeetingCopilot={handleOpenMeetingCopilot}
      />
      </div>
    </ThemeProvider>
  );
}
