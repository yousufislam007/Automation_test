# EzyCommunity web - Paywalls and Paywall Groups (explore + create), second test community

Date 2026-11-13. Site: the SECOND test community `https://yousuf.communitycdn.net` (owner permission; `TEST_*` keys in `.env`), NOT the SQA community. Headless Chromium shared over CDP, logins: admin 1, test member 1, QA student 1 (all HTTP 200). The owner allowed creating paywalls; nothing was bought. Earlier view-only notes for the SQA community: `web-explore-dashboard-b.md` (list pages) and `web-explore-dashboard-c.md` (create dialogs).

## Data created and LEFT in place (ask the owner before deleting)

| What | Id | Details |
| --- | --- | --- |
| Paywall `QA Paywall OneTime 1113` | 712 (`pwl_0-6Q...`) | Resource: channel `Video channel` (483). Price $5 Pay Once, strike $9. Checkout `/paywall/712/checkout`. Archived and reactivated once during the test. |
| Paywall `QA Paywall Monthly 1113` | 713 (`pwl_G8jE...`) | Resources: course `Mastering Excel for Beginners` (1149) + event `QA Explore Event 1` (986). Prices: $3 / QA Monthly (strike $6, 7 trial days, Default) and $30 / QA Yearly. A $0 price was created by a validation probe and deleted. Checkout `/paywall/713/checkout`. |
| Billing intervals | 380, 381 | `QA Monthly` (monthly x1), `QA Yearly` (yearly x1). They now appear in every price form's interval list; no UI to delete an interval was seen. |
| Paywall group `QA Plans 1113` | 243 | T1 Monthly (featured), T2 OneTime. Public page `/plans/243`. |

Existing data untouched: paywall `Premium membership` (id 28, 4 channels, $299 Pay Once).

## /dashboard/paywalls

- H1 `Paywalls`, subtitle "Control access to your community content. Create paywalls to gate channels and spaces behind paid or free access.", `Create Paywall`, filter buttons `All` / `Active` / `Archived`, search `Search paywalls...` (matches name, case-insensitive; no match -> `No paywalls found.`), table PAYWALL / STATUS / RESOURCES (count) / CREATED, `Previous` / `Next`. Newest first.
- Row menu (last `button` in the row, no accessible name): `Copy Checkout Link`, `Copy ID`, `Edit`, `Archive`, `Delete`. An archived row has `Reactivate` instead of `Archive`.
- **Archive has no confirmation**: it fires `PUT /paywalls/<id> {"status":"archived"}` at once. While archived: status badge `Archived`, hidden from the `Active` filter, the checkout URL shows `Page Not Found! Go Back Home` (HTTP 200), and the paywall disappears from its group's public plan page. `Reactivate` (`{"status":"active"}`) restores all of it.
- APIs: `GET /api/community/v1/paywalls?page=1&per_page=20`, `GET .../paywall-resources`, `GET .../paywall-intervals`, `GET .../paywalls/<id>/prices`.

## Create / Edit Paywall dialog (`[role=dialog]`, left steps General / Resources / Prices)

**General** - `Paywall Name` (placeholder `Enter paywall name`), `Short Description` (textarea, counter `n / 500`, hard-limited to 500), `Description` (rich editor, `Insert block`), `Cover Image` (`Select from gallery` / `Change`), `Cancel`, `Create Paywall` (edit mode: `Save Changes`). Resources and Prices are disabled until the paywall exists; after `Create Paywall` (`POST /paywalls` 200 "Paywall created") the dialog jumps to Resources.
- Empty name: client message `Name is required`.
- Name of only spaces: no client message; the request is sent and the API answers 422 `The name field must be defined` (dialog stays open, no visible error noticed).
- Name has no `maxlength`: 300 characters were accepted by the input (not submitted).

