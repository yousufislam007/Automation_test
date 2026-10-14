import { test, expect } from '../../playwright/fixtures'
import { LoginPage } from '../../pages/LoginPage'

// Runs as the logged-in admin (see the "admin" project in playwright.config.ts).
test.describe('Login page while already logged in', { tag: '@session' }, () => {
    test('LOGIN-16: should tell a logged-in user they are already logged in', async ({ page }) => {
        await page.goto('/en/login')
        const loginPage = new LoginPage(page)

        await expect(loginPage.alreadyLoggedInMessage).toBeVisible()
        await expect(loginPage.goToHomeButton).toBeVisible()
        await expect(loginPage.signInButton).toHaveCount(0)
    })
})
