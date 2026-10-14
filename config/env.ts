import 'dotenv/config'
import { join } from 'node:path'

function required(name: string): string {
    const value = process.env[name]
    if (!value) {
        throw new Error(`Missing ${name}. Copy .env.example to .env and fill it in.`)
    }
    return value
}

function positiveInt(name: string, fallback: number): number {
    const raw = process.env[name]
    if (raw === undefined || raw === '') return fallback
    const value = Number(raw)
    if (!Number.isInteger(value) || value < 0) {
        throw new Error(`${name} must be a whole number >= 0 (got "${raw}").`)
    }
    return value
}

// Conservative default: ONE worker until the site's rate limits are understood.
const workers = Math.max(1, positiveInt('PLAYWRIGHT_WORKERS', 1))

export const env = {
    baseUrl: required('WEB_BASE_URL').replace(/\/$/, ''),
    adminEmail: required('WEB_ADMIN_EMAIL'),
    adminPassword: required('WEB_ADMIN_PASSWORD'),

    workers,
    /**
     * Minimum gap between page loads across ALL workers (shared limiter).
     * Default: none for one worker, 1000 ms when several workers share the site.
     */
    minRequestIntervalMs: positiveInt('REQUEST_MIN_INTERVAL_MS', workers > 1 ? 1000 : 0),
    /** AUTH_REFRESH=1 forces a fresh login even when the saved session is still valid. */
    forceAuthRefresh: process.env.AUTH_REFRESH === '1',
    /** Slows every browser action down by this many ms, so a headed run is easy to watch. */
    slowMoMs: positiveInt('PLAYWRIGHT_SLOW_MO', 0),

    /**
     * The dedicated QA course used by the course tests (created during exploratory testing).
     * Tests that create lessons put them in this chapter and delete them again afterwards.
     */
    qa: {
        courseId: process.env.QA_COURSE_ID ?? '49589',
        chapterId: process.env.QA_CHAPTER_ID ?? '168197',
        courseName: process.env.QA_COURSE_NAME ?? 'QA-Explore Course',
    },
}

/** Where generated (private, git-ignored) authentication state is stored. */
export const AUTH_DIR = join('playwright', '.auth')
export const storageStatePath = (name: string) => join(AUTH_DIR, `${name}.json`)

/**
 * The disposable marketplace seller used by the seller tests (QA_SELLER_EMAIL / QA_SELLER_PASSWORD in .env).
 * Use an address that receives no mail, such as one on example.com.
 */
export function sellerAccount(): Account & { name: string } {
    const email = process.env.QA_SELLER_EMAIL
    const password = process.env.QA_SELLER_PASSWORD
    if (!email || !password) {
        throw new Error('Missing QA_SELLER_EMAIL / QA_SELLER_PASSWORD. Add them to .env (see .env.example).')
    }
    return { email, password, name: process.env.QA_SELLER_NAME ?? 'QA Seller' }
}

/** The primary admin session, shared by independent read-only tests. */
export const ADMIN_STORAGE_STATE = storageStatePath('admin')

export interface Account {
    email: string
    password: string
}

/** The primary admin account (WEB_ADMIN_EMAIL / WEB_ADMIN_PASSWORD in .env). */
export const adminAccount = (): Account => ({ email: env.adminEmail, password: env.adminPassword })

/**
 * Account for a worker slot. Slot 0 is the primary admin. Extra slots come from
 * WEB_ADMIN_EMAIL_<n> / WEB_ADMIN_PASSWORD_<n> and are only needed by tests that change data
 * when running with more than one worker. Returns undefined when that slot has no account.
 */
export function accountForSlot(slot: number): Account | undefined {
    if (slot === 0) return adminAccount()
    const email = process.env[`WEB_ADMIN_EMAIL_${slot}`]
    const password = process.env[`WEB_ADMIN_PASSWORD_${slot}`]
    return email && password ? { email, password } : undefined
}
