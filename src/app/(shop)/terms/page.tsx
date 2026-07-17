import React from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Syarat & Ketentuan | Toko Online',
  description: 'Syarat & Ketentuan penggunaan situs dan layanan pembelian Toko Online.',
};

export default function TermsPage() {
  return (
    <div className="flex w-full flex-col">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-12 text-center text-white md:py-16">
        <Container className="flex max-w-3xl flex-col items-center">
          <div className="mb-4 flex h-10 w-10 items-center justify-center bg-blue-500/20 text-blue-300 rounded-full">
            <FileText className="h-5 w-5" />
          </div>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight md:text-4xl">
            Syarat & Ketentuan
          </h1>
          <p className="max-w-xl text-sm text-slate-300 leading-relaxed">
            Terakhir diperbarui: 17 Juli 2026. Harap baca syarat dan ketentuan ini secara saksama sebelum menggunakan layanan kami.
          </p>
        </Container>
      </section>

      {/* Main content */}
      <Section className="bg-white">
        <Container className="max-w-3xl">
          <div className="prose prose-slate max-w-none text-slate-600 space-y-6 text-sm leading-relaxed">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">1. Ketentuan Umum</h2>
              <p>
                Dengan mengakses dan melakukan pembelian di Toko Online, Anda secara otomatis menyatakan setuju untuk terikat oleh seluruh Syarat & Ketentuan yang tercantum di halaman ini. Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu tanpa pemberitahuan terlebih dahulu.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">2. Transaksi & Harga</h2>
              <p>
                Harga produk yang tercantum di situs ini adalah akurat dalam mata uang Rupiah (IDR). Kami berhak mengubah harga produk tanpa pemberitahuan terlebih dahulu. Transaksi dianggap sah apabila Anda telah menyelesaikan pembayaran dan status transaksi di sistem kami berubah menjadi &quot;PAID&quot;.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">3. Pembayaran & Saldo Toko</h2>
              <p>
                Kami menyediakan sistem pembayaran menggunakan pihak ketiga (payment gateway Midtrans) dan Saldo Toko internal.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Saldo Toko adalah saldo virtual yang hanya dapat digunakan untuk pembelian produk di platform kami.</li>
                <li>Pengguna dapat mengisi ulang (Top Up) saldo secara mandiri untuk kemudahan transaksi cepat.</li>
                <li>Saldo Toko tidak dapat diuangkan kembali (non-refundable) ke rekening bank pribadi.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">4. Pengiriman Barang</h2>
              <p>
                Pengiriman barang dilakukan ke alamat yang Anda masukkan saat checkout. Kami tidak bertanggung jawab atas keterlambatan atau kegagalan pengiriman yang disebabkan oleh kesalahan input alamat atau ketidakberadaan penerima di lokasi tujuan saat kurir mengantar barang.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">5. Garansi & Pengembalian</h2>
              <p>
                Semua produk elektronik dilindungi oleh garansi resmi distributor. Untuk pengajuan klaim retur barang cacat fisik atau salah kirim, pembeli wajib mengirimkan video unboxing utuh tanpa terputus dalam waktu 48 jam sejak paket diterima. Kami berhak menolak retur jika bukti video tidak lengkap.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
