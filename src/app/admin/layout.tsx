'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  ShoppingBag,
  Receipt,
  LogOut,
  Menu,
  X,
  User,
  Shield,
} from 'lucide-react';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

function SidebarItem({ href, icon, label, active, onClick }: SidebarItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-200 ${
        active
          ? 'bg-primary text-white shadow-md shadow-primary/25'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // If path is login, bypass layout entirely
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    // Clear session cookie client-side
    document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    toast.success('Logout berhasil.');
    
    // Redirect to login
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    {
      href: '/admin/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: 'Dashboard',
    },
    {
      href: '/admin/products',
      icon: <ShoppingBag className="h-5 w-5" />,
      label: 'Produk',
    },
    {
      href: '/admin/orders',
      icon: <Receipt className="h-5 w-5" />,
      label: 'Order',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* 1. SIDEBAR (Desktop Fixed View) */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shrink-0 select-none">
        {/* Brand header */}
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-850">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-extrabold text-white tracking-wider">ADMIN PORTAL</span>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname.startsWith(item.href)}
            />
          ))}
        </nav>

        {/* Footer Logout button */}
        <div className="p-4 border-t border-slate-850">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full rounded-lg px-4 py-3 text-sm font-semibold text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* 2. DRAWER SIDEBAR (Mobile Slide-in Drawer) */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`lg:hidden fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-850">
          <div className="flex items-center gap-2.5">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-extrabold text-white tracking-wider text-sm">ADMIN PORTAL</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname.startsWith(item.href)}
              onClick={() => setSidebarOpen(false)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-850">
          <button
            onClick={() => {
              setSidebarOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-3 w-full rounded-lg px-4 py-3 text-sm font-semibold text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* 3. MAIN CONTENT FRAME */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar navigation panel */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-10 select-none">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white focus:outline-none"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="font-bold text-lg text-white">
              {pathname.includes('/dashboard')
                ? 'Dashboard Analitik'
                : pathname.includes('/products')
                ? 'Manajemen Produk'
                : pathname.includes('/orders')
                ? 'Manajemen Transaksi'
                : 'Portal Admin'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-white">Super Administrator</span>
              <span className="text-[10px] text-slate-400">admin@example.com</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-300">
              <User className="h-4 w-4" />
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 p-6 overflow-y-auto bg-slate-950">
          {children}
        </main>

        {/* Footer info banner */}
        <footer className="h-12 bg-slate-900 border-t border-slate-850 flex items-center justify-between px-6 text-[10px] sm:text-xs text-slate-500">
          <span>&copy; 2026 Toko Online Portal. All rights reserved.</span>
          <span>Version 1.0.0 (MVP)</span>
        </footer>
      </div>
    </div>
  );
}
