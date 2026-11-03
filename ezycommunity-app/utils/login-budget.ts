import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { RATE_DIR, loginBudget } from '../config/rate'
import { RateLimitError } from './rate-limit'

/** A small log of real login requests, kept on disk so it survives between runs. */
export const LOGIN_LOG = join(RATE_DIR, 'logins.json')

interface LoginLog {
    /** Times (ms since 1970) of login requests that were sent. */
    logins: number[]
    /** After an HTTP 429 on login: no login before this time. */
    blockedUntil?: number
}

export interface BudgetOptions {
    file?: string
    max?: number
    windowMs?: number
    now?: number
}

function read(file: string): LoginLog {
    if (!existsSync(file)) return { logins: [] }
    try {
        const parsed = JSON.parse(readFileSync(file, 'utf8')) as Partial<LoginLog>
        const logins = Array.isArray(parsed.logins) ? parsed.logins.filter((t) => Number.isFinite(t)) : []
        return { logins, blockedUntil: Number.isFinite(parsed.blockedUntil) ? parsed.blockedUntil : undefined }
    } catch {
        return { logins: [] } // a damaged file must never block the tests
    }
}

function write(file: string, log: LoginLog) {
    mkdirSync(dirname(file), { recursive: true })
    const tmp = `${file}.${process.pid}.tmp`
    writeFileSync(tmp, JSON.stringify(log))
    renameSync(tmp, file)
}

const settings = (o: BudgetOptions) => ({
    file: o.file ?? LOGIN_LOG,
    max: o.max ?? loginBudget.max,
    windowMs: o.windowMs ?? loginBudget.windowMin * 60_000,
    now: o.now ?? Date.now(),
})

/** How many login requests were sent inside the current window. */
export function loginsInWindow(options: BudgetOptions = {}): number {
    const { file, windowMs, now } = settings(options)
    return read(file).logins.filter((t) => now - t < windowMs).length
}

/**
 * Throws RateLimitError when another login would go over the budget, or when the last login was answered
 * with HTTP 429 and the block has not ended yet. Call it BEFORE every real login.
 */
export function assertLoginBudget(options: BudgetOptions = {}): void {
    const { file, max, windowMs, now } = settings(options)
    const log = read(file)
    if (log.blockedUntil && log.blockedUntil > now) {
        const minutes = Math.ceil((log.blockedUntil - now) / 60_000)
        throw new RateLimitError(
            `The login API answered HTTP 429 earlier. Not logging in for another ${minutes} minute(s).`,
            log.blockedUntil - now
        )
    }
    const recent = log.logins.filter((t) => now - t < windowMs)
    if (recent.length >= max) {
        const minutes = Math.ceil((Math.min(...recent) + windowMs - now) / 60_000)
        throw new RateLimitError(
            `${recent.length} login requests were already sent in the last ${Math.round(windowMs / 60_000)} minutes (budget ${max}). Wait about ${minutes} minute(s), or reuse the saved session.`,
            Math.min(...recent) + windowMs - now
        )
    }
}

/** Records that a login request is about to be sent. Call it right before the request, success or not. */
export function recordLogin(options: BudgetOptions = {}): void {
    const { file, windowMs, now } = settings(options)
    const log = read(file)
    write(file, { ...log, logins: [...log.logins.filter((t) => now - t < windowMs), now] })
}

/** Records an HTTP 429 from the login API: no more logins until the block has probably ended. */
export function recordLoginBlocked(options: BudgetOptions & { blockMs?: number } = {}): void {
    const { file, windowMs, now } = settings(options)
    const log = read(file)
    write(file, { ...log, blockedUntil: now + (options.blockMs ?? windowMs) })
}
