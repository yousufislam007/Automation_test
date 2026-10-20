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
    // The Flutter Dashboard is always animating; waiting for "idle" makes the
    // UiAutomator2 server hang or crash.
    'appium:disableWindowAnimation': true,
    'appium:waitForIdleTimeout': 0,
}
