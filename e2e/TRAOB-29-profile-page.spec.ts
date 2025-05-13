import { expect, Page, test } from "@playwright/test";
import { LoginPage } from "../pages/e2e/LoginPage";
import { NavigationDrawer } from "../pages/e2e/NavigationDrawer";
import { prepare } from "../utils/helper-functions";
import { ProfilePage } from "../pages/e2e/ProfilePage";
import customers from "../test-data/customers.json";

let describeName = "TRAOB-29";
let loginPage: LoginPage;
let navigationDrawer: NavigationDrawer;
let page: Page;
let profilePage: ProfilePage;

[{ customerType: "B2C" }, { customerType: "B2B" }].forEach((testSpec, index) => {
    test.describe.serial(
        describeName,
        {
            annotation: {
                type: "story",
                description: "https://basecom-gmbh.atlassian.net/browse/TRAOB-29",
            },
            tag: "@dev",
        },
        () => {
            test.beforeEach(async ({ browser }) => {
                const context = await browser.newContext();
                page = await context.newPage();
                await prepare(page, testSpec, index, customers);
                loginPage = new LoginPage(page);
                navigationDrawer = new NavigationDrawer(page);
                profilePage = new ProfilePage(page);
                await navigationDrawer.profile();
            });

            test.afterEach(async () => {
                await navigationDrawer.logout();
                await loginPage.logout();
                await page.close();
            });

            test(`Verify that the personal data is displayed (${testSpec.customerType})`, async () => {
                await profilePage.verifyHeader(page, customers, index);
                await profilePage.verifyThatTheCompanyAndCompanyAddressIsOnlyDisplayedInTheB2BCase(testSpec, page, customers, index, false);
                await expect(page.getByText(customers[index].firstName).first()).toBeVisible();
                await expect(page.getByText(customers[index].lastName).first()).toBeVisible();
                await expect(page.getByText(customers[index].email)).toBeVisible();
                await expect(page.getByText(customers[index].phoneNumber1)).toBeVisible();
                await expect(page.getByText(customers[index].phoneNumber2)).toBeVisible();
            });

            test(`Verify that the address is displayed (${testSpec.customerType})`, async () => {
                await profilePage.address();
                await profilePage.verifyHeader(page, customers, index);
                await profilePage.verifyThatTheCompanyAndCompanyAddressIsOnlyDisplayedInTheB2BCase(testSpec, page, customers, index, true);
                await expect(page.getByRole("main")).toContainText(customers[index].street);
                await expect(page.getByRole("main")).toContainText(customers[index].postalCode);
                await expect(page.getByRole("main")).toContainText(customers[index].city);
                await expect(page.getByRole("main")).toContainText(customers[index].addition);
                await expect(page.getByRole("main")).toContainText(customers[index].country);
            });
        }
    );
});
