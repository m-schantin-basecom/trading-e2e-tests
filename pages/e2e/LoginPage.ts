import { Locator, Page } from "playwright/test";

export class LoginPage {
    readonly page: Page;

    readonly continueButton: Locator;
    readonly emailInput: Locator;
    readonly logoutLink: Locator;
    readonly passwordInput: Locator;
    readonly signInWithPasswordButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.continueButton = page.getByRole("button", { name: "Continue" });
        this.emailInput = page.getByTestId("ory/form/node/input/identifier");
        this.logoutLink = page.getByTestId("ory/screen/login/action/logout");
        this.passwordInput = page.getByTestId("ory/form/node/input/password");
        this.signInWithPasswordButton = page.getByRole("button", { name: "Sign in with password" });
    }

    async continue() {
        await this.continueButton.click();
    }

    async loginUser(username: string, password: string) {
        await this.emailInput.waitFor({ state: "visible" });
        await this.emailInput.fill(username);
        await this.continue();
        await this.passwordInput.fill(password);
        await this.signInWithPassword();
    }

    async logout() {
        await this.logoutLink.click();
    }

    async signInWithPassword() {
        await this.signInWithPasswordButton.click();
    }
}
