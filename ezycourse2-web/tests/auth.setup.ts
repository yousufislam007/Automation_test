import { existsSync } from 'node:fs'
import { expect, test as setup } from '@playwright/test'
import { ADMIN_STORAGE_STATE, MEMBER_STORAGE_STATE, adminAccount, memberAccount } from '../config/env'
import { ensureAuthenticated } from '../utils/auth'
import { siteSession } from '../utils/site-session'

// Makes sure playwright/.auth/<account>.json holds a valid logged-in session.
// It logs in only when the file is missing, the session expired, or AUTH_REFRESH=1 is set.
// Otherwise it just checks the saved session (one page load, no login request).
const accounts = [
    { name: 'admin', account: adminAccount, statePath: ADMIN_STORAGE_STATE },
    { name: 'member', account: memberAccount, statePath: MEMBER_STORAGE_STATE },
]

for (const { name, account, statePath } of accounts) {
    setup(`authenticate as ${name} (log in only if needed)`, async ({ browser }) => {
        // eslint-disable-next-line playwright/no-skipped-test -- skipped on purpose until the login flow is mapped
        setup.skip(!siteSession.mapped, 'The login flow is not mapped yet (utils/site-session.ts).')
        setup.setTimeout(120_000)

        const result = await ensureAuthenticated(browser, siteSession, account(), statePath)

        console.info(`[auth] ${name} session: ${result}`)
        expect(existsSync(statePath), `the saved ${name} login must exist`).toBe(true)
    })
}
