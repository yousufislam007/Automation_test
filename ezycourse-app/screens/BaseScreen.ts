import { browser, driver } from '@wdio/globals'
import { SHORT_TIMEOUT, TIMEOUT } from '../config/timeouts'

/** What every screen shares: app resets and typing into the Flutter app's text fields. Screens extend this class. */
export default abstract class BaseScreen {
    /** The app package under test (APP_PACKAGE in .env). */
    protected readonly appPackage = process.env.APP_PACKAGE || 'com.ezycourse.ezycourse'

    /**
     * Answers whether the element shows up within a SHORT wait, false instead of throwing.
     * Use it for "is this screen/state showing?" questions where "no" is a normal answer, so the test
     * does not burn the full TIMEOUT on something that is not there.
     */
    protected async isShownSoon(getElement: () => ChainablePromiseElement, timeout = SHORT_TIMEOUT): Promise<boolean> {
        return getElement()
            .waitForDisplayed({ timeout })
            .then(
                () => true,
                () => false
            )
    }

    /**
     * Back to a known state WITHOUT a new Appium session: kill and relaunch the app (about 1 s; app data and
     * the saved login stay). Use it in beforeEach instead of browser.reloadSession() (10-15 s).
     */
    async relaunchApp() {
        await driver.terminateApp(this.appPackage)
        await driver.activateApp(this.appPackage)
    }

    /**
     * Like a fresh install, WITHOUT a new Appium session: kill the app, clear its data (so it starts logged out,
     * on the login screen), grant its permissions again (clearing drops them) and relaunch it. A few seconds
     * instead of the 10-15 s of browser.reloadSession() with noReset off.
     */
    async startClean() {
        await driver.terminateApp(this.appPackage)
        await driver.execute('mobile: clearApp', { appId: this.appPackage })
        await driver.execute('mobile: changePermissions', {
            appPackage: this.appPackage,
            action: 'grant',
            permissions: 'all',
        })
        await driver.activateApp(this.appPackage)
    }

    // This is a Flutter app, so two normal WebdriverIO habits don't work here:
    //  1. setValue() only changes the native text; the app's own form never sees it.
    //  2. Clicking the middle of the element can miss the real input, because
    //     the element may also cover a label above it (like "EMAIL").
    // So we tap the lower part of the element (where the input is), type with
    // real key events, then read the text back to prove it arrived.
    // For password fields only the length is checked (the text is masked).
    protected async typeInto(getField: () => ChainablePromiseElement, text: string, isPassword = false) {
        await getField().waitForDisplayed({ timeout: TIMEOUT })

        const arrived = async () => {
            const actual = await getField().getText()
            return isPassword ? actual.length === text.length : actual === text
        }
        const tapAndType = async (viaShell: boolean) => {
            await this.tapInput(getField)
            if (viaShell) {
                // Fallback: adb "input text" (needs the adb_shell server feature).
                await driver.execute('mobile: shell', {
                    command: 'input',
                    args: ['text', text.replace(/ /g, '%s')],
                })
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

    // Ctrl+A does not work in this app. Instead: go to the end of the text and
    // press Delete once per character (plus a few spare) in a single adb call.
    protected async clearField(getField: () => ChainablePromiseElement) {
        const length = (await getField().getText()).length
        await driver.execute('mobile: shell', {
            command: 'input',
            args: ['keyevent', '123', ...Array<string>(length + 5).fill('67')], // MOVE_END, then DEL
        })
    }
}
