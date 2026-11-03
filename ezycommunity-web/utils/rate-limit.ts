/** Thrown when the site keeps answering HTTP 429 (or asks us to wait longer than we are willing to). */
export class RateLimitError extends Error {
    constructor(
        message: string,
        readonly retryAfterMs?: number
    ) {
        super(message)
        this.name = 'RateLimitError'
    }
}

/** Parses a Retry-After header (seconds or an HTTP date) into milliseconds. Undefined if absent/invalid. */
export function parseRetryAfter(value: string | null | undefined, now = Date.now()): number | undefined {
    if (!value) return undefined
    const trimmed = value.trim()
    if (/^\d+$/.test(trimmed)) return Number(trimmed) * 1000
    const date = Date.parse(trimmed)
    return Number.isNaN(date) ? undefined : Math.max(0, date - now)
}

/** Exponential back-off with "full jitter": a random delay between 0 and min(max, base * 2^attempt). */
export function backoffDelay(attempt: number, baseMs = 1000, maxMs = 30_000, random = Math.random): number {
    return Math.floor(random() * Math.min(maxMs, baseMs * 2 ** attempt))
}

export interface RetryOptions {
    /** Total tries including the first one. */
    maxAttempts?: number
    baseMs?: number
    maxMs?: number
    /** If the server asks us to wait longer than this, stop instead of waiting. */
    maxWaitMs?: number
    sleep?: (ms: number) => Promise<void>
    log?: (message: string) => void
}

const sleepReal = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/**
 * Runs an IDEMPOTENT operation (for example a page load / GET) and retries it only when the
 * answer is HTTP 429. Honours Retry-After, otherwise uses bounded exponential back-off with jitter.
 *
 * NEVER use this for actions that create, change or send something (login, payments, messages,
 * form submits): the first request may already have succeeded, so retrying could duplicate it.
 */
export async function withRateLimitRetry<T>(
    operation: () => Promise<T>,
    describe: (result: T) => { status: number | undefined; retryAfter?: string | null },
    options: RetryOptions = {}
): Promise<T> {
    const {
        maxAttempts = 4,
        baseMs = 1000,
        maxMs = 30_000,
        maxWaitMs = 60_000,
        sleep = sleepReal,
        log = console.warn,
    } = options

    for (let attempt = 0; ; attempt++) {
        const result = await operation()
        const { status, retryAfter } = describe(result)
        if (status !== 429) return result

        const asked = parseRetryAfter(retryAfter)
        if (attempt + 1 >= maxAttempts) {
            throw new RateLimitError(`Still rate limited (HTTP 429) after ${maxAttempts} attempts.`, asked)
        }
        if (asked !== undefined && asked > maxWaitMs) {
            throw new RateLimitError(
                `Rate limited (HTTP 429) and the server asked us to wait ${Math.round(asked / 1000)}s, which is over the ${Math.round(maxWaitMs / 1000)}s limit. Stopping.`,
                asked
            )
        }
        const wait = asked ?? backoffDelay(attempt, baseMs, maxMs)
        log(
            `[rate-limit] HTTP 429, waiting ${Math.round(wait)} ms before attempt ${attempt + 2}/${maxAttempts}${asked !== undefined ? ' (Retry-After)' : ''}`
        )
        await sleep(wait)
    }
}
