# Android app tests (Appium + WebdriverIO)

Tests for the EzyCourse Android app. This folder is **self-contained**: it has its own `package.json`,
`node_modules` and `.env`, separate from the Playwright web project in the parent folder.

Status (2026-10-12): all 12 login tests pass on the emulator (Medium_Phone_API_37.0, Android 17, `emulator-5554`).

## Run

1. Start the emulator (Android Studio, or `emulator -avd Medium_Phone_API_37.0`) and wait until it has booted.
2. From this folder: `npm install` (first time only; it also installs the Android driver).
3. Copy `.env.example` to `.env` and fill in `TEST_STUDENT_EMAIL`, `TEST_STUDENT_PASSWORD`, `TEST_ADMIN_EMAIL`, `TEST_ADMIN_PASSWORD`, `COURSE_NAME` (a course the student is enrolled in) and `BUNDLE_COURSE_NAME` (a bundle the student owns). The course tests stop with a clear message if either name is empty.
4. `npm run test:login` for the login spec, or `npm test` for everything. Appium is started and stopped by the runner.

Before finishing any change run `npm run check` (type-check + lint + format check).

## Folder map

```
legacy-appium/
├─ wdio.conf.ts         Runner settings (specs, Appium service, timeouts, screenshot on failure)
├─ package.json         Commands (npm test, npm run check ...) and packages
├─ tsconfig.json        TypeScript settings
├─ eslint.config.mjs    Linter rules (forbids locators and fixed sleeps in tests)
├─ .env / .env.example  PRIVATE credentials and optional device settings / the same list without secrets
├─ config/              capabilities.ts (device + app), env.ts (credentials), timeouts.ts
├─ screens/             Screen Objects: BaseScreen (shared typing helpers), LoginScreen, DashboardScreen
├─ tests/               Specs grouped by feature (tests/auth/login.spec.ts)
├─ utils/               Helpers (screenshot.ts)
└─ screenshots/         GENERATED failure screenshots (git-ignored)
```

## Notes

- TypeScript is pinned to 6.0 (TypeScript 7 does not work with `ts-node`).
- Five of the login tests send a real login request to EzyCourse (the login API allows about 10 per window): do not run the spec many times in a row.
- The root project's lint/format/type-check ignore this folder. Use the commands here instead.
- See `CLAUDE.md` in this folder for the conventions (Screen Objects, no locators in tests, no fixed sleeps).

## Known limitations

- Appium `logLevel` above `warn` (in `wdio.conf.ts`), or a `logPath` for the Appium service, would store the typed values (emails, passwords) in the logs. Keep `logLevel: 'warn'` and do not set `logPath`.
