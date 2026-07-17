import React from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Kebijakan Privasi | Toko Online',
  description: 'Kebijakan Privasi perlindungan data pribadi pengguna Toko Online.',
};

export default function PrivacyPage() {
  return (
    <div className="flex w-full flex-col">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-12 text-center text-white md:py-16">
        <Container className="flex max-w-3xl flex-col items-center">
          <div className="mb-4 flex h-10 w-10 items-center justify-center bg-blue-500/20 text-blue-300 rounded-full">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight md:text-4xl">
            Kebijakan Privasi
          </h1>
          <p className="max-w-xl text-sm text-slate-300 leading-relaxed">
            Terakhir diperbarui: 17 Juli 2026. Kami berkomitmen untuk melindungi dan menghormati hak privasi data pribadi Anda.
          </p>
        </Container>
      </section>

      {/* Main content */}
      <Section className="bg-white">
        <Container className="max-w-3xl">
          <div className="prose prose-slate max-w-none text-slate-600 space-y-6 text-sm leading-relaxed">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">1. Informasi yang Kami Kumpulkan</h2>
              <p>
                Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami ketika melakukan transaksi, pendaftaran, pengiriman formulir kontak, atau saat berkomunikasi dengan tim layanan pelanggan kami. Informasi ini meliputi:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Nama lengkap</li>
                <li>Alamat email</li>
                <li>Nomor telepon / kontak WhatsApp</li>
                <li>Alamat pengiriman fisik (termasuk kota, provinsi, dan kode pos)</li>
                <li>Detail pesanan belanjaan Anda</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">2. Penggunaan Informasi Anda</h2>
              <p>
                Informasi yang kami kumpulkan digunakan untuk tujuan-tujuan berikut:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Memproses transaksi belanja dan mengirimkan produk pesanan Anda.</li>
                <li>Mengelola saldo ("Saldo Toko") dan transaksi keuangan Anda di platform kami.</li>
                <li>Menghubungi Anda terkait status pengiriman atau konfirmasi pesanan.</li>
                <li>Menanggapi keluhan, pertanyaan, atau masukan yang Anda kirimkan melalui formulir kontak.</li>
                <li>Mematuhi kewajiban hukum dan regulasi yang berlaku.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">3. Keamanan Data</h2>
              <p>
                Kami menerapkan langkah-langkah teknis dan organisasional yang dirancang untuk mengamankan informasi pribadi Anda dari kehilangan yang tidak disengaja, akses tanpa izin, perubahan, dan pengungkapan. Pembayaran online diproses menggunakan payment gateway terenkripsi (Midtrans) yang memenuhi standar kepatuhan PCI-DSS.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">4. Hak-Hak Anda</h2>
              <p>
                Anda berhak untuk meminta akses ke data pribadi Anda yang kami simpan, meminta koreksi atas kesalahan data, atau meminta penghapusan data Anda dari sistem kami jika tidak ada kewajiban hukum yang mengharuskan kami untuk menyimpannya.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">5. Hubungi Kami</h2>
              <p>
                Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini atau tentang bagaimana kami mengelola data pribadi Anda, silakan hubungi kami melalui halaman Kontak atau mengirimkan email ke <span className="font-semibold text-slate-950">privacy@tokoonline.com</span>.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
