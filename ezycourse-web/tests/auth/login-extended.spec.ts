import { test, expect } from '../../playwright/fixtures'
import { env } from '../../config/env'
import { LoginPage } from '../../pages/LoginPage'
import { DashboardPage } from '../../pages/DashboardPage'

// Login edge cases that each send a real login request.
// The login API allows only 10 requests per window (about 10-15 minutes), so these are NOT part of
// `npm test`. Run them on their own, at least 15 minutes after any other login test:
//     npm run test:login-extended
test.describe('Admin login (extended)', { tag: ['@login', '@extended'] }, () => {
    let loginPage: LoginPage

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page)
        await loginPage.goto()
    })

    test('LOGIN-EXT-01: should login when pressing Enter in the password field', async ({ page }) => {
        await loginPage.loginViaApi(env.adminEmail, env.adminPassword, { pressEnter: true })

        await new DashboardPage(page).expectLoaded()
    })

    test('LOGIN-EXT-02: should ignore spaces around the email', async ({ page }) => {
        await loginPage.loginViaApi(`  ${env.adminEmail}  `, env.adminPassword)

        await new DashboardPage(page).expectLoaded()
    })

    test('LOGIN-EXT-03: should treat the email as case-insensitive', async ({ page }) => {
        await loginPage.loginViaApi(env.adminEmail.toUpperCase(), env.adminPassword)

        await new DashboardPage(page).expectLoaded()
    })

    test('LOGIN-EXT-04: should treat the password as case-sensitive', async ({ page }) => {
        await loginPage.loginViaApi(env.adminEmail, env.adminPassword.toUpperCase())

        await expect(loginPage.invalidCredentialsError).toBeVisible()
        await expect(page).toHaveURL(/\/en\/login/)
    })

    test('LOGIN-EXT-05: should not accept a password made only of spaces', async ({ page }) => {
        await loginPage.loginViaApi(env.adminEmail, '   ')

        await expect(loginPage.invalidCredentialsError).toBeVisible()
        await expect(page).toHaveURL(/\/en\/login/)
    })

    test('LOGIN-EXT-06: should not trim spaces in the password', async ({ page }) => {
        await loginPage.loginViaApi(env.adminEmail, ` ${env.adminPassword}`)

        await expect(loginPage.invalidCredentialsError).toBeVisible()
        await expect(page).toHaveURL(/\/en\/login/)
    })
})
