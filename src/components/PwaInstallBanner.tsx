import React, { useState, useEffect } from 'react';
import { Download, Share2, Smartphone, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running as standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Show banner after 3 seconds for iOS if not installed
    const timer = setTimeout(() => {
      if (isIosDevice && !isInstalled) {
        setShowPrompt(true);
      }
    }, 3500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <aside
      aria-label="Install 75th IIGF AI Progressive Web App"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-[calc(100vw-2rem)] bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-pink-500/40 backdrop-blur-xl animate-bounce-subtle"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E6005C] to-[#C2004D] flex items-center justify-center text-white font-black text-xs shadow-md border border-white/20 shrink-0">
            75th
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white">Install 75th IIGF App</span>
              <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-300 text-[9px] font-bold rounded border border-amber-400/40">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              Instant offline access to 426 exhibitors, floor navigation & AI B2B matchmaking.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPrompt(false)}
          className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
          aria-label="Dismiss Install Banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
        {isIos ? (
          <div className="text-[10px] text-amber-300 flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 shrink-0 text-cyan-300" />
            <span>Tap <strong>Share</strong> then <strong>"Add to Home Screen"</strong></span>
          </div>
        ) : (
          <button
            onClick={handleInstallClick}
            className="w-full py-2 bg-gradient-to-r from-[#E6005C] to-[#EB8B2D] hover:opacity-95 text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Add to Mobile Home Screen</span>
          </button>
        )}
      </div>
    </aside>
  );
};
