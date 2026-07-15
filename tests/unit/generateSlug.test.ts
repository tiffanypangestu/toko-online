import { describe, it, expect } from 'vitest';
import { generateSlug } from '@/utils/generateSlug';

describe('generateSlug helper function', () => {
  it('converts mixed-case names to lowercase slugs', () => {
    expect(generateSlug('Asus ROG Strix')).toBe('asus-rog-strix');
  });

  it('replaces spaces and underscores with hyphens', () => {
    expect(generateSlug('Laptop_Gaming ASUS')).toBe('laptop-gaming-asus');
  });

  it('strips punctuation and special characters', () => {
    expect(generateSlug('iPhone 15 Pro Max! (1TB)')).toBe('iphone-15-pro-max-1tb');
  });

  it('removes trailing and leading hyphens', () => {
    expect(generateSlug('--Samsung Galaxy S24--')).toBe('samsung-galaxy-s24');
  });
});
