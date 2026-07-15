'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 text-slate-900 py-12 px-4">
      <Container className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">
          <WifiOff className="h-10 w-10" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-800 mb-2">
          Koneksi internet tidak tersedia.
        </h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Silakan periksa sambungan Wi-Fi atau data seluler Anda dan coba muat ulang halaman ini.
        </p>

        <Button
          onClick={handleReload}
          className="w-full flex items-center justify-center gap-2 font-bold py-3 px-4 text-sm bg-primary hover:bg-primary/95 text-white"
        >
          <RefreshCw className="h-4 w-4" />
          Coba Lagi
        </Button>
      </Container>
    </div>
  );
}
