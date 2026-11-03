import { appendFileSync, mkdirSync } from 'node:fs'
import { test as base, expect, type Response } from '@playwright/test'
import { env } from '../config/env'
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
 * Base test for every spec that uses the site.
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

export { expect }
