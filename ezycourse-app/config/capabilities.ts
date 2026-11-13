import 'dotenv/config'

// Device and app settings. Override any of them in .env (see .env.example); the defaults are the
// Android Studio emulator "Medium_Phone_API_37.0" and the EzyCourse app.
const setting = (name: string, fallback: string) => process.env[name] || fallback

export const androidCapabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': setting('ANDROID_DEVICE_NAME', 'emulator-5554'),
    'appium:platformVersion': setting('ANDROID_PLATFORM_VERSION', '17'),
    'appium:appPackage': setting('APP_PACKAGE', 'com.ezycourse.ezycourse'),
    'appium:appActivity': setting('APP_ACTIVITY', '.EzyAudioServiceActivity'),
    'appium:autoGrantPermissions': true,
    // APP_NO_RESET=1 keeps the app data, so the login is reused (the login tests need the default: a clean app each time).
    'appium:noReset': process.env.APP_NO_RESET === '1',
    // The Flutter Dashboard is always animating; waiting for "idle" makes the
    // UiAutomator2 server hang or crash.
    'appium:disableWindowAnimation': true,
    'appium:waitForIdleTimeout': 0,
    // Fast session start: the UiAutomator2 helper apps are already on the device, so do not re-check or re-push
    // them on every session (saves 5-10 s). Set APP_FULL_INIT=1 once after an appium-uiautomator2-driver upgrade
    // or on a new phone/emulator, so the helpers get (re)installed.
    'appium:skipServerInstallation': process.env.APP_FULL_INIT !== '1',
    'appium:skipDeviceInitialization': process.env.APP_FULL_INIT !== '1',
    // Keep a session alive while a test waits on a slow screen (seconds).
    'appium:newCommandTimeout': 300,
}
