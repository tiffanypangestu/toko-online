'use client';

import React, { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { submitContact } from '@/services/contact.service';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      toast.error('Harap isi semua kolom form kontak.');
      return;
    }

    try {
      setLoading(true);
      await submitContact({ name, email, message });
      toast.success('Pesan Anda berhasil terkirim! Terima kasih.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Gagal mengirim pesan. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-16 text-center text-white md:py-24">
        <Container className="flex max-w-3xl flex-col items-center">
          <span className="mb-4 inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300">
            Hubungi Kami
          </span>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl">
            Ada Pertanyaan?
          </h1>
          <p className="max-w-xl text-base text-slate-300 leading-relaxed md:text-lg">
            Kami siap mendengarkan saran, kritik, pertanyaan, atau keluhan Anda. Kirimkan pesan Anda melalui formulir di bawah ini.
          </p>
        </Container>
      </section>

      {/* Contact Content Grid */}
      <Section className="bg-white">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Sidebar Info */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-950 mb-3">Informasi Kontak</h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Hubungi kami secara langsung melalui kontak di bawah ini, atau kunjungi kantor pusat kami.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Telepon & WhatsApp</h4>
                    <p className="text-xs text-slate-500 mt-0.5">+62 812-3456-7890</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Email Resmi</h4>
                    <p className="text-xs text-slate-500 mt-0.5">support@tokoonline.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">Kantor Pusat</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Jl. Kebon Jeruk No. 45, Jakarta Barat, DKI Jakarta, 11530, Indonesia
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-100 bg-slate-50/50 p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Formulir Pesan</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="contact-name">
                    Nama Lengkap
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Masukkan nama lengkap Anda"
                    required
                    disabled={loading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="contact-email">
                    Alamat Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="Masukkan alamat email aktif"
                    required
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="contact-message">
                    Pesan Anda
                  </label>
                  <textarea
                    id="contact-message"
                    placeholder="Tuliskan pesan, pertanyaan, atau saran Anda..."
                    required
                    rows={4}
                    disabled={loading}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-xs font-bold bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-2"
                >
                  <Send className="h-3.5 w-3.5" />
                  {loading ? 'Mengirim...' : 'Kirim Pesan'}
                </Button>
              </form>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
