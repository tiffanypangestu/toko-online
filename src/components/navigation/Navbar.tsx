'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag, ShoppingCart, Wallet, Plus, RefreshCw } from 'lucide-react';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useCart } from '@/hooks/useCart';
import { getBalance, topUpBalance } from '@/services/balance.service';
import { formatRupiah } from '@/utils/format';
import { toast } from 'sonner';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [email, setEmail] = useState('customer@example.com');
  const [tempEmail, setTempEmail] = useState('customer@example.com');
  const [balance, setBalance] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  // Load email and fetch balance on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('wallet_email');
      if (savedEmail) {
        setEmail(savedEmail);
        setTempEmail(savedEmail);
      } else {
        localStorage.setItem('wallet_email', 'customer@example.com');
      }
    }
  }, []);

  const fetchBalance = async (targetEmail: string) => {
    try {
      setRefreshing(true);
      const bal = await getBalance(targetEmail);
      setBalance(bal);
    } catch (err) {
      console.error('Error fetching balance:', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchBalance(email);
    }
  }, [email, mounted]);

  const handleUpdateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempEmail.trim()) {
      toast.error('Email tidak boleh kosong.');
      return;
    }
    setEmail(tempEmail.trim());
    localStorage.setItem('wallet_email', tempEmail.trim());
    toast.success(`Wallet beralih ke email: ${tempEmail.trim()}`);
  };

  const handleTopUp = async (amount: number) => {
    if (amount <= 0) return;
    try {
      setRefreshing(true);
      const newBal = await topUpBalance(email, amount);
      setBalance(newBal);
      toast.success(`Berhasil top up ${formatRupiah(amount)}!`);
    } catch (err) {
      console.error(err);
      toast.error('Gagal melakukan top up.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCustomTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(customAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Masukkan jumlah nominal yang valid.');
      return;
    }
    handleTopUp(amount);
    setCustomAmount('');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
          <ShoppingBag className="w-6 h-6 text-primary" />
          <span>
            Toko<span className="text-primary">Online</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
          >
            Produk
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
          >
            Tentang Kami
          </Link>


          {/* Saldo tracker */}
          {mounted && (
            <button
              onClick={() => setIsWalletOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50/50 px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-blue-100/50 transition-all duration-200"
            >
              <Wallet className="h-3.5 w-3.5" />
              <span>{formatRupiah(balance)}</span>
            </button>
          )}

          {/* Desktop Cart */}
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            aria-label={`Keranjang belanja, ${mounted ? totalItems : 0} item`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Keranjang</span>
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-white">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>



        {/* Mobile menu trigger */}
        <div className="flex items-center gap-3 md:hidden">
          {mounted && (
            <button
              onClick={() => setIsWalletOpen(true)}
              className="flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50/50 px-2.5 py-1 text-[11px] font-semibold text-primary"
            >
              <Wallet className="h-3.5 w-3.5" />
              <span>{formatRupiah(balance)}</span>
            </button>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer p-2 text-slate-600 hover:text-slate-950 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-b border-slate-100 bg-white md:hidden animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-4 p-6">
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Produk
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Tentang Kami
            </Link>


            {/* Mobile Cart */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label={`Keranjang belanja, ${mounted ? totalItems : 0} item`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Keranjang</span>
              {mounted && totalItems > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            <hr className="border-slate-100" />
          </nav>
        </div>
      )}

      {/* Saldo / Wallet Management Modal */}
      <Modal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        title="Dompet Saldo Toko"
      >
        <div className="space-y-6">
          {/* Active email info & change form */}
          <form onSubmit={handleUpdateEmail} className="space-y-2.5">
            <label className="block text-xs font-semibold text-slate-700" htmlFor="wallet-email-input">
              Email Wallet (Ganti untuk menguji akun lain)
            </label>
            <div className="flex gap-2">
              <input
                id="wallet-email-input"
                type="email"
                required
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                placeholder="Masukkan email Anda"
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none"
              />
              <Button type="submit" size="sm" variant="outline" className="text-xs">
                Hubungkan
              </Button>
            </div>
          </form>

          {/* Current balance display */}
          <div className="rounded-xl bg-slate-900 p-5 text-center text-white relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <button
                onClick={() => fetchBalance(email)}
                disabled={refreshing}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Refresh balance"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Saldo Aktif ({email})
            </span>
            <span className="text-2xl font-extrabold block tracking-tight">
              {formatRupiah(balance)}
            </span>
          </div>

          {/* Preset Top Up values */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-slate-700">Quick Top Up</span>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTopUp(100000)}
                disabled={refreshing}
                className="text-xs py-2 hover:bg-blue-50/50 hover:text-primary hover:border-blue-200"
              >
                + Rp 100.000
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTopUp(250000)}
                disabled={refreshing}
                className="text-xs py-2 hover:bg-blue-50/50 hover:text-primary hover:border-blue-200"
              >
                + Rp 250.000
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTopUp(500000)}
                disabled={refreshing}
                className="text-xs py-2 hover:bg-blue-50/50 hover:text-primary hover:border-blue-200"
              >
                + Rp 500.000
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTopUp(1000000)}
                disabled={refreshing}
                className="text-xs py-2 hover:bg-blue-50/50 hover:text-primary hover:border-blue-200"
              >
                + Rp 1.000.000
              </Button>
            </div>
          </div>

          {/* Custom top up input */}
          <form onSubmit={handleCustomTopUp} className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700" htmlFor="custom-amount-input">
              Nominal Top Up Custom (Rupiah)
            </label>
            <div className="flex gap-2">
              <input
                id="custom-amount-input"
                type="number"
                min="10000"
                step="10000"
                placeholder="Contoh: 150000"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none"
              />
              <Button type="submit" size="sm" variant="primary" className="text-xs flex gap-1 items-center">
                <Plus className="h-3 w-3" /> Top Up
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </header>
  );
}
export default Navbar;
