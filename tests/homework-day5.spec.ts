import * as fs from 'node:fs';
import * as path from 'node:path';
import { test, expect } from '../fixtures';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

test('loggedInPage opens the account page', async ({ loggedInPage }) => {
  await expect(loggedInPage).toHaveURL(/\/account(?:[/?#]|$)/);
});

test.describe('catalog hooks', () => {
  let suiteStartedAt: number;

  test.beforeAll(() => {
    suiteStartedAt = Date.now();
    console.log(`Catalog suite started at ${new Date(suiteStartedAt).toISOString()}`);
  });

  test.beforeEach(async ({ page }) => {
    await new HomePage(page).goto();
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed' || testInfo.status === 'timedOut') {
      await testInfo.attach('failure-screenshot', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    }
  });

  test.afterAll(() => {
    console.log(`Catalog suite finished after ${Date.now() - suiteStartedAt} ms`);
  });

  test('catalog page loaded', async ({ page }) => {
    const homePage = new HomePage(page);
    await expect(page).toHaveURL('https://practicesoftwaretesting.com/');
    await expect(homePage.sortDropdown).toBeVisible();
    await expect(homePage.productLinks.first()).toBeVisible();
  });
});

type LoginCase = {
  name: string;
  email: string;
  password: string;
  expectedResult: 'success' | 'failure';
};

// These public training values contain no quoted commas or multiline fields.
const csvPath = path.resolve(__dirname, '../test-data/login-cases.csv');
const [header, ...lines] = fs.readFileSync(csvPath, 'utf8').trim().split(/\r?\n/);
if (header !== 'name,email,password,expectedResult') {
  throw new Error('Unexpected login-cases.csv header');
}

const loginCases: LoginCase[] = lines.filter(line => line.trim()).map((line, index) => {
  const values = line.split(',').map(value => value.trim());
  const [name, email, password, expectedResult] = values;
  if (values.length !== 4 || !name || !email || !password ||
      (expectedResult !== 'success' && expectedResult !== 'failure')) {
    throw new Error(`Invalid login case on CSV line ${index + 2}`);
  }
  return { name, email, password, expectedResult };
});

test.describe('CSV login cases', () => {
  for (const loginCase of loginCases) {
    test(`login: ${loginCase.name} (${loginCase.expectedResult})`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(loginCase.email, loginCase.password);

      if (loginCase.expectedResult === 'success') {
        await expect(page).toHaveURL(/\/account(?:[/?#]|$)/);
      } else {
        await expect(page.getByText('Invalid email or password', { exact: true }))
          .toBeVisible();
      }
    });
  }
});
