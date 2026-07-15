import React from 'react';
import { AdminOrders } from '@/components/shared/AdminOrders';

export const metadata = {
  title: 'Kelola Pesanan | Toko Online',
  description: 'Kelola list transaksi pembayaran belanjaan pelanggan.',
};

export default function AdminOrdersPage() {
  return <AdminOrders />;
}
