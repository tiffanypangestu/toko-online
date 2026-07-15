import React from 'react';
import { AdminProductEdit } from '@/components/shared/AdminProductEdit';

export const metadata = {
  title: 'Edit Produk | Toko Online',
  description: 'Ubah informasi produk dalam database katalog.',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProductEditPage({ params }: PageProps) {
  const { id } = await params;
  return <AdminProductEdit productId={id} />;
}
