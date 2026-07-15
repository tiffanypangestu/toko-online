import React, { Suspense } from 'react';
import { PaymentFailed } from '@/components/shared/PaymentFailed';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export const metadata = {
  title: 'Pembayaran Gagal | Toko Online',
  description: 'Transaksi pembayaran belanjaan Anda tidak berhasil.',
};

export default function FailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center py-12">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
            <LoadingSkeleton variant="circle" className="mx-auto mb-6 h-16 w-16" />
            <LoadingSkeleton variant="title" className="mx-auto mb-4 w-3/4" />
            <LoadingSkeleton variant="rect" className="h-32 mb-6" />
          </div>
        </div>
      }
    >
      <PaymentFailed />
    </Suspense>
  );
}
