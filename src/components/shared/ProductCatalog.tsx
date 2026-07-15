'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts } from '@/services/product.service';
import { Product } from '@/types/product';
import { ProductCard } from '../cards/ProductCard';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { Button } from '../ui/Button';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { formatRupiah } from '@/utils/format';
import { useDebounce } from '@/hooks/useDebounce';
import { useCart } from '@/hooks/useCart';
import Image from 'next/image';
import {
  ChevronRight,
  Home,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  AlertCircle,
  Inbox,
} from 'lucide-react';

const CATEGORIES = ['Semua', 'Laptop', 'Keyboard', 'Mouse', 'Headset'];

type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';

export function ProductCatalog() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter, Search, and Sort state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Selected product modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
      setCurrentPage(1); // Reset page to 1 on new load
    } catch (err) {
      console.error('Error fetching products inside catalog:', err);
      setError('Gagal memuat produk.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Semua');
    setSortBy('newest');
    setCurrentPage(1);
  };

  // Toast handler for adding to cart
  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  // Filter products based on search query and category
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'Semua' ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Pagination index details
  const totalItems = sortedProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <Container>
        {/* Breadcrumbs */}
        <nav className="mb-6 flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link
                href="/"
                className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-primary md:text-sm"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 text-slate-400" />
                <span className="ml-1 text-xs font-semibold text-slate-800 md:text-sm md:ml-2">
                  Produk
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-10 text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Semua Produk
          </h1>
          <p className="mt-2 text-sm text-slate-500 md:text-base">
            Temukan berbagai produk teknologi terbaik dengan harga terjangkau.
          </p>
        </div>

        {/* Catalog Control Bar (Filters, Search, and Sort) */}
        <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-12 items-center">
          {/* Search bar */}
          <div className="relative lg:col-span-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <Input
              type="text"
              placeholder="Cari produk..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Cari produk"
            />
          </div>

          {/* Category Quick Filter */}
          <div className="flex flex-wrap gap-2 lg:col-span-5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold transition-all md:text-sm ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                aria-label={`Filter kategori ${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sorting controls */}
          <div className="flex items-center gap-2 lg:col-span-3 justify-start lg:justify-end">
            <SlidersHorizontal className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortOption);
                setCurrentPage(1);
              }}
              className="block w-full max-w-[200px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 focus:border-primary focus:outline-none md:text-sm"
              aria-label="Urutkan produk"
            >
              <option value="newest">Produk Terbaru</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
              <option value="name-asc">Nama A-Z</option>
              <option value="name-desc">Nama Z-A</option>
            </select>
          </div>
        </div>

        {/* Loading Spinner / Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <LoadingSkeleton key={i} variant="card" />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <Section>
            <div className="mx-auto flex max-w-md flex-col items-center justify-center border border-red-100 bg-red-50/50 p-8 text-center rounded-2xl">
              <AlertCircle className="mb-4 h-12 w-12 text-danger" />
              <h3 className="mb-2 text-lg font-semibold text-slate-800">{error}</h3>
              <p className="mb-6 text-sm text-slate-500 leading-relaxed">
                Koneksi ke database gagal. Periksa koneksi internet Anda atau coba kembali beberapa saat lagi.
              </p>
              <Button onClick={fetchProducts} variant="primary">
                Coba Lagi
              </Button>
            </div>
          </Section>
        )}

        {/* Empty state (No products matching filter/search) */}
        {!loading && !error && currentItems.length === 0 && (
          <Section>
            <div className="mx-auto flex max-w-md flex-col items-center justify-center bg-white border border-slate-100 p-8 text-center rounded-2xl shadow-sm">
              <div className="mb-5 flex h-14 w-14 items-center justify-center bg-slate-50 text-slate-400 rounded-full">
                <Inbox className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-800">
                Produk tidak ditemukan
              </h3>
              <p className="mb-6 text-sm text-slate-500 leading-relaxed">
                Kami tidak menemukan produk yang sesuai dengan filter atau kata kunci pencarian Anda.
              </p>
              <Button onClick={handleResetFilters} variant="primary">
                Reset Filter
              </Button>
            </div>
          </Section>
        )}

        {/* Products Grid */}
        {!loading && !error && currentItems.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentItems.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDetailClick={setSelectedProduct}
                  onAddToCartClick={handleAddToCart}
                />
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {/* Prev button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                  aria-label="Halaman Sebelumnya"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition-all ${
                        currentPage === pageNum
                          ? 'bg-primary border-primary text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                      aria-label={`Ke halaman ${pageNum}`}
                      aria-current={currentPage === pageNum ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                  aria-label="Halaman Selanjutnya"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </Container>

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
                    handleAddToCart(selectedProduct);
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
            <div className="relative aspect-square overflow-hidden bg-slate-50 rounded-lg border border-slate-100">
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
                    {selectedProduct.stock > 0 ? `${selectedProduct.stock} Unit` : 'Habis'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
export default ProductCatalog;
