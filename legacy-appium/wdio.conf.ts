import { androidCapabilities } from './config/capabilities'
import { saveFailureScreenshot } from './utils/screenshot'

export const config: WebdriverIO.Config = {
    runner: 'local',

    specs: ['./tests/**/*.spec.ts'],

    maxInstances: 1,

    hostname: '127.0.0.1',
    port: 4723,
    path: '/',

    // Starts and stops the Appium server for us.
    // Uses the Appium installed in this project's devDependencies.
    // allowInsecure lets "mobile: shell" run adb commands (typing fallback).
    services: [['appium', { args: { allowInsecure: 'uiautomator2:adb_shell' } }]],

    capabilities: [androidCapabilities],

    logLevel: 'warn',

    framework: 'mocha',

    reporters: ['spec'],

    mochaOpts: {
        timeout: 60000,
    },

    // A skipped test is "not passed" too, so look at the error: only real failures get a screenshot.
    afterTest: async (test: { title: string }, _context: unknown, result: { error?: Error }) => {
        if (result.error) {
            await saveFailureScreenshot(test.title)
        }
    },

    // A failing beforeEach/before hook skips the tests, and afterTest never runs for them: save a screenshot here too.
    afterHook: async (test: { title: string }, _context: unknown, result: { error?: Error }) => {
        if (result.error) {
            await saveFailureScreenshot(`hook ${test.title}`)
        }
    },
}
