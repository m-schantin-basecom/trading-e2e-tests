import { expect, Locator, Page } from "playwright/test";

const company: string = "Company"

export class ProfilePage {
    readonly page: Page;

    readonly addressTab: Locator;
    readonly personalDataTab: Locator;

    constructor(page: Page) {
        this.page = page;

        this.addressTab = this.page.getByRole("tab", { name: "Address" });
        this.personalDataTab = this.page.getByRole("tab", { name: "Personal Data" });
    }

    async address() {
        await this.addressTab.click();
    }

    async verifyHeader(page: Page, customers: any, index: number) {
        await expect(page.getByText(`${customers[index].firstName} ${customers[index].lastName}`).first()).toBeVisible();
        await expect(page.getByText(customers[index].customerNumber)).toBeVisible();
    }

    async verifyThatTheCompanyAndCompanyAddressIsOnlyDisplayedInTheB2BCase(testSpec: any, page: Page, customers: any, index: number, addressPage: boolean) {
        if (testSpec.customerType === "B2B") {
            await expect(page.getByRole("main")).toContainText(company);
            await expect(page.getByRole("main")).toContainText(customers[index].company);
            if (addressPage) await expect(page.getByRole("main")).toContainText(customers[index].companyAddress);
        } else {
            await expect(page.getByRole("main")).not.toContainText(company, { timeout: 2500 });
            await expect(page.getByRole("main")).not.toContainText(customers[index].company, { timeout: 2500 });
            if (addressPage) await expect(page.getByRole("main")).not.toContainText(customers[index].companyAddress, { timeout: 2500 });
        }
    }
}
