# Web explore: Admin dashboard, part A (EzyCommunity QA web, admin Team SQA)

> **Correction (re-checked with screenshots, 2026-11-04):** the Meetings "Audience mix 6588%" is NOT a bug (count "65" and percent "88%" are separate elements; innerText glues them). The Media Storage "8.5 GB -> 5 GB" change did not reproduce. "Admin Api" on Billing is shown struck-through (excluded), so it does not contradict the API keys page. Courses is 9 on both Dashboard and Billing now. Confirmed bugs: Channels "Active 8" vs 9 rows, expired invite still "Pending", member count 43 / 41 / 53. Ignore the older notes below that say otherwise.


Explored 2026-11-04, view-only, shared Chromium over CDP, admin session valid. Site https://sqa.ezycommunity.pro.bd only. No 429, no login, nothing saved/created/deleted. Personal data masked (Member A/B, `<email>`). Counts change fast because other workers create data (e.g. Posts 202 yesterday, 235 today), so assert on structure, not numbers. Complements `web-explore-events-admin.md` (section 7); only new details below.

## Shared admin chrome (all /dashboard pages)
- Top bar (member nav): Home /feeds, Courses /courses, Events /events, Members /members, Leaderboard /leaderboard; community name link "SQA Team" /feeds with a "20+" counter next to it. Header buttons (aria-label): `Open messages`, `Open notifications`, `Open profile menu`, `Expand sidebar`.
- Profile menu (opened, not clicked further): header with name + `<email>`, items Profile, Settings, Billing, Theme (Light / Dark / System), **Log out** (not clicked).
- Left nav links (admin): Dashboard /dashboard, Website /dashboard/website, Reports /dashboard/reports, Content /dashboard/content, Members /dashboard/members, Course tools /dashboard/course-tools/certificate-blueprints, Gamification /dashboard/gamification, Meetings /dashboard/meetings, Paywalls, Paywall Groups, Earnings And Orders, Community App, Marketing, Automations, Roles & Permissions, Billing and Transactions, Settings, Developers; **Analytics** is a disabled button with a "Coming Soon" label (not a link). Nav badge on Reports was NOT present today (earlier doc said badge 1; the pending report still exists, so badge text is absent or hidden: the link text is plain "Reports").
- Page `<title>` pattern "<Page> | SQA Team", except /dashboard/meetings whose title is just "Meetings" (inconsistent, minor).

## 1. /dashboard
- Title "Dashboard | SQA Team". No H1 (first heading is H2 "At a glance"); page-level controls are buttons only.
- Date range button (text "Oct 6 – Nov 4, 2026" + "30 days" + "UTC"): opens a popover with presets `Last 7 days`, `Last 30 days`, `Last 90 days`, `Last 12 months` and a two-month calendar (day buttons have aria-label like "Tuesday, October 6th, 2026, selected"; `Go to the Previous Month` / `Go to the Next Month`). Closes with Escape. Not clicked: presets/days.
- "At a glance" (not affected by range): Members, Online now ("live socket connections"), Channels, Posts (all time), Courses ("published & draft"), Events (total events), Paywalls, Paying members. Today: 43 / 5 / 8 / 235 / 9 / 15 / 4 / 4.
- "In this period": New members (with % vs previous 30 days), Posts, Comments, Earnings (HUF 1,000 + "$1,299 new this period"). Percent deltas like "+968.2%" and ">+999%" appear.
- "Needs your attention" (H3, "9 items waiting on you"): links `Reports to review 1` -> /dashboard/reports, `Join requests 0` -> /dashboard/joining-requests, `Posts with no reply 8` -> /feeds.
- Charts (H3): Earnings over time (buttons `HUF` / `USD` toggle, aria "Revenue currency"), New members, Posts & comments (legend Comments/Posts), Busiest channels (info button `How Busiest channels is calculated`, hover shows tooltip; list General 258 "169 posts / 89 comments", Mineral, 123, ...), Top 10 contributors (name, points, "Level N"). Footer text "Data as of <date time> · refreshes when you open this page".
- ODDITIES: "Needs your attention" says "9 items" but the three counters sum to 1+0+8 = 9 (ok). Top contributors show XP and levels while Gamification is OFF (see section 8). Members shown 43 vs Billing 41 (already noted). One busiest-channels row has an emoji/blank-looking name ("123" and one name rendered as "24"? row text "123 | 24 | 23 posts" is the channel "123" with 24 total).

