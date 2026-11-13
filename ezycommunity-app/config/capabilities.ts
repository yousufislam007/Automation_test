import 'dotenv/config'

// Device and app settings. Override any of them in .env (see .env.example); the defaults are the
// Android Studio emulator and the EzyCommunity app (package com.ezycommunity.android).
const setting = (name: string, fallback: string) => process.env[name] || fallback

export const androidCapabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': setting('ANDROID_DEVICE_NAME', 'emulator-5554'),
    'appium:platformVersion': setting('ANDROID_PLATFORM_VERSION', '17'),
    'appium:appPackage': setting('APP_PACKAGE', 'com.ezycommunity.android'),
    'appium:appActivity': setting('APP_ACTIVITY', '.MainActivity'),
    // Keep the app's data (the saved login) between sessions: log in once, then reuse it. Set APP_NO_RESET=0 to start clean.
    'appium:noReset': process.env.APP_NO_RESET !== '0',
    'appium:autoGrantPermissions': true,
    'appium:disableWindowAnimation': true,
    // A Flutter screen that keeps animating makes UiAutomator2 wait for "idle" until it hangs or fails: do not wait.
    'appium:waitForIdleTimeout': 0,
    // Fast session start: the UiAutomator2 helper apps are already on the phone, so do not re-check or re-push
    // them on every session (saves 5-10 s). Set APP_FULL_INIT=1 once after an appium-uiautomator2-driver upgrade
    // or on a new phone/emulator, so the helpers get (re)installed.
    'appium:skipServerInstallation': process.env.APP_FULL_INIT !== '1',
    'appium:skipDeviceInitialization': process.env.APP_FULL_INIT !== '1',
    // Keep a session alive while a test waits on the owner or on a slow screen (seconds).
    'appium:newCommandTimeout': 300,
}
