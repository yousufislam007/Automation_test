# Project: EzyCommunity Web Automation

Tests the EzyCommunity web site in the browser. Self-contained: run every command from this folder (`ezycommunity-web/`).
Modeled on `../ezycourse-web/` (same tools and rules). Status: **scaffold** (start-page smoke test, saved-session and rate-limit machinery); the admin login is mapped (`pages/LoginPage.ts`, `utils/site-session.ts`) and a saved admin session exists.

## The one community (owner's rule)

Test ONLY `https://sqa.ezycommunity.pro.bd`. Never go to, log in to or change any other community or site without the owner's explicit permission.
`config/env.ts` enforces it (`ALLOWED_ORIGIN`: `env.baseUrl` throws for any other origin). Before anything that creates, changes, deletes or sends something,
call `expectOnAllowedCommunity()` (in `BasePage`) so the test fails if the browser is not on that URL.

## Stack

- Playwright Test (`@playwright/test`) + TypeScript (6.0, strict), Chromium (Desktop Chrome)
- ESLint (`typescript-eslint` + `eslint-plugin-playwright`) and Prettier. Config: `eslint.config.mjs`, `.prettierrc.json`

## Commands

| Command                                                               | What it does                                                         |
| --------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `npm test`                                                            | All tests                                                            |
| `npm run test:smoke`                                                  | Only tests tagged `@smoke`                                           |
| `npm run test:unit`                                                   | Logic tests only (rate limits, login budget, community guard)        |
| `npm run test:admin` / `test:member`                                  | Logged-in tests (reuse the saved session; skipped until login is mapped) |
| `npm run auth:refresh`                                                | Force a fresh login and save a new session                           |
| `npm run test:headed` / `test:ui`                                     | Watch the browser / Playwright UI mode                               |
| `npm run report`                                                      | Open the last HTML report                                            |
| `npm run check`                                                       | **Run before finishing any change:** type-check + lint + format check |
| `npm run typecheck` / `lint` / `lint:fix` / `format` / `format:check` | The single checks, and the fixers                                    |

Run one test: `npx playwright test -g "HOME-01"`.

## Setup

Copy `.env.example` to `.env` and fill in `WEB_BASE_URL` (must be `https://sqa.ezycommunity.pro.bd`), `WEB_ADMIN_EMAIL`, `WEB_ADMIN_PASSWORD`,
`WEB_MEMBER_EMAIL`, `WEB_MEMBER_PASSWORD`. Then `npm install` and `npx playwright install chromium`.
Optional: `PLAYWRIGHT_WORKERS` (default 1), `PLAYWRIGHT_SLOW_MO` (ms between actions, for `--headed`), `REQUEST_MIN_INTERVAL_MS`, `AUTH_REFRESH=1`, `LOGIN_BUDGET_MAX` (8), `LOGIN_BUDGET_WINDOW_MIN` (15).

## Structure

- `config/env.ts` -> environment variables (read when first used, so a missing `.env` does not break imports), worker count, auth file paths
- `pages/` -> Page Objects; all extend `BasePage` (`HomePage` is the first one)
- `playwright/fixtures.ts` -> base `test`: records HTTP 429 answers (`rateLimitWatch`) and `pacedGoto` for read-only page loads
- `playwright/.auth/` -> GENERATED private login sessions, `admin.json` and `member.json` (git-ignored, never commit)
- `playwright/.rate/` -> GENERATED limiter files: `logins.json` (log of real logins) and the request-spacing slot (git-ignored)
- `tests/auth.setup.ts` -> makes sure a valid saved session exists; logs in only when needed
- `utils/` -> `auth.ts` (check/save/refresh the saved session), `site-session.ts` (the ONLY site-specific login code: fill it in), `login-budget.ts`, `rate-limit.ts`, `shared-limiter.ts`
- `tests/public/` -> logged-out tests; `tests/auth/` -> login tests; `tests/admin/`, `tests/member/` -> logged-in tests (add when the login flow is mapped)
- `tests/unit/` -> logic tests (no browser, no site)
- `utils/test-data.ts` -> `uniqueName()` for anything a test creates
- `docs/` -> notes on the site's features and test cases (add as the site is explored)
- `../ezycommunity-app/` -> the EzyCommunity Android app tests (separate project, own `package.json` and `.env`)

## Next steps (when the site is explored)

1. Done for the admin (one real login saved to `playwright/.auth/admin.json`). Still to do: the member account (`WEB_MEMBER_*`) and the login edge cases (each uses one real login from the budget).
2. Add a `docs/` file per feature and `tests/<feature>/` folders.
3. Record the measured rate limits below.

## Sessions and rate limits

Not measured yet. Assume the same login limit as EzyCourse until proven otherwise: about 10 login requests per window, then HTTP 429 for 10-15 minutes.

- **Log in once, reuse the saved session.** The `setup` project opens `checkUrl` with the saved state (`playwright/.auth/<account>.json`) and asks `isLoggedIn`.
  Valid -> reused, no login request. Missing / expired / `AUTH_REFRESH=1` -> ONE login, then saved (atomic write). A HTTP 429 while checking is reported, not treated as "expired".
- **Login budget** (`utils/login-budget.ts`): every real login is written to `playwright/.rate/logins.json` BEFORE it is sent. A login is refused when `LOGIN_BUDGET_MAX` (8)
  were sent in the last `LOGIN_BUDGET_WINDOW_MIN` (15) minutes, or when the last login was answered with 429 (blocked for the window). The log survives between runs.
- Login is NOT idempotent, so it is never retried. Page loads (read-only GETs) may use `pacedGoto`: spaced across workers, retried only on 429, honouring `Retry-After`.
- Never retry actions that create, change or send something. Do not try to bypass the limits.

## Rules

- Use the Page Object pattern. **Tests must not contain locators**: `npm run lint` fails if a spec file calls `locator()` or `getBy...()`.
  Put the locator, or a method that uses it, in a page object under `pages/`.
- Locator priority: getByRole > getByLabel / getByPlaceholder / getByText > getByTestId > CSS > XPath (last resort).
- Never use fixed sleeps (`waitForTimeout` is a lint warning). Rely on auto-waiting and web-first assertions.
- Helper methods that contain assertions must be named `expectSomething()`, so the linter knows a test checks something.
- Every test must be independent and start from a known state. Tests that create data delete it again.
- Use `uniqueName('TC ...')` for anything a test creates.
- Use clear test names with a unique ID: "HOME-01: should load the start page".
- Tag test groups with `{ tag: '@name' }` (`@smoke`, ...).
- Screenshot and trace are saved automatically on failure (`test-results/`, `playwright-report/`).
- Do not hardcode credentials. Never print cookies, tokens, emails or passwords. Read credentials from `.env`.
- Only `https://sqa.ezycommunity.pro.bd`: assert it (`expectOnAllowedCommunity()`) before every destructive change; never switch community without the owner's permission.
- Never retry actions that create, change or send something.
- Before finishing a change, run `npm run check`.
