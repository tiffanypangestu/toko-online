'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag, ShoppingCart } from 'lucide-react';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';
import { useCart } from '@/hooks/useCart';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  useEffect(() => {
    setMounted(true);
  }, []);

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
        <nav className="hidden md:flex items-center gap-8">
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
            href="#"
            className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
          >
            Tentang Kami
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
          >
            Kontak
          </Link>

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

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button size="sm" variant="primary">
            Hubungi Kami
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer p-2 text-slate-600 hover:text-slate-950 focus:outline-none md:hidden"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
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
              href="#"
              className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Tentang Kami
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Kontak
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
            <Button
              size="sm"
              className="w-full"
              onClick={() => setIsOpen(false)}
            >
              Hubungi Kami
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
export default Navbar;
