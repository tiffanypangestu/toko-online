import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Container } from '../layout/Container';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-slate-400">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <span>
                Toko<span className="text-primary">Online</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed">
              Toko Online modern terpercaya untuk segala macam kebutuhan perangkat teknologi Anda. Berbelanja aman, cepat, dan terjamin orisinalitasnya.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white">
              Belanja
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Laptop
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Keyboard
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Mouse
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Headset
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white">
              Perusahaan
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-slate-800" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs md:flex-row md:text-sm">
          <p>&copy; {currentYear} Toko Online. Hak Cipta Dilindungi.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">
              Facebook
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Instagram
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Twitter
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
export default Footer;
