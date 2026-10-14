import { expect, type Locator, type Page } from '@playwright/test'

/** The seller's own area (`/seller/dashboard/`): what a logged-in marketplace seller sees first. */
export class SellerDashboardPage {
    static readonly path = '/seller/dashboard/'

    /** The red banner shown to a seller who has no active plan. */
    readonly noPlanBanner: Locator
    readonly productsAndServicesMenu: Locator
    readonly joinedCommunitiesLink: Locator
    readonly physicalProductsLink: Locator
    readonly addProductLink: Locator

    constructor(private readonly page: Page) {
        this.noPlanBanner = page.getByText("You don't have an active plan yet")
        this.productsAndServicesMenu = page.getByText('Products & Services', { exact: true })
        this.joinedCommunitiesLink = page.getByText('Joined Communities')
        this.physicalProductsLink = page.getByText('Physical Products')
        this.addProductLink = page.getByText('Add Product')
    }

    async goto() {
        await this.page.goto(SellerDashboardPage.path)
    }

    async expectLoaded() {
        await expect(this.page).toHaveURL(/\/seller\/dashboard\//)
    }

    async openProductsMenu() {
        await this.productsAndServicesMenu.click()
    }
}
