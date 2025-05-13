import { Page } from "playwright/test";
import { LoginPage } from "../pages/e2e/LoginPage";

let loginPage: LoginPage;

/**
 * Logs either a B2C or a B2B customer in
 * @param page The page
 * @param testSpec The testSpec
 * @param index The index
 * @param customers The customers
 */
export async function prepare(page: Page, testSpec: any, index: number, customers: any) {
    loginPage = new LoginPage(page);
    await page.goto("/");
    let password: string = "";
    if (testSpec.customerType === "B2C") {
        password = process.env.TRADIUM_PASSWORD_B2C!;
    } else if (testSpec.customerType === "B2B") {
        password = process.env.TRADIUM_PASSWORD_B2B!;
    } else {
        console.log("customerType is not defined.");
    }
    await loginPage.loginUser(customers[index].email, password);
}
