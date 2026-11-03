import AppScreen from '../../screens/AppScreen'

describe('App launch', () => {
    const app = new AppScreen()

    it('LAUNCH-01: should start the app and keep it in the foreground', async () => {
        await app.expectAppInForeground()
    })
})
