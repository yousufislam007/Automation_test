# EzyCommunity Android app tests

Appium + WebdriverIO + TypeScript tests for the EzyCommunity Android app (package `com.ezycommunity.android`).
Self-contained: install and run from this folder.
Status: scaffold (project files, `.env`, one launch smoke test). The app is not explored yet.

## Quick start

1. `npm install`
2. Connect the phone with USB debugging allowed (`adb devices -l` shows `device`), or start an emulator.
3. Fill in `.env` (copy of `.env.example`): member and admin accounts. The device settings are already there.
4. `npm run test:smoke`
5. Before finishing a change: `npm run check`

Read `CLAUDE.md` for the structure, rules and limits. The web tests are in `../ezycommunity-web/`.