**Resources** ("Gated Resources") - tabs `Selected n`, `Channels n`, `Courses n`, `Events n`, `Rooms n`, `Library n` (buttons with aria-label = tab name), a search box per tab, `Select all <type>`.
- Channels: listed inside collapsible channel groups (group row with checkbox, chevron and a count); expand the group, then tick a channel. 5 channels here (all visibility `public`).
- Courses: flat checkbox list of the 5 courses. Events: note "Members get free registration for the events you grant here.", filter `All events (upcoming + past)`. Rooms: `No rooms available`. Library: "Nothing in the library is sold on its own yet - set a category, folder or file to Paid access first."
- `Selected` tab shows the picked items with a `New` badge, `Unsaved changes +1 added`, and a checkbox "Unlock what you added for members who already bought this paywall" (on by default; sent as `grantExisting: true`).
- `Save Changes` -> `PUT /paywalls/<id>` with `{"resources":[{"resourceType":"channel|course|event","resourceId":n}],"grantExisting":true}`.

**Prices** - empty state `No prices yet / Add a price to start monetizing this paywall.`, `Add New Price`. Form: `Amount` (`input[name=amount]`, USD), `Strike Price (optional)` (`name=strikeThroughAmount`), `Billing Interval` (combobox: `Pay Once`, saved custom intervals, `Create new interval`), `Trial Days` (`name=trialDays`, default 0), `Cancel`, `Add Price` (`POST /paywalls/<id>/prices`).
- `Create new interval` opens an inline block: `Display Name` (placeholder "e.g. Monthly, Yearly, 3 Yearly, Pay Once, etc."), `Interval Type` (Daily, Weekly, Monthly, Yearly, Lifetime, Installment), then `Interval Count` (default 1, unit shown e.g. `months`), `Create Interval` (`POST /paywall-intervals` 201). The new interval is selected automatically.
- Validation seen: empty amount `Required`; no interval `Select interval`; interval form `Please enter display name` / `Please select interval type`; trial days -5 -> `Must be between 0 and 365`; strike price lower than the amount -> `Must be greater than price`.
- **Amount 0 is accepted**: a `$0 / QA Monthly` Recurring price with a 7-day free trial was created (200). It also became the Default because it was the first price.
- Price card: amount, interval, struck-through strike price, badges `Default` / `One-time` or `Recurring` / `7d free trial`; buttons `Set Default` (`PUT .../prices/<id> {"isDefault":true}`), pencil (edit form with Amount, Strike Price, Trial Days only: the interval cannot be changed), red trash (popconfirm "Delete this price? This price will no longer be available." `Cancel` / `Delete` -> `DELETE .../prices/<id>` "Price deactivated successfully"). The Default price has no trash button.

## /dashboard/paywall-groups

- `Create Group` dialog "Create Paywall Group": `Group Name` (placeholder "e.g. Membership Plans, All Access..."), `Description (optional)` (`n / 1000`), "Plans & Display Order" (drag to reorder, star = `Mark as featured`, remove icon), "Add Plans" list of all paywalls (click to add). `Create Group` is disabled until a name is typed, and is ENABLED with a name and zero plans (an empty group looks creatable; not submitted).
- `POST /paywall-groups` with `{"name","description","paywallIds":[...],"featuredPaywallId"}`. Table GROUP / TIERS (IN ORDER) (`T1`, `T2` chips) / CREATED; row menu `Edit Group`, `Copy Plan URL`, `Delete`.
- Edit dialog shows the public path (`/plans/243`) with `Copy URL`, the same fields, "Add More Plans" and the line `★ <paywall> will be highlighted as "Featured" on the plan page.`

## Public pages (no purchase made)

