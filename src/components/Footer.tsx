import React from 'react';
import { NavTab } from './Header';
import { MapPin, Phone, Mail, Globe, Sparkles } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 dark:text-slate-400 border-t-4 border-[#E6005C] dark:border-[#FF007A] dark:shadow-[0_-5px_25px_rgba(255,0,122,0.2)] text-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img
                src="https://www.indiaapparelfair.com/75th/img/logo.png"
                alt="IIGF"
                className="h-10 w-auto bg-white p-1 rounded dark:brightness-110"
              />
              <div>
                <span className="text-white font-bold text-sm block">75th IIGF</span>
                <span className="text-[10px] text-[#EB8B2D] dark:text-amber-400 font-semibold">14 - 17 July 2026</span>
              </div>
            </div>
            <p className="text-slate-400 dark:text-slate-400 leading-relaxed text-[11px]">
              India International Garment Fair is organized by International Garment Fair Association (IGFA) under the aegis of Apparel Export Promotion Council (AEPC), Government of India.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-slate-700 dark:border-slate-800 pb-1.5">
              Quick Navigation
            </h4>
            <ul className="space-y-1.5 text-slate-400 dark:text-slate-400 text-[11px]">
              <li><button onClick={() => onSelectTab('home')} className="hover:text-white cursor-pointer">Home</button></li>
              <li><button onClick={() => onSelectTab('buyer-dashboard')} className="hover:text-white cursor-pointer">Buyer Registration</button></li>
              <li><button onClick={() => onSelectTab('fair-planner')} className="hover:text-white cursor-pointer font-bold text-amber-300 dark:text-pink-400">AI Fair & Trip Planner</button></li>
              <li><button onClick={() => onSelectTab('exhibitors')} className="hover:text-white cursor-pointer">Exhibitors Zone</button></li>
              <li><button onClick={() => onSelectTab('matchmaking')} className="hover:text-white cursor-pointer">AI Matchmaking</button></li>
              <li><button onClick={() => onSelectTab('companion')} className="hover:text-white cursor-pointer">Fair Companion & Map</button></li>
              <li><button onClick={() => onSelectTab('command-center')} className="hover:text-white cursor-pointer">Organizer Command Center</button></li>
            </ul>
          </div>

          {/* Sourcing Hubs */}
          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-slate-700 dark:border-slate-800 pb-1.5">
              Indian Apparel Hubs
            </h4>
            <p className="text-[11px] text-slate-400 dark:text-slate-400 leading-relaxed">
              Featuring top manufacturers from Tirupur (Knits), Jaipur (Prints & Resortwear), Noida/NCR (Wovens), Bengaluru (Eco-Denim), Surat (Silks) & Ludhiana (Sweaters).
            </p>
          </div>

          {/* Venue & Contacts */}
          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs border-b border-slate-700 dark:border-slate-800 pb-1.5">
              Venue & Secretariat
            </h4>
            <div className="space-y-1.5 text-[11px] text-slate-400 dark:text-slate-400">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E6005C] dark:text-pink-400 shrink-0 mt-0.5" />
                <span>Bharat Mandapam, Pragati Maidan, New Delhi - 110001</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#E6005C] dark:text-pink-400 shrink-0" />
                <span>+91 124 2708100</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#E6005C] dark:text-pink-400 shrink-0" />
                <span>info@indiaapparelfair.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500 dark:text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 India International Garment Fair (IIGF). Concept demonstration of AI intelligence layer for indiaapparelfair.com.</p>
          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-400">
            <span className="text-[#E6005C] dark:text-pink-400 font-bold">Powered by IIGF AI</span>
            <span>·</span>
            <span>Bharat TEX 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
