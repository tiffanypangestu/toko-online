import React from 'react';
import { AdminDashboard } from '@/components/shared/AdminDashboard';

export const metadata = {
  title: 'Dashboard Admin | Toko Online',
  description: 'Kelola statistik penjualan, produk, dan order.',
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
