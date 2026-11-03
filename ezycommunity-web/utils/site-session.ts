import { expect } from '@playwright/test'
import LoginPage from '../pages/LoginPage'
import type { SiteSession } from './auth'

/**
 * The only place that knows how EzyCommunity logs in.
 *  - checkUrl: the community feed; only a logged-in user gets the "Open profile menu" button there.
 *    (The start page '/' is NOT a valid check: it shows no "Log in" link even when the community session is dead.)
 *  - login: the /login form (email + password), ONE request.
 * `expectOnAllowedCommunity()` runs first, so a login can never happen on another site.
 */
export const siteSession: SiteSession = {
    mapped: true,
    checkUrl: '/feeds',
    async isLoggedIn(page) {
        await page.waitForLoadState('networkidle').catch(() => {})
        return (await page.getByRole('button', { name: 'Open profile menu' }).count()) > 0
    },
    async login(page, account) {
        const loginPage = new LoginPage(page)
        await loginPage.open()
        await loginPage.expectOnAllowedCommunity()
        const status = await loginPage.submitAndGetStatus(account.email, account.password)
        if (status < 400) await expect(page).not.toHaveURL(/\/login/, { timeout: 30_000 })
        return status
    },
}
