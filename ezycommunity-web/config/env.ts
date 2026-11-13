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

/**
 * The ONLY community these tests may use. Never point them at another community (or another site) without the
 * owner's permission: if the owner allows it, change this constant together with WEB_BASE_URL.
 */
export const ALLOWED_ORIGIN = 'https://sqa.ezycommunity.pro.bd'

function baseUrl(): string {
    const raw = required('WEB_BASE_URL')
    let origin: string
    try {
        origin = new URL(raw).origin
    } catch {
        throw new Error(`WEB_BASE_URL is not a valid URL (got "${raw}"). Expected ${ALLOWED_ORIGIN}`)
    }
    if (origin !== ALLOWED_ORIGIN) {
        throw new Error(
            `WEB_BASE_URL points to ${origin}, but only ${ALLOWED_ORIGIN} may be tested. Do not switch community without the owner's permission.`
        )
    }
    return ALLOWED_ORIGIN
}

// Default 3 workers: page loads stay spaced out by the shared limiter (minRequestIntervalMs).
// Set PLAYWRIGHT_WORKERS=1 if the site starts answering HTTP 429.
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
    get memberEmail() {
        return required('WEB_MEMBER_EMAIL')
    },
    get memberPassword() {
        return required('WEB_MEMBER_PASSWORD')
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
    /** Real logins allowed per window before the tests refuse to log in again (the site allows about 10). */
    loginBudgetMax: wholeNumber('LOGIN_BUDGET_MAX', 8, 1),
    /** Length of that window in minutes (the site blocks for about 10-15 minutes). */
    loginBudgetWindowMin: wholeNumber('LOGIN_BUDGET_WINDOW_MIN', 15, 1),
    /** Slows every browser action down by this many ms, so a headed run is easy to watch. */
    slowMoMs: wholeNumber('PLAYWRIGHT_SLOW_MO', 0),
}

/** Where generated (private, git-ignored) authentication state is stored. */
export const AUTH_DIR = join(PROJECT_ROOT, 'playwright', '.auth')
/** Where generated (git-ignored) limiter files are stored: the shared request spacing and the login log. */
export const RATE_DIR = join(PROJECT_ROOT, 'playwright', '.rate')
export const storageStatePath = (name: string) => join(AUTH_DIR, `${name}.json`)

export const ADMIN_STORAGE_STATE = storageStatePath('admin')
export const MEMBER_STORAGE_STATE = storageStatePath('member')

export const adminAccount = (): Account => ({ email: env.adminEmail, password: env.adminPassword })
export const memberAccount = (): Account => ({ email: env.memberEmail, password: env.memberPassword })
