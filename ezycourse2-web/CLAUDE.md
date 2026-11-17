# Project: EzyCourse 2.0 Web Automation

Tests the EzyCourse 2.0 web site in the browser. Self-contained: run every command from this folder (`ezycourse2-web/`).
Modeled on `../ezycommunity-web/` (same tools, machinery and rules). Status: **scaffold**. The site URL and login flow are not mapped yet (`utils/site-session.ts` has `mapped: false`, so the `setup` project skips).

## Stack

- Playwright Test + TypeScript (strict), Chromium (Desktop Chrome); ESLint (`typescript-eslint` + `eslint-plugin-playwright`) and Prettier.

## Commands

`npm test` (unit + public), `npm run test:smoke`, `test:unit`, `test:admin`, `test:member`, `auth:refresh`, `test:headed`, `test:ui`, `report`,
**`npm run check`** (type-check + lint + format check; run before finishing any change).
Run one test: `npx playwright test -g "HOME-01"`.

## Setup

Copy `.env.example` to `.env`, fill in `WEB_BASE_URL`, `WEB_ADMIN_EMAIL/PASSWORD`, `WEB_MEMBER_EMAIL/PASSWORD`. Then `npm install` and `npx playwright install chromium`.
Optional keys are listed in `.env.example` (`PLAYWRIGHT_WORKERS`, `AUTH_TRUST_MIN`, `LOGIN_BUDGET_*`, ...).

## Structure

`config/env.ts` env + auth paths, `pages/` Page Objects (extend `BasePage`), `playwright/fixtures.ts` (429 watch, `pacedGoto`), `tests/{public,auth,admin,member,unit}/`,
`utils/` (`auth.ts`, `site-session.ts` = the only site-specific login code, `login-budget.ts`, `rate-limit.ts`, `shared-limiter.ts`, `test-data.ts`), `docs/` (feature notes and test cases).
Generated and git-ignored: `playwright/.auth/` (saved sessions), `playwright/.rate/` (limiter files).

## Next steps

1. Get the site URL; put it in `.env`. Explore the login page (view-only) and fill in `utils/site-session.ts` and a `pages/LoginPage.ts`.
2. One real login per account, saved to `playwright/.auth/`.
3. Add `docs/<feature>.md` and `tests/<feature>/` as the site is explored.

## Rules

- Same rate-limit rules as the repo: log in once and reuse the saved session; never retry a login; never bypass limits (assumed ~10 logins per window, then HTTP 429 for 10-15 min; not measured for 2.0).
- Page Object pattern. Specs contain no locators (lint enforces it). Locator priority: getByRole > getByLabel/Placeholder/Text > getByTestId > CSS > XPath.
- No fixed sleeps. Helpers that assert are named `expectSomething()`.
- Tests are independent, use `uniqueName('TC ...')` for what they create, and delete it again. Test names carry a unique ID ("HOME-01: ...").
- Call `expectOnSiteUnderTest()` before anything that creates, changes, deletes or sends something. Never retry such actions.
- Do not hardcode credentials; never print cookies, tokens, emails or passwords.
