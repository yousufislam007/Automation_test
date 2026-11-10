import { test, expect, type Page } from '@playwright/test'
import { expectMediaFlowing, expectMediaStopped, installRtcSpy, readRtpBytes } from '../../utils/media'

// Checks the meeting test tools on a local page served from memory (https, so the camera API is allowed). No site, no login, no data.
// Run: npm run test:meeting-harness
async function openLocalPage(page: Page) {
    await page.route('https://harness.invalid/**', (route) =>
        route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>harness</title>' })
    )
    await page.goto('https://harness.invalid/')
}

test.describe('MEETING-HARNESS: fake devices and media statistics', { tag: '@meeting-harness' }, () => {
    test.use({ permissions: ['camera', 'microphone'] })

    test('HARNESS-01: fake camera and microphone give live audio and video tracks', async ({ context, page }) => {
        await installRtcSpy(context)
        await openLocalPage(page)
        const kinds = await page.evaluate(async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            return stream.getTracks().map((track) => `${track.kind}:${track.readyState}`)
        })
        expect(kinds.sort()).toEqual(['audio:live', 'video:live'])
    })

    test('HARNESS-02: media bytes grow while sending and stop growing when muted', async ({ context, page }) => {
        await installRtcSpy(context)
        await openLocalPage(page)
        // A loopback call inside the page: connection A sends the fake devices to connection B.
        await page.evaluate(async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            const a = new RTCPeerConnection()
            const b = new RTCPeerConnection()
            a.onicecandidate = (event) => event.candidate && void b.addIceCandidate(event.candidate)
            b.onicecandidate = (event) => event.candidate && void a.addIceCandidate(event.candidate)
            stream.getTracks().forEach((track) => a.addTrack(track, stream))
            await a.setLocalDescription(await a.createOffer())
            await b.setRemoteDescription(a.localDescription!)
            await b.setLocalDescription(await b.createAnswer())
            await a.setRemoteDescription(b.localDescription!)
            ;(window as unknown as { __stream: MediaStream }).__stream = stream
        })

        await expectMediaFlowing(page, 'audioOut')
        await expectMediaFlowing(page, 'videoOut')
        await expectMediaFlowing(page, 'audioIn')
        await expectMediaFlowing(page, 'videoIn')

        // Turn the camera off (like pressing the camera button): video must stop, audio must keep going.
        await page.evaluate(() => {
            const stream = (window as unknown as { __stream: MediaStream }).__stream
            stream.getVideoTracks().forEach((track) => (track.enabled = false))
        })
        await expectMediaStopped(page, 'videoIn')
        await expectMediaFlowing(page, 'audioIn')
        expect((await readRtpBytes(page)).audioIn).toBeGreaterThan(0)
    })
})
