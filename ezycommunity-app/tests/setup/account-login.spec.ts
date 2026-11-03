import { env } from '../../config/env'
import LoginScreen from '../../screens/LoginScreen'

// Makes sure the app is logged in as the account named by LOGIN_AS (admin by default, or member).
// The saved login lives in the app (noReset), so it logs in ONLY when the login screen is showing.
// Run on its own with: LOGIN_AS=member npx wdio run wdio.conf.ts --spec tests/setup/account-login.spec.ts
const as = process.env.LOGIN_AS === 'member' ? 'member' : 'admin'

describe(`Setup: ${as} login`, () => {
    const login = new LoginScreen()

    it(`SETUP-01: should be logged in as ${as} (log in only if needed)`, async () => {
        if (await login.isShown()) {
            const account =
                as === 'member'
                    ? { email: env.memberEmail, password: env.memberPassword }
                    : { email: env.adminEmail, password: env.adminPassword }
            await login.login(account.email, account.password)
        }
        await login.expectLoggedIn()
    })
})
