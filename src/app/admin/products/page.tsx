'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db, isFirebaseConfigured } from '@/firebase/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { deleteProduct } from '@/services/product.service';
import { Product } from '@/types/product';
import { formatRupiah } from '@/utils/format';
import { Button } from '@/components/ui/Button';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    const productsRef = collection(db, 'products');

    // Realtime products listener
    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        const prodList: Product[] = [];
        snapshot.forEach((docSnap) => {
          prodList.push({ id: docSnap.id, ...docSnap.data() } as Product);
        });
        setProducts(prodList);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching admin products:', err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // Compute unique categories
  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  // Deletion handler
  const handleDelete = async (id: string, name: string) => {
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`);
    if (!confirmDelete) return;

    try {
      await deleteProduct(id);
      toast.success(`Produk "${name}" berhasil dihapus.`);
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Gagal menghapus produk. Silakan coba lagi.');
    }
  };

  // Search, Filter, and Sorting processing
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'price-high') {
        return b.price - a.price;
      }
      if (sortBy === 'price-low') {
        return a.price - b.price;
      }
      if (sortBy === 'stock-low') {
        return a.stock - b.stock;
      }
      return 0;
    });

  // Pagination processing
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Reset page number on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, sortBy]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. SECTION HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white">Daftar Produk</h1>
          <p className="text-xs text-slate-400">Total {products.length} produk terdaftar dalam database.</p>
        </div>
        <Link href="/admin/products/create">
          <Button variant="primary" className="flex items-center gap-2 text-xs font-bold shrink-0">
            <Plus className="h-4 w-4" />
            Tambah Produk
          </Button>
        </Link>
      </div>

      {/* 2. SEARCH & FILTER MODULES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-slate-800 bg-slate-900/60 p-4 rounded-xl">
        {/* Search Bar */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Cari nama atau kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-primary focus:outline-none"
            aria-label="Cari produk"
          />
        </div>

        {/* Category filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-primary focus:outline-none"
          aria-label="Filter kategori"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'Semua Kategori' : cat}
            </option>
          ))}
        </select>

        {/* Sorting Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-primary focus:outline-none"
          aria-label="Urutkan produk"
        >
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
          <option value="price-high">Harga: Tertinggi</option>
          <option value="price-low">Harga: Terendah</option>
          <option value="stock-low">Stok Terendah</option>
        </select>
      </div>

      {/* 3. PRODUCTS DATA GRID TABLE */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
        <table className="w-full border-collapse text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-semibold select-none">
            <tr className="border-b border-slate-800">
              <th className="px-6 py-4">Gambar</th>
              <th className="px-6 py-4">Nama</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Harga</th>
              <th className="px-6 py-4">Stok</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4"><LoadingSkeleton variant="circle" className="h-10 w-10" /></td>
                  <td className="px-6 py-4"><LoadingSkeleton variant="text" className="w-40" /></td>
                  <td className="px-6 py-4"><LoadingSkeleton variant="text" className="w-20" /></td>
                  <td className="px-6 py-4"><LoadingSkeleton variant="text" className="w-20" /></td>
                  <td className="px-6 py-4"><LoadingSkeleton variant="text" className="w-12" /></td>
                  <td className="px-6 py-4"><LoadingSkeleton variant="text" className="w-16" /></td>
                  <td className="px-6 py-4"><LoadingSkeleton variant="text" className="w-20 mx-auto" /></td>
                </tr>
              ))
            ) : currentItems.map((product) => (
              <tr key={product.id} className="hover:bg-slate-850/30 transition-colors">
                {/* Image */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative h-10 w-10 overflow-hidden rounded bg-slate-800 flex items-center justify-center border border-slate-750">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-slate-500" />
                    )}
                  </div>
                </td>
                
                {/* Name */}
                <td className="px-6 py-4 font-bold text-white max-w-[200px] truncate">
                  {product.name}
                </td>
                
                {/* Category */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="rounded bg-slate-800 px-2.5 py-1 font-medium text-slate-300 border border-slate-750">
                    {product.category}
                  </span>
                </td>
                
                {/* Price */}
                <td className="px-6 py-4 font-semibold text-slate-200 whitespace-nowrap">
                  {formatRupiah(product.price)}
                </td>
                
                {/* Stock count */}
                <td className="px-6 py-4 font-mono whitespace-nowrap">
                  {product.stock}
                </td>
                
                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.stock > 0 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                      Habis
                    </span>
                  )}
                </td>

                {/* Edit / Delete actions */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2.5">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <button className="p-1.5 rounded bg-slate-800 text-blue-400 hover:bg-slate-700 hover:text-blue-300 transition-all" aria-label="Edit product">
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => product.id && handleDelete(product.id, product.name)}
                      className="p-1.5 rounded bg-slate-800 text-rose-400 hover:bg-slate-700 hover:text-rose-300 transition-all"
                      aria-label="Delete product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && currentItems.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                  Tidak ada produk ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. PAGINATION FOOTER PANEL */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs select-none">
          <span className="text-slate-400 font-medium">
            Menampilkan <span className="text-white font-bold">{indexOfFirstItem + 1}</span> -{' '}
            <span className="text-white font-bold">{Math.min(indexOfLastItem, totalItems)}</span> dari{' '}
            <span className="text-white font-bold">{totalItems}</span> Produk
          </span>

          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="flex items-center gap-1 py-1.5 px-3 text-[11px] font-semibold border-slate-800 hover:bg-slate-900"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="flex items-center gap-1 py-1.5 px-3 text-[11px] font-semibold border-slate-800 hover:bg-slate-900"
            >
              Berikutnya
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
