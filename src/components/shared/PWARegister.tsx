'use client';

import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

export default function PWARegister() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then((success) => {
          if (success) {
            console.log('Service worker unregistered:', registration.scope);
            window.location.reload();
          }
        });
      }
    });
  }, []);

  // Add to Home Screen handler
  const handleInstallApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    console.log(`PWA Installation outcome: ${outcome}`);
    // Clear prompt state
    setInstallPrompt(null);
    setShowInstallBanner(false);
  };

  return (
    <>
      {/* 2. Add To Home Screen Promo Banner */}
      {showInstallBanner && installPrompt && (
        <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-slate-900 border border-slate-800 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between gap-4 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary p-2.5 rounded-lg border border-primary/20">
              <Download className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold">Pasang Toko Online</span>
              <span className="text-[10px] text-slate-400">Akses toko lebih cepat langsung dari layar utama Anda.</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallApp}
              className="bg-primary hover:bg-primary/95 text-white font-bold text-[11px] py-1.5 px-3 rounded-lg cursor-pointer transition-all"
            >
              Pasang
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="text-slate-500 hover:text-slate-300 p-1.5 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
