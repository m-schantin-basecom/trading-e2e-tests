import { expect, Page, test } from "@playwright/test";
import { LoginPage } from "../pages/e2e/LoginPage";
import { NavigationDrawer } from "../pages/e2e/NavigationDrawer";
import transactions from "../test-data/transactions.json"

let describeName = "TRAOB-30";
let loginPage: LoginPage;
let navigationDrawer: NavigationDrawer;
let page: Page;

test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    loginPage = new LoginPage(page);
    navigationDrawer = new NavigationDrawer(page);
    await page.goto("/");
    await loginPage.loginUser(`${process.env.TRADIUM_EMAIL}`, `${process.env.TRADIUM_PASSWORD}`);
    await navigationDrawer.transactions();
});

test.describe.serial(
    describeName,
    {
        annotation: {
            type: "story",
            description: "https://basecom-gmbh.atlassian.net/browse/TRAOB-30",
        },
        tag: "@dev",
    },
    () => {
        test("Verify that the transactions are displayed", async () => {
            for (let transaction of transactions) {
                await expect(page.getByText(transaction.totalValue.value.toLocaleString("en-US")).first()).toBeVisible();
            }
            await page.close();
        });
    }
);
