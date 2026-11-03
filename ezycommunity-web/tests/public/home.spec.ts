import { test } from '../../playwright/fixtures'
import HomePage from '../../pages/HomePage'

test.describe('Home page', { tag: '@smoke' }, () => {
    test('HOME-01: should load the start page', async ({ page }) => {
        const home = new HomePage(page)
        await home.open()
        await home.expectLoaded()
    })
})
