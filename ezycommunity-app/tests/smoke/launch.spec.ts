import AppScreen from '../../screens/AppScreen'

describe('App launch', () => {
    const app = new AppScreen()

    // Known start state without a new Appium session (fast). The saved login stays.
    beforeEach(async () => {
        await app.relaunchApp()
    })

    it('LAUNCH-01: should start the app and keep it in the foreground', async () => {
        await app.expectAppInForeground()
    })
})
