import { expect, type Page } from '@playwright/test'
import { env } from '../config/env'

/** What every page object shares. Page objects extend this class and hold all locators (specs hold none). */
export default abstract class BasePage {
    constructor(protected readonly page: Page) {}

    /** Path of the page, relative to WEB_BASE_URL. */
    protected abstract readonly path: string

    async open() {
        await this.page.goto(this.path)
    }

    /**
     * Fails unless the browser is on the site under test (WEB_BASE_URL).
     * Call it right before anything that creates, changes, deletes or sends something.
     */
    async expectOnSiteUnderTest() {
        expect(new URL(this.page.url()).origin, 'must be on the site under test before changing anything').toBe(
            env.baseUrl
        )
    }
}
