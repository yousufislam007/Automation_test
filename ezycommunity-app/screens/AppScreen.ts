import { browser, expect } from '@wdio/globals'
import BaseScreen from './BaseScreen'

/** The app as a whole (not one screen yet). Replace with real screens once the app is explored. */
export default class AppScreen extends BaseScreen {
    async expectAppInForeground() {
        await browser.waitUntil(async () => (await this.currentPackage()) === this.appPackage, {
            timeout: 15000,
            timeoutMsg: `The app (${this.appPackage}) did not come to the foreground`,
        })
        expect(await this.currentPackage()).toBe(this.appPackage)
    }
}
