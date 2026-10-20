# Project summary, from day one (for a beginner)

This file explains everything that was built in this project, in simple words.
Read it from top to bottom once. After that, use it as a map.

---

## 1. The big picture

**Test automation** means: a program uses an app or a website like a person does. It clicks, types, and then **checks** that the result is correct.
If the result is wrong, the test **fails** and shows you a screenshot. This is faster and more reliable than testing by hand every time.

Every test has the same 3 steps:
1. **Get ready** (open the page, log in).
2. **Do something** (type a wrong password, click Sign In).
3. **Check the result** (the message "Invalid credentials" must appear). This check is called an **assertion**.

What we tested:
- Your **EzyCourse Android app** (first, with Appium). This is now archived.
- Your **EzyCourse website**: the admin dashboard, courses, lessons and the marketplace (with Playwright). This is the active project.

Tools, in plain words:
| Tool | What it is |
|---|---|
| **Node.js** | Lets you run JavaScript/TypeScript programs on your computer |
| **TypeScript** | The programming language the tests are written in (`.ts` files) |
| **Playwright** | The tool that controls a real browser (Chrome) for the website tests |
| **Appium + WebdriverIO** | The tools that controlled the Android app (old project, now in `ezycourse-app/`) |
| **npm** | Runs the commands in `package.json` (for example `npm test`) |

---

## 2. What was done, step by step

### Phase 1: Android app tests (Appium)
**Start:** one test file with 13 login tests. It looked like it worked, but most tests only printed the screen and **checked nothing**, so they always "passed".
**What I did:**
- Reorganised it into folders: `config/`, `screens/` (one file per app screen), `tests/`, `utils/`.
- Moved the email and password out of the code into a private `.env` file.
- Replaced fixed waits (`pause(5000)`) with real waiting for things to appear.
- Added a screenshot when a test fails, and made Appium start by itself.
- Wrote real checks, for example: wrong password shows "Invalid credentials"; empty email shows "Please enter your email"; a good login shows "Welcome to EzyCourse".

**The hard part:** the app is built with Flutter. Normal typing did not reach the app (the app then said the field was empty), and the password field was a "wrapper" around the real input. I found this by looking at the screen and the page source, and fixed it by tapping the right spot and typing with real key presses.
**Result:** 12 of 12 tests passed. This project is now saved in `ezycourse-app/` (not deleted).

### Phase 2: Looking at the website
You gave me the website and an admin login. I used a real browser (Chrome without a window) to log in and **open all 113 admin pages, read-only** (no clicking, no changes).
I saved the result in `docs/web-sitemap.md`: every page, its title, its tables and buttons, and the errors the browser printed.
Things noticed: a missing image (`/img/man.jpg`, error 404) on 92 pages, some invalid SVG attributes, three pages with React errors, and one analytics error.

### Phase 3: Switching to Playwright for the website
You said: "from now I want to test on web". So I:
- Installed **Playwright**, moved the Android project to `ezycourse-app/`, and removed its packages.
- Created the web structure: `config/`, `pages/`, `tests/`, `playwright.config.ts`.
- Wrote **login tests** (wrong password, empty fields, Enter key, show/hide password, and more) after checking how the site really behaves.
- Wrote a **smoke test**: it opens all 113 admin pages and checks that each one loads, has the right path and title.

### Phase 4: The login limit (an important lesson)
The site's login allows only **10 login requests per window** (about 10 to 15 minutes). After that it answers **HTTP 429 "Too many requests"** and blocks logins for about 11 minutes.
My first tests made too many logins, and my retry code made it worse. So I changed the design:
- A normal run now uses only about 6 real logins.
- Extra login edge cases are in a separate set (`npm run test:login-extended`) that you run alone.
- If the site says 429, the test stops with a clear message instead of retrying.

### Phase 5: Reliable login, controlled speed (your detailed brief)
You asked me to organise sessions, workers and rate limits. The result:
- **Saved login:** the first run logs in and saves the login in `playwright/.auth/admin.json`. Later runs **reuse** it. The `setup` step checks that the saved login still works, and logs in again only if it is missing or expired. `npm run auth:refresh` forces a fresh login.
- **Workers** (parallel test runners): the default is **1** (safe). You can raise it with `PLAYWRIGHT_WORKERS`.
- **Request spacing** between workers, and **safe retry on 429** (only for harmless page loads, never for actions like login or create). It waits for `Retry-After` and uses back-off with a random delay.
- **`writeTest`**: for tests that change data, each worker gets its own admin account. A worker without its own account **skips** the test instead of sharing data.
- 12 **unit tests** and 5 **session tests** prove all of this works. Then a full run passed (145 passed, 1 skipped, 6.7 minutes with one worker).

