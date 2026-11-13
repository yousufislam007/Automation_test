import { defineConfig, devices } from '@playwright/test'
import { ADMIN_STORAGE_STATE, env } from './config/env'
import { FAKE_MEDIA_ARGS } from './utils/media'

export default defineConfig({
    testDir: './tests',
    outputDir: './test-results',

    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    // 3 workers by default (PLAYWRIGHT_WORKERS). Page loads are spaced out by the shared limiter because the site
    // rate-limits (HTTP 429), and the login API allows only 10 requests per window.
    workers: env.workers,

    timeout: 60_000,
    expect: { timeout: 15_000 },

    reporter: [['list'], ['html', { open: 'never' }]],

    use: {
        baseURL: env.baseUrl,
        actionTimeout: 15_000,
        navigationTimeout: 30_000,
        screenshot: 'only-on-failure',
        // Tracing every test costs about 10%: off by default, PLAYWRIGHT_TRACE=1 keeps a trace of each failure.
        trace: env.traceOnFailure ? 'retain-on-failure' : 'on-first-retry',
        // PLAYWRIGHT_SLOW_MO=400 makes a --headed run easy to follow.
        launchOptions: { slowMo: env.slowMoMs },
    },

    projects: [
        // Pure logic tests (no browser, no site, no login).
        {
            name: 'unit',
            testMatch: /tests\/unit\/.*\.spec\.ts/,
        },
        // Makes sure a valid saved login session exists. Logs in only when needed.
        {
            name: 'setup',
            testMatch: /auth\.setup\.ts/,
        },
        // Login tests: must start logged OUT.
        {
            name: 'auth',
            testMatch: /tests\/auth\/.*\.spec\.ts/,
            testIgnore: /login-extended\.spec\.ts/,
            use: { ...devices['Desktop Chrome'] },
        },
        // Login edge cases that each use one of the API's 10 requests per window.
        // Not part of `npm test`; run with `npm run test:login-extended`.
        {
            name: 'auth-extended',
            testMatch: /login-extended\.spec\.ts/,
            use: { ...devices['Desktop Chrome'] },
        },
        // Everything else runs as the logged-in admin, reusing the saved session.
        {
            name: 'admin',
            testMatch: /tests\/(?!auth\/|unit\/|marketplace\/|meeting\/).*\.spec\.ts/,
            dependencies: ['setup'],
            use: { ...devices['Desktop Chrome'], storageState: ADMIN_STORAGE_STATE },
        },
        // Meeting tests: Chromium with a fake camera and microphone, several people side by side.
        // Not part of `npm test`. Needs saved sessions for the host and students (see playwright/meeting-fixtures.ts).
        {
            name: 'meeting',
            testMatch: /tests\/meeting\/.*\.spec\.ts/,
            use: { ...devices['Desktop Chrome'], launchOptions: { args: FAKE_MEDIA_ARGS, slowMo: env.slowMoMs } },
        },
        // Marketplace seller tests: they log a test seller in 4 times (the login API allows 10 requests per window)
        // and change that seller's approval status, so they are NOT part of `npm test`.
        // Run them with `npm run test:marketplace`.
        {
            name: 'marketplace',
            testMatch: /tests\/marketplace\/.*\.spec\.ts/,
            dependencies: ['setup'],
            use: { ...devices['Desktop Chrome'], storageState: ADMIN_STORAGE_STATE },
        },
    ],
})
