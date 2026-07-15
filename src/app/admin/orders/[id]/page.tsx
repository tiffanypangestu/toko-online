import React from 'react';
import { AdminOrderDetail } from '@/components/shared/AdminOrderDetail';

export const metadata = {
  title: 'Detail Pesanan | Toko Online',
  description: 'Informasi rincian transaksi belanjaan pelanggan.',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <AdminOrderDetail orderDocId={id} />;
}
