import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, Share } from 'lucide-react';

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check if already running in standalone app mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true;
    
    if (isStandalone) {
      return; // Already installed and opened as an app
    }

    // Check if user dismissed it recently in this session
    if (sessionStorage.getItem('bhanjo_pwa_dismissed')) {
      return;
    }

    // Detect mobile device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isMobileDevice = isIosDevice || /android|mobile/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for custom trigger from Navbar "Install App" button
    const handleCustomTrigger = () => {
      setIsVisible(true);
      setShowIOSGuide(false);
    };
    window.addEventListener('open-pwa-install', handleCustomTrigger);

    // Listen for standard PWA install event (Android Chrome, Edge, PC Chrome)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => {
        setIsVisible(true);
      }, 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // On mobile devices, always show the install bar after 3 seconds if not dismissed
    if (isMobileDevice) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('open-pwa-install', handleCustomTrigger);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }

    return () => {
      window.removeEventListener('open-pwa-install', handleCustomTrigger);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User installed Bhanjo PWA');
      }
      setDeferredPrompt(null);
      setIsVisible(false);
    } else {
      // If beforeinstallprompt hasn't fired or on Android Firefox/Opera, show instruction
      setShowIOSGuide(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('bhanjo_pwa_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Bottom App Install Bar */}
      <div className="fixed bottom-16 sm:bottom-4 inset-x-3 sm:inset-x-auto sm:right-5 sm:max-w-md z-50 animate-in slide-in-from-bottom duration-300">
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 sm:p-3.5 rounded-2xl shadow-2xl border border-slate-700/60 flex items-center gap-3">
          
          {/* App Icon */}
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-md border border-white/20">
            <img 
              src="/icons/icon-192.png" 
              alt="Bhanjo App" 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs sm:text-sm text-white tracking-tight truncate">
                Install Bhanjo App
              </span>
              <span className="bg-[#F85606] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                Fast & Light
              </span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
              Instant deals, offline cart & 1-tap shopping
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="bg-gradient-to-r from-[#F85606] to-[#E00028] hover:from-orange-500 hover:to-red-600 active:scale-95 text-white text-xs font-black px-3.5 py-2 rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Install</span>
            </button>
            <button
              onClick={handleDismiss}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg transition"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Step-by-Step Install Instruction Modal (For when browser requires manual menu tap) */}
      {showIOSGuide && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-slate-800 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <img src="/icons/icon-192.png" alt="Bhanjo" className="w-8 h-8 rounded-lg shadow-xs" />
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                    {isIOS ? 'Install on iPhone / iPad' : 'Install on Android Phone'}
                  </h4>
                  <p className="text-[10px] text-slate-400">Takes only 5 seconds</p>
                </div>
              </div>
              <button 
                onClick={() => setShowIOSGuide(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isIOS ? (
              <div className="py-4 space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-[#F85606] font-black flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    Tap the <strong className="text-slate-900 inline-flex items-center gap-1">Share <Share className="w-3.5 h-3.5 inline text-blue-500" /></strong> button in the bottom bar of Safari.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-[#F85606] font-black flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    Scroll down and tap <strong className="text-slate-900">Add to Home Screen 📲</strong>.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-[#F85606] font-black flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    Tap <strong className="text-slate-900">Add</strong> at top right. Bhanjo will appear right on your home screen!
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4 space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-[#F85606] font-black flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    Tap the <strong className="text-slate-900">3 dots (⋮)</strong> in the top-right corner of Chrome.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-[#F85606] font-black flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    Tap <strong className="text-slate-900">"Add to Home screen"</strong> (or <strong>"Install app"</strong>).
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-[#F85606] font-black flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    Tap <strong className="text-slate-900">"Install / Add"</strong>. Bhanjo is now installed on your phone!
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full bg-gradient-to-r from-[#F85606] to-[#E00028] text-white font-extrabold py-2.5 rounded-xl text-xs shadow-md active:scale-95 transition"
            >
              Got it, let me do that!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
