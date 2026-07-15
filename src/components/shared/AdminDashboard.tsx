'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { db, isFirebaseConfigured } from '@/firebase/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Product } from '@/types/product';
import { Order } from '@/types/order';
import { formatRupiah } from '@/utils/format';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  colorClass: string;
}

function KPICard({ title, value, icon, description, colorClass }: KPICardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm hover:border-slate-700 transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-lg ${colorClass}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-extrabold text-white tracking-tight">{value}</h3>
        <p className="mt-1 text-[10px] text-slate-500">{description}</p>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    const productsRef = collection(db, 'products');
    const ordersRef = collection(db, 'orders');
    const recentOrdersQuery = query(ordersRef, orderBy('createdAt', 'desc'));

    // Realtime listeners
    const unsubscribeProducts = onSnapshot(
      productsRef,
      (snapshot) => {
        const prodList: Product[] = [];
        snapshot.forEach((docSnap) => {
          prodList.push({ id: docSnap.id, ...docSnap.data() } as Product);
        });
        setProducts(prodList);
      },
      (error) => {
        console.error('Error listening to products:', error);
      },
    );

    const unsubscribeOrders = onSnapshot(
      recentOrdersQuery,
      (snapshot) => {
        const ordList: Order[] = [];
        snapshot.forEach((docSnap) => {
          ordList.push({ id: docSnap.id, ...docSnap.data() } as Order);
        });
        setOrders(ordList);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to orders:', error);
        setLoading(false);
      },
    );

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
    };
  }, []);

  // Compute metrics from realtime states
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.paymentStatus === 'PENDING').length;
  const paidOrders = orders.filter((o) => o.paymentStatus === 'PAID').length;
  const totalEarnings = orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.grandTotal, 0);

  // Group monthly sales data for the chart (last 6 months)
  const getMonthlySales = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const salesData: { name: string; amount: number }[] = [];

    // Initialize last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      salesData.push({
        name: months[d.getMonth()],
        amount: 0,
      });
    }

    // Accumulate PAID orders totals
    orders
      .filter((o) => o.paymentStatus === 'PAID')
      .forEach((order) => {
        const orderDate = new Date(order.createdAt);
        const orderMonthName = months[orderDate.getMonth()];
        const match = salesData.find((d) => d.name === orderMonthName);
        if (match) {
          match.amount += order.grandTotal;
        }
      });

    return salesData;
  };

  const monthlySales = getMonthlySales();
  const maxSales = Math.max(...monthlySales.map((d) => d.amount), 1000000);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <LoadingSkeleton key={idx} variant="rect" className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LoadingSkeleton variant="rect" className="h-80 rounded-xl" />
          </div>
          <div>
            <LoadingSkeleton variant="rect" className="h-80 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. KPI COUNTERS GRID */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KPICard
          title="Total Produk"
          value={totalProducts}
          icon={<Package className="h-5 w-5" />}
          description="Produk aktif di katalog"
          colorClass="bg-blue-500/10 text-blue-400"
        />
        <KPICard
          title="Total Order"
          value={totalOrders}
          icon={<ShoppingBag className="h-5 w-5" />}
          description="Semua log transaksi"
          colorClass="bg-purple-500/10 text-purple-400"
        />
        <KPICard
          title="Order Pending"
          value={pendingOrders}
          icon={<Clock className="h-5 w-5" />}
          description="Menunggu pembayaran"
          colorClass="bg-amber-500/10 text-amber-400"
        />
        <KPICard
          title="Order Paid"
          value={paidOrders}
          icon={<CheckCircle2 className="h-5 w-5" />}
          description="Transaksi sukses diselesaikan"
          colorClass="bg-emerald-500/10 text-emerald-400"
        />
        <KPICard
          title="Total Pendapatan"
          value={formatRupiah(totalEarnings)}
          icon={<DollarSign className="h-5 w-5" />}
          description="Akumulasi order PAID"
          colorClass="bg-rose-500/10 text-rose-400"
        />
      </div>

      {/* 2. CHARTS & RECENT ACTIVITIES */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Custom SVG Line/Bar Sales Chart */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Monitoring Penjualan</h3>
              <p className="text-[10px] text-slate-500">Representasi total nominal order PAID (6 bulan terakhir)</p>
            </div>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>

          {/* SVG Custom Sales Graph */}
          <div className="h-56 w-full flex flex-col justify-between">
            <div className="flex-1 flex items-end justify-between gap-3 px-2 border-b border-slate-850 pb-2 relative">
              {monthlySales.map((data, index) => {
                const heightPercentage = (data.amount / maxSales) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center group relative z-10">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 scale-0 group-hover:scale-100 bg-slate-950 text-[10px] font-bold text-white py-1.5 px-2.5 rounded border border-slate-800 shadow-md transition-transform origin-bottom duration-200 pointer-events-none whitespace-nowrap z-50">
                      {formatRupiah(data.amount)}
                    </div>
                    {/* Visual Bar component */}
                    <div
                      className="w-full max-w-[40px] rounded-t-md bg-gradient-to-t from-primary/40 to-primary group-hover:from-primary/60 group-hover:to-primary/95 transition-all duration-300 cursor-pointer"
                      style={{ height: `${Math.max(heightPercentage, 4)}%` }}
                    />
                  </div>
                );
              })}

              {/* Background Grid Horizontal Guidelines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="border-t border-slate-850/50 w-full" />
                <div className="border-t border-slate-850/50 w-full" />
                <div className="border-t border-slate-850/50 w-full" />
              </div>
            </div>

            {/* X-Axis labels */}
            <div className="flex justify-between items-center px-2 pt-2 text-[10px] font-semibold text-slate-400">
              {monthlySales.map((data, index) => (
                <span key={index} className="flex-1 text-center max-w-[40px]">{data.name}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions Sidebox */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-sm flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Order Terbaru</h3>
            <Link href="/admin/orders" className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5">
              Lihat Semua
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[220px] pr-1">
            {orders.slice(0, 5).map((order) => (
              <div key={order.orderId} className="flex items-center justify-between border-b border-slate-850/40 pb-3 last:border-b-0 last:pb-0">
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-slate-200 truncate">{order.customerName}</span>
                  <span className="block text-[10px] text-slate-500 font-mono mt-0.5">{order.orderId}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="block text-xs font-bold text-slate-100">{formatRupiah(order.grandTotal)}</span>
                  <span
                    className={`inline-block text-[9px] font-extrabold rounded px-1.5 py-0.5 mt-1 border ${
                      order.paymentStatus === 'PAID'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : order.paymentStatus === 'PENDING'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-8">
                <p className="text-xs">Belum ada order masuk.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminDashboard;
