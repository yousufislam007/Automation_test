import { request, type APIRequestContext } from '@playwright/test'
import { env } from '../config/env'

export interface ApiResult<T = unknown> {
    status: number
    body: T
}

/**
 * A small API client that reuses a saved browser login (the same cookies the page uses), so set-up work
 * such as creating an appointment event or a booking takes a fraction of a second instead of many clicks.
 *
 * Rules: never retried (a repeated POST would create a second booking), never prints cookies or tokens.
 * The XSRF header name below is the usual one for the XSRF-TOKEN cookie this site sets. It is UNVERIFIED:
 * confirm it from the Network tab during the discovery pass, and fix it here if the site expects another.
 */
export class ApiClient {
    private constructor(private readonly context: APIRequestContext) {}

    static async fromState(statePath: string): Promise<ApiClient> {
        return new ApiClient(await request.newContext({ baseURL: env.baseUrl, storageState: statePath }))
    }

    private async xsrfHeader(): Promise<Record<string, string>> {
        const state = await this.context.storageState()
        const token = state.cookies.find((cookie) => cookie.name === 'XSRF-TOKEN')?.value
        return token ? { 'X-XSRF-TOKEN': decodeURIComponent(token) } : {}
    }

    async call<T = unknown>(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        path: string,
        data?: unknown
    ): Promise<ApiResult<T>> {
        const response = await this.context.fetch(path, { method, data, headers: await this.xsrfHeader() })
        if (response.status() === 429) {
            throw new Error(`HTTP 429 from ${method} ${path}. Wait 10-15 minutes; do not retry.`)
        }
        const text = await response.text()
        let body: unknown = text
        try {
            body = JSON.parse(text)
        } catch {
            // not JSON: keep the text
        }
        return { status: response.status(), body: body as T }
    }

    get = <T = unknown>(path: string) => this.call<T>('GET', path)
    post = <T = unknown>(path: string, data?: unknown) => this.call<T>('POST', path, data)
    put = <T = unknown>(path: string, data?: unknown) => this.call<T>('PUT', path, data)
    delete = <T = unknown>(path: string) => this.call<T>('DELETE', path)

    dispose() {
        return this.context.dispose()
    }
}
