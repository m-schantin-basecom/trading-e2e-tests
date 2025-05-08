import { Locator, Page } from "playwright/test";

export class TransactionsPage {
    readonly page: Page;

    readonly allButton: Locator;
    readonly purchaseButton: Locator;
    readonly openCommoditiesDropDownMenuDiv: Locator;
    readonly saleButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.allButton = page.getByRole("button", { name: "All", exact: true });
        this.openCommoditiesDropDownMenuDiv = page.getByRole("combobox").filter({ hasText: /^keyboard_arrow_down$/ });
        this.purchaseButton = page.getByRole("button", { name: "Purchase", exact: true });
        this.saleButton = page.getByRole("button", { name: "Sale", exact: true });
    }

    async all() {
        await this.allButton.click();
    }

    async openCommoditiesDropDownMenu() {
        await this.openCommoditiesDropDownMenuDiv.click()
    }

    async purchase() {
        await this.purchaseButton.click();
    }

    async sale() {
        await this.saleButton.click();
    }
}
