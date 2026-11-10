import { execFileSync } from 'node:child_process'

/**
 * Fast phone control through adb, for set-up and "what if" steps that are slow or unreliable through Appium:
 * permissions, network off/on, sending the app to the background, keeping the screen awake.
 * Nothing here logs in, taps inside the app or reads personal data.
 */

const APP_PACKAGE = process.env.APP_PACKAGE || 'com.ezycourse.ezycourse'

function run(args: string[]): string {
    return execFileSync('adb', args, { encoding: 'utf8', timeout: 30_000 }).trim()
}

/** The serial of the one connected, authorised phone. Throws a clear message if there is none or several. */
export function deviceSerial(): string {
    const lines = run(['devices']).split(/\r?\n/).slice(1)
    const ready = lines.filter((line) => /\tdevice$/.test(line)).map((line) => line.split('\t')[0])
    if (ready.length === 0) throw new Error('No Android device is connected and authorised (check USB debugging).')
    const wanted = process.env.ANDROID_UDID
    if (wanted) {
        if (!ready.includes(wanted)) throw new Error('ANDROID_UDID is set but that device is not connected.')
        return wanted
    }
    if (ready.length > 1) throw new Error('Several devices are connected. Set ANDROID_UDID in .env.')
    return ready[0]
}

const shell = (command: string) => run(['-s', deviceSerial(), 'shell', command])

/** Grants camera, microphone and notification permission, so no permission dialog appears during a meeting. */
export function grantMeetingPermissions(pkg = APP_PACKAGE): void {
    for (const permission of ['CAMERA', 'RECORD_AUDIO', 'POST_NOTIFICATIONS']) {
        shell(`pm grant ${pkg} android.permission.${permission}`)
    }
}

/** Takes away the same permissions, to test the "permission denied" cases. */
export function revokeMeetingPermissions(pkg = APP_PACKAGE): void {
    for (const permission of ['CAMERA', 'RECORD_AUDIO']) {
        shell(`pm revoke ${pkg} android.permission.${permission}`)
    }
}

/** Turns Wi-Fi and mobile data on or off (for the reconnect cases). Always switch back on afterwards. */
export function setNetwork(on: boolean): void {
    const state = on ? 'enable' : 'disable'
    shell(`svc wifi ${state}`)
    shell(`svc data ${state}`)
}

/** Sends the app to the background (Home key) and brings it back. */
export function sendAppToBackground(): void {
    shell('input keyevent KEYCODE_HOME')
}
export function bringAppToFront(pkg = APP_PACKAGE): void {
    shell(`monkey -p ${pkg} -c android.intent.category.LAUNCHER 1`)
}

/** Keeps the screen on while USB is connected, and wakes it. */
export function keepScreenAwake(): void {
    shell('svc power stayon usb')
    shell('input keyevent KEYCODE_WAKEUP')
}

/** Cheap checks used before a run. */
export function deviceReport(): { serial: string; android: string; locked: boolean; appInstalled: boolean } {
    const serial = deviceSerial()
    return {
        serial,
        android: shell('getprop ro.build.version.release'),
        locked: /isKeyguardShowing=true/.test(shell('dumpsys window')),
        appInstalled: shell(`pm list packages ${APP_PACKAGE}`).includes(APP_PACKAGE),
    }
}