### Phase 6: Learning the Course feature
You said: "create a course and learn everything". I created **"QA-Explore Course"** (a Draft) and went through every part: course, chapter, lesson, settings, drip, pricing, quiz builder, student preview.
What I learned: **Course → Chapter → Lesson**; there are **14 lesson types**; drip has 3 types; pricing has 6 plan types (but no payment gateway is set up).
Everything is in `docs/course-feature.md`.

### Phase 7: Lesson test cases (headed, so you could watch)
I wrote one test case for every lesson type (`tests/course/lessons.spec.ts`).
Each test **creates** a lesson, checks it was saved, **reopens** it, and then **deletes** it, so nothing is left behind.
- 16 tests pass (TEXT, PPT, PDF, QUIZ, ASSIGNMENT, EMBEDDED, MULTIPLE, draft, description, empty name, and the "needs content" checks).
- 6 are **skipped on purpose** (`fixme`): VIDEO, AUDIO, DOWNLOAD, SCORM/HTML need a file, LIVE needs a live integration, SURVEY needs a survey form. The reason is written inside each test.
- Discovery: if you click **Create** too early, the page says "Course is required" (the app is not ready yet). The tests wait for the right moment.

### Phase 8: Marketplace seller approval
You asked for a test about "a seller who is not approved but can post products".
- I created a **test seller** (`qa.seller.test@example.com`, ID 1307) and tests that approve/reject it from the admin screen.
- **Finding:** a rejected seller **cannot log in**, but a seller who was **already logged in keeps access for about 17 minutes** after being rejected (I measured it).
- Then you asked for a special state (Auto-Approve Seller OFF, Auto-Approve Seller Products ON). Result: **no seller can create a product at all** on this site. Courses and communities are refused with "Plan not found" (no seller plans exist), and physical products can't be completed (no category is offered).
- I changed the settings only for the experiment and **put them back** afterwards.
- Everything is in `docs/marketplace-feature.md`. The tests are in `tests/marketplace/`.

---

## 3. The folder map (what is where)

```
app-automation/
├─ README.md            The first file to read: setup, commands, conventions
├─ .env                 PRIVATE passwords and settings (never share, never commit)
├─ .env.example         The same list of names, without secrets (safe to share)
├─ CLAUDE.md            The project rules and commands (for the AI helper and for you)
├─ package.json         The list of commands (npm test, npm run ...)
├─ playwright.config.ts The main settings: which tests, how many workers, screenshots
├─ eslint.config.mjs    The linter's rules (a spell-checker for code; forbids locators in tests)
├─ .prettierrc.json     The formatter's rules (one code style for every file)
├─ .editorconfig        Editor settings (indentation, line endings)
├─ .gitattributes       Line-ending settings for Git (ready for when Git is installed)
├─ config/env.ts        Reads .env, holds the settings (URL, workers, QA course, seller)
├─ pages/               "Page objects": one file per page, holds the locators and actions
│   ├─ LoginPage.ts, DashboardPage.ts, LessonPage.ts, MarketplaceSellersPage.ts
│   ├─ seller/          The seller's own area (dashboard, product form, course form)
│   └─ components/      Small shared parts of the screen (Toast = the pop-up messages)
├─ tests/               The real test cases
│   ├─ auth.setup.ts          Logs in once and saves the login
│   ├─ auth/                  Login tests (+ login-extended)
│   ├─ dashboard/             The 113-page smoke test
│   ├─ session/               Tests for saved login, 429 handling, per-worker accounts
│   ├─ course/lessons.spec.ts One test case per lesson type
│   ├─ marketplace/           Seller approval tests
│   └─ unit/                  Tests of our own helper code (no browser)
├─ test-data/           Data the tests use (the list of the 113 dashboard pages)
├─ playwright/
│   ├─ fixtures.ts              Shared helpers every test can use (test, writeTest, pacedGoto)
│   ├─ course-fixtures.ts       courseTest: gives a lesson page that cleans up after itself
│   ├─ marketplace-fixtures.ts  marketplaceTest: admin side + separate seller browsers
│   └─ .auth/                   PRIVATE saved logins (git-ignored)
├─ utils/               Helper code: saved login, 429 retry, request spacing, unique names
├─ docs/                What we learned: web-sitemap, course-feature, marketplace-feature, this file
├─ ezycourse-app/       The old Android project (not used any more)
├─ test-results/        Created after a run: screenshots and traces of failures
└─ playwright-report/   Created after a run: the HTML report
```

