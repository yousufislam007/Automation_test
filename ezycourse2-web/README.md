# EzyCourse 2.0 web tests

Playwright + TypeScript tests for the EzyCourse 2.0 web site. Self-contained: install and run from this folder.
Status: scaffold (project files, one start-page smoke test). The site and its login are not mapped yet.

## Quick start

1. `npm install`
2. `npx playwright install chromium`
3. Copy `.env.example` to `.env` and fill in `WEB_BASE_URL` and the admin and member accounts.
4. `npm run test:smoke`
5. Before finishing a change: `npm run check`

Read `CLAUDE.md` for the structure and rules.
