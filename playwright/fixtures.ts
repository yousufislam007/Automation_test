import { appendFileSync, mkdirSync } from 'node:fs'
import { test as base, expect, type Response } from '@playwright/test'
import { ADMIN_STORAGE_STATE, accountForSlot, env, storageStatePath } from '../config/env'
import { ensureAuthenticated } from '../utils/auth'
import { withRateLimitRetry } from '../utils/rate-limit'
import { waitForSlot } from '../utils/shared-limiter'

interface RateLimitHit {
    test: string
    method: string
    path: string // path only: query strings can carry tokens
    retryAfter: string | null
    at: string
}

/**
 * Base test for every spec.
 *  - rateLimitWatch (automatic): records any HTTP 429 the site answers during a test, attaches it to the
 *    report and appends it to test-results/rate-limit.log. It does not fail the test by itself.
 *  - pacedGoto: page.goto() for read-only page loads. It waits for a slot in the limiter shared by all
 *    workers (REQUEST_MIN_INTERVAL_MS) and retries ONLY on HTTP 429, honouring Retry-After.
 */
export const test = base.extend<{ rateLimitWatch: void; pacedGoto: (url: string) => Promise<Response | null> }>({
    rateLimitWatch: [
        async ({ context }, use, testInfo) => {
            const hits: RateLimitHit[] = []
            context.on('response', (response) => {
                if (response.status() !== 429) return
                hits.push({
                    test: testInfo.title,
                    method: response.request().method(),
                    path: new URL(response.url()).pathname,
                    retryAfter: response.headers()['retry-after'] ?? null,
                    at: new Date().toISOString(),
                })
            })
            await use()
            if (hits.length === 0) return
            await testInfo.attach('rate-limit-429', {
                body: JSON.stringify(hits, null, 2),
                contentType: 'application/json',
            })
            testInfo.annotations.push({ type: 'rate-limited', description: `${hits.length} HTTP 429 response(s)` })
            mkdirSync('test-results', { recursive: true })
            appendFileSync('test-results/rate-limit.log', hits.map((h) => JSON.stringify(h)).join('\n') + '\n')
        },
        { auto: true },
    ],

    pacedGoto: async ({ page }, use) => {
        await use((url) =>
            withRateLimitRetry(
                async () => {
                    await waitForSlot(env.minRequestIntervalMs)
                    return page.goto(url)
                },
                (response) => ({ status: response?.status(), retryAfter: response?.headers()['retry-after'] })
            )
        )
    },
})

/**
 * For tests that CREATE, CHANGE or DELETE data. Each worker uses its own admin account and its own
 * saved session (playwright/.auth/worker-<parallelIndex>.json), so parallel workers cannot step on each
 * other's data or overwrite each other's state file.
 *
 *  - Slot 0 is the primary admin (the same account and file as everything else).
 *  - Slot n needs WEB_ADMIN_EMAIL_n / WEB_ADMIN_PASSWORD_n in .env. Accounts are never created
 *    automatically. A worker without an account SKIPS the test with a clear reason.
 */
export const writeTest = test.extend<object, { workerAccountState: string | null }>({
    workerAccountState: [
        async ({ browser }, use, workerInfo) => {
            const slot = workerInfo.parallelIndex
            const account = accountForSlot(slot)
            if (!account) return use(null)
            const statePath = slot === 0 ? ADMIN_STORAGE_STATE : storageStatePath(`worker-${slot}`)
            await ensureAuthenticated(browser, account, statePath)
            await use(statePath)
        },
        { scope: 'worker', timeout: 120_000 },
    ],

    storageState: async ({ workerAccountState }, use, testInfo) => {
        writeTest.skip(
            workerAccountState === null,
            `Worker ${testInfo.parallelIndex} has no separate admin account. Add WEB_ADMIN_EMAIL_${testInfo.parallelIndex} and ` +
                `WEB_ADMIN_PASSWORD_${testInfo.parallelIndex} to .env, or run with PLAYWRIGHT_WORKERS=1.`
        )
        await use(workerAccountState!)
    },
})

export { expect }
