import { $ } from '@wdio/globals'
import BaseScreen from './BaseScreen'

class DashboardScreen extends BaseScreen {
    get welcomeMessage() {
        return $('~Welcome to EzyCourse')
    }

    /** The bottom "Home" tab. Several elements share this description, so take the first one. */
    get homeTab() {
        return $('android=new UiSelector().description("Home").instance(0)')
    }

    /** True when the signed-in app is showing (the welcome message or the Home tab). */
    async isShown() {
        return (await this.welcomeMessage.isDisplayed()) || (await this.homeTab.isDisplayed())
    }
}

export default new DashboardScreen()
