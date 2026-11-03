import { expect, type Page } from '@playwright/test'
import { ALLOWED_ORIGIN } from '../config/env'

/** What every page object shares. Page objects extend this class and hold all locators (specs hold none). */
export default abstract class BasePage {
    constructor(protected readonly page: Page) {}

    /** Path of the page, relative to WEB_BASE_URL. */
    protected abstract readonly path: string

    async open() {
        await this.page.goto(this.path)
    }

    /**
     * Fails unless the browser is on the allowed community (https://sqa.ezycommunity.pro.bd).
     * Call it right before anything that creates, changes, deletes or sends something, so a test can never
     * change data in another community.
     */
    async expectOnAllowedCommunity() {
        expect(new URL(this.page.url()).origin, 'must be on the allowed community before changing anything').toBe(
            ALLOWED_ORIGIN
        )
    }
}
