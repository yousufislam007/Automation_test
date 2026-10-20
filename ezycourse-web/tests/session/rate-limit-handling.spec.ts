import { test, expect } from '../../playwright/fixtures'

// Simulates the site answering HTTP 429 with "Retry-After: 1" on the first page load (the answer is faked
// in the browser, so the real site is not hit extra times) and checks that pacedGoto waits and retries.
test.describe('Rate-limit handling', { tag: '@session' }, () => {
    test('RATE-01: should wait for Retry-After and then load the page', async ({ page, pacedGoto }) => {
        let calls = 0
        await page.route('**/dashboard/analytics/', async (route) => {
            calls++
            if (calls === 1) {
                await route.fulfill({ status: 429, headers: { 'retry-after': '1' }, body: 'Too many requests' })
            } else {
                await route.continue()
            }
        })

        const startedAt = Date.now()
        const response = await pacedGoto('/dashboard/analytics/')

        expect(response?.status()).toBeLessThan(400)
        expect(calls).toBe(2)
        expect(Date.now() - startedAt).toBeGreaterThanOrEqual(1000)
        await expect(page).toHaveTitle('Analytics | Admin')
    })

    test('RATE-02: should stop with a clear error when the site keeps answering 429', async ({ page, pacedGoto }) => {
        let calls = 0
        await page.route('**/dashboard/analytics/', async (route) => {
            calls++
            await route.fulfill({ status: 429, headers: { 'retry-after': '1' }, body: 'Too many requests' })
        })

        await expect(pacedGoto('/dashboard/analytics/')).rejects.toThrow(/rate limited/i)
        expect(calls).toBe(4) // the default maximum number of attempts, then it gives up
    })
})
