# Test automation: EzyCourse and EzyCommunity

One repository, four independent projects. Each folder has its own `README.md`, packages, `.env` and commands. Run every command from inside the folder you work on.

| Folder | What it tests | Tools | Status |
| --- | --- | --- | --- |
| [`ezycourse-web/`](ezycourse-web/) | EzyCourse admin dashboard in the browser | Playwright + TypeScript | In use |
| [`ezycourse-app/`](ezycourse-app/) | EzyCourse Android app (also the white-label apps built from it, for example Mindspectrum) | Appium + WebdriverIO + TypeScript | In use |
| [`ezycommunity-web/`](ezycommunity-web/) | EzyCommunity web | Playwright + TypeScript | Scaffold (env, config, smoke test) |
| [`ezycommunity-app/`](ezycommunity-app/) | EzyCommunity Android app | Appium + WebdriverIO + TypeScript | Scaffold (env, config, smoke test) |

## Rules for the whole repo
- Never commit `.env` files, login sessions (`playwright/.auth/`) or log files (`.gitignore` covers them).
- Do not hardcode credentials. Never print cookies, tokens, emails or passwords.
- The login API allows about 10 requests per window; log in once and reuse the session.
- Run `npm run check` inside a project before finishing a change to it (where the project has that script).

## Where the notes are
- Web feature notes: [`ezycourse-web/docs/`](ezycourse-web/docs/) (course, marketplace, community, coaching, site map).
- App notes: [`ezycourse-app/docs/app-feature.md`](ezycourse-app/docs/app-feature.md).
