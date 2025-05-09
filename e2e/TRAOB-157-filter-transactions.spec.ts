import { expect, Page, test } from "@playwright/test";
import { NavigationDrawer } from "../pages/e2e/NavigationDrawer";
import { prepare } from "../utils/helper-functions";
import { TransactionsPage } from "../pages/e2e/TransactionsPage";
import customers from "../test-data/customers.json";
import timeranges from "../test-data/timeranges.json";
import transactions from "../test-data/transactions.json";

let navigationDrawer: NavigationDrawer;
let page: Page;
let transactionsPage: TransactionsPage;

const expectedStrings = [`6 transactions`, `€53,800.23`, `€2,400.23`, `€30,156,637.70`, `€9,334.00`, `€1,637.70`];
const expectedPurchaseStrings = [`€53,800.23`, `€30,156,637.70`, `€1,637.70`];
const expectedSaleStrings = [`€2,400.23`, `€9,334.00`, `€9,334.00`];

[{ customerType: `B2C` }, { customerType: `B2B` }].forEach((testSpec, index) => {
    test.describe.serial(
        `TRAOB-157 (${testSpec.customerType})`,
        {
            annotation: {
                type: `story`,
                description: `https://basecom-gmbh.atlassian.net/browse/TRAOB-157`,
            },
            tag: `@dev`,
        },
        () => {
            test.beforeEach(async ({ browser }) => {
                const context = await browser.newContext();
                page = await context.newPage();
                await prepare(page, testSpec, index, customers);
                transactionsPage = new TransactionsPage(page);
                navigationDrawer = new NavigationDrawer(page);
                await navigationDrawer.transactions();
            });

            test.afterEach(async () => {
                await page.close();
            });

            test(`SUT TODO: Verify that only the purchases are displayed after clicking on Purchase (${testSpec.customerType})`, async () => {
                await transactionsPage.purchase();
                for (let expectedPurchaseString of expectedPurchaseStrings) {
                    await expect(page.getByText(expectedPurchaseString).first()).toBeVisible();
                }
            });

            test(`SUT TODO: Verify that only the sales are displayed after clicking on Sale (${testSpec.customerType})`, async () => {
                await transactionsPage.sale();
                for (let expectedSaleString of expectedSaleStrings) {
                    await expect(page.getByText(expectedSaleString).first()).toBeVisible();
                }
            });

            test(`SUT TODO: Verify that all transactions are displayed after clicking on All (${testSpec.customerType})`, async () => {
                await transactionsPage.all();
                for (let expectedAmount of expectedStrings) {
                    await expect(page.getByText(expectedAmount).first()).toBeVisible();
                }
            });

            test(`SUT TODO: Verify that transactions can be filtered by date range (${testSpec.customerType})`, async () => {
                await page.getByText(`Last 12 monthskeyboard_arrow_down`).click();
                for (let timeRange of timeranges.timeranges) {
                    await page.getByText(`${timeRange.value}`).click();
                    // TODO: verify that transactions are in the time range
                    // open drop down for next run
                    await page.getByText(`${timeRange.value}keyboard_arrow_down`).click();
                }
            });

            test(`Verify that transactions can be filtered by commodity (${testSpec.customerType})`, async () => {
                for (let transaction of transactions) {
                    await transactionsPage.openCommoditiesDropDownMenu();
                    for (let category of transaction.categories) {
                        await page.getByText(category.name).click();
                        await expect(page.getByText(category.code!).first()).toBeVisible();
                    }
                    for (let category of transaction.categories!) {
                        await page.getByText(category.name!).nth(1).click();
                    }
                    await page.keyboard.press(`Escape`);
                }
            });
        }
    );
});
