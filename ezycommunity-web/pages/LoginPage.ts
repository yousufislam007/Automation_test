import { expect, type Page } from '@playwright/test'
import BasePage from './BasePage'

export default class LoginPage extends BasePage {
    protected readonly path = '/login'

    private readonly emailInput = this.page.getByPlaceholder('you@example.com')
    private readonly passwordInput = this.page.getByPlaceholder('Please enter your password')
    private readonly submitButton = this.page.getByRole('button', { name: 'Log in', exact: true })

    constructor(page: Page) {
        super(page)
    }

    async open() {
        await super.open()
        await expect(this.submitButton).toBeVisible()
    }

    /**
     * Fills the form, submits ONCE and returns the HTTP status of POST /api/auth/login.
     * The login is never retried here: the caller counts it in the login budget first.
     */
    async submitAndGetStatus(email: string, password: string): Promise<number> {
        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        // The page also sends analytics POSTs (/cdn-cgi/rum), so wait for the login API itself.
        const answer = this.page.waitForResponse(
            (r) => r.request().method() === 'POST' && new URL(r.url()).pathname === '/api/auth/login',
            { timeout: 30_000 }
        )
        await this.submitButton.click()
        return (await answer).status()
    }
}
