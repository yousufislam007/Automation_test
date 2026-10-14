import { existsSync } from 'node:fs'
import { expect, test as setup } from '@playwright/test'
import { ADMIN_STORAGE_STATE, adminAccount } from '../config/env'
import { ensureAuthenticated } from '../utils/auth'

// Makes sure playwright/.auth/admin.json holds a valid logged-in session.
// It logs in only when the file is missing, the session expired, or AUTH_REFRESH=1 is set.
// Otherwise it just checks the saved session (one page load, no login request).
setup('authenticate as admin (log in only if needed)', async ({ browser }) => {
    setup.setTimeout(120_000)

    const result = await ensureAuthenticated(browser, adminAccount(), ADMIN_STORAGE_STATE)

    console.info(`[auth] admin session: ${result}`)
    expect(existsSync(ADMIN_STORAGE_STATE), 'the saved admin login must exist').toBe(true)
})
