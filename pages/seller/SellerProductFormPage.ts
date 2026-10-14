import type { Locator, Page } from '@playwright/test'

/** The seller's "Create A Physical Product" form (`/seller/products/create/`). */
export class SellerProductFormPage {
    static readonly path = '/seller/products/create/'

    readonly titleInput: Locator

    constructor(private readonly page: Page) {
        this.titleInput = page.locator('#form_in_modal_product_title')
    }

    /** Opens the form's address. It does not wait for the form: a seller who is not allowed in is sent to the login page. */
    async goto() {
        await this.page.goto(SellerProductFormPage.path)
    }
}
