import 'dotenv/config'

function required(name: string, hint = 'Copy .env.example to .env and fill it in.'): string {
    const value = process.env[name]?.trim()
    if (!value) {
        throw new Error(`${name} is missing or empty in ezycommunity-app/.env. ${hint}`)
    }
    return value
}

// Read when first used, so a test that needs no login does not need the accounts.
// Never print these values in logs or error messages.
export const env = {
    /** A normal member account of the community. */
    get memberEmail() {
        return required('TEST_MEMBER_EMAIL')
    },
    get memberPassword() {
        return required('TEST_MEMBER_PASSWORD')
    },
    /** The community owner / admin account (only for owner tests). */
    get adminEmail() {
        return required('TEST_ADMIN_EMAIL')
    },
    get adminPassword() {
        return required('TEST_ADMIN_PASSWORD')
    },
}
