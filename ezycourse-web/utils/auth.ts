import { mkdirSync, renameSync, existsSync, statSync } from 'node:fs'
import { dirname } from 'node:path'
import type { Browser } from '@playwright/test'
import { env, type Account } from '../config/env'
import { LoginPage } from '../pages/LoginPage'
import { RateLimitError } from './rate-limit'

export type SessionCheck = 'valid' | 'expired'

/** Saves browser state without ever leaving a half-written file (write to a temp file, then rename). */
export async function saveState(context: import('@playwright/test').BrowserContext, statePath: string) {
    mkdirSync(dirname(statePath), { recursive: true })
    const tmp = `${statePath}.${process.pid}.tmp`
    // indexedDB: true is a no-op for this site today (no IndexedDB auth) but keeps the state complete if that changes.
    await context.storageState({ path: tmp, indexedDB: true })
    renameSync(tmp, statePath)
}

/**
 * Opens an authenticated page with the saved state and checks that we really are logged in.
 * Login indicator: we stay under /dashboard and the tab title is "Dashboard | Admin".
 * (A bare "file exists" check would not notice cookies that expired or were revoked.)
 * If the session is valid, the state is saved again so any cookies the site rotated are kept.
 */
export async function checkSession(browser: Browser, statePath: string): Promise<SessionCheck> {
    const context = await browser.newContext({ baseURL: env.baseUrl, storageState: statePath })
    try {
        const page = await context.newPage()
        const response = await page.goto('/dashboard/')
        if (response?.status() === 429) {
            // Not "expired": logging in again now would only make the rate limit worse.
            throw new RateLimitError(
                'Could not check the saved session because the site answered HTTP 429. Wait a few minutes and run again.'
            )
        }
        await page.waitForFunction(
            () => document.title.includes('Admin') || location.pathname.includes('login'),
            undefined,
            { timeout: 20_000 }
        )
        const loggedIn =
            new URL(page.url()).pathname.startsWith('/dashboard') && (await page.title()) === 'Dashboard | Admin'
        if (!loggedIn) return 'expired'
        await saveState(context, statePath)
        return 'valid'
    } finally {
        await context.close()
    }
}

/** Logs in through the login page (ONE login API request) and saves the session. */
export async function loginAndSave(browser: Browser, account: Account, statePath: string) {
    const context = await browser.newContext({ baseURL: env.baseUrl })
    try {
        const page = await context.newPage()
        const loginPage = new LoginPage(page)
        await loginPage.goto()
        const status = await loginPage.loginViaApi(account.email, account.password) // throws on HTTP 429
        if (status === 400) {
            throw new Error('Login was rejected ("Invalid credentials"). Check the account email and password in .env.')
        }
        if (status >= 400) throw new Error(`Login failed with HTTP ${status}.`)
        await page.waitForURL(/\/dashboard/, { timeout: 30_000 })
        await saveState(context, statePath)
    } finally {
        await context.close()
    }
}

/**
 * Makes sure `statePath` holds a valid logged-in session. Logs in ONLY when the file is missing,
 * the session is no longer valid, or a refresh was requested with AUTH_REFRESH=1.
 * Returns what was done so callers can report it.
 */
export async function ensureAuthenticated(
    browser: Browser,
    account: Account,
    statePath: string,
    { forceRefresh = env.forceAuthRefresh } = {}
): Promise<'reused' | 'logged-in-missing' | 'logged-in-expired' | 'logged-in-forced'> {
    if (forceRefresh) {
        await loginAndSave(browser, account, statePath)
        return 'logged-in-forced'
    }
    if (!existsSync(statePath)) {
        await loginAndSave(browser, account, statePath)
        return 'logged-in-missing'
    }
    // The file is rewritten on every successful check, so its age says when the session was last seen valid.
    if (isFresh(statePath)) return 'reused'
    if ((await checkSession(browser, statePath)) === 'valid') return 'reused'

    await loginAndSave(browser, account, statePath)
    return 'logged-in-expired'
}

/** True when the saved session was checked or created less than env.authTrustMinutes ago (0 disables this). */
export function isFresh(statePath: string, trustMinutes = env.authTrustMinutes): boolean {
    if (trustMinutes <= 0) return false
    const ageMs = Date.now() - statSync(statePath).mtimeMs
    return ageMs >= 0 && ageMs < trustMinutes * 60_000
}
