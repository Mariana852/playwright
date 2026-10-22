import path from "node:path";
import fs from "node:fs";
import { expect, test } from "../fixtures";
import { LoginPage } from "../pages/LoginPage";

type LoginCase = {
    name: string;
    email: string;
    password: string;
    expectedResult: 'success' | 'failure';
};

const jsonPath = path.resolve(__dirname, "../test-data/login.json");

const credentials = JSON.parse(
    fs.readFileSync(jsonPath, "utf8")
);

const loginCases: LoginCase[] = Object.entries(credentials).map(
    ([expectedResult, data]) => ({
        name: expectedResult,
        email: (data as any).email,
        password: (data as any).password,
        expectedResult: expectedResult as "success" | "failure",
    })
);

test.describe("JSON login cases", () => {
    for (const loginCase of loginCases) {
        test(`login: ${loginCase.name} (${loginCase.expectedResult})`, async ({ page }) => {
            const loginPage = new LoginPage(page);

            await loginPage.goto();
            await loginPage.login(loginCase.email, loginCase.password);

            if (loginCase.expectedResult === "success") {
                await expect(page).toHaveURL(/\/account(?:[/?#]|$)/);
            } else {
                await expect(
                    page.getByText("Invalid email or password", { exact: true })
                ).toBeVisible();
            }
        });
    }
});