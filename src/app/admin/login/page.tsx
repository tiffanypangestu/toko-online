'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { createAuditLog } from '@/services/audit.service';
import { ShieldAlert, KeyRound, Mail } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Harap isi semua kolom login.');
      return;
    }

    setLoading(true);

    // Hardcoded authentication check
    if (email.trim() === 'admin@example.com' && password === 'admin123') {
      toast.success('Login berhasil! Mengalihkan...');
      
      // Determine session cookie lifetime
      const maxAge = rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24; // 7 days vs 1 day
      
      // Set session cookie client-side
      document.cookie = `admin_session=true; path=/; max-age=${maxAge}; SameSite=Strict`;
      
      // Record Audit Log
      await createAuditLog({
        action: 'ADMIN_LOGIN',
        user: email.trim(),
        ipAddress: 'client-browser',
        description: 'Super admin login success',
      });

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/admin/dashboard');
        router.refresh();
      }, 800);
    } else {
      toast.error('Email atau Password salah.');
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden animate-in fade-in duration-300">
        
        {/* Header Branding */}
        <div className="p-6 text-center border-b border-slate-700/60 bg-slate-800/40">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-primary/10 text-primary rounded-xl">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">
            Admin Panel Login
          </h1>
          <p className="mt-1.5 text-xs text-slate-400">
            Masuk untuk mengelola produk dan order toko online.
          </p>
        </div>

        {/* Input Login Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="email-input">
              Alamat Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                id="email-input"
                type="email"
                placeholder="Contoh: admin@example.com"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none transition-colors"
                aria-label="Email Address"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="password-input">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <KeyRound className="h-4 w-4" />
              </span>
              <input
                id="password-input"
                type="password"
                placeholder="••••••••"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none transition-colors"
                aria-label="Password"
              />
            </div>
          </div>

          {/* Remember me selection */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-slate-400 select-none cursor-pointer">
              <input
                type="checkbox"
                disabled={loading}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary/20 cursor-pointer"
              />
              <span>Remember Me</span>
            </label>
          </div>

          {/* Login button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-bold bg-primary hover:bg-primary/95 text-white"
          >
            {loading ? 'Mengautentikasi...' : 'Masuk ke Dashboard'}
          </Button>
        </form>
      </div>
    </div>
  );
}
