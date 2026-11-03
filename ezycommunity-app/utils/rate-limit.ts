/** Thrown when a login must not be sent because the site's rate limit would be hit (or was hit already). */
export class RateLimitError extends Error {
    constructor(
        message: string,
        readonly retryAfterMs?: number
    ) {
        super(message)
        this.name = 'RateLimitError'
    }
}
