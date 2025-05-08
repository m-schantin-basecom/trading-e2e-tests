import { expect, Page, test } from "@playwright/test";
import { LoginPage } from "../pages/e2e/LoginPage";
import { NavigationDrawer } from "../pages/e2e/NavigationDrawer";
import { TransactionsPage } from "../pages/e2e/TransactionsPage";
import transactions from "../test-data/transactions.json";

let describeName = "TRAOB-157";
let loginPage: LoginPage;
let navigationDrawer: NavigationDrawer;
let page: Page;
let transactionsPage: TransactionsPage;

test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    loginPage = new LoginPage(page);
    navigationDrawer = new NavigationDrawer(page);
    transactionsPage = new TransactionsPage(page);
    await page.goto("/");
    await loginPage.loginUser(`${process.env.TRADIUM_EMAIL}`, `${process.env.TRADIUM_PASSWORD}`);
    await navigationDrawer.transactions();
});

const expectedStrings = ["6 transactions", "€53,800.23", "€2,400.23", "€30,156,637.70", "€9,334.00", "€1,637.70"];
const expectedPurchaseStrings = ["3 transactions", "€53,800.23", "€30,156,637.70", "€1,637.70"];
const expectedSaleStrings = ["3 transactions", "€2,400.23", "€9,334.00", "€9,334.00"];

test.describe.serial(
    describeName,
    {
        annotation: {
            type: "story",
            description: "https://basecom-gmbh.atlassian.net/browse/TRAOB-157",
        },
        tag: "@dev",
    },
    () => {
        test.skip("SUT is currently defective: Verify that only the purchases are displayed after clicking on Purchase", async () => {
            await transactionsPage.purchase();
            for (let expectedPurchaseString of expectedPurchaseStrings) {
                await expect(page.getByText(expectedPurchaseString).first()).toBeVisible();
            }
        });

        test.skip("SUT is currently defective: Verify that only the sales are displayed after clicking on Sale", async () => {
            await transactionsPage.sale();
            for (let expectedSaleString of expectedSaleStrings) {
                await expect(page.getByText(expectedSaleString).first()).toBeVisible();
            }
        });

        test.skip("SUT is currently defective: Verify that all transactions are displayed after clicking on All", async () => {
            await transactionsPage.all();
            for (let expectedAmount of expectedStrings) {
                await expect(page.getByText(expectedAmount).first()).toBeVisible();
            }
        });

        test.skip("SUT is currently defective: Verify that transactions can be filtered by date range", async () => {
            await page.getByRole("combobox").filter({ hasText: "Last 12 months" }).locator("i").click();
            await page.getByText("Last month").click();
        });

        test("Verify that transactions can be filtered by commodity", async () => {
            for (let transaction of transactions) {
                await transactionsPage.openCommoditiesDropDownMenu();
                for (let category of transaction.categories) {
                    await page.getByText(category.name).click();
                    await expect(page.getByText(category.code!).first()).toBeVisible();
                }
                for (let category of transaction.categories!) {
                    await page.getByText(category.name!).nth(1).click();
                }
                await page.keyboard.press("Escape");
            }
        });
    }
);

test.afterAll(async () => {
    await page.close();
});
