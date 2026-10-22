import { test, expect } from '@playwright/test';

// TASK 1 — Search for pliers
test('search for pliers shows 4 products', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');
  const searchBox = page.locator('[data-test="search-query"]');
  await searchBox.dblclick();
  await searchBox.fill('Pliers');
  await expect(searchBox).toHaveValue('Pliers');
  await page.locator('[data-test="search-submit"]').click();
  const products = page.getByTestId('search-result-count')
  await expect(products).toContainText('4');
});

// TASK 2 — Filter the catalog to hammers
test('filter catalog to hammers shows 7 products', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');
  const hammerCheckbox = page.getByRole('checkbox', { name: /Hammer/i });
  await hammerCheckbox.check();
  await expect(hammerCheckbox).toBeChecked();
  const products = page.locator('[data-test="filter_completed"] > a');
  await expect(products).toHaveCount(7);
  await hammerCheckbox.uncheck();
  await expect(hammerCheckbox).not.toBeChecked();
});

// TASK 3 — Sort products by name
test('sort products by name shows Adjustable Wrench first', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');
  await page.locator('select').selectOption({ label: 'Name (A - Z)' });
  const titles = page.locator('.card-title');
  await expect(titles).toHaveCount(9);
  await expect(titles.first()).toContainText('Adjustable Wrench');
  await expect(titles.first()).toHaveClass(/card-title/);
});

// TASK 4 — Inspect product and add two items to cart
test('inspect Combination Pliers and add 2 to cart', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');
  await page.getByText('Combination Pliers').click();
  await expect(page.getByRole('heading', { level: 1, name: /Combination Pliers/i })).toBeVisible();
  const quantity = page.locator('[data-test="quantity"]');
  await expect(quantity).toHaveValue('1');
  await page.locator('[data-test="increase-quantity"]').click();
  await expect(quantity).toHaveValue('2');
  await page.locator('[data-test="add-to-cart"]').click();
  const alert = page.locator('#toast-container');
  await expect(alert).toContainText('Product added to shopping cart');
  const cartNumber = page.locator('[data-test="cart-quantity"]')
  await expect(cartNumber).toBeVisible();
  await expect(cartNumber).toContainText('2');
});