## 2. /dashboard/website (+ sub-pages)
- Sub-nav links under H2 "Website": Overview /dashboard/website, Analytics /dashboard/website/analytics, Database /dashboard/website/database, Secrets /dashboard/website/secrets, Deployments /dashboard/website/deployments, Settings /dashboard/website/settings, Builder Pages (badge RETIRING) /dashboard/website-builder/pages. Status strip on every sub-page: "Live", domain, "published 2 days ago", link `Visit site` (href "/"), button `Open editor`.
- Overview: H2 "sqa.ezycommunity.pro.bd" card with Live badge, buttons `Open editor`, `Build with AI`, link `Visit site`. "At a glance - Your site, last 7 days" with link `See analytics`: Visitors 0, Requests 0, Data served 0 B, Error rate 0%.
- Analytics (H1 Analytics): button "Previous 7 days" (range picker, not opened); domains line "sqa-team-th6.ezycommunity.com · sqa.ezycommunity.pro.bd"; KPIs Visits, Requests, Data served, Error rate (5xx); H3 Traffic (chart legend Requests/Visits), Top pages, Where visitors come from, Countries, Devices, Browsers, Responses (empty state "No data in this range" or an em dash). Also "Served from cache 0%", "Your code ran 1,092", "Code speed (CPU) 9.8 ms ... 53 ms slowest 1%", "Errors in your code 0". ODDITY: Requests = 0 but "Your code ran 1,092".
- Database (H1 Database): card "SQL Studio" with buttons `Open SQL Studio`, `Open live` (not clicked; it launches an external/other tool). "Site database": billing period Nov 1-30, Queries 4 of 500,000 included, Storage 0 GB of 1 GB, "Extra cost this month $0.00", chart "Queries per day" with `Live` / `Staging` toggle buttons. Tabs (role=tab): `Connections` (default), `Community Keys`, `Delete database` (red tab, not clicked). Connections: Live database `Rotate password`; Staging database `Rotate password`; Direct and Pooled connection strings masked as `postgres://••••••••:••••••••@db.prisma.io:5432/...`, buttons `Reveal` and `Copy` each (not clicked; "every reveal is recorded"); "Connections the platform uses": Your website / Database updates / Editor each with `Rotate` (not clicked). Community Keys tab: "Live key ... Ends in: <4 chars> · Last used 15 days ago" and "Editor key ... Not used yet", each with `Rotate`. SENSITIVE: never click Rotate/Reveal/Delete.
- Secrets (H1 Secrets): button `Add secret`; two panels "Production" and "Staging" each "0 / 50", empty "No production secrets yet." / "No staging secrets yet."; note "DATABASE_URL and EZY_COMMUNITY_KEY are set by us".
- Deployments (H1 Deployments, H3 Updates): list of versions with date, "took 52s", note label, badge Live, buttons `Details` and `Redeploy` (not clicked). The top entry says "On your website now"; earlier ones say "From an earlier source - kept for reference". ODDITY: all three versions carry a "Live" badge (older ones should arguably not).
- Settings (H1 Settings, H2 "Your website is served from your published code"): Source/Type/Updates/Last update table (Astro (SSR), a zip name, "Published from the editor", Updates On), buttons `Disconnect` and `Turn off custom code` (neither clicked; destructive), H3 Limits list (largest zip 100 MB, build zip 25 MB, unpacked 500 MB, 10,000 files, 10 minutes, 10 versions to roll back), note "Request limits are coming".
- Builder Pages (/dashboard/website-builder/pages, H1 Pages): banner "Your website is served from the file you uploaded" with button `Go to Website`; search `Search pages…`; one page "Footer" (type FOOTER, status Published) with link `Build Page` -> /builder/<site-id>/<id> (opens the builder; not clicked).

