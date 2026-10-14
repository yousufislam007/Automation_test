# Project: Web Admin Dashboard Automation

Tests the EzyCourse admin dashboard (https://ezyyousuf.ezycourse.com) in the browser. New here? Start with `README.md`.

## Stack

- Playwright Test (`@playwright/test`) + TypeScript (6.0, strict), Chromium (Desktop Chrome)
- ESLint (`typescript-eslint` + `eslint-plugin-playwright`) and Prettier. Config: `eslint.config.mjs`, `.prettierrc.json`

## Commands

| Command                                                                                                         | What it does                                                                                       |
| --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `npm test`                                                                                                      | The main set (~168 tests): unit + login + dashboard smoke + session + lesson tests                  |
| `npm run test:unit`                                                                                             | Pure logic tests only (no browser, no site, no login)                                              |
| `npm run test:login`                                                                                            | Login tests (default set)                                                                          |
| `npm run test:login-extended`                                                                                   | Login edge cases that each use a real login request (see rate limits)                              |
| `npm run test:smoke`                                                                                            | Only the 113-page dashboard smoke test (tag `@smoke`)                                              |
| `npm run test:lessons` / `:headed`                                                                              | Create-lesson test cases, headless / in a visible browser slowed down by 400 ms                    |
| `npm run test:marketplace` / `:headed`                                                                          | Marketplace seller-approval tests (NOT in `npm test`: 4 real seller logins, changes a seller)      |
| `npm run test:headed` / `test:ui`                                                                               | Watch the browser / Playwright UI mode                                                             |
| `npm run auth:refresh`                                                                                          | Force a fresh login and save a new session                                                         |
| `npm run report`                                                                                                | Open the last HTML report                                                                          |
| `npm run check`                                                                                                 | **Run before finishing any change:** type-check + lint + format check                              |
| `npm run typecheck` / `lint` / `lint:fix` / `format` / `format:check`                                           | The single checks, and the fixers                                                                  |

Run one test: `npx playwright test -g "LOGIN-02"`. Run a group: `npx playwright test --grep @login`.

## Setup

Copy `.env.example` to `.env` and fill in `WEB_BASE_URL`, `WEB_ADMIN_EMAIL`, `WEB_ADMIN_PASSWORD`.
Then `npm install` and `npx playwright install chromium`.

## Settings (environment variables, see `.env.example`)

- `PLAYWRIGHT_WORKERS` (default **1**): number of parallel workers. Raise it slowly, see rate limits.
- `REQUEST_MIN_INTERVAL_MS` (default 0 for 1 worker, 1000 for more): minimum gap between page loads across ALL workers.
- `PLAYWRIGHT_SLOW_MO`: milliseconds to wait between actions, for watching a `--headed` run.
- `AUTH_REFRESH=1`: force a fresh login even if the saved session is valid.
- `WEB_ADMIN_EMAIL_<n>` / `WEB_ADMIN_PASSWORD_<n>`: optional extra admin accounts, only for data-changing tests with more than one worker.
- `QA_SELLER_EMAIL` / `QA_SELLER_PASSWORD`: the disposable marketplace test seller. `QA_COURSE_ID`, `QA_CHAPTER_ID`, `QA_COURSE_NAME`: the QA course.

## Structure

- `config/env.ts` -> environment variables, worker count, auth file locations, QA course and seller account
- `pages/` -> Page Objects: `LoginPage`, `DashboardPage`, `LessonPage`, `MarketplaceSellersPage`
  - `pages/seller/` -> the seller's own area (`SellerDashboardPage`, `SellerProductFormPage`, `SellerCourseFormPage`)
  - `pages/components/` -> small shared parts of the UI (`Toast`)
- `playwright/fixtures.ts` -> base `test` (429 diagnostics, `pacedGoto`) and `writeTest` (per-worker account)
- `playwright/course-fixtures.ts` -> `courseTest`: a `lessons` page object that deletes what the test created
- `playwright/marketplace-fixtures.ts` -> `marketplaceTest`: `sellersAdmin` (admin side) and `seller` (seller browsers)
- `playwright/.auth/` -> GENERATED private login sessions (git-ignored, never commit)
- `playwright/.rate/` -> GENERATED limiter files shared by workers (git-ignored)
- `test-data/` -> data used by tests (`dashboard-pages.ts`: the 113 admin pages, generated from a crawl)
- `tests/auth.setup.ts` -> makes sure a valid saved session exists; logs in only when needed
- `tests/auth/` -> login tests (start logged OUT)
- `tests/dashboard/` -> 113-page smoke test
- `tests/session/` -> already-logged-in, per-worker session, 429-handling tests
- `tests/course/` -> one test case per lesson type
- `tests/marketplace/` -> seller approval tests
- `tests/unit/` -> tests for the rate-limit utilities
- `utils/` -> `auth.ts` (check/save/refresh the saved session), `rate-limit.ts` (Retry-After, jittered back-off),
  `shared-limiter.ts` (request spacing shared across workers), `test-data.ts` (`uniqueName()`)
- `docs/` -> `project-summary.md`, `web-sitemap.md`, `course-feature.md`, `marketplace-feature.md`
- `legacy-appium/` -> Android app tests (Appium + WebdriverIO), self-contained with its own `package.json` and `.env`. Not part of `npm test`; run from inside that folder (see its `README.md`)

## Authentication (how sessions work)

- The site authenticates with **cookies** (`__Host-access`, `__Host-refresh`, `swuid`, `XSRF-TOKEN`; access/refresh last about 7 days).
  localStorage holds no auth data and the app does not use IndexedDB or sessionStorage for login.
- The `setup` project runs before the `admin` tests. It opens `/dashboard/` with the saved session and checks the login
  indicator (stays under `/dashboard`, title "Dashboard | Admin"). Valid -> reused, no login request.
  Missing / expired / `AUTH_REFRESH=1` -> one login, then saved. A HTTP 429 while checking is reported, not treated as "expired".
- State files are written atomically (temp file, then rename). Each worker that needs its own account has its own file.
- **Refresh an expired session:** `npm run auth:refresh`. (Or delete `playwright/.auth/admin.json` and run any test.)
  If that fails, the message says whether the credentials were rejected or the site is rate limiting.

## Workers and data

- Independent, read-only tests share the one admin session (`test` from `playwright/fixtures.ts`).
- Tests that create/change/delete data must use `writeTest` (or `courseTest` / `marketplaceTest`, which build on it): every worker
  uses its own admin account and session (`playwright/.auth/worker-<parallelIndex>.json`). A worker with no account of its own
  **skips** the test. Accounts are never created automatically.

## Rate limits (measured)

- **Login API** (`POST /api/student/auth/login`): **10 requests per window**; after that HTTP 429 for about 10-15 minutes
  and a "Too many requests" toast. Login is NOT idempotent, so it is never retried. `loginPage.loginViaApi()` fails fast with a clear message.
  `npm test` uses about 4 real logins. Tests that only trigger browser validation or "Password is required" send no request.
  Edge cases that each need a real login live in `tests/auth/login-extended.spec.ts` (6 logins) and `tests/marketplace` (4 logins):
  run each alone, 15+ minutes apart.
- **`POST /api/student/socket/connect`** (the app's real-time chat connection) answers 429 on some page loads, without `Retry-After`.
  It is background noise: it is recorded in `test-results/rate-limit.log` and the report, and does not fail tests.
- Page loads (read-only GETs) use `pacedGoto`: spaced out across workers, retried only on 429, honouring `Retry-After`,
  bounded exponential back-off with jitter, and it gives up with a clear error (`RateLimitError`).
- Never retry actions that create, change or send something.
- Do not try to bypass the limits. Prefer an approved test environment and authorized request quotas.

## Rules

- Use the Page Object pattern. **Tests must not contain locators**: `npm run lint` fails if a spec file calls `locator()` or `getBy...()`.
  Put the locator, or a method that uses it, in a page object under `pages/`.
- Locator priority: getByRole > getByLabel / getByPlaceholder / getByText > getByTestId > CSS > XPath (last resort).
- Never use fixed sleeps in tests (`waitForTimeout` is a lint warning). Rely on auto-waiting and web-first assertions (`expect(locator).toBeVisible()`).
- Helper methods that contain assertions must be named `expectSomething()`, so the linter knows a test checks something.
- Every test must be independent and start from a known state. Tests that create data delete it again (fixtures do it for you).
- Use `uniqueName('TC ...')` from `utils/test-data.ts` for anything a test creates.
- Use clear test names with an ID: "LOGIN-02: should show error when password is empty". IDs are unique.
- Tag test groups with `{ tag: '@name' }` (`@smoke`, `@login`, `@extended`, `@course`, `@marketplace`, `@session`, `@unit`).
- Parked tests: `test.fixme(title, { annotation: { type: 'needs', description: '...' } }, async () => {})`. Known bugs: `test.fail(true, 'reason')`.
- Screenshot and trace are saved automatically on failure (`test-results/`, `playwright-report/`).
- Do not hardcode credentials. Never print cookies or tokens. Read credentials from `.env`.
- Many list pages redirect to `?page=1&pageSize=10`. Assert on the path, not the whole URL.
- Toasts (error pop-ups) are not part of the page text. Use the `Toast` component (`pages/components/Toast.ts`), not `body.innerText`.
- **`browser.newContext()` inherits the project's saved admin login** in Playwright Test. For a second user (for example a seller),
  pass an explicitly empty state: `browser.newContext({ storageState: { cookies: [], origins: [] } })` (the `seller` fixture does this).
- The seller tests flip the test seller's approval status, so they run one after another
  (`test.describe.configure({ mode: 'serial' })`) and put it back to Approved at the end.
- Before finishing a change, run `npm run check`.

## Version control

The project is not in a Git repository yet (Git is not installed on this computer). `.gitignore` and `.gitattributes` are ready.
When Git is installed: `git init -b main`, `git add .`, check `git status` does NOT list `.env` or `playwright/.auth/`, then commit.
