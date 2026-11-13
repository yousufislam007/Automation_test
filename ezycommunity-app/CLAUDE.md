# Project: Android App Automation (EzyCommunity app)

Self-contained project: run every command from this folder (`ezycommunity-app/`).
Modeled on `../ezycourse-app/` (same tools and rules). Status: **scaffold** (launch smoke test, saved-login and login-budget machinery). Explored view-only as admin (`docs/app-explore.md`, 2026-11-03) and as member (`docs/app-explore-member.md`, 2026-11-13): read both before writing screens or tests.

## The one community (owner's rule)

Test ONLY the community `https://sqa.ezycommunity.pro.bd`. Never switch to, join, log in to or change any other community without the owner's explicit permission.
Before anything that creates, changes, deletes or sends something, first check on the screen that the app is in that community (map how the app shows it, then add an `expectOnAllowedCommunity()` to `BaseScreen`). If it cannot be confirmed, stop and ask.

## Stack

- Appium 3 + UiAutomator2 driver (installed by `npm install`, listed in `package.json`)
- WebdriverIO 10 + TypeScript 6.0 (strict), runner: Mocha
- ESLint (`typescript-eslint`) and Prettier. Config: `eslint.config.mjs`, `.prettierrc.json`
- Platform: Android only. App package `com.ezycommunity.android`, launch activity `.MainActivity` (resolved on the device)
- Test device: Samsung SM-A176B (Android 16), serial `R5CYA314MRH`, over USB with USB debugging allowed. The emulator also works (defaults in `config/capabilities.ts`)

## Commands

| Command                                                               | What it does                                                          |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `npm test`                                                            | All specs (starts Appium itself; the device must be connected)        |
| `npm run test:smoke`                                                  | The launch spec (LAUNCH-01): no login                                 |
| `npm run test:watch`                                                  | **While writing tests:** keeps the WDIO worker and the Appium session open and re-runs a spec when you save it (about 5 s per re-run instead of 12 s). Add `--spec <file>` to watch one spec |
| `npm run appium`                                                      | **Fast runs:** keep one Appium server running in its own terminal; every `wdio run` then reuses it (about 10 s less per run) |
| `npm run check`                                                       | **Run before finishing any change:** type-check + lint + format check |
| `npm run typecheck` / `lint` / `lint:fix` / `format` / `format:check` | The single checks, and the fixers                                     |

Check the phone is connected: `adb devices -l` must show `device` (not `unauthorized`).

### Speed rules (keep runs short)

- Start `npm run appium` once and leave it running; `wdio.conf.ts` detects the listening port and skips starting its own server.
- Sessions start with `skipServerInstallation` + `skipDeviceInitialization` (about 4 s instead of 10+ s). After an `appium-uiautomator2-driver` upgrade or on a new phone run once with `APP_FULL_INIT=1` so the helper apps get installed again.
- Reset the app between tests with `relaunchApp()` (kill + relaunch, 2-3 s, login kept), NOT `browser.reloadSession()` (10-15 s).
- Ask "is X on screen?" with `isShownSoon()` (3 s, answers false) instead of `waitForDisplayed` with the full 15 s timeout; keep the long wait for things that must appear.
- One Appium session per spec file; do not open a session per test.
- While iterating on a spec use `npm run test:watch -- --spec <file>`; a normal `wdio run` costs about 12 s even for a 2 s test (WDIO boot ~6 s + session ~4 s, both fixed).
- Measured 2026-11-13: session start 3.7 s is the UiAutomator2 floor (instrumentation alone 2.1 s); `relaunchApp()` 0.8 s; `autoGrantPermissions`, `disableWindowAnimation` and logcat capture change nothing measurable, so they stay on.

## Setup

Copy `.env.example` to `.env` and fill in `TEST_MEMBER_EMAIL`, `TEST_MEMBER_PASSWORD` (a normal member) and
`TEST_ADMIN_EMAIL`, `TEST_ADMIN_PASSWORD` (the owner, only for owner tests). They are read in `config/env.ts` when first used.
`.env` also sets the device: `ANDROID_DEVICE_NAME`, `ANDROID_PLATFORM_VERSION`, `APP_PACKAGE`, `APP_ACTIVITY`.
Then `npm install`, connect the device, run a test.

## Structure

- `wdio.conf.ts` -> runner settings: specs, Appium service, Mocha timeout, screenshot on failure
- `config/` -> `capabilities.ts` (device + app, overridable from `.env`), `env.ts` (accounts from `.env`), `timeouts.ts`
- `screens/` -> Screen Objects, one class per screen; all extend `BaseScreen` (`AppScreen` is the first one)
- `tests/` -> specs grouped by feature (`tests/smoke/launch.spec.ts`)
- `utils/screenshot.ts` -> saves a screenshot into `screenshots/` when a test fails
- `utils/login-budget.ts` -> log of real login requests (`.rate/logins.json`, git-ignored); `config/rate.ts` -> its settings
- `screenshots/` -> GENERATED failure screenshots (git-ignored)
- `docs/` -> notes on the app's features (add as the app is explored)

## Rules

- Use the Screen Object pattern. **Tests must not contain locators**: `npm run lint` fails if a spec imports `$` / `$$`
  from `@wdio/globals` or calls `browser.$()`. Put the locator, or a method that uses it, in a screen under `screens/`.
- Locator priority: accessibility id (`~id`) > resource-id > UiAutomator > XPath (last resort).
- Never use fixed sleeps (`browser.pause` fails the lint). Use explicit waits (`waitForDisplayed`, `waitUntil`).
- Every test must be independent and start from a known app state: `await screen.relaunchApp()` in `beforeEach` (fast; the saved login stays). Use `browser.reloadSession()` only when a test really needs a fresh Appium session.
- Use clear test names with a unique ID: "LAUNCH-01: should start the app".
- Do not hardcode credentials. Read them from `.env`. Never print them.
- Only the community `https://sqa.ezycommunity.pro.bd`: confirm it before every destructive change; never switch community without the owner's permission.
- Explore the live app view-only, in rounds, and wait for the owner's OK (see the repo memory rules). An explanation of a button is not permission to tap it.
- Before finishing a change, run `npm run check`.

## Session and limits

Not measured yet. Assume the same login limit as EzyCourse: about 10 login requests per window, then HTTP 429 for 10-15 minutes.

- **The saved login lives in the app:** `appium:noReset` is on by default (`APP_NO_RESET=0` starts clean), so one login is reused by later sessions. Log in once per task; never retry a failed login.
- **Login budget:** a screen's `login()` must call `this.beforeRealLogin()` right before a REAL login request (not before client-side validation errors). It refuses when `LOGIN_BUDGET_MAX` (8) logins
  were sent in the last `LOGIN_BUDGET_WINDOW_MIN` (15) minutes or the last one was rate limited; call `this.afterLoginRateLimited()` when the app shows "Too many requests".
- Note: `relaunchApp()` and `browser.reloadSession()` keep the login only while `noReset` is on.

## Open questions

- Is the app Flutter (like the EzyCourse app)? If so, copy the `typeInto()` helpers from `../ezycourse-app/screens/BaseScreen.ts` and the `waitForIdleTimeout: 0` capability.
