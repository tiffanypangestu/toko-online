'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { Input } from '../ui/Input';
import { formatRupiah } from '@/utils/format';
import { toast } from 'sonner';
import Image from 'next/image';
import {
  ChevronRight,
  Home,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  Percent,
  Truck,
} from 'lucide-react';

export function CartContainer() {
  const router = useRouter();
  const {
    cartItems,
    isInitialized,
    appliedVoucher,
    removeItem,
    updateQuantity,
    clearCart,
    applyVoucher,
    removeVoucher,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getGrandTotal,
    getTotalItems,
  } = useCart();

  const [voucherInput, setVoucherInput] = useState<string>('');
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  // Set hydration mount check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync applied voucher text input
  useEffect(() => {
    if (appliedVoucher) {
      setVoucherInput(appliedVoucher);
    }
  }, [appliedVoucher]);

  if (!mounted || !isInitialized) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <Container>
          <div className="mb-8">
            <LoadingSkeleton variant="title" className="mb-4" />
            <LoadingSkeleton variant="text" className="w-1/2" />
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-4">
              <LoadingSkeleton variant="rect" className="h-40" />
              <LoadingSkeleton variant="rect" className="h-40" />
            </div>
            <div className="lg:col-span-4">
              <LoadingSkeleton variant="rect" className="h-80" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const shippingFee = getShippingFee();
  const grandTotal = getGrandTotal();
  const totalItems = getTotalItems();

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError(null);

    if (!voucherInput.trim()) {
      setVoucherError('Masukkan kode voucher.');
      return;
    }

    const success = applyVoucher(voucherInput.trim());
    if (success) {
      toast.success('Voucher HEMAT10 berhasil digunakan. Diskon 10% diterapkan!');
      setVoucherError(null);
    } else {
      setVoucherError('Voucher tidak valid.');
      toast.error('Voucher tidak valid.');
    }
  };

  const handleRemoveVoucher = () => {
    removeVoucher();
    setVoucherInput('');
    setVoucherError(null);
    toast.info('Voucher dihapus.');
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus produk ini?');
    if (confirmDelete) {
      removeItem(productId);
      toast.success(`${productName} berhasil dihapus.`);
    }
  };

  const handleClearCart = () => {
    const confirmClear = window.confirm('Apakah Anda yakin ingin mengosongkan seluruh keranjang belanja?');
    if (confirmClear) {
      clearCart();
      toast.success('Keranjang belanja berhasil dikosongkan.');
    }
  };

  const handleCheckout = () => {
    // Validate stock values before navigating
    const invalidItems = cartItems.filter((item) => item.quantity > item.stock);
    if (invalidItems.length > 0) {
      const names = invalidItems.map((item) => item.name).join(', ');
      toast.error(`Kuantitas barang (${names}) melebihi stok yang tersedia. Harap kurangi jumlah pembelian.`);
      return;
    }

    router.push('/checkout');
  };

  // Render Empty State if no items in cart
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center py-12">
        <Container className="flex flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center bg-white border border-slate-100 rounded-full shadow-sm text-slate-400">
            <ShoppingBag className="h-12 w-12" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-slate-800">
            Keranjang belanja masih kosong
          </h1>
          <p className="mb-8 max-w-sm text-sm text-slate-500 leading-relaxed">
            Belum ada produk di dalam keranjang Anda. Jelajahi toko kami untuk menemukan perangkat teknologi impian Anda.
          </p>
          <Link href="/products">
            <Button size="lg" variant="primary">
              Mulai Belanja
            </Button>
          </Link>
        </Container>
      </div>
    );
  }

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
            <li>
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 text-slate-400" />
                <Link
                  href="/products"
                  className="ml-1 text-xs font-medium text-slate-500 hover:text-primary md:text-sm md:ml-2"
                >
                  Produk
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 text-slate-400" />
                <span className="ml-1 text-xs font-semibold text-slate-800 md:text-sm md:ml-2">
                  Keranjang
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Keranjang Belanja
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Anda memiliki {totalItems} item di dalam keranjang belanja.
            </p>
          </div>
          <Button
            onClick={handleClearCart}
            variant="outline"
            size="sm"
            className="flex items-center justify-center gap-1.5 self-start sm:self-center border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            aria-label="Kosongkan seluruh keranjang belanja"
          >
            <Trash2 className="h-4 w-4" />
            Kosongkan Keranjang
          </Button>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Product Items Table List */}
          <div className="space-y-4 lg:col-span-8">
            {cartItems.map((item) => {
              const isOverStock = item.quantity > item.stock;
              const isMaxQty = item.quantity >= item.stock;

              return (
                <div
                  key={item.productId}
                  className={`flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between transition-all duration-200 hover:shadow-md ${
                    isOverStock ? 'border-red-200 bg-red-50/10' : ''
                  }`}
                >
                  {/* Left: Image & Description */}
                  <div className="flex gap-4 items-center">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-slate-50 rounded-lg border border-slate-100">
                      <Image
                        src={item.image || 'https://placehold.co/600x600'}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div>
                      <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 mb-1">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-800 line-clamp-1 sm:text-base">
                        {item.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-900 mt-1">
                        {formatRupiah(item.price)}
                      </p>

                      {/* Stock badge validation warn */}
                      <div className="mt-1">
                        {item.stock === 0 ? (
                          <span className="text-[10px] font-bold text-rose-600">
                            Stok Habis
                          </span>
                        ) : isOverStock ? (
                          <span className="text-[10px] font-bold text-rose-600 animate-pulse">
                            Melebihi Stok (Tersedia: {item.stock})
                          </span>
                        ) : item.stock <= 10 ? (
                          <span className="text-[10px] font-medium text-amber-600">
                            Stok Terbatas (Tersedia: {item.stock})
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-emerald-600">
                            Stok Tersedia ({item.stock})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Quantity, Subtotal, Delete Actions */}
                  <div className="flex items-center justify-between gap-4 border-t border-slate-50 pt-3 sm:border-none sm:pt-0 shrink-0">
                    {/* Quantity selectors */}
                    <div className="flex items-center rounded-lg border border-slate-200 p-0.5 bg-slate-50 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="cursor-pointer rounded p-1.5 text-slate-500 hover:bg-white hover:text-slate-800 disabled:opacity-30"
                        disabled={item.quantity <= 1}
                        aria-label="Kurangi jumlah"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="cursor-pointer rounded p-1.5 text-slate-500 hover:bg-white hover:text-slate-800 disabled:opacity-30"
                        disabled={isMaxQty}
                        aria-label="Tambah jumlah"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right shrink-0 min-w-[100px]">
                      <p className="text-xs text-slate-400">Subtotal</p>
                      <p className="text-sm font-bold text-slate-800">
                        {formatRupiah(item.subtotal)}
                      </p>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleRemoveItem(item.productId, item.name)}
                      className="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-red-600 transition-colors"
                      aria-label={`Hapus ${item.name} dari keranjang`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Summary Sidebar panel */}
          <div className="lg:col-span-4 space-y-6">
            {/* Voucher input Box */}
            <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
                <Percent className="h-4 w-4 text-primary" />
                Gunakan Voucher
              </h3>
              <form onSubmit={handleApplyVoucher} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Masukkan kode voucher..."
                  className="h-10 text-xs shrink-0 flex-1 uppercase"
                  value={voucherInput}
                  onChange={(e) => {
                    setVoucherInput(e.target.value);
                    setVoucherError(null);
                  }}
                  disabled={!!appliedVoucher}
                  aria-label="Kode Voucher"
                />
                {appliedVoucher ? (
                  <Button
                    type="button"
                    onClick={handleRemoveVoucher}
                    variant="danger"
                    size="sm"
                    className="h-10 shrink-0"
                  >
                    Hapus
                  </Button>
                ) : (
                  <Button type="submit" variant="secondary" size="sm" className="h-10 shrink-0">
                    Gunakan
                  </Button>
                )}
              </form>
              {voucherError && <p className="mt-1 text-xs text-danger font-medium">{voucherError}</p>}
              {appliedVoucher && (
                <p className="mt-2 text-xs font-semibold text-emerald-600 animate-fade-in">
                  Voucher **{appliedVoucher}** aktif (Diskon 10%)
                </p>
              )}
              <p className="mt-3 text-[10px] text-slate-400 leading-normal">
                Gunakan voucher dummy **HEMAT10** untuk mendapatkan diskon 10% pada pembelanjaan Anda.
              </p>
            </div>

            {/* Shopping Summary billing list */}
            <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-base font-bold text-slate-800">Ringkasan Belanja</h3>
              
              <div className="space-y-3 border-b border-slate-100 pb-4 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Jumlah Item</span>
                  <span className="font-semibold text-slate-800">{totalItems} Barang</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">{formatRupiah(subtotal)}</span>
                </div>
                
                {/* Discount display */}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Diskon (10%)</span>
                    <span>-{formatRupiah(discountAmount)}</span>
                  </div>
                )}

                {/* Shipping display */}
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-slate-400" />
                    Ongkos Kirim
                  </span>
                  <span className="font-semibold text-slate-800">
                    {shippingFee === 0 ? (
                      <span className="text-xs font-bold text-emerald-600 uppercase">Gratis Ongkir</span>
                    ) : (
                      formatRupiah(shippingFee)
                    )}
                  </span>
                </div>
              </div>

              {/* Free shipping eligibility banner */}
              {shippingFee > 0 && (
                <div className="mt-3 rounded-lg bg-blue-50/50 p-2.5 text-center text-xs text-blue-700 leading-normal border border-blue-100/50">
                  Belanja hingga **{formatRupiah(500000)}** untuk mendapatkan **Gratis Ongkir**!
                </div>
              )}

              {/* Grand Total */}
              <div className="my-4 flex items-baseline justify-between">
                <span className="text-sm font-bold text-slate-800">Total Harga</span>
                <span className="text-xl font-black text-slate-900">
                  {formatRupiah(grandTotal)}
                </span>
              </div>

              {/* Checkout CTA */}
              <Button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 font-bold py-3 text-sm"
                variant="primary"
                disabled={cartItems.length === 0}
              >
                Lanjut ke Checkout
              </Button>

              <div className="mt-4 text-center">
                <Link
                  href="/products"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Kembali Belanja
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
export default CartContainer;
