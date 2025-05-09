import { expect, test } from "@playwright/test";
import { NavigationDrawer } from "../pages/e2e/NavigationDrawer";
import { prepare } from "../utils/helper-functions";
import customers from "../test-data/customers.json";

let describeName = "TRAOB-132";
let navigationDrawer: NavigationDrawer;

test.describe.serial(
    describeName,
    {
        annotation: {
            type: "story",
            description: "https://basecom-gmbh.atlassian.net/browse/TRAOB-132",
        },
        tag: "@dev",
    },
    () => {
        [{ customerType: "B2C" }, { customerType: "B2B" }].forEach((testSpec, index) => {
            test(`Verify that the Change request for personal data form is prefilled (${testSpec.customerType})`, async ({ page }) => {
                await prepare(page, testSpec, index, customers);
                navigationDrawer = new NavigationDrawer(page);
                await navigationDrawer.profile();
                await page.getByRole("button", { name: "Edit your data" }).click();
                await expect(page.getByRole("textbox", { name: "First Name" })).toHaveValue(customers[index].firstName);
                await expect(page.getByRole("textbox", { name: "Last Name" })).toHaveValue(customers[index].lastName);
                await expect(page.getByRole("textbox", { name: "Phone Number 1" })).toHaveValue(customers[index].phoneNumber1);
                await expect(page.getByRole("textbox", { name: "Phone Number 2" })).toHaveValue(customers[index].phoneNumber2);
                await page.getByRole("button", { name: "Cancel" }).click();
                await page.close();
            });
        });
    }
);
