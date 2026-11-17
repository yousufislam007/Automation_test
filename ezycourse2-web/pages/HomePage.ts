import { expect } from '@playwright/test'
import BasePage from './BasePage'

export default class HomePage extends BasePage {
    protected readonly path = '/'

    async expectLoaded() {
        await expect(this.page).toHaveURL(/./)
        await expect(this.page.locator('body')).toBeVisible()
    }
}
