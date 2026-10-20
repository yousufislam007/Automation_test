import type { Browser, BrowserContext, Page } from '@playwright/test'
import { ADMIN_STORAGE_STATE, env, sellerAccount } from '../config/env'
import { LoginPage } from '../pages/LoginPage'
import { MarketplaceSellersPage } from '../pages/MarketplaceSellersPage'
import { writeTest } from './fixtures'

/** A saved browser login (cookies and storage). */
export type SavedSession = Awaited<ReturnType<BrowserContext['storageState']>>

/** What the login API answered, for example `{ status: 200, body: { require_approval: true } }`. */
export interface LoginResult {
    status: number
    body: Record<string, unknown>
}

const NOT_LOGGED_IN: SavedSession = { cookies: [], origins: [] }

/** A seller's own browser, completely separate from the admin's. */
export class SellerSession {
    readonly loginPage: LoginPage

    constructor(
        readonly context: BrowserContext,
        readonly page: Page
    ) {
        this.loginPage = new LoginPage(page)
    }

    /** True when the seller really got login cookies (the access cookie is only set for an approved seller). */
    async hasSession(): Promise<boolean> {
        return (await this.context.cookies()).some((cookie) => cookie.name === '__Host-access')
    }

    /** A copy of this browser's login, to use again later with `seller.openWithSession()`. */
    saveSession(): Promise<SavedSession> {
        return this.context.storageState()
    }

    /** Closes this browser. Use it to simulate "the seller is away", so it makes no more requests. */
    async close() {
        await this.context.close().catch(() => undefined)
    }
}

/** A seller's browser right after a login attempt. */
export class LoggedInSeller extends SellerSession {
    constructor(
        context: BrowserContext,
        page: Page,
        readonly login: LoginResult
    ) {
        super(context, page)
    }
}

export interface Seller {
    /** The disposable test seller (QA_SELLER_EMAIL / QA_SELLER_PASSWORD in .env). */
    account: ReturnType<typeof sellerAccount>
    /** Opens a brand-new browser (nobody logged in) and logs the seller in. Uses one real login request. */
    logIn(): Promise<LoggedInSeller>
    /** Opens a browser that already holds a saved seller login, for example an older one. Makes no login request. */
    openWithSession(state: SavedSession): Promise<SellerSession>
}

/**
 * For tests about marketplace sellers. They change the test seller's approval status, so they must run one after
 * another and use `writeTest`'s admin account.
 *
 *  - `sellersAdmin`: the admin's "Marketplace > Seller" screen (approve / reject the test seller).
 *  - `seller`: the seller's side, in browsers separate from the admin's. All of them are closed when the test ends.
 */
export const marketplaceTest = writeTest.extend<{ seller: Seller; sellersAdmin: MarketplaceSellersPage }>({
    sellersAdmin: async ({ page }, use) => {
        await use(new MarketplaceSellersPage(page))
    },

    seller: async ({ browser }, use, testInfo) => {
        const account = sellerAccount()
        const contexts: BrowserContext[] = []

        // Playwright Test gives browser.newContext() the project's saved ADMIN login unless told otherwise, so a
        // seller browser is always opened with an explicit state: nobody logged in, or a saved seller login.
        const openBrowser = async (state: SavedSession) => {
            const context = await browser.newContext({ baseURL: env.baseUrl, storageState: state })
            contexts.push(context)
            return { context, page: await context.newPage() }
        }

        await use({
            account,

            async logIn() {
                const { context, page } = await openBrowser(NOT_LOGGED_IN)
                const loginPage = new LoginPage(page)
                try {
                    await loginPage.goto()
                } catch (error) {
                    // This browser is not the test's own page, so Playwright does not capture it: attach what it saw.
                    await testInfo.attach('seller-browser', { body: await page.screenshot(), contentType: 'image/png' })
                    await testInfo.attach('seller-browser-url', { body: page.url(), contentType: 'text/plain' })
                    throw error
                }
                const login = await loginPage.loginViaApiDetailed(account.email, account.password)
                return new LoggedInSeller(context, page, login)
            },

            async openWithSession(state) {
                const { context, page } = await openBrowser(state)
                return new SellerSession(context, page)
            },
        })

        await Promise.all(contexts.map((context) => context.close().catch(() => undefined)))
    },
})

/**
 * Runs `action` with the admin's "Marketplace > Seller" screen in its own browser. For `beforeAll` / `afterAll`
 * hooks, which cannot use the per-test `sellersAdmin` fixture.
 */
export async function withAdminSellersPage<T>(
    browser: Browser,
    action: (sellers: MarketplaceSellersPage) => Promise<T>
): Promise<T> {
    const context = await browser.newContext({ baseURL: env.baseUrl, storageState: ADMIN_STORAGE_STATE })
    try {
        return await action(new MarketplaceSellersPage(await context.newPage()))
    } finally {
        await context.close()
    }
}

export { expect } from './fixtures'
