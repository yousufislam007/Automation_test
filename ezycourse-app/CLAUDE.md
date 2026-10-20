# Project: Android App Automation (EzyCourse app)

Self-contained project inside the `app-automation` repo: run every command from this folder (`ezycourse-app/`).
The Playwright web project in the parent folder is separate; its lint/format/type-check ignore this folder.

## Stack

- Appium 3 + UiAutomator2 driver (installed by `npm install`, listed in `package.json`)
- WebdriverIO 10 + TypeScript 6.0 (strict), runner: Mocha
- ESLint (`typescript-eslint`) and Prettier. Config: `eslint.config.mjs`, `.prettierrc.json`
- Platform: Android only (emulator via Android Studio AVD, default `Medium_Phone_API_37.0` = `emulator-5554`, Android 17)

## Commands

| Command                                                                     | What it does                                                         |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `npm test`                                                                  | All specs (starts Appium itself; the emulator must be running)       |
| `npm run test:login`                                                        | The login spec (12 tests; 5 send a real login request, see Limits)   |
| `npm run test:courses`                                                      | The Courses tab spec (CRS-01..07; ONE real login; CRS-02 and CRS-03 skip until `test-data/courses.ts` has their data) |
| `npm run check`                                                             | **Run before finishing any change:** type-check + lint + format check |
| `npm run typecheck` / `lint` / `lint:fix` / `format` / `format:check`       | The single checks, and the fixers                                    |

Run some tests of a spec: `npx wdio run wdio.conf.ts --spec tests/auth/login.spec.ts --mochaOpts.grep "LOGIN-0[12]"`.

## Setup

Copy `.env.example` to `.env` and fill in `TEST_STUDENT_EMAIL`, `TEST_STUDENT_PASSWORD` (the student account the tests log in with),
`TEST_ADMIN_EMAIL`, `TEST_ADMIN_PASSWORD` (the site owner / admin account, only for owner tests),
`COURSE_NAME` (a course the student is enrolled in) and `BUNDLE_COURSE_NAME` (a bundle the student owns).
The two names are read in `config/env.ts` when first used; the course spec stops with a clear message if one is empty.
Course names are test data: never print them in logs or error messages (the screens' messages do not contain them).
Use only these accounts from now on (they replace the old `VALID_*` and `SITE_OWNER_*` keys).
Optional in `.env`: `ANDROID_DEVICE_NAME`, `ANDROID_PLATFORM_VERSION`, `APP_PACKAGE`, `APP_ACTIVITY` (defaults are in `config/capabilities.ts`).
Then `npm install`, start the emulator, run a test.

## Structure

- `wdio.conf.ts` -> runner settings: specs, Appium service, Mocha timeout, screenshot on failure
- `config/` -> `capabilities.ts` (device + app, overridable from `.env`), `env.ts` (credentials from `.env`), `timeouts.ts`
- `screens/` -> Screen Objects, one class per screen (`LoginScreen`, `DashboardScreen`); all extend `BaseScreen`
  - `BaseScreen.ts` -> shared helpers: `typeInto()` and `clearField()` for the Flutter text fields
- `screens/components/` -> shared parts (`BottomMenu`); `CoursesScreen`, `LessonPlayerScreen`
- `tests/` -> specs grouped by feature (`tests/auth/login.spec.ts`, `tests/courses/courses.spec.ts`)
- `test-data/` -> data the tests expect (`courses.ts`: course names; must match the web admin)
- `utils/` -> helpers (`screenshot.ts`: saves a screenshot into `screenshots/` when a test fails)
- `screenshots/` -> GENERATED failure screenshots (git-ignored)

## Rules

- Use the Screen Object pattern. **Tests must not contain locators**: `npm run lint` fails if a spec imports `$` / `$$`
  from `@wdio/globals` or calls `browser.$()`. Put the locator, or a method that uses it, in a screen under `screens/`.
- Locator priority: accessibility id (`~id`) > resource-id > UiAutomator > XPath (last resort).
- Never use fixed sleeps (`browser.pause` fails the lint). Use explicit waits (`waitForDisplayed`, `waitUntil`).
- Every test must be independent and start from a known app state (`browser.reloadSession()` in `beforeEach`).
- Use clear test names with an ID: "LOGIN-05: should show error when password is wrong". IDs are unique.
- Take a screenshot on test failure (done in `wdio.conf.ts`).
- Do not hardcode credentials. Read them from `.env`. Never print them.
- Before finishing a change, run `npm run check`.

## Flutter app notes (why the screens look unusual)

- `setValue()` does not reach the app's own form. Type with `typeInto()` (real key events, then read the text back).
- The password `~PASSWORD` element is only a wrapper; the real input is the `EditText` inside it.
- Empty-field messages are not separate elements: the app adds them to the email field's `hint` and to the PASSWORD description.
- Do not wait for the app to be idle (`waitForIdleTimeout: 0`): the Flutter dashboard always animates and would hang the driver.

## Limits

- The app uses the same login API as the website: about 10 login requests per window, then HTTP 429 for 10-15 minutes.
  The login spec sends 5 real ones (LOGIN-03, 04, 05, 06, 10). Do not run the full spec many times in a row.
  To check typing or screen changes without a login request, run only LOGIN-01, 02, 07, 08, 09, 11, 12.