## 3. /dashboard/reports ("Reports to review" is the SAME page)
- The dashboard card link "Reports to review 1" has href /dashboard/reports, identical to nav "Reports". No separate "Reports to review" route.
- H1 Reports, subtitle "Content your members flagged for review. One row per post or comment."
- Filter buttons (not role=tab): `Pending`, `Dismissed`, `Actioned`, `AI restricted`. Search input type=search, placeholder "Search by member name…", aria-label "Search reports by member name". URL never changes.
- Pending today: 1 row: Member A, "Comment in General", "6d ago", comment text, "1 report", reason chip "Misinformation", link `View` (-> /p/general/<post-slug>, plain navigation, not clicked) and button `Review`.
- Review opens an inline/side panel (not a dialog role): header "This comment is visible to members" + hint "Approve it to keep it and close the report, or remove it with the actions below.", buttons `Close`, `Approve comment`; radio-like options (checkboxes) `Remove the content`, `Warn the author`, `Suspend account`, `Restrict without suspending` with sub-checkboxes `Posting`, `Commenting`, `Messaging`; textbox "Optional. Why this decision was made." labelled "Internal note - audit log only, the author will not see this"; buttons `Apply action` and `Dismiss report`. Opened and closed with Escape; none clicked.
- Dismissed: "No Dismissed reports." Actioned: 1 row (Member B, comment in General, 21d ago, reason "Hate", "Content removed", "by Team SQA · 21d ago", only `View`). AI restricted: "No members are currently auto-restricted by the AI Agent." Search no-match: "No Pending reports from a member matching “zzzz”."

## 4. /dashboard/content (redirects to /dashboard/content/post)
- Sub-nav links: Post /dashboard/content/post, Media Storage /dashboard/content/media-storage, Blogs /dashboard/content/blogs, Channels /dashboard/content/channels.
### Post (H1 Posts, "Manage all posts across your community")
- Search `Search posts`. Status filter buttons with counts: `All243`, `Published238`, `Drafts2`, `Scheduled0`, `On Review3`, `Edit Review0` (All = sum of the others, ok). Pagination `Previous` (disabled on page 1) / `Next`; 20 rows per page.
- Columns change by filter: All/Published: TITLE, STATUS, AUTHOR, CHANNEL, REACTIONS, COMMENTS, PUBLISHED AT, OPTION. Drafts: ... CREATED AT, UPDATED AT. Scheduled: SCHEDULED AT. On Review: REQUESTED AT. Edit Review: TITLE, AUTHOR, CHANNEL, REQUESTED AT, OPTION (no status).
- Empty state: "No posts found." (Scheduled, Edit Review, no search match).
- Row OPTION menu (button aria-haspopup=menu in last cell): `View`, `Delete` (Published and Drafts). On Review rows: the action cell holds different controls (approve/reject style, not identified); NOT clicked (unsure). `View` not clicked.
- Title shows "—" for posts without a title (many rows). A "Edited" tag appears next to a title. Author cell is avatar initial + name; channel is a link /channels/<slug>; author link /profile/<slug>.
### Media Storage (H1 Media Storage)
- Header "8.5 GB of 50.0 GB Used", sub-totals "Media 8.3 GB", "Library 167.9 MB" (link Library -> /library). Filter buttons `People` (dropdown of members, filters "uploaded by"), `Image`, `Videos`, `Audio`, `Files`, `File Size` (dropdown). Columns NAME, TYPE, UPLOADED BY, LOCATION, File Size, DATE, OPTION. Row menu: `Download`, `View Details`, `Delete`. Checkbox column present. Pagination Previous/Next. Row uploader buttons "Show files uploaded by <name>".
- ODDITY: the used-size header text changes to "5 GB of 50.0 GB Used" after clicking a filter chip (was 8.5 GB) while sub-totals stay 8.3 GB + 167.9 MB: inconsistent figure. Also earlier billing page said 7.1 GB.
### Blogs (H1 Blogs)
- Buttons `New Post` (opens a blog editor, not clicked), `Authors` and `Categories` (dropdown filters: Authors list "Admin Jubayer, Team SQA"; Categories "New, Old, Social"). Search `Search blogs`. Chips `All4`, `Published4`, `Drafts0`. Columns TITLE, STATUS, AUTHORS, CATEGORIES, TAGS, DATE, OPTION. Row menu: `View`, `Copy URL`, `Edit`, `Unpublish`, `Delete`. Duplicate title "Reflections on the Past Year" appears twice (different dates).
### Channels (H1 Channels)
- Search `Search channels`; chips `Active8`, `Archived0`; columns NAME, TYPE (Posts), MEMBERS, ACCESS (Open/Closed), WHO CAN POST (Members / Requires Approval), GROUP, OPTION. Row menu: `View`, `Edit`, `Copy ID`, `Archive`, `Delete`. Paid channels carry a "Paid" tag; names include emoji.
- POSSIBLE BUG: chip says Active 8 but the table lists 9 rows (paid, hiii, 123, Hydrogen, Private Channel 2, Private channel, Tunnel - paid, Mineral, General). Also the MEMBERS value for General is 53 while the community has 43 members, and the TYPE/MEMBERS columns appear to be offset (the "Posts" label is in the TYPE column, count in MEMBERS): verify on screen.

