import { test, expect } from '../../playwright/fixtures'
import { env } from '../../config/env'
import { LoginPage } from '../../pages/LoginPage'
import { DashboardPage } from '../../pages/DashboardPage'

// The login API only allows 10 requests per window, so this file keeps real login calls to a minimum.
// Tests that need more real logins are in login-extended.spec.ts.
test.describe('Admin login', { tag: '@login' }, () => {
    let loginPage: LoginPage

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page)
        await loginPage.goto()
    })

    test('LOGIN-01: should display the login page', async () => {
        await expect(loginPage.emailInput).toBeVisible()
        await expect(loginPage.passwordInput).toBeVisible()
        await expect(loginPage.signInButton).toBeEnabled()
        await expect(loginPage.forgotPasswordLink).toBeVisible()
    })

    test('LOGIN-02: should login successfully with valid credentials', async ({ page }) => {
        await loginPage.loginViaApi(env.adminEmail, env.adminPassword)

        await new DashboardPage(page).expectLoaded()
    })

    test('LOGIN-03: should show error when password is wrong', async ({ page }) => {
        await loginPage.loginViaApi(env.adminEmail, 'WrongPassword123')

        await expect(loginPage.invalidCredentialsError).toBeVisible()
        await expect(page).toHaveURL(/\/en\/login/)
    })

    test('LOGIN-04: should show error when email does not exist', async ({ page }) => {
        await loginPage.loginViaApi('nobody.here@example.com', env.adminPassword)

        await expect(loginPage.invalidCredentialsError).toBeVisible()
        await expect(page).toHaveURL(/\/en\/login/)
    })

    test('LOGIN-05: should show error when password is empty', async ({ page }) => {
        await loginPage.login(env.adminEmail, '')

        await expect(loginPage.passwordRequiredError).toBeVisible()
        await expect(page).toHaveURL(/\/en\/login/)
    })

    test('LOGIN-06: should not submit when email is empty', async ({ page }) => {
        await loginPage.login('', env.adminPassword)

        // The browser blocks the submit with its own message, so the app shows none.
        expect(await loginPage.validationMessage(loginPage.emailInput)).not.toBe('')
        await expect(page).toHaveURL(/\/en\/login/)
    })

    test('LOGIN-07: should not submit when email and password are both empty', async ({ page }) => {
        await loginPage.login('', '')

        expect(await loginPage.validationMessage(loginPage.emailInput)).not.toBe('')
        await expect(page).toHaveURL(/\/en\/login/)
    })

    test('LOGIN-08: should reject an invalid email format', async ({ page }) => {
        await loginPage.login('invalid-email', env.adminPassword)

        expect(await loginPage.validationMessage(loginPage.emailInput)).toContain('@')
        await expect(page).toHaveURL(/\/en\/login/)
    })

    test('LOGIN-09: should mask the password', async () => {
        await loginPage.passwordInput.fill('TestPassword123')

        await expect(loginPage.passwordInput).toHaveAttribute('type', 'password')
    })

    test('LOGIN-10: should open the forgot password page', async ({ page }) => {
        await loginPage.forgotPasswordLink.click()

        await expect(page).toHaveURL(/\/en\/forgot-password/)
    })

    test('LOGIN-11: should open the sign up page', async ({ page }) => {
        await loginPage.signUpLink.click()

        await expect(page).toHaveURL(/\/en\/signup/)
    })

    test('LOGIN-12: should have the correct page title', async ({ page }) => {
        await expect(page).toHaveTitle('User Login – Access Your Account Securely')
    })

    test('LOGIN-13: should show and hide the password', async () => {
        await loginPage.passwordInput.fill('TestPassword123')

        await loginPage.showPasswordButton.click()
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'text')

        await loginPage.hidePasswordButton.click()
        await expect(loginPage.passwordInput).toHaveAttribute('type', 'password')
    })

    // TODO: the API answers 422 "Invalid email address" for a 300-character email. What the page
    // shows for it still has to be checked (read the toast text, then assert it here).
    test.fixme('LOGIN-14: should show an error for a very long email', async ({ page }) => {
        await loginPage.login('a'.repeat(300) + '@example.com', env.adminPassword)

        await expect(page).toHaveURL(/\/en\/login/)
    })

    // The server firewall blocks SQL-like input with HTTP 403; the page shows a generic toast.
    test('LOGIN-15: should show a generic error for SQL-like input', async ({ page }) => {
        await loginPage.login("admin'--@example.com", "' OR '1'='1")

        await expect(loginPage.loginFailedToast).toBeVisible()
        await expect(page).toHaveURL(/\/en\/login/)
    })
})
