# EzyCourse 2.0 web: explore notes

Source for test cases. The site is the UI/UX prototype https://ezycourse20uiux.pages.dev/ (explored 2026-11-17, view-only, nothing created or changed).

## Facts that matter for tests

- Static single-page app, hash routing (`/#/<group>/<page>`), **no login**, no network calls, all data is mock and fixed (dates Sep-Oct 2026, mock admin "Muzammel Academy"). No rate limit applies. Set `WEB_BASE_URL=https://ezycourse20uiux.pages.dev`.
- The sidebar is an accordion: opening a group closes the other. Reach pages with `goto('/#/...')` instead of clicking through it.
- Because it is a prototype, a few sidebar items are not built (the route falls back to another page) and a few pages are empty stubs. Each file marks them.
- Top bar: Search (Ctrl/Cmd+K), notification badge (8), avatar "MA", Gallery, Visit site.
- Buttons labelled Create / New / Add / Import / Export were NOT clicked; their dialogs are not explored yet.

## Files (one per sidebar group)

| File | Pages |
| --- | --- |
| [dashboard.md](dashboard.md) | Dashboard `/` |
| [website-ai.md](website-ai.md) | Website, AI |
| [analytics.md](analytics.md) | Overview, Reports, Product insights, Revenue insights |
| [courses.md](courses.md) | All courses, Submissions, Quiz, Certificates |
| [products.md](products.md) | Coaching (stub), Communities (not built), Scheduling, Media library |
| [b2b.md](b2b.md) | Organizations, Pricing plans |
| [users.md](users.md) | All contacts, Team & roles |
| [sell.md](sell.md) | Orders, Approvals, Checkout statistics, Offers, Pricing, Memberships |
| [marketing.md](marketing.md) | Email insights, Campaigns, Automations, Forms, Funnels, Newsletter; Marketplace and CRM not built |
| [manage.md](manage.md) | Categories, Email settings, Audit log, Sites & transfers; Gamification, Video editor, Exports are stubs |
| [settings.md](settings.md) | Settings (8 cards) |

## Not explored yet

Settings sub-pages, tab contents on Website / AI / Analytics, detail pages (row click), create/edit dialogs, filters panels, Ctrl+K search, notification panel, sidebar collapse, responsive layout, dark mode.
