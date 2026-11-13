import { execFileSync } from 'node:child_process'

/** The port the tests talk to Appium on (wdio.conf.ts and `npm run appium` use the same value). */
export const APPIUM_PORT = Number(process.env.APPIUM_PORT) || 4723

/**
 * True when something already listens on the Appium port, i.e. a server started by hand with `npm run appium`.
 * Then wdio.conf.ts does not start (and later stop) its own server, which saves about 10 seconds per run.
 * Synchronous on purpose: the WDIO config is built synchronously.
 */
export function appiumIsRunning(port = APPIUM_PORT): boolean {
    try {
        const output =
            process.platform === 'win32'
                ? execFileSync('netstat', ['-ano', '-p', 'tcp'], { encoding: 'utf8', timeout: 10_000 })
                : execFileSync('sh', ['-c', 'ss -ltn 2>/dev/null || netstat -ltn'], {
                      encoding: 'utf8',
                      timeout: 10_000,
                  })
        // A line like "  TCP    127.0.0.1:4723    0.0.0.0:0    LISTENING    1234" (":4723 ... LISTEN" on Linux/macOS).
        return output.split(/\r?\n/).some((line) => line.includes(`:${port} `) && /LISTEN/i.test(line))
    } catch {
        return false
    }
}
