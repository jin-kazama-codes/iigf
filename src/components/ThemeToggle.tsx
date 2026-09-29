import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleTheme();
      }}
      aria-label={`Switch to ${isDark ? 'Light Fair' : 'Dark Realm'} Mode`}
      title={`Current: ${isDark ? 'Dark Realm (Click for Light)' : 'Light Fair (Click for Dark)'}`}
      className={`relative group flex items-center justify-center transition-all duration-300 cursor-pointer select-none ${
        showLabel
          ? 'px-3 py-1.5 rounded-xl border gap-2 text-xs font-bold'
          : 'w-8 h-8 sm:w-9 sm:h-9 rounded-xl border'
      } ${
        isDark
          ? 'bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border-pink-500/50 shadow-[0_0_15px_rgba(230,0,92,0.35)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] ring-1 ring-pink-500/30'
          : 'bg-white hover:bg-slate-50 text-amber-600 border-slate-300 shadow-xs hover:border-[#E6005C]'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center pointer-events-none">
        {isDark ? (
          <>
            <Moon className="w-4 h-4 text-cyan-300 fill-cyan-300/30 transition-transform group-hover:rotate-12 duration-300" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-500 animate-ping opacity-75" />
          </>
        ) : (
          <Sun className="w-4 h-4 text-amber-500 fill-amber-400/40 transition-transform group-hover:rotate-45 duration-300" />
        )}
      </div>

      {showLabel && (
        <span className="pointer-events-none">
          {isDark ? (
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent font-black uppercase tracking-wider text-[10px]">
              Dark Realm
            </span>
          ) : (
            <span className="text-slate-800 font-bold uppercase tracking-wider text-[10px]">
              Light Fair
            </span>
          )}
        </span>
      )}
    </button>
  );
};
