import { describe, it, expect } from 'vitest';
import { formatRupiah } from '@/utils/format';

describe('formatRupiah helper function', () => {
  it('formats positive numbers as Rupiah correctly', () => {
    expect(formatRupiah(18500000).replace(/\s/g, '')).toBe('Rp18.500.000');
    expect(formatRupiah(20000).replace(/\s/g, '')).toBe('Rp20.000');
    expect(formatRupiah(0).replace(/\s/g, '')).toBe('Rp0');
  });

  it('formats decimal numbers by rounding them', () => {
    expect(formatRupiah(12500.5).replace(/\s/g, '')).toBe('Rp12.501');
  });
});
