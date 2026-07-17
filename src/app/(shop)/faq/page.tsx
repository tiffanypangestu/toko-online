import React from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'FAQ | Toko Online',
  description: 'Pertanyaan umum yang sering ditanyakan pelanggan Toko Online.',
};

export default function FAQPage() {
  const faqs = [
    {
      category: 'Pemesanan & Stok',
      questions: [
        {
          q: 'Bagaimana cara melakukan pemesanan di Toko Online?',
          a: 'Cari produk yang Anda inginkan di halaman Produk, klik tombol "Beli" untuk memasukkannya ke keranjang belanja, masuk ke halaman Keranjang, lalu klik "Checkout". Isi data pengiriman dengan benar dan selesaikan pembayaran.',
        },
        {
          q: 'Apakah semua produk yang ditampilkan selalu ready stock?',
          a: 'Sistem kami terhubung secara realtime dengan database Firestore. Jumlah stok yang tertera di halaman detail produk adalah akurat. Jika stok habis, tombol "Beli" otomatis dinonaktifkan.',
        },
      ],
    },
    {
      category: 'Pembayaran',
      questions: [
        {
          q: 'Metode pembayaran apa saja yang tersedia?',
          a: 'Kami menerima pembayaran aman melalui Midtrans (Transfer Bank, QRIS, dll) dan juga metode pembayaran instan menggunakan Saldo Toko Anda.',
        },
        {
          q: 'Bagaimana cara menggunakan Saldo Toko?',
          a: 'Gunakan saldo akun Anda untuk membayar belanjaan secara instan di checkout. Anda dapat melihat dan mengisi ulang (Top Up) Saldo Toko langsung dari menu saldo di Navbar.',
        },
      ],
    },
    {
      category: 'Pengiriman & Ongkir',
      questions: [
        {
          q: 'Berapa biaya pengiriman barang?',
          a: 'Ongkos kirim dihitung secara otomatis saat Anda melakukan checkout berdasarkan alamat pengiriman Anda.',
        },
        {
          q: 'Berapa lama waktu pengiriman?',
          a: 'Pesanan biasanya diproses dalam waktu 24 jam setelah pembayaran dikonfirmasi. Pengiriman ke area Jabodetabek memakan waktu 1-2 hari kerja, sedangkan luar kota/pulau sekitar 3-5 hari kerja.',
        },
      ],
    },
    {
      category: 'Garansi & Pengembalian',
      questions: [
        {
          q: 'Apakah produk memiliki garansi?',
          a: 'Ya, seluruh produk gadget dan komputer di Toko Online dijamin 100% original dan dilindungi oleh garansi resmi distributor masing-masing (umumnya 1 hingga 2 tahun).',
        },
        {
          q: 'Bagaimana kebijakan pengembalian barang?',
          a: 'Pengembalian barang hanya diterima jika produk mengalami cacat pabrik atau salah kirim, wajib disertai video unboxing lengkap tanpa edit maksimal 2x24 jam sejak barang diterima.',
        },
      ],
    },
  ];

  return (
    <div className="flex w-full flex-col">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-16 text-center text-white md:py-24">
        <Container className="flex max-w-3xl flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center bg-blue-500/20 text-blue-300 rounded-full">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            Pusat Bantuan <span className="text-blue-400">FAQ</span>
          </h1>
          <p className="max-w-xl text-base text-slate-300 leading-relaxed md:text-lg">
            Temukan jawaban cepat untuk pertanyaan-pertanyaan yang paling sering diajukan seputar pemesanan, pengiriman, pembayaran, dan garansi.
          </p>
        </Container>
      </section>

      {/* Main Content */}
      <Section className="bg-slate-50">
        <Container className="max-w-4xl">
          <div className="space-y-10">
            {faqs.map((cat, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 border-l-4 border-primary pl-3 uppercase tracking-wider">
                  {cat.category}
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {cat.questions.map((faq, fIdx) => (
                    <div
                      key={fIdx}
                      className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-sm font-bold text-slate-900 mb-2">
                        {faq.q}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
