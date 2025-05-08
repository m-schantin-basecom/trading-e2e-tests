import { Locator, Page } from "playwright/test";

export class LoginPage {
    readonly page: Page;

    readonly continueButton: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;

    constructor(page: Page) {
        this.page = page;

        this.continueButton = page.getByRole("button", { name: "Continue" });
        this.emailInput = page.getByTestId("ory/form/node/input/identifier");
        this.passwordInput = page.getByTestId("ory/form/node/input/password");
    }

    async loginUser(username: string, password: string) {
        await this.emailInput.waitFor({ state: "visible" });
        await this.emailInput.fill(username);
        await this.continueButton.click();
        await this.page.getByRole("button", { name: "Enter your password associated with your account" }).click();
        await this.passwordInput.fill(password);
        await this.page.getByRole("button", { name: "Sign in with password" }).click();
    }
}
