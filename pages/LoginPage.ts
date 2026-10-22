import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(private readonly page: Page) {
    // Keep selectors here so the tests can use simple page actions.
    this.emailInput = page.locator('[data-test="email"]')
    this.passwordInput = page.locator('[data-test="password"]')
    this.loginButton = page.locator('[data-test="login-submit"]')
  }

  // Open the sign-in page.
  async goto(): Promise<void> {
    await this.page.goto('https://practicesoftwaretesting.com/auth/login');
  }

  // Fill in the form and submit it.
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