**Why "page objects"?** If a button changes, you fix it in **one** place (the page file), not in 30 tests.
**The rule:** tests do not contain locators. Tests say *what* to do (`loginPage.login(...)`); page files say *how*.
This rule is now **checked automatically**: `npm run lint` fails if a test file contains a locator.
**Fixtures** are ready-made helpers a test can ask for by name. For example, a lesson test asks for `lessons` and gets a lesson page that is already open and that deletes the lessons it created when the test ends.

---

## 4. Commands you will use

| Command | What it does |
|---|---|
| `npm test` | Runs the main set (about 168 tests; 7 are skipped on purpose). Takes several minutes. |
| `npm run test:login` | Only the login tests |
| `npm run test:smoke` | Only the 113-page dashboard smoke test (selected by its `@smoke` tag) |
| `npm run test:headed` | Same as `npm test`, but you **see** the browser |
| `npm run test:lessons:headed` | Lesson tests, visible and slowed down |
| `npm run test:marketplace:headed` | Marketplace seller tests, visible and slowed down |
| `npm run test:login-extended` | Extra login edge cases (use alone, 15 minutes after other login tests) |
| `npm run report` | Opens the HTML report of the last run |
| `npm run auth:refresh` | Forces a fresh login and saves it |
| `npm run check` | **Run this before you finish any change.** Type-check + lint + format check in one command |
| `npm run lint:fix` | Lets the linter fix the problems it can fix by itself |
| `npm run format` | Formats every file in the project style |
| `npx playwright test -g "LOGIN-02"` | Runs only the test with that name |
| `npx playwright test --grep @login` | Runs only the tests with that tag |

**Do not run everything again and again.** The login limit is 10 per window. Wait about 15 minutes if a run says "rate limited".

---

## 5. How one test works (a real example)

From `tests/auth/login.spec.ts`:

```ts
test('LOGIN-03: should show error when password is wrong', async ({ page }) => {
    await loginPage.loginViaApi(env.adminEmail, 'WrongPassword123')       // do something

    await expect(loginPage.invalidCredentialsError).toBeVisible()          // check 1
    await expect(page).toHaveURL(/\/en\/login/)                            // check 2
})
```

And in `pages/LoginPage.ts` the locator is defined once:

```ts
this.invalidCredentialsError = page.getByText('Invalid credentials').first()
```

How to read it:
- `test('name', async ({ page }) => { ... })` is one test case. `page` is the browser tab Playwright gives it.
- `await` means "wait until this finishes".
- `expect(...).toBeVisible()` is an assertion. Playwright **waits** (up to 15 seconds) for it to become true. That is why we never use fixed pauses.
- `env.adminEmail` comes from your private `.env` file. Passwords are never written in the code.

---

## 6. Words you will see

| Word | Meaning |
|---|---|
| **Test case / spec** | One check (a `test(...)`) / a file with several tests (`*.spec.ts`) |
| **Assertion** | A check, for example `expect(...).toBeVisible()` |
| **Locator** | How a test finds an element, for example `getByRole('button', { name: 'Sign In' })` |
| **Page object** | A file/class that holds the locators and actions of one page |
| **Fixture** | A ready-made helper a test can ask for (like `page`) |
| **Headless / headed** | Without a visible window / with a visible window |
| **Slow motion** | `PLAYWRIGHT_SLOW_MO=400` waits 400 ms between actions so you can follow |
| **Session / cookie** | How a website remembers that you are logged in |
| **storageState** | A saved copy of a logged-in browser, so we do not log in every time |
| **Worker** | One test runner. More workers = faster but more requests to the site |
| **API** | The "back door" the page talks to (for example `/api/student/auth/login`) |
| **HTTP 429** | "Too many requests, slow down" |
| **Toast** | The small pop-up message that disappears after a few seconds |
| **Flaky test** | A test that sometimes passes and sometimes fails for no clear reason |
| **`test.fixme`** | A test that is parked (skipped) on purpose, with the reason written inside |
| **`test.fail`** | A test for a known bug: it **passes while the bug exists** and fails when the bug is fixed (so you notice) |
| **Serial** | Tests run one after another (needed when they share one test user) |
| **Project** (in Playwright) | A named group of tests with its own settings (`setup`, `auth`, `admin`, `marketplace`...) |

---

## 7. What we found in your site (possible bugs and gaps)

**Login**
- The login allows only 10 requests per window; after that it blocks for about 11 minutes (the page shows a "Too many requests" toast).
- Email: spaces around it are ignored and it is not case-sensitive. Password: case-sensitive, spaces are kept.
- A 300-character email gets HTTP 422 from the server (what the page shows for it was not checked).

