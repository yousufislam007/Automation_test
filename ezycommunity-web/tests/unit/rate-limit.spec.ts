import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test, expect } from '@playwright/test'
import { RateLimitError, backoffDelay, parseRetryAfter, withRateLimitRetry } from '../../utils/rate-limit'
import { waitForSlot } from '../../utils/shared-limiter'

test.describe('parseRetryAfter', { tag: '@unit' }, () => {
    test('should read seconds', () => {
        expect(parseRetryAfter('7')).toBe(7000)
    })

    test('should read an HTTP date', () => {
        const now = Date.parse('2026-10-09T10:00:00Z')
        expect(parseRetryAfter('Fri, 09 Oct 2026 10:00:30 GMT', now)).toBe(30_000)
    })

    test('should ignore a missing or invalid value', () => {
        expect(parseRetryAfter(undefined)).toBeUndefined()
        expect(parseRetryAfter('soon')).toBeUndefined()
    })
})

test.describe('backoffDelay', { tag: '@unit' }, () => {
    test('should grow exponentially, stay under the cap, and be jittered', () => {
        expect(backoffDelay(0, 1000, 30_000, () => 0.999)).toBeLessThan(1000)
        expect(backoffDelay(3, 1000, 30_000, () => 0.999)).toBeLessThan(8000)
        expect(backoffDelay(10, 1000, 30_000, () => 0.999)).toBeLessThan(30_000)
        expect(backoffDelay(3, 1000, 30_000, () => 0)).toBe(0)
    })
})

test.describe('withRateLimitRetry', { tag: '@unit' }, () => {
    const describeResult = (r: { status: number; retryAfter?: string }) => r
    const quiet = { log: () => {} }

    test('should return straight away when the answer is not 429', async () => {
        let calls = 0
        const result = await withRateLimitRetry(async () => (calls++, { status: 200 }), describeResult, quiet)
        expect(result.status).toBe(200)
        expect(calls).toBe(1)
    })

    test('should wait for Retry-After and then succeed', async () => {
        const answers = [{ status: 429, retryAfter: '3' }, { status: 200 }]
        const waits: number[] = []
        const result = await withRateLimitRetry(async () => answers.shift()!, describeResult, {
            ...quiet,
            sleep: async (ms) => void waits.push(ms),
        })
        expect(result.status).toBe(200)
        expect(waits).toEqual([3000])
    })

    test('should use bounded jittered back-off when there is no Retry-After', async () => {
        const answers = [{ status: 429 }, { status: 429 }, { status: 200 }]
        const waits: number[] = []
        await withRateLimitRetry(async () => answers.shift()!, describeResult, {
            ...quiet,
            baseMs: 100,
            maxMs: 400,
            sleep: async (ms) => void waits.push(ms),
        })
        expect(waits).toHaveLength(2)
        expect(waits[0]).toBeLessThan(100)
        expect(waits[1]).toBeLessThan(200)
    })

    test('should stop after the maximum number of attempts', async () => {
        let calls = 0
        await expect(
            withRateLimitRetry(async () => (calls++, { status: 429 }), describeResult, {
                ...quiet,
                maxAttempts: 3,
                sleep: async () => {},
            })
        ).rejects.toBeInstanceOf(RateLimitError)
        expect(calls).toBe(3)
    })

    test('should refuse to wait longer than the allowed maximum', async () => {
        let calls = 0
        await expect(
            withRateLimitRetry(async () => (calls++, { status: 429, retryAfter: '600' }), describeResult, {
                ...quiet,
                maxWaitMs: 60_000,
                sleep: async () => {},
            })
        ).rejects.toThrow(/over the 60s limit/)
        expect(calls).toBe(1)
    })

    test('should not retry other errors', async () => {
        let calls = 0
        const result = await withRateLimitRetry(async () => (calls++, { status: 500 }), describeResult, {
            ...quiet,
            sleep: async () => {},
        })
        expect(result.status).toBe(500)
        expect(calls).toBe(1)
    })
})

test.describe('shared limiter', { tag: '@unit' }, () => {
    test('should space out concurrent callers by the minimum interval', async () => {
        const dir = mkdtempSync(join(tmpdir(), 'limiter-'))
        const interval = 250
        const finished: number[] = []

        await Promise.all(
            Array.from({ length: 5 }, async () => {
                await waitForSlot(interval, dir)
                finished.push(Date.now())
            })
        )

        finished.sort((a, b) => a - b)
        for (let i = 1; i < finished.length; i++) {
            expect(finished[i] - finished[i - 1], `gap ${i}`).toBeGreaterThanOrEqual(interval - 30)
        }
    })

    test('should do nothing when the interval is 0', async () => {
        const started = Date.now()
        await waitForSlot(0)
        expect(Date.now() - started).toBeLessThan(50)
    })
})
