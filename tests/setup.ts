import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Global mocks for Next.js router navigation hooks
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return {
      get: () => null,
    };
  },
}));
