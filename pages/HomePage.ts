import { expect, Locator, Page } from '@playwright/test';

export class HomePage {
  readonly cartLink: Locator;
  readonly cartQuantity: Locator;
  readonly sortDropdown: Locator;
  readonly productLinks: Locator;
  readonly visiblePrices: Locator;

  constructor(private readonly page: Page) {
    // These locators cover the main parts of the product page.
    // The site uses data-test, not Playwright's default data-testid.
    this.cartLink = page.locator('[data-test="nav-cart"]');
    this.cartQuantity = page.locator('[data-test="cart-quantity"]');
    this.sortDropdown = page.locator('[data-test="sort"]');
    this.productLinks = page.locator('a[data-test^="product-"]');
    this.visiblePrices = this.productLinks.locator('[data-test="product-price"]');
  }

  // Return to the product list before choosing an item.
  async goto(): Promise<void> {
    await this.page.goto('https://practicesoftwaretesting.com/');
    await expect(this.productLinks.first()).toBeVisible();
  }

  // Open the selected product and add it to the cart.
  async addItemToCart(productName: string): Promise<void> {
    await this.goto();
    const currentCount = await this.cartQuantity.count()
      ? Number(await this.cartQuantity.textContent())
      : 0;
    await this.productLinks.filter({
      has: this.page.getByText(productName, { exact: true }),
    }).click();
    await expect(this.page.locator('h1[data-test="product-name"]')).toHaveText(productName);
    await this.page.locator('[data-test="add-to-cart"]').click();
    await this.expectCartCount(currentCount + 1);
  }

  // Open the cart and remove its first item.
  async removeItemFromCart(): Promise<void> {
    await this.cartLink.click();
    const rows = this.page.getByRole('row').filter({
      has: this.page.locator('[data-test="product-title"]'),
    });
    await expect(rows.first()).toBeVisible();
    const previousCount = await rows.count();
    // The remove control is an anchor without an accessible name or data-test.
    await rows.first().locator('a.btn-danger').click();
    await expect(rows).toHaveCount(previousCount - 1);
  }

  // Check the visible cart count without relying on the whole link's wording.
  async expectCartCount(count: number): Promise<void> {
    if (count === 0) {
      // The cart link and badge are absent when the cart is empty.
      await expect(this.cartLink).toBeHidden();
      return;
    }
    await expect(this.cartQuantity).toHaveText(String(count));
  }
}
