import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { FeaturedProducts } from '@/components/shared/FeaturedProducts';
import { FAQAccordion } from '@/components/shared/FAQAccordion';
import { Truck, ShieldCheck, Lock, Headphones, ArrowRight } from 'lucide-react';
import { seedProductsIfEmpty } from '@/services/seedProducts';

import Image from 'next/image';

export const metadata = {
  title: 'Home | Toko Online',
  description: 'Belanja produk teknologi terbaik dengan pembayaran aman.',
};

export default async function HomePage() {
  // Seed data otomatis jika collection kosong di Firestore
  try {
    await seedProductsIfEmpty();
  } catch (error) {
    console.error('Failed to run seeder on home page load:', error);
  }

  return (
    <div className="flex w-full flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50/30 py-20 lg:py-32">
        <Container className="grid grid-cols-1 gap-12 items-center lg:grid-cols-12">
          <div className="flex flex-col items-start text-left lg:col-span-6">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Gadget & Tech Store
            </span>
            <h1 className="mb-6 text-4xl font-black tracking-tight text-slate-900 leading-none md:text-5xl lg:text-6xl">
              Toko Online <span className="text-primary">Modern</span>
            </h1>
            <p className="mb-8 max-w-xl text-lg text-slate-600 leading-relaxed md:text-xl">
              Belanja kebutuhan teknologi dengan mudah, aman, dan cepat. Temukan koleksi gadget terbaik dengan garansi resmi.
            </p>
            <div className="flex w-full flex-wrap gap-4 sm:w-auto">
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="group flex w-full items-center justify-center gap-2" variant="primary">
                  Belanja Sekarang
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Hubungi Kami
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center lg:col-span-6">
            <div className="relative aspect-[4/3] w-full max-w-lg overflow-hidden bg-white border border-slate-100 shadow-2xl rounded-2xl">
              <Image
                src="https://placehold.co/600x450?text=Toko+Online+Illustration"
                alt="Toko Online Modern"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 2. FEATURED PRODUCTS */}
      <Section className="bg-white">
        <Container>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">
              Produk Pilihan
            </h2>
            <p className="text-slate-500">
              Temukan koleksi perangkat teknologi terbaik pilihan kami, dikurasi khusus untuk meningkatkan produktivitas Anda.
            </p>
          </div>

          <FeaturedProducts />
        </Container>
      </Section>

      {/* 3. KEUNGGULAN SECTION */}
      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">
              Mengapa Memilih Kami
            </h2>
            <p className="text-slate-500">
              Kami berkomitmen untuk memberikan pengalaman belanja online produk teknologi terbaik untuk Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Gratis Ongkir */}
            <div className="flex flex-col items-start border border-slate-100 bg-white p-6 rounded-xl shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center bg-primary/10 text-primary rounded-lg">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-800">Gratis Ongkir</h3>
              <p className="text-sm leading-relaxed text-slate-500">
                Nikmati gratis ongkos kirim ke seluruh wilayah Indonesia untuk setiap pembelian nominal tertentu.
              </p>
            </div>

            {/* Produk Original */}
            <div className="flex flex-col items-start border border-slate-100 bg-white p-6 rounded-xl shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center bg-primary/10 text-primary rounded-lg">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-800">Produk Original</h3>
              <p className="text-sm leading-relaxed text-slate-500">
                Semua produk yang kami sediakan dijamin 100% original langsung dari distributor resmi dengan garansi penuh.
              </p>
            </div>

            {/* Pembayaran Aman */}
            <div className="flex flex-col items-start border border-slate-100 bg-white p-6 rounded-xl shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center bg-primary/10 text-primary rounded-lg">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-800">Pembayaran Aman</h3>
              <p className="text-sm leading-relaxed text-slate-500">
                Sistem transaksi online terenkripsi yang aman terintegrasi dengan payment gateway terpercaya.
              </p>
            </div>

            {/* Customer Support */}
            <div className="flex flex-col items-start border border-slate-100 bg-white p-6 rounded-xl shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center bg-primary/10 text-primary rounded-lg">
                <Headphones className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-800">Customer Support</h3>
              <p className="text-sm leading-relaxed text-slate-500">
                Tim support kami siap membantu menjawab setiap keluhan dan pertanyaan Anda dengan ramah dan responsif.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. CARA BELANJA */}
      <Section className="bg-white">
        <Container>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">
              Cara Berbelanja
            </h2>
            <p className="text-slate-500">
              Proses mudah dan aman berbelanja perangkat teknologi impian Anda dalam hitungan menit.
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center bg-primary font-bold text-lg text-white rounded-full">
                1
              </div>
              <h3 className="mb-2 text-base font-semibold text-slate-800">Pilih Produk</h3>
              <p className="max-w-xs text-xs leading-relaxed text-slate-500 md:text-sm">
                Cari dan telusuri produk teknologi yang Anda butuhkan di katalog kami.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center bg-primary font-bold text-lg text-white rounded-full">
                2
              </div>
              <h3 className="mb-2 text-base font-semibold text-slate-800">Masukkan Keranjang</h3>
              <p className="max-w-xs text-xs leading-relaxed text-slate-500 md:text-sm">
                Tambahkan produk pilihan Anda ke dalam keranjang belanja.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center bg-primary font-bold text-lg text-white rounded-full">
                3
              </div>
              <h3 className="mb-2 text-base font-semibold text-slate-800">Checkout</h3>
              <p className="max-w-xs text-xs leading-relaxed text-slate-500 md:text-sm">
                Isi data pengiriman barang beserta alamat pengiriman Anda dengan benar.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center bg-primary font-bold text-lg text-white rounded-full">
                4
              </div>
              <h3 className="mb-2 text-base font-semibold text-slate-800">Bayar</h3>
              <p className="max-w-xs text-xs leading-relaxed text-slate-500 md:text-sm">
                Pilih metode pembayaran aman dan lakukan pelunasan transaksi Anda.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 5. FAQ SECTION */}
      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">
              Pertanyaan Umum (FAQ)
            </h2>
            <p className="text-slate-500">
              Butuh informasi lebih lanjut? Berikut daftar pertanyaan yang paling sering diajukan pelanggan kami.
            </p>
          </div>

          <FAQAccordion />
        </Container>
      </Section>

      {/* 6. CTA SECTION */}
      <section className="bg-primary py-16 text-center text-white md:py-24">
        <Container className="flex max-w-4xl flex-col items-center">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight leading-none md:text-4xl">
            Siap Belanja?
          </h2>
          <p className="mb-8 max-w-xl text-base text-blue-100 leading-relaxed md:text-lg">
            Dapatkan penawaran harga menarik dan nikmati berbagai promo eksklusif untuk gadget serta produk teknologi idaman Anda sekarang.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="flex items-center gap-2 font-bold"
          >
            Lihat Semua Produk
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Container>
      </section>
    </div>
  );
}