## 5. /dashboard/members (+ sub-nav, tabs are links)
- Sub-nav (H2 Members): Members /dashboard/members, Invitations /invitations, Join Requests /requests, Chat Room Requests /chat-room-requests, Profile Fields /profile-fields, Tags /tags, Membership Questions /membership-questions, Auto-Join Channels /auto-join-channels, Level Gates /level-gates (all under /dashboard/members/).
### Members List (H1 Members List)
- Buttons `Export`, `Invite`, `Tags`, `Profile fields`; search `Search members`. Role chips with counts: `Total Members43`, `Admin5`, `Moderator1`, `Member34`, `Course Manager1`, `QA Payment Settings Only1`, `QA Orders Reviewer1` (sum = 43). Chips filter client-side; URL unchanged.
- Grid with role=columnheader (not `th`): checkbox, Name, Tags, Role, Status, Joined Date, Actions (sr-only). Cells role=cell: avatar initials, name, `<email>` (plain text), tags "—", role, status "Active", date "Nov 03, 2026".
- Infinite scroll: 18 rows initially, more load on scroll (22 after scrolling in my run); there is no pager.
- Row action menu (last cell): `View Profile`, `Edit Member`, `Edit tags`, `Assign Role`, `Send Login Email`, `Suspend Member`, `Restrict Member`, `Remove Member` (not clicked). Empty: "No members found".
- ODDITY: two pairs of different members show the SAME email in the list (Dean Larson / Sandra Patrick, Suki Hopper / Fletcher Wooten): check if duplicate emails are allowed. Role chip counts for "Member34" while the dashboard says 43 total (ok).
### Invitations (H1 Invitations)
- Buttons `Invite`, `Email Invites`, `Invite Links`; search `Search by email or name`; chips `Total Sent6`, `Pending1`, `Accepted5`, `Expired / Revoked0`; columns INVITEE, STATUS, INVITED BY, SENT DATE, EXPIRES, ACTIONS (row menus). Invite Links view: columns LINK, STATUS, USES, EXPIRES, ACTIONS, empty "No invite links yet. Create one to share."; the stat chips disappear there.
- ODDITY: a Pending invite expired on Oct 22 still shows "Pending" while Expired/Revoked = 0 (today is Nov 4).
### Join Requests (/dashboard/members/requests, H1 "Membership requests")
- Banner "Join settings: Approval is off ... Turn on approval under Membership Questions". Filter buttons `Pending`, `Approved`, `Declined`. Pending empty: "Nothing here | No one is waiting for a decision." Approved/Declined rows show applicant, `<email>` or "Unknown applicant", status, answers ("Why do you want to join?", "Give a number between 1-7!"). ODDITY: several "Unknown applicant" rows with stray answers like "yy", "gg".
### Chat Room Requests (H1 "Chat room requests")
- Pending/Approved/Declined buttons; empty "Nothing here | No one is waiting for a decision."
### Profile Fields (H1 Profile Fields)
- Button `Add field` (not clicked); chips/tabs `Custom fields5`, `System fields`, `Active5`, `Archived10`; "5 of 25 used". Custom fields list: name, type (Short text, Dropdown, Number), Required badge, usage "Profile · Directory filter" / "Signup · Profile", row menus. System fields view: About (Long text), Website, Facebook, LinkedIn, X (Twitter), YouTube (Link) with Required / "Show on profile" switches and `Save changes` (not clicked). H3 Enforcement: switch "Require a completed profile". Archived chip not clicked (could not be targeted).
### Tags (H1 Tags)
- Search `Search tags…`, buttons `Add tag`, `Add your first tag`; empty "No tags yet".
### Membership Questions (H1)
- `Save changes`; switches "Require approval to join" (off), "Offer paid membership" (disabled until approval on); Questions "2 of 6": each with `Question` text input, type label (Dropdown, Number), Required switch, `Remove question`, option inputs `Add an option`, number min/max, `Re-apply cooldown (days)` number. Note: "Turn on approval above to ask questions". Input placeholders "e.g. Why do you want to join?".
### Auto-Join Channels (H1)
- Checkbox list of channels (General, 123, Mineral, hiii) with "1 of 2 selected" (max 2) and `Save`.
### Level Gates (H1)
- Notice "Turn on Badges & Levels first" with button `Open Badges & Levels`; six gates each with switch, "Off - everyone can ...", and a "Needs Level" input: Chat in rooms, Send private messages (DMs), Post links in chat rooms, Create posts, Post links in the feed, Add videos in the feed.

