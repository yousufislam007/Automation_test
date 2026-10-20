import { expect, type Page } from '@playwright/test'

export class DashboardPage {
    constructor(private readonly page: Page) {}

    async goto(path = '/dashboard/') {
        await this.page.goto(path)
    }

    /** Waits until we are on the admin dashboard home. */
    async expectLoaded() {
        await expect(this.page).toHaveURL(/\/dashboard\/?$/)
        await expect(this.page).toHaveTitle('Dashboard | Admin')
    }

    /**
     * Any admin page: we ended up on the expected path, it has the expected tab title (when it has one),
     * and it shows real content (not the "page could not be found" screen, and not an empty page).
     */
    async expectPageLoaded(expected: { path: string; title?: string }) {
        await expect(this.page).toHaveURL((url) => url.pathname === expected.path)
        if (expected.title) await expect(this.page).toHaveTitle(expected.title)
        await expect(this.page.getByText('This page could not be found')).toHaveCount(0)
        await expect(this.page.locator('body')).not.toBeEmpty()
    }
}
