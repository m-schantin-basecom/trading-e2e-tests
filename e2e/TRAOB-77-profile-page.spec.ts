import { expect, test } from "@playwright/test";
import { prepare } from "../utils/helper-functions";
import customers from "../test-data/customers.json";

let describeName = "TRAOB-77";

test.describe.serial(
    describeName,
    {
        annotation: {
            type: "story",
            description: "https://basecom-gmbh.atlassian.net/browse/TRAOB-77",
        },
        tag: "@dev",
    },
    () => {
        [{ customerType: "B2C" }, { customerType: "B2B" }].forEach((testSpec, index) => {
            test(`Verify that the personal data is displayed (${testSpec.customerType})`, async ({ page }) => {
                await prepare(page, testSpec, index, customers);
                await expect(page.getByText(customers[index].firstName).first()).toBeVisible();
                await expect(page.getByText(customers[index].lastName).first()).toBeVisible();
                await expect(page.getByText(customers[index].email)).toBeVisible();
                await expect(page.getByText(customers[index].phoneNumber1)).toBeVisible();
                await expect(page.getByText(customers[index].phoneNumber2)).toBeVisible();
                await expect(page.getByText(customers[index].customerNumber)).toBeVisible();
                await page.close();
            });
        });

        [{ customerType: "B2C" }, { customerType: "B2B" }].forEach((testSpec, index) => {
            test(`Verify that the address is displayed (${testSpec.customerType})`, async ({ page }) => {
                await prepare(page, testSpec, index, customers);
                await page.getByRole("tab", { name: "Address" }).click();
                await expect(page.getByRole("main")).toContainText(customers[index].company);
                await expect(page.getByRole("main")).toContainText(customers[index].street);
                await expect(page.getByRole("main")).toContainText(customers[index].postalCode);
                await expect(page.getByRole("main")).toContainText(customers[index].city);
                await expect(page.getByRole("main")).toContainText(customers[index].addition);
                await expect(page.getByRole("main")).toContainText(customers[index].country);
                await page.close();
            });
        });
    }
);
