import { $ } from '@wdio/globals'
import BaseScreen from './BaseScreen'

class DashboardScreen extends BaseScreen {
    get welcomeMessage() {
        return $('~Welcome to EzyCourse')
    }
}

export default new DashboardScreen()
