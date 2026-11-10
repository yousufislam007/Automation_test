import { browser, expect } from '@wdio/globals'
import LoginScreen from '../../screens/LoginScreen'
import DashboardScreen from '../../screens/DashboardScreen'
import { env } from '../../config/env'
import { grantMeetingPermissions } from '../../utils/adb'

// Logs the phone in ONCE as a student, only when the login screen shows. Run it with:
//   APP_NO_RESET=1 LOGIN_AS=1 npx wdio run wdio.conf.ts --spec tests/setup/student-login.spec.ts
// LOGIN_AS is the student number (1 to 4). Without it this spec is skipped, so `npm test` never logs in by accident.
const slot = Number(process.env.LOGIN_AS)
const suite = slot >= 1 && slot <= 4 ? describe : describe.skip

suite('SETUP: log the phone in as a student (one login, never retried)', () => {
    it('logs in only if the login screen is shown', async () => {
        grantMeetingPermissions()
        const account = env.student(slot as 1 | 2 | 3 | 4)
        const onLogin = await LoginScreen.loginButton.waitForDisplayed({ timeout: 15000 }).then(
            () => true,
            () => false
        )
        if (onLogin) await LoginScreen.login(account.email, account.password)
        await browser.waitUntil(() => DashboardScreen.isShown(), {
            timeout: 25000,
            timeoutMsg: 'Neither the welcome message nor Home showed after the login',
        })
        expect(await LoginScreen.isStillOnLoginScreen()).toBe(false)
    })
})
