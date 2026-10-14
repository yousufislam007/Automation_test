import { $, browser } from '@wdio/globals'
import { TIMEOUT } from '../config/timeouts'
import BaseScreen from './BaseScreen'

class LoginScreen extends BaseScreen {
    // Email has no accessibility id, so we use the first EditText on the screen.
    get emailField() {
        return $('android=new UiSelector().className("android.widget.EditText").instance(0)')
    }

    // "~PASSWORD" is only a wrapper View (and its description changes to
    // "PASSWORD\nPlease enter your password" on error). The real input is the
    // EditText inside it, so we find it through the wrapper's description prefix.
    get passwordField() {
        return $(
            'android=new UiSelector().descriptionStartsWith("PASSWORD")' +
                '.childSelector(new UiSelector().className("android.widget.EditText"))'
        )
    }

    get loginButton() {
        return $('~Login')
    }

    get invalidCredentialsError() {
        return $('~Invalid credentials')
    }

    // The empty-field messages are not separate elements. The app appends them to
    // the email EditText's "hint" and to the PASSWORD wrapper's description.
    readonly emailRequiredMessage = 'Please enter your email'
    readonly passwordRequiredMessage = 'Please enter your password'

    get passwordRequiredError() {
        return $(`android=new UiSelector().descriptionContains("${this.passwordRequiredMessage}")`)
    }

    /** True once the email field shows the "Please enter your email" message. */
    async hasEmailRequiredError() {
        return browser
            .waitUntil(
                async () => ((await this.emailField.getAttribute('hint')) ?? '').includes(this.emailRequiredMessage),
                { timeout: TIMEOUT }
            )
            .then(
                () => true,
                () => false
            )
    }

    async waitUntilLoaded() {
        await this.loginButton.waitForDisplayed({ timeout: TIMEOUT })
    }

    async enterEmail(email: string) {
        await this.typeInto(() => this.emailField, email)
    }

    async enterPassword(password: string) {
        await this.typeInto(() => this.passwordField, password, true)
    }

    async tapLogin() {
        await this.loginButton.click()
    }

    async login(email: string, password: string) {
        if (email) await this.enterEmail(email)
        if (password) await this.enterPassword(password)
        await this.tapLogin()
    }

    /** True if we are still on the login screen once the app has finished loading. */
    async isStillOnLoginScreen() {
        // While logging in, the app briefly hides the Login button (loading state).
        // Give it time to start loading, then wait for the button to be back.
        await this.loginButton.waitForDisplayed({ timeout: 3000, reverse: true }).catch(() => {})
        return this.isLoginButtonBackWithin(TIMEOUT)
    }

    private async isLoginButtonBackWithin(ms: number) {
        return this.loginButton.waitForDisplayed({ timeout: ms }).then(
            () => true,
            () => false
        )
    }
}

export default new LoginScreen()
