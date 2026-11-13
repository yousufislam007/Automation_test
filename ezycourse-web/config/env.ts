import { config } from 'dotenv'
import { join, resolve } from 'node:path'

export interface Account {
    email: string
    password: string
}

/** The project folder, so `.env` and auth files do not depend on where the command was started (for example the VS Code extension runs from the repo root). */
const PROJECT_ROOT = resolve(__dirname, '..')
config({ path: join(PROJECT_ROOT, '.env'), quiet: true })

/** The trimmed value, or undefined when it is missing or blank. */
function optional(name: string): string | undefined {
    const value = process.env[name]?.trim()
    return value ? value : undefined
}

function required(name: string): string {
    const value = optional(name)
    if (!value) {
        throw new Error(`Missing ${name}. Copy .env.example to .env and fill it in.`)
    }
    return value
}

function wholeNumber(name: string, fallback: number, min = 0): number {
    const raw = optional(name)
    if (raw === undefined) return fallback
    const value = Number(raw)
    if (!Number.isInteger(value) || value < min) {
        throw new Error(`${name} must be a whole number >= ${min} (got "${raw}").`)
    }
    return value
}

function baseUrl(): string {
    // WEB_URL is the name now used in .env; WEB_BASE_URL is still accepted.
    const raw = optional('WEB_BASE_URL') ?? required('WEB_URL')
    try {
        new URL(raw)
    } catch {
        throw new Error(`WEB_URL is not a valid URL (got "${raw}"). Example: https://yourschool.ezycourse.com`)
    }
    return raw.replace(/\/+$/, '')
}

// Default 3 workers: page loads stay spaced out by the shared limiter (minRequestIntervalMs), and the login tests
// are serial in one file. Set PLAYWRIGHT_WORKERS=1 if the site starts answering HTTP 429.
const workers = wholeNumber('PLAYWRIGHT_WORKERS', 3, 1)

export const env = {
    // Read on use, so importing this file does not fail when .env is missing.
    get baseUrl() {
        return baseUrl()
    },
    get adminEmail() {
        return required('WEB_ADMIN_EMAIL')
    },
    get adminPassword() {
        return required('WEB_ADMIN_PASSWORD')
    },
    /** Student account 1 to 4 (STUDENT_<n>_EMAIL / STUDENT_<n>_PASSWORD in .env). Never print the values. */
    student(slot: 1 | 2 | 3 | 4): Account {
        return { email: required(`STUDENT_${slot}_EMAIL`), password: required(`STUDENT_${slot}_PASSWORD`) }
    },

    workers,
    /**
     * Minimum gap between page loads across ALL workers (shared limiter).
     * Default: none for one worker, 1000 ms when several workers share the site.
     */
    minRequestIntervalMs: wholeNumber('REQUEST_MIN_INTERVAL_MS', workers > 1 ? 1000 : 0),
    /** AUTH_REFRESH=1 forces a fresh login even when the saved session is still valid. */
    forceAuthRefresh: optional('AUTH_REFRESH') === '1',
    /**
     * A saved session checked (or created) less than this many minutes ago is trusted without opening the site
     * again (saves a browser start and a page load, about 5 s, on every run). 0 = always check.
     */
    authTrustMinutes: wholeNumber('AUTH_TRUST_MIN', 20),
    /** PLAYWRIGHT_TRACE=1 records a trace for every test and keeps it on failure (costs about 10% per test). */
    traceOnFailure: optional('PLAYWRIGHT_TRACE') === '1',
    /** Slows every browser action down by this many ms, so a headed run is easy to watch. */
    slowMoMs: wholeNumber('PLAYWRIGHT_SLOW_MO', 0),

    /**
     * The dedicated QA course used by the course tests (created during exploratory testing).
     * Tests that create lessons put them in this chapter and delete them again afterwards.
     * The defaults are this project's QA course; set QA_COURSE_* in .env to use another one.
     */
    qa: {
        courseId: optional('QA_COURSE_ID') ?? '49589',
        chapterId: optional('QA_CHAPTER_ID') ?? '168197',
        courseName: optional('QA_COURSE_NAME') ?? 'QA-Explore Course',
    },
}

/** Where generated (private, git-ignored) authentication state is stored. */
export const AUTH_DIR = join(PROJECT_ROOT, 'playwright', '.auth')
export const storageStatePath = (name: string) => join(AUTH_DIR, `${name}.json`)

/**
 * The disposable marketplace seller used by the seller tests (QA_SELLER_EMAIL / QA_SELLER_PASSWORD in .env).
 * Use an address that receives no mail, such as one on example.com.
 */
export function sellerAccount(): Account & { name: string } {
    const email = optional('QA_SELLER_EMAIL')
    const password = optional('QA_SELLER_PASSWORD')
    if (!email || !password) {
        throw new Error('Missing QA_SELLER_EMAIL / QA_SELLER_PASSWORD. Add them to .env (see .env.example).')
    }
    return { email, password, name: optional('QA_SELLER_NAME') ?? 'QA Seller' }
}

/** Saved login session of student account 1 to 4 (created by the meeting discovery / setup step, git-ignored). */
export const studentStorageState = (slot: 1 | 2 | 3 | 4) => storageStatePath(`student-${slot}`)

/** The primary admin session, shared by independent read-only tests. */
export const ADMIN_STORAGE_STATE = storageStatePath('admin')

/** The primary admin account (WEB_ADMIN_EMAIL / WEB_ADMIN_PASSWORD in .env). */
export const adminAccount = (): Account => ({ email: env.adminEmail, password: env.adminPassword })

/**
 * Account for a worker slot. Slot 0 is the primary admin. Extra slots come from
 * WEB_ADMIN_EMAIL_<n> / WEB_ADMIN_PASSWORD_<n> and are only needed by tests that change data
 * when running with more than one worker. Returns undefined when that slot has no account.
 */
export function accountForSlot(slot: number): Account | undefined {
    if (slot === 0) return adminAccount()
    const email = optional(`WEB_ADMIN_EMAIL_${slot}`)
    const password = optional(`WEB_ADMIN_PASSWORD_${slot}`)
    return email && password ? { email, password } : undefined
}
