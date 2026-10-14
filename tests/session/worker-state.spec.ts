import { writeTest as test, expect } from '../../playwright/fixtures'

// Demonstrates the fixture for tests that CHANGE data: each worker gets its own admin account and its own
// saved session. A worker with no account of its own SKIPS (it never shares the primary account's data).
// These two tests only read, they just prove the sessions work. Real data-changing tests go in the same style.
test.describe('Per-worker admin sessions', { tag: '@session' }, () => {
    for (const n of [1, 2]) {
        test(`SESSION-0${n}: should open the dashboard with this worker's own session`, async ({ page }) => {
            await page.goto('/dashboard/')

            await expect(page).toHaveTitle('Dashboard | Admin')
        })
    }
})
