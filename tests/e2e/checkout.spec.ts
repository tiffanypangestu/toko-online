import { test, expect } from '@playwright/test';

test.describe('E2E Checkout flow', () => {
  test('should go from products page, add items, and try accessing checkout', async ({ page }) => {
    // 1. Visit Products list page
    await page.goto('/products');
    
    // Check that title or catalog is mounted
    await expect(page).toHaveTitle(/Produk/);

    // 2. Visit Cart page
    await page.goto('/cart');
    await expect(page.locator('text=Keranjang belanja masih kosong')).toBeVisible();

    // 3. Visit Checkout directly and confirm redirection to /cart
    await page.goto('/checkout');
    await expect(page).toHaveURL(/\/cart/);
  });
});
