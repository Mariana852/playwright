import { expect, test } from '@playwright/test';

import { HomePage } from '../pages/HomePage';

test.describe('Shopping cart', () => {
  test('adds Combination Pliers and Bolt Cutters', async ({ page }) => {
    const home = new HomePage(page);

    await home.goto();

    // A new browser context starts with an empty cart.
    await home.expectCartCount(0);

    await home.addItemToCart('Combination Pliers');
    await home.addItemToCart('Bolt Cutters');

    await home.expectCartCount(2);
    await home.cartLink.click();
    await expect(page.locator('[data-test="product-title"]')).toHaveText([
      'Combination Pliers',
      'Bolt Cutters',
    ]);
  });

  test('removes one of two items', async ({ page }) => {
    const home = new HomePage(page);

    await home.addItemToCart('Combination Pliers');
    await home.addItemToCart('Pliers');
    await home.expectCartCount(2);

    await home.removeItemFromCart();
    await home.expectCartCount(1);
    await expect(page.locator('[data-test="product-title"]')).toHaveText(['Pliers']);
  });
});
