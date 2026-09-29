import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      title={`Switch to ${isDark ? 'Light Fair' : 'Dark Realm'} Mode`}
      className={`relative group w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center transition-all duration-300 cursor-pointer ${
        isDark
          ? 'bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border-pink-500/40 shadow-[0_0_15px_rgba(230,0,92,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.45)]'
          : 'bg-white hover:bg-slate-50 text-amber-500 border-slate-300 shadow-xs hover:border-[#E6005C]'
      } ${className}`}
    >
      {isDark ? (
        <>
          <Moon className="w-4 h-4 text-cyan-300 fill-cyan-300/30 transition-transform group-hover:rotate-12 duration-300" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-pink-500 animate-ping opacity-75" />
        </>
      ) : (
        <Sun className="w-4 h-4 text-amber-500 fill-amber-400/30 transition-transform group-hover:rotate-45 duration-300" />
      )}
    </button>
  );
};
