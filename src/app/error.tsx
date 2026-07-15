'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an analytics service
    console.error('Captured by Global Error Boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center py-12 px-4">
      <Container className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center bg-rose-500/10 text-rose-500 rounded-full border border-rose-500/20">
          <AlertTriangle className="h-10 w-10" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Terjadi Kesalahan Sistem
        </h1>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Mohon maaf, aplikasi mengalami kendala teknis yang tidak terduga. Silakan coba memuat kembali halaman.
        </p>

        {error.message && (
          <div className="mb-6 rounded-lg bg-slate-950 p-4 text-left border border-slate-800 text-[11px] font-mono text-slate-500 break-all select-all">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 font-bold py-2.5 px-4 text-sm bg-primary hover:bg-primary/95 text-white"
          >
            <RotateCcw className="h-4 w-4" />
            Coba Lagi
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 font-bold py-2.5 px-4 text-sm border-slate-800 text-slate-300 hover:bg-slate-800"
            >
              <Home className="h-4 w-4" />
              Kembali ke Home
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
