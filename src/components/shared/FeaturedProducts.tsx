'use client';

import React, { useEffect, useState } from 'react';
import { getProducts } from '@/services/product.service';
import { Product } from '@/types/product';
import { formatRupiah } from '@/utils/format';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { AlertCircle, Eye } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';

export function FeaturedProducts() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      // Ambil maksimal 4 produk
      setProducts(data.slice(0, 4));
    } catch (err) {
      console.error('Error in FeaturedProducts fetch:', err);
      setError('Gagal memuat produk.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <LoadingSkeleton key={i} variant="card" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center border border-red-100 bg-red-50/50 p-8 text-center rounded-2xl">
        <AlertCircle className="mb-4 h-12 w-12 text-danger" />
        <h3 className="mb-2 text-lg font-semibold text-slate-800">{error}</h3>
        <p className="mb-6 text-sm text-slate-500 leading-relaxed">
          Koneksi ke Firestore terputus atau kredensial database belum disetup. Silakan periksa file konfigurasi Anda.
        </p>
        <Button onClick={fetchFeaturedProducts} variant="primary">
          Coba Lagi
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center bg-slate-50 p-8 text-center rounded-2xl border border-slate-100">
        <h3 className="mb-2 text-lg font-semibold text-slate-800">
          Belum ada produk
        </h3>
        <p className="mb-6 text-sm text-slate-500">
          Database Firestore Anda kosong. Silakan jalankan seeder atau muat ulang halaman.
        </p>
        <Button onClick={fetchFeaturedProducts} variant="primary">
          Perbarui
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <Card
            key={product.id}
            className="group flex flex-col overflow-hidden h-full"
          >
            {/* Image */}
            <div className="relative mb-4 aspect-square w-full overflow-hidden bg-slate-100 rounded-lg">
              <Image
                src={product.image || 'https://placehold.co/600x600'}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <span className="absolute top-2 left-2 rounded bg-slate-900/90 px-2.5 py-1 text-xs font-semibold text-white">
                {product.category}
              </span>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col">
              <h3 className="mb-1 text-base font-semibold text-slate-800 line-clamp-1 transition-colors group-hover:text-primary">
                {product.name}
              </h3>
              <p className="mb-4 text-xs text-slate-500 line-clamp-2">
                {product.description}
              </p>

              {/* Price & Stock */}
              <div className="mt-auto">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900">
                    {formatRupiah(product.price)}
                  </span>
                  <span className="text-xs text-slate-500">
                    Stok:{' '}
                    <span
                      className={
                        product.stock > 0
                          ? 'font-semibold text-slate-700'
                          : 'font-semibold text-danger'
                      }
                    >
                      {product.stock}
                    </span>
                  </span>
                </div>

                <Button
                  onClick={() => setSelectedProduct(product)}
                  variant="outline"
                  className="flex w-full items-center justify-center gap-2 text-sm transition-all duration-200 group-hover:border-primary group-hover:bg-primary group-hover:text-white"
                >
                  <Eye className="h-4 w-4" />
                  Lihat Detail
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title="Detail Produk"
          footer={
            <div className="flex w-full items-center justify-between">
              <span className="text-xl font-bold text-slate-900">
                {formatRupiah(selectedProduct.price)}
              </span>
              <div className="flex gap-2">
                <Button onClick={() => setSelectedProduct(null)} variant="outline">
                  Tutup
                </Button>
                <Button
                  onClick={() => {
                    addItem(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  variant="primary"
                  disabled={selectedProduct.stock === 0}
                >
                  Tambah ke Keranjang
                </Button>
              </div>
            </div>
          }
          size="lg"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="relative aspect-square overflow-hidden bg-slate-100 rounded-lg border border-slate-100">
              <Image
                src={selectedProduct.image || 'https://placehold.co/600x600'}
                alt={selectedProduct.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <span className="mb-3 inline-block rounded bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {selectedProduct.category}
                </span>
                <h2 className="mb-2 text-xl font-bold text-slate-900">
                  {selectedProduct.name}
                </h2>
                <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                  {selectedProduct.description}
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500">
                    Ketersediaan Stok
                  </span>
                  <span className={`text-sm font-bold ${selectedProduct.stock > 0 ? 'text-emerald-600' : 'text-danger'}`}>
                    {selectedProduct.stock > 0 ? `${selectedProduct.stock} unit` : 'Habis'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
export default FeaturedProducts;
