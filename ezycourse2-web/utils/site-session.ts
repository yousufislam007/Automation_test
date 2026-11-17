import type { SiteSession } from './auth'

/**
 * The ONLY place that knows how EzyCourse 2.0 logs in. NOT MAPPED YET.
 * When the login page is explored: set `mapped: true`, `checkUrl` (a page only a logged-in user can open),
 * `isLoggedIn` (what proves the session is alive) and `login` (fill the form, send ONE request, return the HTTP status).
 * See ../ezycommunity-web/utils/site-session.ts for a finished example.
 */
export const siteSession: SiteSession = {
    mapped: false,
    checkUrl: '/',
    async isLoggedIn() {
        return false
    },
    async login() {
        throw new Error('The EzyCourse 2.0 login flow is not mapped yet (utils/site-session.ts).')
    },
}
