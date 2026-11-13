# EzyCommunity Android app - view-only exploration as a MEMBER (community SQA Team)

Date 2026-11-13. Device Samsung SM-A176B (Android 16), package `com.ezycommunity.android`, logged in as the test member (`@testera-a`, `TEST_MEMBER_*` in `.env`). Read `app-explore.md` (admin pass, 2026-11-03) first: this file only records what is DIFFERENT for a member, plus new facts. Method: one Appium session, page source parsed, screenshots deleted afterwards. Nothing was posted, reacted, saved, joined, bought, registered, marked read or changed; menus and sheets were opened and closed only. "(unverified)" = seen once / read from the tree only.

## Session facts (important for every run)

- The member session on the phone was LOST between 14:41 and 14:54 local time (the app showed the login screen, with the member email and "Remember me" pre-filled, the Terms checkbox UNCHECKED and the password field empty). Cause unknown. During the pass a toast `New sign-in on Mac OS` appeared in the app (14:11 screenshot of Library), so another sign-in of the same account may have happened elsewhere; if the site allows one session per account, the phone will be logged out again whenever that happens. One real login was needed again (2 logins for the account on 2026-11-13).
- After a logout the login form keeps email and password (Remember me) but the `I agree to the Terms of Service and Privacy Policy` box is unchecked; `Sign in` does nothing until it is ticked. `LoginScreen.login()` now ticks it (`CheckBox` instance 1; instance 0 is Remember me).
- Launch takes 3-5 s on a splash screen (logo + spinner) before any `content-desc` exists; wait for `Welcome back` or `Home`.

## Member vs admin: what differs

