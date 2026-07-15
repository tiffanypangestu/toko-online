import React from 'react';
import { AdminProductCreate } from '@/components/shared/AdminProductCreate';

export const metadata = {
  title: 'Tambah Produk | Toko Online',
  description: 'Tambah produk baru ke dalam katalog toko online.',
};

export default function AdminProductCreatePage() {
  return <AdminProductCreate />;
}
