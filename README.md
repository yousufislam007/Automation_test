# EzyCourse web tests

Automated end-to-end tests for the EzyCourse admin dashboard and its marketplace, written with
[Playwright](https://playwright.dev) and TypeScript.

> New to the project? Read [docs/project-summary.md](docs/project-summary.md) first. It explains everything in simple words.

## What is tested

| Area                           | Where                              | Notes                                                       |
| ------------------------------ | ---------------------------------- | ----------------------------------------------------------- |
| Login (page, errors, edge cases) | `tests/auth/`                    | Starts logged out                                           |
| All 113 admin dashboard pages  | `tests/dashboard/`                 | Read-only smoke test                                        |
| Saved login, rate limits, workers | `tests/session/`, `tests/unit/` | Tests of our own helper code                                |
| Course lessons (every type)    | `tests/course/`                    | Creates lessons in a QA course and deletes them again       |
| Marketplace seller approval    | `tests/marketplace/`               | Uses a disposable test seller. **Not** part of `npm test`   |

## Requirements

- Node.js 20 or newer (developed on Node 24, see `.nvmrc`)
- A copy of the private `.env` file values (admin login of the site under test)

## First-time setup

```bash
npm install
npx playwright install chromium
copy .env.example .env      # macOS/Linux: cp .env.example .env   then fill in the values
```

## Running the tests

| Command                           | What it does                                                                 |
| --------------------------------- | ---------------------------------------------------------------------------- |
| `npm test`                        | The main set: unit, login, dashboard smoke, session and lesson tests (~168)   |
| `npm run test:headed`             | Same, in a visible browser                                                   |
| `npm run test:smoke`              | Only the 113-page dashboard smoke test (tag `@smoke`)                        |
| `npm run test:login`              | Only the login tests                                                         |
| `npm run test:lessons:headed`     | Lesson tests in a visible browser, slowed down so you can follow             |
| `npm run test:marketplace`        | Marketplace seller tests (see the warning below)                             |
| `npm run test:login-extended`     | Extra login edge cases (see the warning below)                               |
| `npm run report`                  | Opens the HTML report of the last run                                        |
| `npm run auth:refresh`            | Forces a fresh login and saves it                                            |
| `npx playwright test -g "LOGIN-02"` | Runs only the tests whose name contains the text                           |

Settings live in `.env` (see `.env.example`): `PLAYWRIGHT_WORKERS` (default 1), `REQUEST_MIN_INTERVAL_MS`,
`PLAYWRIGHT_SLOW_MO`, `AUTH_REFRESH`.

### Important: the login rate limit

The site's login API allows only **10 requests per window** (about 10 to 15 minutes). After that it answers
HTTP 429 for several minutes. A normal `npm test` uses about 4 real logins. `npm run test:marketplace` uses 4 and
`npm run test:login-extended` uses 6, so **do not run them right after each other**. If a run stops with
"rate limited", wait about 15 minutes.

## Project structure

```
config/        environment settings (env.ts)
pages/         page objects: the locators and actions of each page (pages/seller/, pages/components/)
playwright/    shared test helpers (fixtures) and the saved logins (.auth/, never commit)
test-data/     data used by tests (the list of dashboard pages)
tests/         the test cases, one folder per feature
utils/         helper code: saved login, 429 retry, request spacing, unique names
docs/          what we learned about the site: sitemap, course feature, marketplace feature
legacy-appium/ the old Android tests (not used any more)
```

## How tests are written

- **Page objects.** Locators and page actions live in `pages/`. Spec files only say *what* to do. This is
  enforced: `npm run lint` fails if a spec file contains a locator.
- **Fixtures** give tests ready-made helpers: `test` (base), `writeTest` (tests that change data), `courseTest`
  (a lesson page that cleans up after itself) and `marketplaceTest` (admin and seller browsers).
- **Tags** select groups of tests: `@smoke`, `@login`, `@extended`, `@course`, `@marketplace`, `@session`, `@unit`.
  Example: `npx playwright test --grep @login`.
- **Test IDs** such as `LOGIN-02` or `MKT-03` are in the test names and are unique.
- **Parked tests** use `test.fixme` with the reason written in the test. **Known bugs** use `test.fail`, so they pass
  while the bug exists and start failing when it is fixed.
- **No fixed sleeps.** Playwright waits for things by itself.
- **Data.** Tests that create data delete it again. Names start with `TC`, or `QA`.

## Quality checks

```bash
npm run check          # type-check + lint + format check (run this before every commit)
npm run lint:fix       # fix what ESLint can fix
npm run format         # format all files with Prettier
```

## Saved logins and secrets

- `.env` and `playwright/.auth/*.json` contain real passwords and logins. They are in `.gitignore`. Never share them.
- Failure reports (`test-results/`, `playwright-report/`) can contain values typed into forms. Do not share them either.

## More documentation

- [CLAUDE.md](CLAUDE.md): project rules and conventions
- [docs/project-summary.md](docs/project-summary.md): the whole story, a glossary and a learning path
- [docs/web-sitemap.md](docs/web-sitemap.md), [docs/course-feature.md](docs/course-feature.md),
  [docs/marketplace-feature.md](docs/marketplace-feature.md): how the site works and the bugs found
"# Automation_test" 
