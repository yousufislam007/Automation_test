import { expect, type BrowserContext, type Page } from '@playwright/test'

/**
 * Chromium flags that replace the camera and microphone with fake devices (a test pattern and a beep)
 * and answer the permission prompt automatically. With these, a meeting room can be joined headless.
 * They give a real stream, so "audio/video is sent and received" can be checked from the connection
 * statistics. They cannot tell how the sound or picture looks to a person.
 */
export const FAKE_MEDIA_ARGS = ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream']

export type RtpKind = 'audioIn' | 'videoIn' | 'audioOut' | 'videoOut'
export type RtpBytes = Record<RtpKind, number>

/**
 * Runs before any page script. Keeps a list of every RTCPeerConnection the page creates, so the test
 * can read its statistics later (the room's own code is not touched or changed).
 */
const RTC_SPY = `(() => {
  const Original = window.RTCPeerConnection;
  if (!Original || window.__rtcSpy) return;
  const connections = [];
  window.__rtcSpy = connections;
  const Spy = function (...args) { const pc = new Original(...args); connections.push(pc); return pc; };
  Spy.prototype = Original.prototype;
  Object.setPrototypeOf(Spy, Original);
  window.RTCPeerConnection = Spy;
})();`

/** Call once per browser context, before opening any page. */
export async function installRtcSpy(context: BrowserContext): Promise<void> {
    await context.addInitScript(RTC_SPY)
}

/** Total RTP bytes received (In) and sent (Out) so far, per media kind, over all connections of the page. */
export async function readRtpBytes(page: Page): Promise<RtpBytes> {
    return page.evaluate(async () => {
        const total = { audioIn: 0, videoIn: 0, audioOut: 0, videoOut: 0 }
        const spy = (window as unknown as { __rtcSpy?: RTCPeerConnection[] }).__rtcSpy ?? []
        for (const pc of spy) {
            const report = await pc.getStats()
            report.forEach((stat: Record<string, unknown>) => {
                const kind = (stat.kind ?? stat.mediaType) as string | undefined
                if (kind !== 'audio' && kind !== 'video') return
                if (stat.type === 'inbound-rtp') total[`${kind}In`] += Number(stat.bytesReceived ?? 0)
                if (stat.type === 'outbound-rtp') total[`${kind}Out`] += Number(stat.bytesSent ?? 0)
            })
        }
        return total
    })
}

/** Passes when the byte counter for `kind` keeps growing (media is really flowing), not just when a tile exists. */
export async function expectMediaFlowing(page: Page, kind: RtpKind, timeoutMs = 15_000): Promise<void> {
    const before = (await readRtpBytes(page))[kind]
    await expect
        .poll(async () => (await readRtpBytes(page))[kind], {
            message: `${kind} bytes should grow (media flowing)`,
            timeout: timeoutMs,
        })
        .toBeGreaterThan(before)
}

/** Passes when the byte counter for `kind` stops growing (muted or camera off). */
export async function expectMediaStopped(page: Page, kind: RtpKind, settleMs = 4_000): Promise<void> {
    // Tiny keep-alive packets may still arrive while muted, so allow a very small growth.
    const first = (await readRtpBytes(page))[kind]
    await expect
        .poll(async () => (await readRtpBytes(page))[kind] - first, {
            message: `${kind} bytes should stop growing (muted / off)`,
            timeout: settleMs + 6_000,
            intervals: [settleMs],
        })
        .toBeLessThan(2_000)
}