**Admin dashboard (all 113 pages)**
- Missing image `/img/man.jpg` (404) on 92 pages, invalid SVG attributes, React errors on 3 pages, an analytics error, and a 404 for the meeting license API.

**Courses**
- The "Share this lesson" link returned a 404 page (maybe because the course was a Draft; not confirmed).
- The course page still says "Please Create Your Chapter!" even when a chapter exists.
- **Create** is enabled before the page has finished loading (clicking too early gives "Course is required").
- The Upload box on lesson forms opens nothing, but the same kind of box on the seller product form works.
- Paid pricing is impossible: no payment gateway is configured.

**Marketplace**
- **A rejected seller who is already logged in can keep working for about 17 minutes** (most important finding).
- No seller plans exist ("No plan available yet"), so no seller can create a course or community ("Plan not found").
- The seller product form needs a category, but none is offered (only "Digital" categories can be created).
- The category delete dialog says "**Partners** with these IDs will be deleted" (wrong word).

Full details are in the three files in `docs/`.

---

## 8. What I created on your site (test data)

| Item | Where | Notes |
|---|---|---|
| **QA-Explore Course** (ID 49589, Draft) | Courses | With "Chapter 1 - Basics" (168197) and two lessons: "Lesson 1 - Welcome (text)" (734090) and "Lesson 2 - Quiz" (734091). The lesson tests use this course. |
| **QA Seller** (ID 1307, `qa.seller.test@example.com`) | Marketplace > Seller | Left **Approved**. The marketplace tests use it. |

- The test lessons, the "QA Category", the test images and the settings change were **deleted or restored** after use.
- "Yousuf course" (ID 49588) is **yours**, not mine.
- Everything above is safe to delete when you finish, but then the lesson and marketplace tests will not work until they are created again.

---

## 9. Mistakes made on the way (and what they teach)

1. **The first tests "passed" but checked nothing.** A green test is only useful if it has real checks.
2. **I said "no message is shown" three times and was wrong.** The messages were pop-ups (toasts) that my first check could not see. Look with the right tool before you decide something is a bug.
3. **My retry code made the login lock last longer.** Retrying a blocked action is often the wrong fix.
4. **A second browser silently reused the admin login.** In Playwright, a new browser context inherits the project's saved login unless you give it an empty one.
5. **Tests that change shared data cannot run in parallel.** That is why the marketplace tests run one after another.
6. **We had a rule ("no locators in tests") and still broke it 17 times.** Rules that only live in a document get forgotten. Now the linter checks it, so it cannot happen again without an error.
7. **The newest TypeScript (version 7) did not work with the linter.** The newest version of a tool is not always the best choice. The project now uses TypeScript 6.0, which the tools support.

---

## 10. Safety notes

- `.env` and `playwright/.auth/*.json` contain **real passwords and logins**. Never send them, never put them on GitHub. They are already in `.gitignore`.
- The admin password was pasted in the chat earlier. **Change it** when the testing is finished.
- This folder is **not a Git repository yet**, because Git is not installed on this computer. Without it nothing is backed up and you cannot go back to an older version. Install Git, then run `git init -b main`, `git add .`, `git status` (check that `.env` and `playwright/.auth/` are **not** listed) and `git commit -m "Initial commit"`.
- Tests change real data on your site (courses, lessons, a seller). Use only the QA items listed above.

---

## 11. Where to go next

**To learn (about 1 hour):**
1. Read `CLAUDE.md`.
2. Open `pages/LoginPage.ts`, then `tests/auth/login.spec.ts`.
3. Run `npm run test:login`, then `npm run test:headed` and watch.
4. Run `npm run report` and open a test to see the steps.
5. Change one expected text in a test, run it, and read the failure (screenshot and trace are in `test-results/`). Then change it back.
6. Read `playwright.config.ts`, then `pages/LessonPage.ts` and `tests/course/lessons.spec.ts`.
7. Learn more at playwright.dev (start with "Writing tests", "Locators" and "Assertions").

**Things I suggest next:**
- Install Git and put the project in it (see the safety notes).
- Later: ask your developers for `data-testid` attributes (stable hooks for tests), move test setup from the screen to the API (faster), and add a CI pipeline.
- Answer the open questions in `docs/course-feature.md` and `docs/marketplace-feature.md` (seller plans, physical products, test student account, payment gateway, sample files for VIDEO/AUDIO/DOWNLOAD/SCORM lessons).
- Choose the next area to cover (Students, Orders, Coupons, Communities...).