## 6. /dashboard/joining-requests
- Title "Joining Requests | SQA Team", H1 "Joining requests", "Approve or decline people asking to join private chat rooms." This is a different page from Members > Join Requests (membership) and overlaps with Chat Room Requests. No H2 sub-nav; buttons `Chat` (type selector), `Pending`, `Approved`, `Rejected`.
- Pending empty: "No pending requests right now." Approved shows rows "Member A wants to join <room name> · 5d ago · Approved · 5d ago" (repeated duplicate rows for one member). Rejected: "No Rejected requests in this view." After clicking `Chat` the previously selected status stays.
- ODDITY: naming is inconsistent: "Declined" (members pages) vs "Rejected" (this page); Chat Room Requests /dashboard/members/chat-room-requests shows nothing while this page shows approved rows for the same kind of request.

## 7. /dashboard/course-tools/certificate-blueprints
- Only ONE page in the Course tools group (nav group is a single link). H2 "Course tools", H1 "Certificate blueprints": "Design a certificate once, then attach it to any course".
- Button `New blueprint` (not clicked). Section "Public certificate search" with switch/checkbox "Also allow lookup by email" (off; privacy warning text) (not toggled).
- Toolbar: three dropdowns (aria-label): `Filter by status` (All statuses / Published / Draft), `Filter by usage` (Any usage / Attached to courses / Not attached), `Sort blueprints` (Recently updated / Oldest first / Name (A-Z)); view toggle buttons `Grid view`, `Table view` (I toggled Table then Grid; the view may be remembered).
- Card: name (one blueprint with a Bengali "unnamed certificate" title), "#207 · Updated 11 Oct 2026", badges Draft, "Not attached", row menu `Actions for <name>` (items not read). Table columns Blueprint, Status, Used in, Issued, Updated. Footer "Showing 1 of 1 blueprint", `Previous`/`Next`. Card/row link is just the page itself in my read (open link not captured).

