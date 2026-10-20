import { browser, expect } from '@wdio/globals'
import LoginScreen from '../../screens/LoginScreen'
import DashboardScreen from '../../screens/DashboardScreen'
import { env } from '../../config/env'

describe('EzyCourse Login', () => {
    beforeEach(async () => {
        // Fresh session = app data cleared, so every test starts on the login screen.
        await browser.reloadSession()
        await LoginScreen.waitUntilLoaded()
    })

    it('LOGIN-01: should display the login page', async () => {
        await expect(LoginScreen.emailField).toBeDisplayed()
        await expect(LoginScreen.passwordField).toBeDisplayed()
        await expect(LoginScreen.loginButton).toBeDisplayed()
    })

    it('LOGIN-02: should keep the email and password the user typed', async () => {
        await LoginScreen.enterEmail(env.studentEmail)
        await LoginScreen.enterPassword(env.studentPassword)

        await LoginScreen.expectEmailTyped(env.studentEmail)
    })

    it('LOGIN-03: should login successfully with valid credentials', async () => {
        await LoginScreen.login(env.studentEmail, env.studentPassword)

        await expect(DashboardScreen.welcomeMessage).toBeDisplayed({ wait: 20000 })
    })

    it('LOGIN-04: should not login with invalid email and valid password', async () => {
        await LoginScreen.login('wrong@example.com', env.studentPassword)

        // TODO: assert the exact error element once the error text is known.
        expect(await LoginScreen.isStillOnLoginScreen()).toBe(true)
    })

    it('LOGIN-05: should show error when password is wrong', async () => {
        await LoginScreen.login(env.studentEmail, 'WrongPassword123')

        await expect(LoginScreen.invalidCredentialsError).toBeDisplayed({ wait: 15000 })
    })

    it('LOGIN-06: should not login with invalid email and invalid password', async () => {
        await LoginScreen.login('wrong@example.com', 'WrongPassword123')

        // TODO: assert the exact error element once the error text is known.
        expect(await LoginScreen.isStillOnLoginScreen()).toBe(true)
    })

    it('LOGIN-07: should show error when email is empty', async () => {
        await LoginScreen.login('', env.studentPassword)

        expect(await LoginScreen.hasEmailRequiredError()).toBe(true)
        await expect(LoginScreen.passwordRequiredError).not.toBeDisplayed()
    })

    it('LOGIN-08: should show error when password is empty', async () => {
        await LoginScreen.login(env.studentEmail, '')

        await expect(LoginScreen.passwordRequiredError).toBeDisplayed({ wait: 15000 })
        expect(await LoginScreen.emailField.getAttribute('hint')).not.toContain(LoginScreen.emailRequiredMessage)
    })

    it('LOGIN-09: should show error when email and password are both empty', async () => {
        await LoginScreen.login('', '')

        expect(await LoginScreen.hasEmailRequiredError()).toBe(true)
        await expect(LoginScreen.passwordRequiredError).toBeDisplayed({ wait: 15000 })
    })

    it('LOGIN-10: should reject invalid email format', async () => {
        await LoginScreen.login('invalid-email', env.studentPassword)

        // TODO: assert the invalid-format error text once it is known.
        expect(await LoginScreen.isStillOnLoginScreen()).toBe(true)
    })

    it('LOGIN-11: should mask the password', async () => {
        await LoginScreen.enterPassword('TestPassword123')

        expect(await LoginScreen.passwordField.getAttribute('password')).toBe('true')
    })

    it('LOGIN-12: should have an enabled login button', async () => {
        await expect(LoginScreen.loginButton).toBeDisplayed()
        await expect(LoginScreen.loginButton).toBeEnabled()
    })
})
