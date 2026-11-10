import { existsSync } from 'node:fs'
import { type BrowserContext, type Page } from '@playwright/test'
import { ADMIN_STORAGE_STATE, env, studentStorageState } from '../config/env'
import { ApiClient } from '../utils/api'
import { installRtcSpy } from '../utils/media'
import { test as base, expect } from './fixtures'

export interface Person {
    label: string
    context: BrowserContext
    page: Page
}

export interface People {
    /** The admin / host, signed in from the saved admin session. */
    host: () => Promise<Person>
    /** Student 1 to 4, signed in from that student's saved session. Each call opens its own browser context. */
    student: (slot: 1 | 2 | 3 | 4) => Promise<Person>
}

/**
 * For meeting tests. Needs the project `meeting` (it starts Chromium with fake camera and microphone).
 *  - people: open the host and any students side by side, each in its own context with camera and microphone
 *    allowed and the connection-statistics spy installed. Contexts are closed after the test.
 *  - adminApi: API client signed in as the admin, for fast set-up (events, bookings) and clean-up.
 * A missing saved session is an error with the fix in the message: sessions are never created silently,
 * because a login costs one of the limited login requests.
 */
export const meetingTest = base.extend<{ people: People; adminApi: ApiClient }>({
    people: async ({ browser }, use) => {
        const opened: BrowserContext[] = []
        const open = async (label: string, statePath: string): Promise<Person> => {
            if (!existsSync(statePath)) {
                throw new Error(
                    `No saved session for ${label}. Create it first (one login) before running meeting tests.`
                )
            }
            const context = await browser.newContext({
                baseURL: env.baseUrl,
                storageState: statePath,
                permissions: ['camera', 'microphone'],
            })
            opened.push(context)
            await installRtcSpy(context)
            return { label, context, page: await context.newPage() }
        }
        await use({
            host: () => open('host', ADMIN_STORAGE_STATE),
            student: (slot) => open(`student-${slot}`, studentStorageState(slot)),
        })
        await Promise.all(opened.map((context) => context.close()))
    },

    adminApi: async ({}, use) => {
        const api = await ApiClient.fromState(ADMIN_STORAGE_STATE)
        await use(api)
        await api.dispose()
    },
})

export { expect }
