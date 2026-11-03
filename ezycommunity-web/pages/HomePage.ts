import { expect } from '@playwright/test'
import BasePage from './BasePage'

/** The site's start page. Replace the checks with real locators once the site is mapped. */
export default class HomePage extends BasePage {
    protected readonly path = '/'

    async expectLoaded() {
        await expect(this.page).toHaveTitle(/.+/)
        await expect(this.page.locator('body')).toBeVisible()
    }
}
