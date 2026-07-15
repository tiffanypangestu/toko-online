import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import ToastProvider from '@/components/shared/ToastProvider';
import PWARegister from '@/components/shared/PWARegister';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Toko Online MVP | E-Commerce Modern',
    template: '%s | Toko Online',
  },
  description: 'Temukan produk teknologi pilihan terbaik di Toko Online MVP. Transaksi mudah, cepat, dan aman.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'TokoOnline',
    statusBarStyle: 'default',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Toko Online MVP | E-Commerce Modern',
    description: 'Temukan produk teknologi pilihan terbaik di Toko Online MVP.',
    url: '/',
    siteName: 'Toko Online',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toko Online MVP | E-Commerce Modern',
    description: 'Temukan produk teknologi pilihan terbaik di Toko Online MVP.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen bg-slate-50 text-slate-900`}>
        <CartProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <ToastProvider />
          <PWARegister />
        </CartProvider>
      </body>
    </html>
  );
}
