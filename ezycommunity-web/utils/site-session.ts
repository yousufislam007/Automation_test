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
        // Wait for whichever appears first (no "networkidle": the feed keeps polling, which made this take long).
        const profileMenu = page.getByRole('button', { name: 'Open profile menu' })
        const logIn = page.getByRole('link', { name: 'Log in' }).or(page.getByRole('button', { name: 'Log in' }))
        await profileMenu
            .or(logIn)
            .first()
            .waitFor({ timeout: 20_000 })
            .catch(() => {})
        return (await profileMenu.count()) > 0
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
