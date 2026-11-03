import { $, browser } from '@wdio/globals'
import { TIMEOUT } from '../config/timeouts'
import BaseScreen from './BaseScreen'

/** The "Welcome back / Sign in to continue to your community." screen, and the home screen that follows a login. */
export default class LoginScreen extends BaseScreen {
    private readonly welcome = () => $('~Welcome back')
    private readonly emailField = () => $('android=new UiSelector().className("android.widget.EditText").instance(0)')
    private readonly passwordField = () =>
        $('android=new UiSelector().className("android.widget.EditText").instance(1)')
    private readonly signInButton = () => $('~Sign in')
    // The home screen: header with the community name and the "Home" tab.
    // "Home" exists twice (top tab and bottom bar): take the first.
    private readonly homeTab = () => $('android=new UiSelector().description("Home").instance(0)')
    private readonly communityHeader = () => $('~SQA Team')

    // isDisplayed() that answers false instead of throwing while the screen is still changing.
    private async shown(getElement: () => ChainablePromiseElement): Promise<boolean> {
        return getElement()
            .isExisting()
            .catch(() => false)
    }

    /** True when the login screen is showing (the app was logged out). */
    async isShown(): Promise<boolean> {
        return this.welcome().isDisplayed()
    }

    /**
     * Types the account and taps Sign in ONCE (a real login request). Refuses when the login budget is used up.
     * Never retried: a failed login is reported, not repeated.
     */
    async login(email: string, password: string) {
        await this.waitUntilShown(this.emailField)
        await this.typeInto(this.emailField, email)
        await this.typeInto(this.passwordField, password, true)
        this.beforeRealLogin()
        await this.signInButton().click()
    }

    /** Waits for the home screen of the SQA Team community (not just any screen). */
    async expectLoggedIn() {
        try {
            await browser.waitUntil(
                async () => (await this.shown(this.homeTab)) && (await this.shown(this.communityHeader)),
                {
                    timeout: TIMEOUT * 2,
                }
            )
        } catch {
            const stillOnLogin = await this.isShown()
            throw new Error(
                stillOnLogin
                    ? 'Still on the login screen after Sign in: the login was rejected or rate limited. Not retrying.'
                    : `The SQA Team home screen did not appear after Sign in. On screen: ${await this.visibleLabels()}`
            )
        }
    }
}