## 8. /dashboard/gamification (URL becomes ?tab=badges)
- Sub-tabs (links with ?tab=): `Badges & Levels` (?tab=badges), `Activity XP` (?tab=activity-xp), `Notifications` (?tab=notifications).
- State today: master switch (checkbox, label "Gamification") is OFF. All "Edit <level>" cards are `disabled` (title "Edit this level", opacity 50) so level editing cannot be opened. Activity XP and Notifications show banners "Gamification is currently off - turn it on under Badges & Levels".
- Badges & Levels: H1, H2 "Levels" (9 levels): Sprout 20 XP, Rookie 50, Regular 75, Insider 150, Connector 400, Veteran 1,000, Mentor 3,000, Luminary 9,000, Legend 30,000 XP, each with tagline; "Badge colors - applies to every badge": `Original` / `Custom` with a colour input.
- Activity XP: groups MEMBERSHIP (Join the community, Once), PROFILE (Update profile picture, cover photo, Complete your bio, Add a social profile), ENGAGEMENT (React to a post/comment, Each), COURSES (Enroll, Complete), EVENTS & LIVE (Attend an event, Join a live session); each row has a switch, frequency, "Custom" tag, XP input.
- Notifications: "Progress nudges" switch, Milestones (First nudge %, Second nudge %), "Celebration preview & style": Preview level buttons 1-9, a level name (Mentor), `Preview level-up`, `Preview milestone` (not clicked).
- ODDITY: dashboard "Top 10 contributors" shows XP/levels while gamification is off.

## 9. /dashboard/meetings
- Title "Meetings" (no community suffix), H1 Meetings, button `Go Live` (starts an instant live session: NOT clicked). Range buttons `7d`, `30d`, `90d` (stat labels change "Held · 7d" etc.).
- Card "Live time this month": "Included in your plan, up to 300 attendees per session, resets Nov 30"; "4 h 21 m of 15 h used / 10 h 39 m left". Stats: Live now, Upcoming (3), Held, Attended time, Peak concurrent, Guest leads. Section "Attendance" with a button for the next webinar ("This is a banner test · webinar · Nov 10, 4:00 PM") and "Not enough samples for this meeting yet."
- BUG CONFIRMED (all ranges): "Audience mix" prints "Community 6588%, Private 00%, Public 912%" (30d); 7d "1789% / 00% / 211%"; 90d "6987% / 00% / 1013%": count glued to percentage.
- Main tabs (buttons): `Meetings`, `Webinars`, `Guest leads`. For Meetings, sub-buttons `Past`, `Running`, `Upcoming`.
- Meetings table columns MEETING, HOST, WHEN (Upcoming: STARTS), LENGTH, ATTENDED, PEAK, GUEST JOINS, RECORDING; name cell has status chip (Completed / Cancelled / Failed / Scheduled) and audience chip (Community / Public). Row menu (aria-haspopup): `View details` (not clicked). Past is paginated Previous/Next. Running empty: "No meeting is live right now." Upcoming: 3 rows (5 Nov Untitled meeting, 9 Nov Test recurring, 18 Nov event twwww).
- ODDITIES: Past list includes "Event Test Banner Cancelled Nov 4, 5:00 PM" and a "Failed" row "60m planned"; many "Untitled meeting" names; Past in 30d mixes times descending but one row (Nov 4 5:00 PM) sits mid-list so sorting is not strictly by date.
- Webinars table: name, status, host, date, length, "N of 100" attended capacity, joins, `Watch replay`, "In gallery"; cancelled webinar shows "0 of 25".
- Guest leads table: NAME, EMAIL (usually "—"; one real `<email>`), MEETING (e.g. "Meeting #774"), JOINED; button `Export CSV` (not clicked: downloads data).

## Not covered / not clicked
Log out, Review actions (Approve, Remove, Apply, Dismiss), all Save/Add/Create/Delete/Rotate/Reveal/Disconnect/Turn off custom code, Go Live, Export, Invite, New blueprint/New Post, Open SQL Studio/editor, On Review row actions, row `View` links and detail views (not opened), certificate blueprint row menu items, date-range presets, gamification Edit dialogs (disabled), Archived chip on Profile Fields, Charts hover tooltips.
