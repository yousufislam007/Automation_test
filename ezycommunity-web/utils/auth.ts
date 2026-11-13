import { existsSync, mkdirSync, renameSync, statSync } from 'node:fs'
import { dirname } from 'node:path'
import type { Browser, BrowserContext, Page } from '@playwright/test'
import { env, type Account } from '../config/env'
import { assertLoginBudget, recordLogin, recordLoginBlocked } from './login-budget'
import { RateLimitError } from './rate-limit'

export type SessionCheck = 'valid' | 'expired'

/** What is specific to the EzyCommunity site. Implemented in `utils/site-session.ts` once the login flow is mapped. */
export interface SiteSession {
    /** False until the login flow is mapped: the setup project then skips instead of failing. */
    readonly mapped: boolean
    /** Path opened with the saved session to find out whether it is still valid. */
    readonly checkUrl: string
    /** True when the page shows a logged-in user. */
    isLoggedIn(page: Page): Promise<boolean>
    /** Logs in with ONE login request. Returns the HTTP status the login API answered. */
    login(page: Page, account: Account): Promise<number>
}

/** Saves browser state without ever leaving a half-written file (write to a temp file, then rename). */
export async function saveState(context: BrowserContext, statePath: string) {
    mkdirSync(dirname(statePath), { recursive: true })
    const tmp = `${statePath}.${process.pid}.tmp`
    await context.storageState({ path: tmp, indexedDB: true })
    renameSync(tmp, statePath)
}

/**
 * Opens a page with the saved state and checks that we really are logged in.
 * (A bare "file exists" check would not notice cookies that expired or were revoked.)
 * If the session is valid it is saved again, so cookies the site rotated are kept.
 */
export async function checkSession(browser: Browser, site: SiteSession, statePath: string): Promise<SessionCheck> {
    const context = await browser.newContext({ baseURL: env.baseUrl, storageState: statePath })
    try {
        const page = await context.newPage()
        const response = await page.goto(site.checkUrl)
        if (response?.status() === 429) {
            // Not "expired": logging in again now would only make the rate limit worse.
            throw new RateLimitError(
                'Could not check the saved session because the site answered HTTP 429. Wait a few minutes and run again.'
            )
        }
        if (!(await site.isLoggedIn(page))) return 'expired'
        await saveState(context, statePath)
        return 'valid'
    } finally {
        await context.close()
    }
}

/**
 * Logs in (ONE login request) and saves the session. The login is never retried: it is counted in the
 * login log first, and refused when the budget for the window is used up or the last answer was HTTP 429.
 */
export async function loginAndSave(browser: Browser, site: SiteSession, account: Account, statePath: string) {
    assertLoginBudget()
    const context = await browser.newContext({ baseURL: env.baseUrl })
    try {
        const page = await context.newPage()
        recordLogin()
        const status = await site.login(page, account)
        if (status === 429) {
            recordLoginBlocked()
            throw new RateLimitError('The login API answered HTTP 429. Wait 10-15 minutes. Not retrying.')
        }
        if (status === 400 || status === 401) {
            throw new Error('Login was rejected. Check the account email and password in .env.')
        }
        if (status >= 400) throw new Error(`Login failed with HTTP ${status}.`)
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
    site: SiteSession,
    account: Account,
    statePath: string,
    { forceRefresh = env.forceAuthRefresh } = {}
): Promise<'reused' | 'logged-in-missing' | 'logged-in-expired' | 'logged-in-forced'> {
    if (forceRefresh) {
        await loginAndSave(browser, site, account, statePath)
        return 'logged-in-forced'
    }
    if (!existsSync(statePath)) {
        await loginAndSave(browser, site, account, statePath)
        return 'logged-in-missing'
    }
    // The file is rewritten on every successful check, so its age says when the session was last seen valid.
    if (isFresh(statePath)) return 'reused'
    if ((await checkSession(browser, site, statePath)) === 'valid') return 'reused'

    await loginAndSave(browser, site, account, statePath)
    return 'logged-in-expired'
}

/** True when the saved session was checked or created less than env.authTrustMinutes ago (0 disables this). */
export function isFresh(statePath: string, trustMinutes = env.authTrustMinutes): boolean {
    if (trustMinutes <= 0) return false
    const ageMs = Date.now() - statSync(statePath).mtimeMs
    return ageMs >= 0 && ageMs < trustMinutes * 60_000
}
