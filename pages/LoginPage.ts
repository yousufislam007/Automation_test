import { expect, type Locator, type Page } from '@playwright/test'
import { Toast } from './components/Toast'

export class LoginPage {
    readonly emailInput: Locator
    readonly passwordInput: Locator
    readonly signInButton: Locator
    readonly forgotPasswordLink: Locator
    readonly signUpLink: Locator
    readonly showPasswordButton: Locator
    readonly hidePasswordButton: Locator
    readonly invalidCredentialsError: Locator
    readonly passwordRequiredError: Locator
    readonly alreadyLoggedInMessage: Locator
    readonly goToHomeButton: Locator
    /** Toast shown when the request is blocked or fails (for example HTTP 403). */
    readonly loginFailedToast: Locator
    /** Toast shown when the login API answers HTTP 429. */
    readonly tooManyRequestsToast: Locator
    /** Shown to a seller whose account is not approved (the login API answers `require_approval: true`). */
    readonly approvalRequiredMessage: Locator

    constructor(private readonly page: Page) {
        const toast = new Toast(page)
        this.emailInput = page.getByPlaceholder('Email')
        this.passwordInput = page.getByPlaceholder('Password')
        this.signInButton = page.getByRole('button', { name: 'Sign In' })
        this.showPasswordButton = page.getByRole('button', { name: 'Show password' })
        this.hidePasswordButton = page.getByRole('button', { name: 'Hide password' })
        this.alreadyLoggedInMessage = page.getByText("You're already logged in")
        this.goToHomeButton = page.getByRole('link', { name: 'Go to Home' })
        this.loginFailedToast = toast.withText('Something went wrong while logging in')
        this.tooManyRequestsToast = toast.withText('Too many requests')
        this.invalidCredentialsError = toast.withText('Invalid credentials')
        this.approvalRequiredMessage = page.getByText('Please wait for a teacher to approve your account')
        this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' })
        this.signUpLink = page.getByRole('link', { name: "Don't have an account?" })
        this.passwordRequiredError = page.getByText('Password is required')
    }

    async goto() {
        await this.page.goto('/en/login')
        await expect(this.signInButton).toBeVisible()
        await this.acceptCookiesIfShown()
    }

    /** Fills the form and clicks Sign In. Use for cases where the browser blocks the submit. */
    async login(email: string, password: string) {
        await this.fill(email, password)
        await this.signInButton.click()
    }

    /**
     * Fills the form, submits, and waits for the login API to answer. Use this when a request
     * is really sent. Returns the HTTP status of the answer.
     *
     * The login API allows only 10 requests per window (about 10-15 minutes) and then answers
     * 429 for a long time. Retrying makes it worse, so on 429 we stop with a clear message.
     */
    async loginViaApi(email: string, password: string, options: { pressEnter?: boolean } = {}): Promise<number> {
        return (await this.loginViaApiDetailed(email, password, options)).status
    }

    /** Same as loginViaApi, but also returns the JSON the login API answered (for example `{ require_approval: true }`). */
    async loginViaApiDetailed(
        email: string,
        password: string,
        { pressEnter = false } = {}
    ): Promise<{ status: number; body: Record<string, unknown> }> {
        await this.fill(email, password)

        const [response] = await Promise.all([
            this.page.waitForResponse(
                (r) => r.request().method() === 'POST' && r.url().includes('/api/student/auth/login')
            ),
            pressEnter ? this.passwordInput.press('Enter') : this.signInButton.click(),
        ])
        if (response.status() === 429) {
            throw new Error(
                'The login API is rate limited (HTTP 429, limit is 10 requests per window). ' +
                    'Wait about 15 minutes without logging in, then run again.'
            )
        }
        const body = (await response.json().catch(() => ({}))) as Record<string, unknown>
        return { status: response.status(), body }
    }

    private async fill(email: string, password: string) {
        if (email) await this.emailInput.fill(email)
        if (password) await this.passwordInput.fill(password)
    }

    /** The browser's built-in validation message for a field ('' when the field is valid). */
    async validationMessage(field: Locator): Promise<string> {
        return field.evaluate((el) => (el as HTMLInputElement).validationMessage)
    }

    private async acceptCookiesIfShown() {
        const accept = this.page.getByRole('button', { name: 'Accept Cookies' })
        if (await accept.isVisible()) await accept.click()
    }
}
