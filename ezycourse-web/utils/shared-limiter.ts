import { closeSync, existsSync, mkdirSync, openSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/**
 * A request-spacing limiter that is shared by ALL Playwright workers (separate processes).
 * An in-memory counter would be per worker, so the slot times live in a small file guarded by a lock file.
 *
 * Every caller gets the next free slot at least `minIntervalMs` after the previous caller's slot and
 * then waits for it. With minIntervalMs <= 0 it does nothing.
 */
export async function waitForSlot(minIntervalMs: number, dir = join('playwright', '.rate')): Promise<void> {
    if (minIntervalMs <= 0) return
    mkdirSync(dir, { recursive: true })
    const lockPath = join(dir, 'slot.lock')
    const slotPath = join(dir, 'next-slot.txt')

    await acquire(lockPath)
    let wait: number
    try {
        const now = Date.now()
        const next = existsSync(slotPath) ? Number(readFileSync(slotPath, 'utf8')) || 0 : 0
        const mySlot = Math.max(now, next)
        writeFileSync(slotPath, String(mySlot + minIntervalMs))
        wait = mySlot - now
    } finally {
        unlinkSync(lockPath)
    }
    if (wait > 0) await sleep(wait)
}

async function acquire(lockPath: string, timeoutMs = 30_000): Promise<void> {
    const started = Date.now()
    for (;;) {
        try {
            closeSync(openSync(lockPath, 'wx')) // fails if another worker holds the lock
            return
        } catch {
            // A lock older than 10 s was left behind by a crashed worker.
            try {
                if (Date.now() - statSync(lockPath).mtimeMs > 10_000) unlinkSync(lockPath)
            } catch {
                /* released meanwhile */
            }
            if (Date.now() - started > timeoutMs)
                throw new Error(`Could not get the request limiter lock (${lockPath}).`)
            await sleep(20 + Math.random() * 30)
        }
    }
}
