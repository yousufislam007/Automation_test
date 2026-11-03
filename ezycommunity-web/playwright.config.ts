import { defineConfig, devices } from '@playwright/test'
import { ADMIN_STORAGE_STATE, MEMBER_STORAGE_STATE, env } from './config/env'

export default defineConfig({
    testDir: './tests',
    outputDir: './test-results',

    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    // One worker by default. Raise it with PLAYWRIGHT_WORKERS once the site's rate limits are understood.
    workers: env.workers,

    timeout: 60_000,
    expect: { timeout: 15_000 },

    reporter: [['list'], ['html', { open: 'never' }]],

    use: {
        baseURL: env.baseUrl,
        actionTimeout: 15_000,
        navigationTimeout: 30_000,
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
        // PLAYWRIGHT_SLOW_MO=400 makes a --headed run easy to follow.
        launchOptions: { slowMo: env.slowMoMs },
    },

    projects: [
        // Pure logic tests (no browser, no site, no login).
        {
            name: 'unit',
            testMatch: /tests\/unit\/.*\.spec\.ts/,
        },
        // Makes sure a valid saved login session exists for the admin and the member. Logs in only when needed.
        {
            name: 'setup',
            testMatch: /auth\.setup\.ts/,
        },
        // Logged-out tests (public pages, login screen).
        {
            name: 'public',
            testMatch: /tests\/(public|auth)\/.*\.spec\.ts/,
            use: { ...devices['Desktop Chrome'] },
        },
        // Tests that run as the logged-in admin / member, reusing the saved session (no login request).
        {
            name: 'admin',
            testMatch: /tests\/admin\/.*\.spec\.ts/,
            dependencies: ['setup'],
            use: { ...devices['Desktop Chrome'], storageState: ADMIN_STORAGE_STATE },
        },
        {
            name: 'member',
            testMatch: /tests\/member\/.*\.spec\.ts/,
            dependencies: ['setup'],
            use: { ...devices['Desktop Chrome'], storageState: MEMBER_STORAGE_STATE },
        },
    ],
})
