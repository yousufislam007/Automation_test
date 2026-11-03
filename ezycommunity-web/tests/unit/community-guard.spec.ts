import { test, expect } from '@playwright/test'
import { ALLOWED_ORIGIN, env } from '../../config/env'

test.describe('allowed community', { tag: '@unit' }, () => {
    let saved: string | undefined

    test.beforeEach(() => {
        saved = process.env.WEB_BASE_URL
    })

    test.afterEach(() => {
        if (saved === undefined) delete process.env.WEB_BASE_URL
        else process.env.WEB_BASE_URL = saved
    })

    test('should accept the allowed community, with or without a trailing slash or path', () => {
        process.env.WEB_BASE_URL = `${ALLOWED_ORIGIN}/`
        expect(env.baseUrl).toBe(ALLOWED_ORIGIN)
        process.env.WEB_BASE_URL = `${ALLOWED_ORIGIN}/login`
        expect(env.baseUrl).toBe(ALLOWED_ORIGIN)
    })

    test('should refuse any other community', () => {
        process.env.WEB_BASE_URL = 'https://other.ezycommunity.pro.bd'
        expect(() => env.baseUrl).toThrow(/only https:\/\/sqa\.ezycommunity\.pro\.bd may be tested/)
    })

    test('should refuse a look-alike host', () => {
        process.env.WEB_BASE_URL = 'https://sqa.ezycommunity.pro.bd.evil.example'
        expect(() => env.baseUrl).toThrow(/may be tested/)
    })
})
