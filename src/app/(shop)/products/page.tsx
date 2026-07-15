import React from 'react';
import { ProductCatalog } from '@/components/shared/ProductCatalog';

export const metadata = {
  title: 'Semua Produk | Toko Online',
  description: 'Daftar lengkap produk teknologi terbaik.',
};

export default function ProductsPage() {
  return <ProductCatalog />;
}
