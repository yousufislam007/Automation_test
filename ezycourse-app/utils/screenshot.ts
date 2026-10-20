import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { browser } from '@wdio/globals'

export async function saveFailureScreenshot(testTitle: string): Promise<void> {
    const dir = join(process.cwd(), 'screenshots')
    mkdirSync(dir, { recursive: true })
    const safeName = testTitle.replace(/[^a-z0-9]+/gi, '_').slice(0, 80)
    await browser.saveScreenshot(join(dir, `${safeName}_${Date.now()}.png`))
}
