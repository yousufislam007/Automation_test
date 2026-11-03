# Repository overview

This repository holds four separate test projects. **Work inside one project folder and read its own `CLAUDE.md` first.**

| Folder | Project | Instructions |
| --- | --- | --- |
| `ezycourse-web/` | EzyCourse admin dashboard (Playwright + TypeScript) | `ezycourse-web/CLAUDE.md` |
| `ezycourse-app/` | EzyCourse Android app (Appium + WebdriverIO) | `ezycourse-app/CLAUDE.md` |
| `ezycommunity-web/` | EzyCommunity web (Playwright + TypeScript), scaffold only | `ezycommunity-web/CLAUDE.md` |
| `ezycommunity-app/` | EzyCommunity Android app (Appium + WebdriverIO), scaffold only | `ezycommunity-app/CLAUDE.md` |

## Rules for the whole repo
- Each project has its own `package.json`, `node_modules`, `.env` and commands. Run commands from inside the project folder, not from the repo root.
- Do not hardcode credentials. Never print cookies, tokens, emails or passwords. Read credentials from the project's `.env`.
- Never commit `.env`, `playwright/.auth/` or `*.log` (see `.gitignore`).
- The login API allows about 10 requests per window (then HTTP 429 for 10 to 15 minutes). Log in once and reuse the saved session; never retry a login. Do not try to bypass rate limits.
- Before finishing a change in a project that has `npm run check`, run it from that project's folder.
