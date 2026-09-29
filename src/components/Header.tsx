import React, { useState } from 'react';
import { 
  Sparkles, 
  PlayCircle, 
  Menu, 
  X, 
  ChevronDown,
  Globe,
  Search,
  MessageSquare
} from 'lucide-react';

export type NavTab = 
  | 'home' 
  | 'concierge' 
  | 'buyer-dashboard' 
  | 'exhibitors' 
  | 'matchmaking' 
  | 'meetings' 
  | 'companion' 
  | 'exhibitor-copilot' 
  | 'command-center' 
  | 'architecture';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenRegisterModal: () => void;
  onOpenConciergeModal: () => void;
  onStartGuidedTour: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenRegisterModal,
  onOpenConciergeModal,
  onStartGuidedTour
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navItems: { id: NavTab; label: string; hasDropdown?: boolean; dropdownItems?: { id: NavTab; label: string }[] }[] = [
    { id: 'home', label: 'Home' },
    { 
      id: 'buyer-dashboard', 
      label: 'Event Registration',
      hasDropdown: true,
      dropdownItems: [
        { id: 'buyer-dashboard', label: 'Buyer Dashboard & Matches' },
        { id: 'concierge', label: 'Register with AI Concierge' }
      ]
    },
    { 
      id: 'exhibitors', 
      label: 'Exhibitors Zone',
      hasDropdown: true,
      dropdownItems: [
        { id: 'exhibitors', label: 'Explore 426 Exhibitors' },
        { id: 'exhibitor-copilot', label: 'Exhibitor AI Sales Copilot' }
      ]
    },
    { id: 'matchmaking', label: 'AI Matchmaking' },
    { id: 'meetings', label: 'Meetings & Agenda' },
    { id: 'companion', label: 'Fair Companion' },
    { id: 'command-center', label: 'Command Center' },
    { id: 'architecture', label: 'Architecture' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top White Bar with Official IIGF Logo, 75th Edition, Bharat Tex & AEPC */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
        {/* Left: Official Logo + Edition Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2 text-left cursor-pointer hover:opacity-95 transition-opacity"
          >
            <img
              src="https://www.indiaapparelfair.com/75th/img/logo.png"
              alt="IIGF Logo"
              className="h-10 sm:h-13 w-auto object-contain"
              onError={(e) => {
                // Fallback SVG mark if network fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="hidden sm:block border-l-2 border-slate-200 pl-3">
              <div className="text-sm sm:text-base font-black tracking-tight text-[#E6005C] uppercase font-sans">
                75<sup className="text-[10px]">th</sup> INDIA INTERNATIONAL GARMENT FAIR
              </div>
              <div className="text-[11px] font-semibold text-slate-700 tracking-wide">
                14 to 17 July, 2026 · Bharat Mandapam, New Delhi
              </div>
            </div>
          </button>
        </div>

        {/* Right: Bharat Tex 2026 + AEPC Logos + AI Badge */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Concept Demo Pill */}
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 bg-pink-50 border border-pink-200 text-[#E6005C] text-[11px] font-bold uppercase tracking-wider rounded">
            <Sparkles className="w-3 h-3 text-[#E6005C]" />
            AI Intelligence Layer
          </span>

          {/* Bharat Tex & AEPC Emblems */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 px-2 py-1 rounded">
              <span className="text-[9px] font-black text-[#E6005C] tracking-tighter">Bharat TEX</span>
              <span className="text-[8px] font-semibold text-slate-600">Global Expo</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 px-2 py-1 rounded">
              <span className="text-[9px] font-black text-blue-900 tracking-tighter">AEPC</span>
              <span className="text-[8px] font-semibold text-slate-600">Govt of India</span>
            </div>
          </div>

          {/* Quick Guided Tour launcher */}
          <button
            onClick={onStartGuidedTour}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[#EB8B2D] hover:bg-[#d67b22] text-white text-xs font-bold rounded shadow-xs transition-colors cursor-pointer"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>13-Step Hero Tour</span>
          </button>
        </div>
      </div>

      {/* Main Pink / Magenta Navigation Bar (Exact IIGF Styling) */}
      <div className="bg-[#E6005C] text-white border-t border-[#C2004D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => {
                      onSelectTab(item.id);
                      setOpenDropdown(null);
                    }}
                    className={`px-3 py-2 text-xs font-semibold rounded transition-colors flex items-center gap-1 cursor-pointer ${
                      isActive
                        ? 'bg-[#C2004D] text-white font-bold'
                        : 'text-white/95 hover:bg-[#C2004D]/70 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.hasDropdown && <ChevronDown className="w-3 h-3 opacity-80" />}
                  </button>

                  {/* Dropdown menu */}
                  {item.hasDropdown && item.dropdownItems && (
                    <div className="absolute left-0 top-full hidden group-hover:block w-48 bg-white text-slate-800 shadow-xl rounded-b-md border border-slate-200 py-1.5 z-50">
                      {item.dropdownItems.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            onSelectTab(sub.id);
                            setOpenDropdown(null);
                          }}
                          className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-pink-50 hover:text-[#E6005C] font-medium transition-colors cursor-pointer block"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onOpenConciergeModal}
              className="px-3 py-1.5 bg-white text-[#E6005C] hover:bg-pink-50 text-xs font-extrabold rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E6005C]" />
              <span>Ask IIGF AI</span>
            </button>

            <button
              onClick={onOpenRegisterModal}
              className="px-3.5 py-1.5 bg-[#EB8B2D] hover:bg-[#d67b22] text-white text-xs font-bold rounded shadow-xs transition-colors cursor-pointer"
            >
              Register with AI
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-white hover:bg-[#C2004D] rounded"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#E6005C] text-white border-t border-[#C2004D] px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold ${
                currentTab === item.id ? 'bg-[#C2004D] font-bold' : 'hover:bg-[#C2004D]/60'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-white/20 flex flex-col gap-2">
            <button
              onClick={() => {
                onStartGuidedTour();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 bg-[#EB8B2D] text-white text-xs font-bold rounded flex items-center justify-center gap-1.5"
            >
              <PlayCircle className="w-4 h-4" />
              <span>13-Step Hero Demo Tour</span>
            </button>
          </div>
        </div>
      )}

      {/* Vertical Pink Floating Tab on the right side: "Register Here To Visit" (Screenshot 4) */}
      <button
        onClick={onOpenRegisterModal}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#E6005C] hover:bg-[#C2004D] text-white font-bold text-xs py-3 px-2 shadow-2xl rounded-l-md transition-transform hover:-translate-x-1 cursor-pointer [writing-mode:vertical-rl] tracking-wider hidden sm:block"
        style={{ textOrientation: 'mixed' }}
      >
        Register Here To Visit
      </button>
    </header>
  );
};
