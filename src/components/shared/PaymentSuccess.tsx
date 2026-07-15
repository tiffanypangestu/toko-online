'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { getOrderByOrderId } from '@/services/order.service';
import { Order } from '@/types/order';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { formatRupiah } from '@/utils/format';
import { CheckCircle, ShoppingBag } from 'lucide-react';

export function PaymentSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { clearCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Clear shopping cart on successful checkout payment loading
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const orderData = await getOrderByOrderId(orderId);
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching success order details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center py-12">
        <Container className="max-w-md">
          <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-lg">
            <LoadingSkeleton variant="circle" className="mx-auto mb-6 h-16 w-16" />
            <LoadingSkeleton variant="title" className="mx-auto mb-4 w-3/4" />
            <LoadingSkeleton variant="rect" className="h-32 mb-6" />
            <LoadingSkeleton variant="text" className="h-10 w-full" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center py-12">
      <Container className="max-w-md">
        <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-lg animate-in fade-in duration-300">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center bg-emerald-50 text-emerald-500 rounded-full">
            <CheckCircle className="h-10 w-10" />
          </div>

          <h1 className="mb-2 text-2xl font-bold text-slate-800">
            Pembayaran Berhasil
          </h1>
          <p className="mb-6 text-sm text-slate-500">
            Terima kasih! Transaksi pembayaran Anda telah sukses diproses.
          </p>

          {/* Invoice breakdown details */}
          {order && (
            <div className="mb-8 rounded-xl bg-slate-50 p-5 text-left border border-slate-100 text-xs sm:text-sm">
              <div className="mb-3 flex justify-between border-b border-slate-200/60 pb-3">
                <span className="font-semibold text-slate-500">Nomor Order</span>
                <span className="font-bold text-slate-800 font-mono">{order.orderId}</span>
              </div>
              <div className="mb-3 flex justify-between border-b border-slate-200/60 pb-3">
                <span className="font-semibold text-slate-500">Nama Pelanggan</span>
                <span className="font-bold text-slate-800">{order.customerName}</span>
              </div>
              <div className="mb-3 flex justify-between border-b border-slate-200/60 pb-3">
                <span className="font-semibold text-slate-500">Status Transaksi</span>
                <span className="font-bold text-emerald-600">PAID</span>
              </div>
              <div className="flex justify-between font-bold text-base text-slate-900 mt-2">
                <span>Total Pembayaran</span>
                <span>{formatRupiah(order.grandTotal)}</span>
              </div>
            </div>
          )}

          {!order && orderId && (
            <div className="mb-6 rounded-xl bg-slate-50 p-4 text-center border border-slate-100 text-xs text-slate-500 font-mono">
              Order ID: {orderId}
            </div>
          )}

          <Link href="/products">
            <Button className="w-full flex items-center justify-center gap-2 font-bold py-3 text-sm" variant="primary">
              <ShoppingBag className="h-4 w-4" />
              Belanja Lagi
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
export default PaymentSuccess;