| Area | Admin (2026-11-03) | Member (2026-11-13) |
| --- | --- | --- |
| Home top tabs | Home, Channels, Courses, Events, Members, Leaderboard, Library (7) | Same 7 tabs (the owner's note "member has fewer tabs" did NOT hold for testerA) |
| Post `...` menu on someone else's post | Copy text, Save post, Pin post, Turn off commenting, Hide post, Report post, Block user, Delete post | `Save post`, `Hide post`, `Report post`, `Block user` only (4 Buttons under a `Scrim`) |
| Channels list | 9 channels + `Add channel group` | 11 rows, NO `Add channel group`. Paid/private channels carry a crown emoji in the desc (`Tunnel - paid / 👑`, `Private channel / 👑`, `Hydrogen / 👑`, `paid / 👑`); `General / 20+` carries an unread badge. Groups: `TEST` (channel `123`), `NEW TEST` (two channels named after people, one with 😂). A channel named after a person also sits in the main list. |
| Paid channel page (`Tunnel - paid`) | Content visible, no paywall | Lock banner `Join Tunnel - paid to post, react, and comment.` + Button `Join for $10/mo`, `Sort` button, and the empty state `No posts yet / Be the first to post in this channel` (admin saw 1 video post there). `...` and filter icons in the header. |
| Private channel page | 1 post, 2 comments | Sales/lock page: `PRIVATE CHANNEL / Private channel / <pitch> / Members-only discussions / Resources you will not find elsewhere / A direct line to the team / Early access / $80`, Button `Join for $80`, FAQ rows `How do members get in?`, `What happens after I join?`, `Is anything shared outside the channel?` |
| Composer channel picker | `9 channels` | `7 channels` (General, Mineral, hiii, the person-named channel, TEST/123, NEW TEST/2): paid and private channels the member has not joined are excluded. Attachment row: `Image, Video, Audio, Poll, GIF, File, Code` (admin saw `Doc` and `Embed`; member has `File` and no `Embed`). |
| Events card | `View event`, `Add to cal`, `Join live`, `Ended` | Upcoming online cards show Button `Register` |
| Event detail | `Join live room` / `You manage this event` | Badge `Members only`, `Recurring event`, `Starts in 48m 38s`, `Add to calendar`, `Set reminder`, `Organized by`, counter `0 registered / 4` (capacity), bottom Button `REgIsTeR` (mixed case, see oddities). `Back` and `Share event` Buttons present. |
| Members | `43`, chips 5+1+34 | `47`, chips `Admin 6`, `Moderator 1`, `Member 36` (= 43, 4 unaccounted again). Card desc now shows the role: `<name> / Community Member / 0 / posts / 0 / comments` or `<name> / Admin / 9 / posts / 33 / comments`. Expanded card: `Message`, `View profile`. Profile tabs `Posts / Comments / About`, `Message`, `No posts yet`. |
| Leaderboard | gamification-off message | Same message, same misleading "Contact an administrator" text |
| Library | 12 files in 2 folders | Same list; a file in the paid folder shows `Paid access` with a lock instead of `Audio, size, date`; grid/list toggle icons at the top right. |
| Chat > Rooms | private room shows `Request` | `Rooms / 9`: public rooms not joined show Button `Join` (`testing / 37m / 1 member`); `Members only` rooms not joined show `Request`; joined rooms show the last message. `Direct messages / 1` (unread count in the toggle label). Threads / Mentions / Saved pages list the member's own items (`@testerA A` mentions, `QA-BADGE-*` test messages). |
| Account sheet | admin card | `testerA A / @testera-a`, same rows (`Edit profile, Notifications, Visibility, Security, Blocked users, Language, Downloads, LINKS / Com-And, Log out`) |
| Blocked users | empty | One blocked user with Button `<name> / Unblock` (testerA has blocked someone; test data) |

## Member-only facts

- Courses: `Continue learning` row lists the member's enrolled courses (`<title> / Continue learning / <n> lessons`); `All courses` marks them `Enrolled`. Free course detail: `1 enrolled`, `Instructor`, `Course includes` (`1 lesson`, `1 chapter`), `Course curriculum`, chapter row `chapter 1 / 1 lesson` with lesson `Lesson 1 video`, price `Free`, Button `Enroll for free` (not tapped). No `Buy` course was on the first screen (list not scrolled).
- Home feed as member: `Sort` Button present; post action row `React / Comment / Share`; reaction count ImageView (`1`) and `14 comments`; audio post card `<file>.wav / 00:00 / 00:29` with a `ProgressBar` (desc `0`), PDF card `<file>.pdf / PDF`.
- Channel `General` page: `Sort`, `Pinned post` section first.
- Videos: header `📹 / General`, reaction count `1`, `Share`, author avatar, count `3`, `Save`, `More` (no caption on the first video).
- Search: `Search results for “test”` tabs `All / 38`, `Posts / 22`, `Comments / 2`, `People / 3` (+ Events/Courses off-screen), filters `All spaces / Any author / Any time / Relevance`, section `POSTS / View all 22`, rows `<initials> / <name> · <age> / <title> / <snippet> / <channel>`. `RECENT SEARCHES` stays `No recent searches yet.` before typing.
- Settings > Edit profile: EditText First Name / Last Name / Display name / About You (`486 characters remaining`), `Username` is a non-editable `@handle`, `Change cover`. Visibility: `Everyone / Anyone can view your profile`, `Members only / Only community members can see`. Security: `Change password` (3 fields, `Update password`). Language: `Filter by region` chips `All / 76, Europe / 33, Asia / 30, Middle East / 5`, `Community default / Follow whatever this community is set to`, tiles `<flag> / <native> / <English>`. Downloads: `No downloads yet / Downloaded files will appear here`.
- Bottom bar descs carry badge counts: `9+ / Notifications`, `6 / Notifications`, `9+ / Chat`. `UiSelector().description("Notifications")` therefore fails on the bottom bar; use `descriptionContains("Notifications")` and pick the bottom-most match (the Settings row has the plain desc).
- Toasts appear in the tree as `android.widget.Toast` (`New sign-in on Mac OS`, `1 update available`).

## Candidate bugs / oddities (owner decides; each seen once unless noted)

1. Event detail button reads `REgIsTeR` (mixed case) while the list card says `Register` (screenshot checked). Could be a custom CTA label typed on the web wizard: check the event "Event Recurring test" (13 Nov 16:00) in the admin before reporting.
2. Locked paid channel shows the empty state `No posts yet / Be the first to post in this channel` under the lock banner, although the admin sees a post there and the member cannot post. Misleading empty state (possible bug).
3. Members: `All 47` vs chips 6+1+36 = 43 (same mismatch as the admin pass, 43 vs 40, and the web 43/41/53 counts).
4. Calendar month picker still says `Sept` (all other months 3 letters).
5. Leaderboard off-message tells a member to "Contact an administrator" (fine for members; misleading only for admins).
6. Toast `New sign-in on Mac OS` while the account was in use on Android only (by us). Either another sign-in happened elsewhere or the platform detection is wrong. Tied to the session loss above (unverified).
7. Session loss without user action (see Session facts). If reproducible, it breaks every long member run.

## Still not covered (view-only limits or not reached)

Notifications page as member (bottom-bar locator failed), Settings > Notifications matrix as member, reaction picker (would react), comment composer (would post), chat composers, event `Register` / `Set reminder` / `Add to calendar` (would change data), `Join for $..` flows, Library file open (plays/downloads), Videos `Save`/`More`, course player as member, Members `Filter` sheet, calendar month `Edit`, `Com-And` link, the person-named channels' pages, hardware-Back-from-root behaviour (an edge swipe at x≈1000 is the Android back gesture and left the app; not an app bug).

## Locator notes added by this pass

- Post `...` menu: unlabeled clickable `Button` with bounds x ≈ 934-1046 right of the post header (first post ≈ [934,398][1046,511]); tapping its centre opens the sheet.
- `descriptionContains("paid")` matches `Tunnel - paid` before the channel `paid`: match channel rows by exact desc prefix or bounds.
- Edge swipes (start x > ~980 or < ~100) trigger the system back gesture; swipe the tab strip from x=900 to x=200.
