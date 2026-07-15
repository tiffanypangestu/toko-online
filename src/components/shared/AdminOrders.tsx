'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db, isFirebaseConfigured } from '@/firebase/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Order } from '@/types/order';
import { formatRupiah } from '@/utils/format';
import { Button } from '../ui/Button';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    // Realtime orders listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ordList: Order[] = [];
        snapshot.forEach((docSnap) => {
          ordList.push({ id: docSnap.id, ...docSnap.data() } as Order);
        });
        setOrders(ordList);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching admin orders list:', err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // Search and Filter logic
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.orderId.toLowerCase().includes(search.toLowerCase()) ||
        order.customerName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.paymentStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });

  // Pagination processing
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  // Reset page number on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // Status badge styling helper
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
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-extrabold text-white">Daftar Transaksi</h1>
        <p className="text-xs text-slate-400">Total {orders.length} order terekam dalam database.</p>
      </div>

      {/* Filter panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-slate-800 bg-slate-900/60 p-4 rounded-xl">
        {/* Search Input */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Cari Order ID atau nama customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-primary focus:outline-none"
            aria-label="Cari transaksi"
          />
        </div>

        {/* Status selection */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-primary focus:outline-none"
          aria-label="Filter status pembayaran"
        >
          <option value="all">Semua Status</option>
          <option value="PENDING">PENDING</option>
          <option value="PAID">PAID</option>
          <option value="FAILED">FAILED</option>
          <option value="CANCELLED">CANCELLED</option>
          <option value="EXPIRED">EXPIRED</option>
        </select>
      </div>

      {/* Orders Data Grid Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
        <table className="w-full border-collapse text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-semibold select-none">
            <tr className="border-b border-slate-800">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Grand Total</th>
              <th className="px-6 py-4">Status Pembayaran</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4"><LoadingSkeleton variant="text" className="w-28" /></td>
                  <td className="px-6 py-4"><LoadingSkeleton variant="text" className="w-36" /></td>
                  <td className="px-6 py-4"><LoadingSkeleton variant="text" className="w-24" /></td>
                  <td className="px-6 py-4"><LoadingSkeleton variant="text" className="w-20" /></td>
                  <td className="px-6 py-4"><LoadingSkeleton variant="text" className="w-20" /></td>
                  <td className="px-6 py-4"><LoadingSkeleton variant="text" className="w-12 mx-auto" /></td>
                </tr>
              ))
            ) : currentItems.map((order) => (
              <tr key={order.orderId} className="hover:bg-slate-850/30 transition-colors">
                {/* Order ID */}
                <td className="px-6 py-4 font-bold text-white font-mono whitespace-nowrap">
                  {order.orderId}
                </td>
                
                {/* Customer name */}
                <td className="px-6 py-4 font-semibold text-slate-200">
                  {order.customerName}
                </td>

                {/* Date */}
                <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>

                {/* Grand Total */}
                <td className="px-6 py-4 font-extrabold text-white whitespace-nowrap">
                  {formatRupiah(order.grandTotal)}
                </td>

                {/* Status badge */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-block text-[9px] font-extrabold rounded px-2 py-0.5 border ${getStatusBadgeClass(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </td>

                {/* View Details action */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <Link href={`/admin/orders/${order.id}`}>
                    <button className="p-1.5 rounded bg-slate-800 text-blue-400 hover:bg-slate-700 hover:text-blue-300 transition-all" aria-label="Lihat detail order">
                      <Eye className="h-4 w-4" />
                    </button>
                  </Link>
                </td>
              </tr>
            ))}

            {!loading && currentItems.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  Tidak ada data transaksi ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer controls */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs select-none">
          <span className="text-slate-400 font-medium">
            Menampilkan <span className="text-white font-bold">{indexOfFirstItem + 1}</span> -{' '}
            <span className="text-white font-bold">{Math.min(indexOfLastItem, totalItems)}</span> dari{' '}
            <span className="text-white font-bold">{totalItems}</span> Order
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
export default AdminOrders;
