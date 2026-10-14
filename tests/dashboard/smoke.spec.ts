import { DashboardPage } from '../../pages/DashboardPage'
import { expect, test } from '../../playwright/fixtures'
import { DASHBOARD_PAGES } from '../../test-data/dashboard-pages'

// Opens every admin dashboard page and checks it loads. Runs as the logged-in admin, reusing the
// saved session. Read-only, so all workers may share the same session. Page loads go through
// pacedGoto: spaced out across workers and retried only on HTTP 429.
test.describe('Dashboard smoke test', { tag: '@smoke' }, () => {
    for (const info of DASHBOARD_PAGES) {
        test(`SMOKE: should load ${info.path}`, async ({ page, pacedGoto }) => {
            const response = await pacedGoto(info.path)

            expect(response?.status(), 'page response status').toBeLessThan(400)
            await new DashboardPage(page).expectPageLoaded({ path: info.expectedPath, title: info.title })
        })
    }
})
