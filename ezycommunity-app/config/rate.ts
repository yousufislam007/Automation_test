import 'dotenv/config'
import { join } from 'node:path'

function wholeNumber(name: string, fallback: number): number {
    const raw = process.env[name]?.trim()
    if (!raw) return fallback
    const value = Number(raw)
    if (!Number.isInteger(value) || value < 1) {
        throw new Error(`${name} must be a whole number >= 1 (got "${raw}").`)
    }
    return value
}

/** Where generated (git-ignored) limiter files are stored: the log of real login requests. Run commands from this folder. */
export const RATE_DIR = join(process.cwd(), '.rate')

/** The site is assumed to allow about 10 login requests per window, then HTTP 429 for 10-15 minutes. */
export const loginBudget = {
    /** Real logins allowed per window before the tests refuse to log in again. */
    max: wholeNumber('LOGIN_BUDGET_MAX', 8),
    /** Length of that window in minutes. */
    windowMin: wholeNumber('LOGIN_BUDGET_WINDOW_MIN', 15),
}
