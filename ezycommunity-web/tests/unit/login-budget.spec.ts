import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test, expect } from '@playwright/test'
import { assertLoginBudget, loginsInWindow, recordLogin, recordLoginBlocked } from '../../utils/login-budget'
import { RateLimitError } from '../../utils/rate-limit'

const freshFile = () => join(mkdtempSync(join(tmpdir(), 'logins-')), 'logins.json')
const MIN = 60_000

test.describe('login budget', { tag: '@unit' }, () => {
    test('should allow a login when none were sent', () => {
        expect(() => assertLoginBudget({ file: freshFile(), max: 3 })).not.toThrow()
    })

    test('should refuse a login once the budget for the window is used up', () => {
        const file = freshFile()
        const now = Date.parse('2026-11-03T10:00:00Z')
        for (let i = 0; i < 3; i++) recordLogin({ file, max: 3, windowMs: 15 * MIN, now: now + i * 1000 })
        expect(loginsInWindow({ file, windowMs: 15 * MIN, now: now + 5000 })).toBe(3)
        expect(() => assertLoginBudget({ file, max: 3, windowMs: 15 * MIN, now: now + 5000 })).toThrow(RateLimitError)
    })

    test('should allow logins again after the window has passed', () => {
        const file = freshFile()
        const now = Date.parse('2026-11-03T10:00:00Z')
        for (let i = 0; i < 3; i++) recordLogin({ file, windowMs: 15 * MIN, now })
        expect(() => assertLoginBudget({ file, max: 3, windowMs: 15 * MIN, now: now + 16 * MIN })).not.toThrow()
    })

    test('should block logins after an HTTP 429 until the block ends', () => {
        const file = freshFile()
        const now = Date.parse('2026-11-03T10:00:00Z')
        recordLoginBlocked({ file, windowMs: 15 * MIN, now })
        expect(() => assertLoginBudget({ file, windowMs: 15 * MIN, now: now + 5 * MIN })).toThrow(/429/)
        expect(() => assertLoginBudget({ file, windowMs: 15 * MIN, now: now + 16 * MIN })).not.toThrow()
    })
})
