'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getOrderById } from '@/services/order.service';
import { Order } from '@/types/order';
import { formatRupiah } from '@/utils/format';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import {
  ChevronLeft,
  User,
  MapPin,
  FileText,
  CreditCard,
  Calendar,
  Truck,
} from 'lucide-react';

interface AdminOrderDetailProps {
  orderDocId: string;
}

export function AdminOrderDetail({ orderDocId }: AdminOrderDetailProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderData = await getOrderById(orderDocId);
        if (orderData) {
          setOrder(orderData);
        } else {
          console.error('Order not found in Firestore.');
          router.push('/admin/orders');
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderDocId, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <LoadingSkeleton variant="circle" className="h-6 w-6" />
          <LoadingSkeleton variant="title" className="w-48" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <LoadingSkeleton variant="rect" className="h-96 rounded-xl" />
          </div>
          <div>
            <LoadingSkeleton variant="rect" className="h-80 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const getStatusBadgeClass = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'PAID':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'FAILED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'CANCELLED':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'EXPIRED':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* 1. HEADER SECTION */}
      <div className="flex items-center gap-3">
        <Link href="/admin/orders" className="text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-white">Detail Transaksi</h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">{order.orderId}</p>
        </div>
      </div>

      {/* 2. GRID BLOCK CONTAINER */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        
        {/* Left Side: Order Items and Client Data Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Customer profile summary */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <User className="h-4.5 w-4.5 text-primary" />
              Informasi Pembeli
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="block text-slate-500 mb-0.5">Nama Lengkap</span>
                <span className="font-bold text-white">{order.customerName}</span>
              </div>
              <div>
                <span className="block text-slate-500 mb-0.5">Alamat Email</span>
                <span className="font-semibold text-slate-200">{order.email}</span>
              </div>
              <div>
                <span className="block text-slate-500 mb-0.5">Nomor HP</span>
                <span className="font-semibold text-slate-200">{order.phone}</span>
              </div>
              {order.notes && (
                <div className="sm:col-span-2 border-t border-slate-850/50 pt-2">
                  <span className="block text-slate-500 mb-0.5">Catatan Pesanan</span>
                  <span className="block text-slate-300 italic">{order.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address panel */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <MapPin className="h-4.5 w-4.5 text-primary" />
              Alamat Pengiriman
            </h3>
            <div className="text-xs space-y-2">
              <div>
                <span className="block text-slate-500 mb-0.5">Alamat Lengkap</span>
                <p className="font-semibold text-slate-200 leading-relaxed">{order.address}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-850/50">
                <div>
                  <span className="block text-slate-500 mb-0.5">Kota</span>
                  <span className="font-semibold text-slate-300">{order.city}</span>
                </div>
                <div>
                  <span className="block text-slate-500 mb-0.5">Provinsi</span>
                  <span className="font-semibold text-slate-300">{order.province}</span>
                </div>
                <div>
                  <span className="block text-slate-500 mb-0.5">Kode Pos</span>
                  <span className="font-semibold text-slate-300 font-mono">{order.postalCode}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <FileText className="h-4.5 w-4.5 text-primary" />
              Daftar Barang Belanjaan
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-500 font-semibold select-none pb-2">
                    <th className="py-2">Nama Barang</th>
                    <th className="py-2 text-right">Harga</th>
                    <th className="py-2 text-center">Jumlah</th>
                    <th className="py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/40">
                  {order.items.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-850/10">
                      <td className="py-3 font-semibold text-white">{item.name}</td>
                      <td className="py-3 text-right font-mono">{formatRupiah(item.price)}</td>
                      <td className="py-3 text-center font-bold text-slate-400">{item.quantity}</td>
                      <td className="py-3 text-right font-bold text-white font-mono">{formatRupiah(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Totals Summary & Payment Info */}
        <div className="space-y-6">
          {/* Order Totals Summary list */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2.5">Rincian Pembayaran</h3>
            
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-200 font-mono">{formatRupiah(order.subtotal)}</span>
              </div>
              
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-500">
                  <span>Diskon Voucher</span>
                  <span className="font-bold font-mono">-{formatRupiah(order.discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4" />
                  Ongkos Kirim
                </span>
                <span className="font-bold text-slate-200 font-mono">
                  {order.shippingCost === 0 ? (
                    <span className="text-[10px] font-bold text-emerald-500 uppercase">Gratis</span>
                  ) : (
                    formatRupiah(order.shippingCost)
                  )}
                </span>
              </div>

              <div className="border-t border-slate-800 pt-3 flex items-baseline justify-between font-extrabold text-sm text-white">
                <span>Total Pembayaran</span>
                <span className="text-base text-primary font-mono">{formatRupiah(order.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Payment execution logs details */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2.5">Status & Logs Transaksi</h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="block text-slate-500 mb-1">Status Pembayaran</span>
                <span className={`inline-block text-[9px] font-extrabold rounded px-2.5 py-1 border ${getStatusBadgeClass(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>

              <div>
                <span className="block text-slate-500 mb-1.5">Midtrans Transaction ID</span>
                {order.transactionId ? (
                  <span className="block font-bold text-slate-200 font-mono select-all bg-slate-950 p-2 rounded border border-slate-850 truncate">
                    {order.transactionId}
                  </span>
                ) : (
                  <span className="block text-slate-650 italic">Belum dibuat atau pending</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-850/50 text-[10px]">
                <div>
                  <span className="block text-slate-500 flex items-center gap-1 mb-0.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Dibuat Pada
                  </span>
                  <span className="font-semibold text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-500 flex items-center gap-1 mb-0.5">
                    <CreditCard className="h-3.5 w-3.5" />
                    Metode Bayar
                  </span>
                  <span className="font-semibold text-slate-400">{order.paymentMethod}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
export default AdminOrderDetail;