- **Plan page `/plans/<groupId>`** (works logged out): heading + description, one card per active paywall in tier order. Featured card is purple with the badge `★ Most Popular`; card shows default price, strike price, `/ <interval name>` or `one-time · lifetime`, `Save 50%`, `7-day free trial`, `Also: $30 / QA Yearly`, name, short description, `Get started →`, footer `SECURE CHECKOUT · 256-BIT TLS · PCI-DSS / ENCRYPTED PAYMENT / CANCEL ANYTIME / NO HIDDEN FEES`.
- **Checkout `/paywall/<id>/checkout`** (title `Unlock <name>`): left = name, short description, `CHOOSE YOUR PLAN` (one option per price, with `SAVE 50%`, `Save vs. $6.00`, `7-day free trial`, `$3.00 / mo`, `$30.00 / yr`) or the single price, `WHAT'S INCLUDED` (channels, courses and events by name), `About this plan`, `Secure & protected`. Right = `Start your free trial` / `Complete your purchase`, account block (name, email, `Not you?`) or, logged out, an `Email` field with `Verify`; checkbox `I agree to the Terms and Privacy Policy`, `Save card for future purchases`, saved cards (`VISA •••• 4242`, `Use a new card`), button `Start 7-day free trial` / `Complete purchase`, summary (Subtotal, `Free trial (7 days) -$3.00`, `Due today $0.00`, "Free until Nov 20, 2026, then $3.00 per month.").

## Candidate bugs / questions for the owner (not sent to Discord)

1. **A public channel added to a paywall stays fully open.** The QA student (no purchases) opened `/channels/video-channel`, which is gated by two paywalls, and still got the composer (`Post`, `Photo`, `Poll`) and `Follow`. All 5 channels here have visibility `public` / ACCESS `Open`. If a paywall is meant to "gate" the channel, this is a bug; if a paywall only unlocks channels that are already private or priced, the page subtitle is misleading. Needs the owner's ruling and a re-test with a Private channel (none exists here; creating one was outside this task).
2. **A free course in a paywall stays free**: `Mastering Excel for Beginners` still shows `Free` / `Enroll in Course` to the student. Same question as 1.
3. **Plan page omits courses and events**: the OneTime card lists `INCLUDED CHANNELS / Video channel`, but the Monthly card (1 course + 1 event) lists nothing, while its checkout page does list both under `WHAT'S INCLUDED`. Seen logged in and logged out, screenshot checked.
4. **$0 price accepted** for a paid recurring interval with a trial (see Prices). Possibly intended as "free access"; then the 7-day trial on a free price makes no sense.
5. **Spaces-only paywall name** is not caught client-side; server 422 and no clear message.
6. **Archive has no confirmation**, although it instantly kills the checkout link (Delete was not tried).
7. Wording: edit-group dialog says the plan is highlighted as "Featured"; the public page badge says `Most Popular`.
8. Cosmetic: the `Delete price` tooltip overlaps the `Cancel` button of the delete popconfirm.
9. `403 /api/community/v1/paywall-intervals` on member pages again (same as on SQA).
10. The archived checkout URL answers HTTP 200 with a "Page Not Found!" body (soft 404).

## Not covered

Buying a paywall (Stripe test card), free-trial start, subscription renewal/cancel, `Delete` paywall and `Delete` group, cover image, drag reorder, editing a group, paywall with a Private channel / room / library item, coupons, manual payment gateway, `Copy Plan URL` clipboard content (headless clipboard read was denied; the path is `/plans/<id>`), the Paywalls tab inside channel settings, member `/billing` Subscriptions tab after a purchase.

## Automation notes

- Session: `launchPersistentContext` + `--remote-debugging-port`, snippets connect with `connectOverCDP` and end with `process.exit(0)`; one login per account lasted the whole run (token refresh `POST /api/auth/refresh`, `expiresIn: 300`).
- Clipboard: `context.grantPermissions(['clipboard-read','clipboard-write'], { origin })` worked for the paywall row menu after `page.bringToFront()` was not needed; it failed once on the groups page (read permission denied).
- Locators: dialog steps `getByRole('button', { name: 'Prices', exact: true })`; resource tabs `getByRole('button', { name: /^Courses/ })`; price inputs by `name`; comboboxes `[role=combobox]` + `getByRole('option')`; row menu = last button in `tbody tr` filtered by the paywall name; menu items by role `menuitem`.
- Never log response bodies of `/api/socket/v1/connect` (they contain a token).
