import { browser, driver } from '@wdio/globals'
import { TIMEOUT } from '../config/timeouts'
import { assertLoginBudget, recordLogin, recordLoginBlocked } from '../utils/login-budget'

/**
 * What every screen shares. Screens extend this class and hold all locators (specs hold none).
 * The app's text fields are Flutter-style (a View/EditText with no resource-id), so typing uses real key events
 * and reads the text back, like ../ezycourse-app/screens/BaseScreen.ts.
 */
export default abstract class BaseScreen {
    protected async waitUntilShown(getElement: () => ChainablePromiseElement) {
        await getElement().waitForDisplayed({ timeout: TIMEOUT })
    }

    /**
     * Call this right before a screen sends a REAL login request (not before client-side validation errors).
     * It refuses to continue when the login budget for the window is used up or the last login was answered with 429.
     */
    protected beforeRealLogin() {
        assertLoginBudget()
        recordLogin()
    }

    /** Call this when the app shows that the login was rate limited (HTTP 429 / "Too many requests"). */
    protected afterLoginRateLimited() {
        recordLoginBlocked()
    }

    /** The first few content descriptions on screen (emails masked), for error messages. */
    protected async visibleLabels(): Promise<string> {
        const source = await driver.getPageSource()
        const labels = [...source.matchAll(/content-desc="([^"]+)"/g)].map((m) => m[1].replace(/\S+@\S+/g, '<email>'))
        return labels.slice(0, 8).join(' | ')
    }

    /** The package that is in the foreground right now. */
    async currentPackage(): Promise<string> {
        return driver.getCurrentPackage()
    }

    // Types into a text field: tap the lower part of it (where the real input is), type with real key events,
    // then read the text back to prove it arrived. For password fields only the length is checked (masked).
    protected async typeInto(getField: () => ChainablePromiseElement, text: string, isPassword = false) {
        await getField().waitForDisplayed({ timeout: TIMEOUT })
        if (!isPassword && (await getField().getText()).length > 0) await this.clearField(getField)

        const arrived = async () => {
            const actual = await getField().getText()
            return isPassword ? actual.length === text.length : actual === text
        }
        const tapAndType = async (viaShell: boolean) => {
            await this.tapInput(getField)
            if (viaShell) {
                // Fallback: adb "input text" (needs the adb_shell server feature).
                await driver.execute('mobile: shell', { command: 'input', args: ['text', text.replace(/ /g, '%s')] })
            } else {
                await driver.execute('mobile: type', { text })
            }
            return browser.waitUntil(arrived, { timeout: 3000 }).then(
                () => true,
                () => false
            )
        }

        if (await tapAndType(false)) return
        await this.clearField(getField)
        if (await tapAndType(true)) return
        // Never put the typed value in the message: it can be an email or a password and would end up in logs.
        throw new Error(
            `Typed text did not reach the ${isPassword ? 'password' : 'text'} field (the value is not shown)`
        )
    }

    // Taps the lower part of a text field (where the real input is) so it gets the keyboard focus.
    protected async tapInput(getField: () => ChainablePromiseElement) {
        const rect = await driver.getElementRect(await getField().elementId)
        await driver.execute('mobile: clickGesture', {
            x: Math.round(rect.x + rect.width / 2),
            y: Math.round(rect.y + rect.height * 0.65),
        })
    }

    // Go to the end of the text and press Delete once per character (plus a few spare) in a single adb call.
    protected async clearField(getField: () => ChainablePromiseElement) {
        await this.tapInput(getField)
        const length = (await getField().getText()).length
        await driver.execute('mobile: shell', {
            command: 'input',
            args: ['keyevent', '123', ...Array<string>(length + 5).fill('67')], // MOVE_END, then DEL
        })
    }
}
