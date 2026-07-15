'use client';

import React, { useEffect, useState } from 'react';
import { Download, X, RefreshCw } from 'lucide-react';

export default function PWARegister() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);
  const [updateWaiting, setUpdateWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // 1. Register Service Worker and listen for updates
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully under scope:', registration.scope);

        // Check for updates periodically
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('Service Worker: New version detected and ready.');
                setUpdateWaiting(newWorker);
              }
            });
          }
        });

        // If a service worker is already waiting in queue
        if (registration.waiting) {
          setUpdateWaiting(registration.waiting);
        }
      })
      .catch((err) => {
        console.error('Service Worker registration failed:', err);
      });

    // 2. Listen for controller changes to trigger refresh
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });

    // 3. Add to Home Screen Prompt intercept
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // Store event
      setInstallPrompt(e);
      // Show custom banner
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Update App handler
  const handleUpdateApp = () => {
    if (updateWaiting) {
      updateWaiting.postMessage({ action: 'skipWaiting' });
    }
  };

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
      {/* 1. App Update Toast Notification */}
      {updateWaiting && (
        <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-slate-900 border border-slate-800 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between gap-4 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-primary-400">Pembaruan Tersedia</span>
            <span className="text-[11px] text-slate-400">Versi baru telah tersedia untuk diunduh.</span>
          </div>
          <button
            onClick={handleUpdateApp}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white font-bold text-[11px] py-1.5 px-3 rounded-lg cursor-pointer transition-all"
          >
            <RefreshCw className="h-3 w-3 animate-spin" style={{ animationDuration: '3s' }} />
            Perbarui Sekarang
          </button>
        </div>
      )}

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
