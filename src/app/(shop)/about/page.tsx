import React from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Shield, Sparkles, Heart, Users } from 'lucide-react';

export const metadata = {
  title: 'Tentang Kami | Toko Online',
  description: 'Kenali lebih dekat Toko Online, penyedia perangkat teknologi terpercaya Anda.',
};

export default function AboutPage() {
  return (
    <div className="flex w-full flex-col">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50/30 py-16 text-center md:py-24 border-b border-slate-100">
        <Container className="flex max-w-3xl flex-col items-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Our Story
          </span>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl" style={{ color: '#0f172a' }}>
            Tentang <span style={{ color: '#2563EB' }}>Toko Online</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed md:text-lg" style={{ color: '#475569' }}>
            Kami adalah platform e-commerce teknologi terkemuka yang berdedikasi untuk menyediakan produk gadget dan perangkat komputer berkualitas tinggi, orisinal, dan bergaransi resmi.
          </p>
        </Container>
      </section>

      {/* Main Content */}
      <Section className="bg-white">
        <Container className="max-w-4xl">
          <div className="space-y-12">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-slate-950">Visi & Misi Kami</h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Visi kami adalah menjadi destinasi utama belanja kebutuhan teknologi di Indonesia yang diakui atas keaslian produk dan keunggulan layanan pelanggan. Kami berkomitmen untuk mendemokrasikan teknologi dengan memberikan akses mudah ke perangkat keras dan aksesoris komputer terbaik untuk meningkatkan produktivitas dan gaya hidup digital Anda.
              </p>
            </div>

            {/* Core Values */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-slate-950">Nilai-Nilai Utama</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex gap-4 p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">100% Original & Terpercaya</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Kami hanya menjual produk asli langsung dari distributor resmi dengan jaminan garansi penuh.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Inovasi Berkelanjutan</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Kami selalu memperbarui katalog kami dengan teknologi terbaru untuk memastikan Anda mendapatkan produk modern.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Fokus pada Pelanggan</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Kepuasan pelanggan adalah prioritas utama kami. Tim dukungan kami siap melayani Anda dengan ramah dan responsif.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Komunitas Tech</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Kami mendukung pertumbuhan komunitas kreator, gamer, dan profesional IT dengan menyediakan perangkat pendukung terbaik.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Journey */}
            <div className="border-t border-slate-150 pt-8">
              <h2 className="mb-4 text-2xl font-bold text-slate-950">Perjalanan Kami</h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-4">
                Didirikan pada tahun 2026, Toko Online bermula dari sebuah inisiatif kecil untuk menjembatani kesenjangan akses produk gadget premium dengan harga yang kompetitif bagi masyarakat. Berkat kepercayaan dari ribuan pelanggan, kami terus bertumbuh dan berekspansi menjadi salah satu e-commerce andalan untuk kebutuhan laptop, keyboard mekanikal, mouse nirkabel, dan perangkat audio.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                Kami berterima kasih atas dukungan setia Anda dan berkomitmen untuk terus meningkatkan kualitas pelayanan kami dari hari ke hari.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
