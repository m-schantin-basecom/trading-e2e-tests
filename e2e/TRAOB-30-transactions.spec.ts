import { expect, test } from "@playwright/test";
import { NavigationDrawer } from "../pages/e2e/NavigationDrawer";
import { prepare } from "../utils/helper-functions";
import customers from "../test-data/customers.json";
import transactions from "../test-data/transactions.json";

let describeName = "TRAOB-30";
let navigationDrawer: NavigationDrawer;

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
        [{ customerType: "B2C" }, { customerType: "B2B" }].forEach((testSpec, index) => {
            test(`Verify that the transactions are displayed (${testSpec.customerType})`, async ({ page }) => {
                await prepare(page, testSpec, index, customers);
                navigationDrawer = new NavigationDrawer(page);
                await navigationDrawer.transactions();
                for (let transaction of transactions) {
                    await expect(page.getByText(transaction.totalValue.value.toLocaleString("en-US")).first()).toBeVisible();
                }
                await page.close();
            });
        });
    }
);
