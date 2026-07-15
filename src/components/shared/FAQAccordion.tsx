'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Apakah produk original?',
    answer: 'Ya, semua produk yang kami jual dijamin 100% original langsung dari distributor resmi dan dilengkapi dengan garansi pabrik.',
  },
  {
    question: 'Bagaimana pembayaran?',
    answer: 'Kami menyediakan pembayaran modern yang praktis dan aman menggunakan Bank Transfer (Virtual Account), E-Wallet (GoPay, OVO, ShopeePay), serta kartu kredit melalui sistem payment gateway Midtrans Sandbox.',
  },
  {
    question: 'Apakah bisa retur?',
    answer: 'Tentu bisa. Kami menyediakan kebijakan retur barang selama maksimal 7 hari setelah pesanan diterima jika terjadi cacat produksi atau kerusakan selama proses pengiriman.',
  },
  {
    question: 'Berapa lama pengiriman?',
    answer: 'Estimasi pengiriman berkisar antara 1-3 hari kerja untuk wilayah Jabodetabek, dan 3-7 hari kerja untuk wilayah di luar itu, tergantung jenis ekspedisi yang Anda pilih.',
  },
  {
    question: 'Bagaimana menghubungi admin?',
    answer: 'Anda dapat menghubungi tim customer support kami melalui chat WhatsApp interaktif di jam operasional (08.00 - 20.00 WIB) dengan menekan tombol "Hubungi Kami" di bagian atas halaman.',
  },
];

export function FAQAccordion() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {faqData.map((item, index) => {
        const isOpen = activeIndex === index;
        return (
          <div
            key={index}
            className="overflow-hidden border border-slate-100 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left font-medium text-slate-800 hover:text-primary transition-colors focus:outline-none"
            >
              <span className="text-sm md:text-base font-semibold">{item.question}</span>
              <ChevronDown
                className={twMerge(
                  'h-5 w-5 text-slate-400 transition-transform duration-300',
                  isOpen && 'rotate-180 text-primary',
                )}
              />
            </button>
            <div
              className={twMerge(
                'transition-all duration-300 ease-in-out overflow-hidden',
                isOpen ? 'max-h-60 border-t border-slate-50' : 'max-h-0',
              )}
            >
              <p className="px-6 py-5 text-sm md:text-base leading-relaxed text-slate-600">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default FAQAccordion;
