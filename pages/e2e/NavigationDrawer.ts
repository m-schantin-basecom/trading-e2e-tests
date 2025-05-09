import { Locator, Page } from "playwright/test";

export class NavigationDrawer {
    readonly page: Page;

    readonly documentsLink: Locator;
    readonly logoutLink: Locator;
    readonly portfolioLink: Locator;
    readonly profileLink: Locator;
    readonly transactionsLink: Locator;

    constructor(page: Page) {
        this.page = page;

        this.documentsLink = page.getByRole("link", { name: "Documents" });
        this.logoutLink = page.getByRole("link", { name: "Logout" });
        this.portfolioLink = page.getByRole("link", { name: "Portfolio" });
        this.profileLink = page.getByRole("link", { name: "Profile" });
        this.transactionsLink = page.getByRole("link", { name: "Transactions" });
    }

    async documents() {
        await this.documentsLink.click();
    }

    async logout() {
        await this.logoutLink.click();
    }
    
    async portfolio() {
        await this.portfolioLink.click();
    }

    async profile() {
        await this.profileLink.click();
    }

    async transactions() {
        await this.transactionsLink.click();
    }

}
