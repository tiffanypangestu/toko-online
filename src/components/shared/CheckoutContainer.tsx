'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { createOrder } from '@/services/order.service';
import { Order, OrderItem } from '@/types/order';
import { getBalance, deductBalance } from '@/services/balance.service';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { formatRupiah } from '@/utils/format';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Script from 'next/script';
import {
  ChevronRight,
  Home,
  CreditCard,
  CheckCircle,
  Truck,
  FileText,
} from 'lucide-react';

// Form validation Zod schema
const checkoutSchema = z.object({
  customerName: z
    .string()
    .min(3, { message: 'Nama lengkap minimal harus terdiri dari 3 karakter.' }),
  email: z
    .string()
    .email({ message: 'Masukkan alamat email yang valid.' }),
  phone: z
    .string()
    .min(10, { message: 'Nomor HP minimal terdiri dari 10 digit.' }),
  address: z
    .string()
    .min(15, { message: 'Alamat lengkap minimal terdiri dari 15 karakter.' }),
  city: z
    .string()
    .min(1, { message: 'Kota wajib diisi.' }),
  province: z
    .string()
    .min(1, { message: 'Provinsi wajib diisi.' }),
  postalCode: z
    .string()
    .length(5, { message: 'Kode pos harus terdiri dari 5 digit angka.' })
    .regex(/^\d+$/, { message: 'Kode pos hanya boleh berisi angka.' }),
  notes: z
    .string()
    .optional(),
  agreement: z
    .boolean()
    .refine((val) => val === true, { message: 'Anda harus menyetujui syarat dan ketentuan.' }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutContainer() {
  const router = useRouter();
  const {
    cartItems,
    isInitialized,
    appliedVoucher,
    clearCart,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getGrandTotal,
    getTotalItems,
  } = useCart();

  const [mounted, setMounted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'MIDTRANS' | 'SALDO_TOKO'>('MIDTRANS');

  // Set hydration mount check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Empty cart protection redirect
  useEffect(() => {
    if (mounted && isInitialized && cartItems.length === 0 && !createdOrder) {
      router.push('/cart');
    }
  }, [mounted, isInitialized, cartItems, createdOrder, router]);

  // Form hooks setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      notes: '',
      agreement: false,
    },
  });

  if (!mounted || !isInitialized || (cartItems.length === 0 && !createdOrder)) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <Container>
          <div className="mb-8">
            <LoadingSkeleton variant="title" className="mb-4" />
            <LoadingSkeleton variant="text" className="w-1/2" />
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-4">
              <LoadingSkeleton variant="rect" className="h-96" />
            </div>
            <div className="lg:col-span-4">
              <LoadingSkeleton variant="rect" className="h-80" />
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Generate Unique Order ID following: ORD-YYYYMMDD-XXXX
  const generateOrderId = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    // Random 4 digit number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${dateStr}-${randomNum}`;
  };

  // Sanitation helper
  const sanitizeText = (text: string): string => {
    return text.replace(/[<>]/g, '').trim(); // Remove basic HTML tag markers
  };

  const onSubmit = async (values: CheckoutFormValues) => {
    try {
      setSubmitting(true);

      // Validate stock quantities one final time
      const invalidItems = cartItems.filter((item) => item.quantity > item.stock);
      if (invalidItems.length > 0) {
        const names = invalidItems.map((item) => item.name).join(', ');
        toast.error(`Kuantitas barang (${names}) melebihi stok yang tersedia. Harap edit keranjang.`);
        setSubmitting(false);
        return;
      }

      const generatedId = generateOrderId();
      const orderItems: OrderItem[] = cartItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
      }));

      const isSaldo = selectedPaymentMethod === 'SALDO_TOKO';
      const grandTotal = getGrandTotal();

      if (isSaldo) {
        // Validate user balance
        const balance = await getBalance(values.email.trim().toLowerCase());
        if (balance < grandTotal) {
          toast.error('Saldo Toko Anda tidak mencukupi untuk memesan. Silakan top up saldo terlebih dahulu.');
          setSubmitting(false);
          return;
        }
        // Deduct balance
        await deductBalance(values.email.trim().toLowerCase(), grandTotal);
      }

      const newOrder: Omit<Order, 'id'> = {
        orderId: generatedId,
        customerName: sanitizeText(values.customerName),
        email: values.email.trim().toLowerCase(),
        phone: sanitizeText(values.phone),
        address: sanitizeText(values.address),
        city: sanitizeText(values.city),
        province: sanitizeText(values.province),
        postalCode: sanitizeText(values.postalCode),
        notes: values.notes ? sanitizeText(values.notes) : '',
        items: orderItems,
        subtotal: getSubtotal(),
        discount: getDiscountAmount(),
        shippingCost: getShippingFee(),
        grandTotal: grandTotal,
        paymentStatus: isSaldo ? 'PAID' : 'PENDING',
        paymentMethod: isSaldo ? 'SALDO_TOKO' : 'MIDTRANS',
        paymentToken: '',
        paymentUrl: '',
        transactionId: isSaldo ? `SALDO-${generatedId}` : '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 1. Save order inside Firestore orders collection
      const docId = await createOrder(newOrder);

      let savedOrder: Order;

      if (isSaldo) {
        savedOrder = {
          ...newOrder,
          id: docId,
        };
        clearCart();
        toast.success('Pembayaran sukses menggunakan Saldo Toko!');
        
        // Refresh local balance in window if it matches
        if (typeof window !== 'undefined') {
          const currentEmail = localStorage.getItem('wallet_email') || 'customer@example.com';
          if (currentEmail.trim().toLowerCase() === values.email.trim().toLowerCase()) {
            // Dispatch a storage event or simply reload navbar by state (will refresh on next navigation or refresh)
            window.dispatchEvent(new Event('storage'));
          }
        }
      } else {
        // 2. Request Midtrans Snap Transaction details from API Route
        const response = await fetch('/api/payment/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: generatedId,
            customer: {
              name: newOrder.customerName,
              email: newOrder.email,
              phone: newOrder.phone,
              address: newOrder.address,
              city: newOrder.city,
              province: newOrder.province,
              postalCode: newOrder.postalCode,
            },
            items: newOrder.items,
            subtotal: newOrder.subtotal,
            shipping: newOrder.shippingCost,
            discount: newOrder.discount,
            grandTotal: newOrder.grandTotal,
          }),
        });

        if (!response.ok) {
          throw new Error('Gagal menghubungi API Pembayaran Midtrans Snap.');
        }

        const paymentData = await response.json();

        savedOrder = {
          ...newOrder,
          id: docId,
          paymentToken: paymentData.token,
          paymentUrl: paymentData.redirectUrl,
        };
      }

      setCreatedOrder(savedOrder);
      toast.success('Pesanan berhasil dibuat.');
    } catch (error) {
      console.error('Checkout submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal memproses pesanan.';
      toast.error(errorMessage || 'Silakan periksa koneksi internet Anda.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayNow = () => {
    if (!createdOrder) return;

    // Launch Midtrans Snap Popup if JS is loaded, otherwise fall back to redirect URL
    const snapClient = typeof window !== 'undefined'
      ? (window as unknown as { snap?: { pay: (token: string, options?: object) => void } }).snap
      : undefined;

    if (snapClient) {
      snapClient.pay(createdOrder.paymentToken, {
        onSuccess: function () {
          toast.success('Pembayaran sukses!');
          clearCart();
          router.push(`/payment/success?orderId=${createdOrder.orderId}`);
        },
        onPending: function () {
          toast.info('Menunggu pembayaran.');
          router.push(`/payment/pending?orderId=${createdOrder.orderId}`);
        },
        onError: function () {
          toast.error('Pembayaran gagal.');
          router.push(`/payment/failed?orderId=${createdOrder.orderId}`);
        },
        onClose: function () {
          toast.warning('Pembayaran tertunda.');
          router.push(`/payment/pending?orderId=${createdOrder.orderId}`);
        },
      });
    } else {
      console.warn('Midtrans Snap Client JS not loaded. Redirecting to payment URL.');
      window.location.href = createdOrder.paymentUrl;
    }
  };

  // If order is successfully created, display Checkout Success page details
  if (createdOrder) {
    return (
      <div className="min-h-[85vh] bg-slate-50 flex items-center justify-center py-12">
        <Container className="max-w-2xl">
          {/* Dynamic load of Midtrans Sandbox snap.js */}
          <Script
            src="https://app.sandbox.midtrans.com/snap/snap.js"
            data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
            strategy="lazyOnload"
          />

          <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-lg animate-in fade-in duration-300">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center bg-emerald-50 text-emerald-500 rounded-full">
              <CheckCircle className="h-10 w-10" />
            </div>
            
            <h1 className="mb-2 text-2xl font-bold text-slate-800">
              {createdOrder.paymentMethod === 'SALDO_TOKO' ? 'Pembayaran Berhasil!' : 'Pesanan Berhasil Dibuat'}
            </h1>
            <p className="mb-6 text-sm text-slate-500">
              {createdOrder.paymentMethod === 'SALDO_TOKO' 
                ? 'Terima kasih telah berbelanja di Toko Online. Pembayaran Anda menggunakan Saldo Toko telah sukses dikonfirmasi.' 
                : 'Terima kasih telah berbelanja di Toko Online. Pesanan Anda telah tersimpan di sistem kami dengan status pembayaran PENDING.'}
            </p>

            {/* Order Invoice Brief info */}
            <div className="mb-8 rounded-xl bg-slate-50 p-5 text-left border border-slate-100 text-xs sm:text-sm">
              <div className="mb-3 flex justify-between border-b border-slate-200/60 pb-3">
                <span className="font-semibold text-slate-500">Order ID</span>
                <span className="font-bold text-slate-800 font-mono">{createdOrder.orderId}</span>
              </div>
              <div className="mb-3 flex justify-between border-b border-slate-200/60 pb-3">
                <span className="font-semibold text-slate-500">Nama Penerima</span>
                <span className="font-bold text-slate-800">{createdOrder.customerName}</span>
              </div>
              <div className="mb-3 flex justify-between border-b border-slate-200/60 pb-3">
                <span className="font-semibold text-slate-500">Metode Pembayaran</span>
                <span className="font-bold text-primary">{createdOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-slate-900 mt-2">
                <span>Grand Total</span>
                <span>{formatRupiah(createdOrder.grandTotal)}</span>
              </div>
            </div>

            <div className="space-y-3">
              {createdOrder.paymentMethod === 'SALDO_TOKO' ? (
                <Link href="/products" className="block w-full">
                  <Button
                    variant="primary"
                    className="w-full flex items-center justify-center gap-2 font-bold py-3 text-sm"
                  >
                    Kembali Belanja
                  </Button>
                </Link>
              ) : (
                <>
                  <Button
                    onClick={handlePayNow}
                    variant="primary"
                    className="w-full flex items-center justify-center gap-2 font-bold py-3 text-sm"
                  >
                    <CreditCard className="h-4 w-4" />
                    Bayar Sekarang (Midtrans)
                  </Button>
                  <p className="text-[10px] text-slate-400">
                    Pilih tombol di atas untuk membuka popup transaksi Midtrans Snap Sandbox.
                  </p>
                </>
              )}
              {createdOrder.paymentMethod !== 'SALDO_TOKO' && (
                <div className="pt-4">
                  <Link
                    href="/products"
                    className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors"
                  >
                    Kembali ke Katalog Produk
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Normal checkout form rendering details
  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const shippingFee = getShippingFee();
  const grandTotal = getGrandTotal();
  const totalItems = getTotalItems();

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
                  href="/cart"
                  className="ml-1 text-xs font-medium text-slate-500 hover:text-primary md:text-sm md:ml-2"
                >
                  Keranjang
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 text-slate-400" />
                <span className="ml-1 text-xs font-semibold text-slate-800 md:text-sm md:ml-2">
                  Checkout
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8 text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Selesaikan Pembelian
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Lengkapi data pengiriman di bawah ini untuk memproses pesanan Anda.
          </p>
        </div>

        {/* Form Content Grid */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          
          {/* Left Panel: Customer Form Fields */}
          <div className="space-y-6 lg:col-span-8">
            <fieldset disabled={submitting} className="space-y-6">
              <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="mb-6 flex items-center gap-2 text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
                  <FileText className="h-5 w-5 text-primary" />
                  Informasi Penerima & Alamat Pengiriman
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Full name */}
                  <div className="sm:col-span-2">
                    <Input
                      label="Nama Lengkap"
                      placeholder="Contoh: John Doe"
                      error={errors.customerName?.message}
                      {...register('customerName')}
                    />
                  </div>

                  {/* Email address */}
                  <div>
                    <Input
                      label="Email"
                      type="email"
                      placeholder="Contoh: johndoe@gmail.com"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>

                  {/* Mobile phone number */}
                  <div>
                    <Input
                      label="Nomor HP"
                      type="tel"
                      placeholder="Contoh: 081234567890"
                      error={errors.phone?.message}
                      {...register('phone')}
                    />
                  </div>

                  {/* Full address */}
                  <div className="sm:col-span-2">
                    <Input
                      label="Alamat Lengkap"
                      placeholder="Contoh: Jl. Sudirman No. 12, RT 01/RW 02"
                      error={errors.address?.message}
                      {...register('address')}
                    />
                  </div>

                  {/* City */}
                  <div>
                    <Input
                      label="Kota / Kabupaten"
                      placeholder="Contoh: Jakarta Selatan"
                      error={errors.city?.message}
                      {...register('city')}
                    />
                  </div>

                  {/* Province */}
                  <div>
                    <Input
                      label="Provinsi"
                      placeholder="Contoh: DKI Jakarta"
                      error={errors.province?.message}
                      {...register('province')}
                    />
                  </div>

                  {/* Postal Code */}
                  <div>
                    <Input
                      label="Kode Pos"
                      placeholder="Contoh: 12190"
                      maxLength={5}
                      error={errors.postalCode?.message}
                      {...register('postalCode')}
                    />
                  </div>

                  {/* Notes input */}
                  <div className="sm:col-span-2">
                    <Textarea
                      label="Catatan Pesanan (Opsional)"
                      placeholder="Contoh: Kirim setelah jam kerja, warna hitam, dll."
                      error={errors.notes?.message}
                      {...register('notes')}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Metode Pembayaran
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-slate-50 transition-all ${selectedPaymentMethod === 'MIDTRANS' ? 'border-primary bg-blue-50/10' : 'border-slate-200'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="MIDTRANS"
                      checked={selectedPaymentMethod === 'MIDTRANS'}
                      onChange={() => setSelectedPaymentMethod('MIDTRANS')}
                      className="h-4 w-4 text-primary focus:ring-primary cursor-pointer animate-none"
                    />
                    <div>
                      <span className="block text-xs font-bold text-slate-800">Midtrans Sandbox</span>
                      <span className="block text-[10px] text-slate-400">QRIS, Transfer Bank, e-Wallet</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-slate-50 transition-all ${selectedPaymentMethod === 'SALDO_TOKO' ? 'border-primary bg-blue-50/10' : 'border-slate-200'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="SALDO_TOKO"
                      checked={selectedPaymentMethod === 'SALDO_TOKO'}
                      onChange={() => setSelectedPaymentMethod('SALDO_TOKO')}
                      className="h-4 w-4 text-primary focus:ring-primary cursor-pointer animate-none"
                    />
                    <div>
                      <span className="block text-xs font-bold text-slate-800">Saldo Toko</span>
                      <span className="block text-[10px] text-slate-400">Bayar instan menggunakan Saldo Anda</span>
                    </div>
                  </label>
                </div>
              </div>
            </fieldset>
          </div>

          {/* Right Panel: Shopping Summary panel & Checkbox */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-base font-bold text-slate-800 border-b border-slate-100 pb-3">Ringkasan Pesanan</h3>

              {/* Items List */}
              <div className="mb-4 max-h-40 overflow-y-auto space-y-3 border-b border-slate-100 pb-4">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center text-xs text-slate-600">
                    <span className="font-semibold text-slate-700 line-clamp-1 max-w-[200px]">
                      {item.name} <span className="text-slate-400 font-medium">x{item.quantity}</span>
                    </span>
                    <span className="font-bold text-slate-800">{formatRupiah(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              {/* Calculations lists */}
              <div className="space-y-3 border-b border-slate-100 pb-4 text-xs sm:text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Jumlah Item</span>
                  <span className="font-semibold text-slate-800">{totalItems} Barang</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">{formatRupiah(subtotal)}</span>
                </div>
                
                {/* Discount */}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Diskon (10%)</span>
                    <span>-{formatRupiah(discountAmount)}</span>
                  </div>
                )}

                {/* Voucher (Readonly badge) */}
                {appliedVoucher && (
                  <div className="flex justify-between items-center">
                    <span>Voucher Terpasang</span>
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                      {appliedVoucher}
                    </span>
                  </div>
                )}

                {/* Shipping cost */}
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

              {/* Grand total */}
              <div className="my-4 flex items-baseline justify-between">
                <span className="text-sm font-bold text-slate-800">Total Pembayaran</span>
                <span className="text-lg font-black text-slate-900">
                  {formatRupiah(grandTotal)}
                </span>
              </div>

              {/* T&C Terms Agreement Checkbox */}
              <div className="mb-4">
                <label className="flex items-start gap-2.5 text-xs text-slate-500 leading-normal select-none cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={submitting}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 focus:ring-primary cursor-pointer shrink-0"
                    {...register('agreement')}
                  />
                  <span>Saya menyetujui syarat dan ketentuan yang berlaku.</span>
                </label>
                {errors.agreement && (
                  <p className="mt-1 text-[10px] text-danger font-medium">{errors.agreement.message}</p>
                )}
              </div>

              {/* Submit Checkout button */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 font-bold py-3 text-sm"
                variant="primary"
              >
                {submitting ? 'Memproses...' : 'Lanjut ke Pembayaran'}
              </Button>

              <div className="mt-4 text-center">
                <Link
                  href="/cart"
                  className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors"
                >
                  Kembali ke Keranjang
                </Link>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}
export default CheckoutContainer;
