# EzyCommunity web tests

Playwright + TypeScript tests for the EzyCommunity web site. Self-contained: install and run from this folder.
Status: scaffold (project files, `.env`, one start-page smoke test). The site is not mapped yet.

## Quick start

1. `npm install`
2. `npx playwright install chromium`
3. Fill in `.env` (copy of `.env.example`): `WEB_BASE_URL` and the admin and member accounts.
4. `npm run test:smoke`
5. Before finishing a change: `npm run check`

Read `CLAUDE.md` for the structure, rules and next steps. The Android app tests are in `../ezycommunity-app/`.
