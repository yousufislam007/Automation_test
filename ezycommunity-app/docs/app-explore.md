# EzyCommunity Android app - view-only exploration (admin, community SQA Team)

Date 2026-11-03. Device Samsung SM-A176B (Android 16), package `com.ezycommunity.android`, logged in as the community admin (Team SQA). Method: Appium 3 + UiAutomator2, page source parsed (no resource ids; Flutter-style tree). Nothing was posted, saved, joined, bought or changed. "(unverified)" = read from the tree only or seen once.

Legend: `desc` = content-desc (use `~desc` or `UiSelector().description(...)`). Bounds are for 1080x2340 and shift with scroll.

## Global layout

- Top header: `View` desc `SQA Team` [169,144][417,214]; avatar at top-left (tap x=85,y=179) opens the account sheet.
- Bottom bar (visible on Home tabs only, hidden on detail pages): `Home` (ImageView), `Videos` (View), `Post` (ImageView), `Notifications` (ImageView), `Chat` (ImageView). Bounds y 2050-2194. `Home` also exists as the top tab (duplicate desc, use `.instance(n)`).
- Home top tabs (admin): `Home`, `Channels`, `Courses`, `Events`, `Members`, `Leaderboard` (6 tabs). The strip is horizontally scrollable and auto-scrolls to the selected tab, so on Events the `Home` tab is off-screen (not in tree) and bounds of every tab change per selected tab. Tap tabs by desc, not by fixed x.
- Detail pages show a `Back` Button [11,111][146,246] (not always present in the tree, see quirks) and hide the bottom bar. System Back works.
- Home feed "Sort" Button [945,123][1058,235] appears only on some loads (not always in tree).

## Home (feed)
Reach: default screen / tap `Home`. Posts are `View` rows whose desc = `[Admin /] in <Channel> • <age> / <title> / <body> [/ Embedded from youtube.com | File]`, e.g. `in ⁨General⁩ • 3h / Defensive Body ...` (note invisible bidi marks around channel name). Author is a separate `View` (e.g. `Asif QA`, `Team SQA`, `Yousuf007`). Action row per post: `React` (View) / `Adore`/`Curious` (shown instead of React when the user already reacted; ImageView), `Comment` (ImageView), `Share` (View), counts as `View`/`ImageView` with desc like `2`, `1 comment`, `8 comments`, `10 comments`. Feed contains text, YouTube embed, file (`<name>.docx / DOCX`) posts, pinned post (in channel Mineral). Feed scrolls vertically and ends with older posts; the tab strip scrolls away with the feed.
Post detail: tap the post body/author. Shows `Back`, channel name header (`General`), author, text, reactions, `8 Comments` (capital C in detail vs `8 comments` in feed), `Most recent` sort Button, comments as `View` desc `· / 6 days / <text>` with child `Like` and `Reply` Views and the commenter name. Comment composer input was NOT visible in the tree (unverified). Bug candidate: comment count wording differs between feed and detail (cosmetic).
Test ideas: feed order by recency; reaction count; comment count equals number of comment rows; post in private channel not shown to non-members; file post shows file name and type; pinned post only in its channel.

## Channels
Reach: tap `Channels` tab. Heading `CHANNELS`, then rows (ImageView/View with channel name as desc): `General`, `Mineral`, `Tunnel - paid`, `Private channel`, `Private Channel 2`, `Hydrogen`, emoji channel (desc `&#128525; / hiii`), `paid`; group heading `TEST` with channel `123`. Admin-only control: `Add channel group` (View, bottom of list; NOT tapped).
Channel page: title in header, `Sort` Button [945,111][1080,246], posts list. Opened: `Tunnel - paid` (admin sees content, no paywall; 1 video post), `Private channel` (1 post, 2 comments), `Mineral` (has a `Pinned post` section). Bottom bar hidden inside a channel.
Test ideas: member without access sees paywall/lock on paid and private channels (admin does not); channel order; group heading; sort options (not opened).

## Courses
Reach: tap `Courses` tab. Sections `Continue learning` (only when the account has progress) and `All courses`. Cards are View/ImageView with desc `Image not available / [Enrolled /] <title> / <instructor> / <n> lessons [/ Advanced]` or `<price> / <title> / ...` (`$50`, `Free`, `$555/mo`). Two-column grid; many `AUTO_COURSE_<id>_<timestamp>` courses (0 lessons, Free) appeared during the session (created by another worker/automation), so list contents change.
Course detail (not enrolled): title, `<n> enrolled`, `Instructor`, `Course includes` (`4 lessons`, `2 chapters`), `About this course`, `Course curriculum` (`2 chapters • 4 lessons`), chapter rows `Chap1 / 2 lessons` (expandable, lessons `Less1`, `Less2`), price View and a bottom Button `Buy • $50` / `Buy • $555/mo` / `Enroll for free` (NOT tapped). Admin gets the Buy button too (admin/owner is not auto-enrolled) - note for test design.
Enrolled course: tapping the card opened the lesson player directly with a first-run coach-mark overlay `STEP 1 OF 3 / Swipe up to go fullscreen ...` with `Skip` and `Next` (not tapped). ODD: hardware Back from that overlay screen exited the app to the Android launcher (seen once; relaunch with `adb shell am start -n com.ezycommunity.android/.MainActivity`, session stays logged in).
Test ideas: Enrolled badge vs price badge; lesson count equals curriculum; locked lessons for paid course; Buy/Enroll CTA text by price type (Free, one-time, monthly `/mo`).

## Events
Reach: `Events` tab. `Calendar` Button [739,398][1035,533] opens the `Browse by month` sheet (Scrim + year `2026` + month Views `Jan` ... `Sept` (sic, `Sept` not `Sep`) ... `Dec`). Picking a month shows the heading `<Month> 2026` plus Buttons `Edit` and `Back to upcoming` (meaning of `Edit` unverified, not tapped; may be admin-only or just reopen the month picker). Sections on the default list: `Live & upcoming` and `Upcoming events`.
Cards (View, multi-line desc, tap by coordinates): `[LIVE /] [Registered /] <Online|In-person> / NOV / 3 / Tue / <title> / <date time> / [<address> /] by <host>`; meeting cards: `NOV / 5 / Thu / Community Meeting / 10:00 – 11:00 / Meeting · Hosted by <host>`. Card buttons: `View event`, `Add to cal` (registered), `Join live` (while LIVE, not tapped), `Ended` (past, not clickable). A card turned `LIVE` while I was on the page (event start 17:00).
Detail page (Online): `Back`, `Share event`, badge `Online`, date block, `Starts in` countdown, `Add to calendar`, `Set reminder`, `Organized by`, `<n> registered`, bottom Button `Join live room` for the host/admin (NOT tapped). Scrolled: `Online meeting`, `Join online meeting`, `Tags` / `#EVENT`, `Discussion`, `<n> Comments`, `Most recent`, empty state `No comments yet. Be the first to comment!`.
Detail (In-person, Local Business Networking Breakfast, 4 Nov): address block, `Check-in opens 30 min before the event`, `Get directions`, `Copy address`; the bottom control for the admin is `You manage this event` (admin/organizer-only, not clickable in the tree, replaces Register/Join). The address string is long (Sylhet division) and wraps.
Detail (Meeting, tapped from card): bottom sheet over a Scrim with `Meeting`, title, `Starts in 1d 17h`, date, `10:00 – 11:00 · Dhaka`, `1 hour`, `Hosted by`, `Everyone in the community`, `Up to 100 people`, `This session is recorded`, `Add to calendar`. Past meeting (28 Oct) shows `Scheduled` + `Ended` and no action button. System Back closes the sheet.
Detail (past online event, Youth Leadership Summit, 1 Oct): tags `EVENT • LIVE • APPOINTMENT • New2`, `About event`, speakers (name / org / `Speaker`), disabled Button `Event ended`, `0 registered`.
Recurring event detail shows `Weekly on Mon`, countdown, comments with `Like`/`Reply`, `1 registered`.
Oddities: the tab strip loses `Home` (scrolled off); list scroll positions are kept across screens so coordinates differ between runs - take a fresh dump before tapping.
Test ideas: badge LIVE/Registered/Ended by state; countdown format; host-only buttons (`Join live room`, `You manage this event`) vs member Register; month browse lists past events; address/check-in text only on in-person; meetings open a sheet while events open a page.

## Members
Reach: `Members` tab (strip then shows `Courses ... Library`). Header `Members`, count `43`. Role chips: `All  43`, `Admin  5`, `Moderator  1`, `Member  34` (5+1+34=40, not 43: 3 users with another role or an unlisted role - possible bug, unverified). Sort chips `Newest` / `Oldest`; `Filter` Button opens sheet `Filter members` (Scrim, `Reset`, one block per membership question with operators `starts with`, `is exactly`, `is answered`, answer options, Button `Show members`; not applied).
Member card desc: `<name> / Community Member / 0 / posts / 0 / comments`; an expanded card has Buttons `Message` and `View profile`.
Profile page: name (duplicate desc in header and body), `@handle`, tabs `Posts`, `Comments`, `About`, Button `Message`. Empty states `No posts yet`, `No comments yet`; About shows `ABOUT` and `Member since Nov 2026`. No Back node in the tree on the profile; system Back works. No remove/ban/role control seen on the card or profile (long-press not tried).
Test ideas: counts vs list length; role chip filtering; newest/oldest order; empty states.

## Leaderboard
Tab `Leaderboard` shows `Gamification is turned off` / `Contact an administrator to enable this feature` (also for the admin, so the text is misleading for admins - cosmetic). Test idea: enable gamification on the web, then check points/levels.

## Library (7th Home tab, after Leaderboard; only reachable by scrolling the strip)
Reach: `Library` tab. `Library`, `12 files in 2 folders`, `Filter` Button, `Folders  2` (`folder testing / 1 file`, `paid / Channel members only`), `Files  12` grid with desc `<file name> / <type>, <size>, <date>` (Video, Audio, Image, Document, PDF document, External link). Filter sheet: TYPE chips `All, PDF, Docs, Slides, Video, Images, Audio, Links, Web pages`; SORT BY radios `Newest first`, `Name A–Z`, `Most downloaded`; `Done`. Folder view: header = folder name, `Library  ·  1 file  ·  Channel members only`, `Files  1`. ODD: system Back from the folder view exited the app to the launcher (seen once, same as from an enrolled course player); no in-app Back in the tree. File cards were not opened (would play/download).
Test ideas: folder access label, sort, type filter, file type labels.

## Videos (bottom bar)
Vertical full-screen pager (TikTok style), autoplays. Elements: header desc `<emoji> / <channel> / <caption>`, `React`/count, `Share`, `Full-screen`, author ImageView, `Save`, `More`, ProgressBar. Swipe up for the next video. Nothing tapped. Test ideas: pager order, caption, counts, full-screen toggle.

## Post composer (bottom bar `Post`)
Full-screen composer: `Close` Button, channel chip (ImageView, desc = channel name, default `General`), disabled `Post` ImageView when empty, counter `0 characters / Add to your post`, attachment row: `Image`, `Video`, `Audio`, `Poll`, `GIF`, `Doc`, `Code`, `Embed`. Channel chip opens sheet `Select channel` (`9 channels`, includes paid/private; system Back closes it, a Scrim tap did NOT). `Poll` opens a dialog (`+ Add option`, `Allow multiple select`, `Allow members to add options`, `Set an end date`, `Cancel`, `Create poll`); `Cancel` closes. `Embed` opens `Create embed post` (`Post` Button, `Posting in # General`, link field auto-focused; first system Back only hides the keyboard, second returns). `Close` leaves the composer with no discard prompt. The text input of the composer is not exposed as a labelled node. Not opened: Image/Video/Audio/Doc/GIF/Code (system pickers).

## Notifications (bottom bar)
Header `Notifications`, `Mark all as read` (not tapped), chips `All`, `Community`, `Mention`, `Other`, groups `Today`, `Yesterday`, `Earlier`. Rows: `<actor> / <verb> ... / <age>`: `joined the community`, `posted in <channel> <text>`, `commented on your post/event <title>`, `reacted to your post`; admin/moderation types: `submitted a post for review`, `interacted with your content reported a comment — False information`. Rows are clickable, not opened.

## Chat (bottom bar)
Cards `Threads`, `Mentions`, `Saved` (each opens a list page with its own header, no Back node), toggle Buttons `Direct messages` / `Rooms`. DM list row: `<name> / <age> / <last message>`. Rooms list: sections `Rooms`, `Members only`; rows `<emoji> / <name> / <age> / <last>`; a private room shows a Button `Request` even for the admin (not tapped). Conversation page: header `<name> / Direct message` or the room name, date separators (`WEDNESDAY 28 OCTOBER`), messages as plain Views, no composer node in the tree (unverified). Threads rows: `<sender> / <date> / <text> / <n> replies`. Mentions row example `@Team SQA x`. Saved lists saved messages. Opening a conversation may mark it read (accepted side effect for read-only viewing).

## Account sheet (avatar top-left, tap 85,179)
Rows: account card `Team SQA / @team-sqa`, theme buttons `Light`, `Dark`, `System` (not tapped), community row `SQA Team / sqa-team-th6` (switcher, not tapped), `SETTINGS` rows `Edit profile`, `Notifications`, `Visibility`, `Security`, `Blocked users`, `Language`, `Downloads`, `LINKS / Com-And`, `Log out` (never tapped). Each Settings page has Button `Back` that returns to the sheet.
- Edit profile: `Change cover`, EditText fields First Name / Last Name / Display name (`Team SQA`), Username (`@team-sqa`, not an EditText), About You (`500 characters remaining`), Address, Links (Website, `Facebook *`, LinkedIn, X (Twitter), YouTube). Nothing typed; Save button not seen in the tree.
- Notifications: matrix with columns `Email`, `In-app`, `Push` and rows `Comments on my posts`, `Replies to my comments`, `Mentions`, `Reactions on my posts`, `Reactions on my comments`, `Polls`, `New members join`, `New posts in channels`, plus `Toggle all`. Cells have no desc (`–` = unsupported); toggles not tapped.
- Visibility: `Profile visibility`: `Everyone` / `Members only`.
- Security: `Change password` with Current / New / Confirm fields and `Update password`.
- Blocked users: empty state `You haven't blocked anyone.`
- Language: `Show this community in`, region chips `All / 76`, `Europe / 33`, `Asia / 30`, `Middle East / 5` (sum 68 vs 76; other regions may exist), `Community default`, then ~76 language tiles (flag, native name, English name).
- Downloads: empty state `No downloads yet`.

## Search (top-right icon)
The icon is an unlabeled View [810,123][923,235] on Home (tap 866,179); full page. Page: EditText (find with `android.widget.EditText`), tabs `All`, `Posts`, `Comments`, `People`, `Events`, `Courses`, `RECENT SEARCHES` / `No recent searches yet.` Typing `test` gave `Search results for “test”`, tab desc with counts (`All / 21`, `Posts / 9`, `Comments / 2`, `People / 3`, `Events / 4`, `Courses / 3`), filters `All spaces`, `Any author`, `Any time`, `Relevance`, and result rows with snippets. After typing, tab labels change to `<Name> / <n>` and the strip scrolls to the selected tab so bounds move (my tap on the People position selected Courses once). The box was cleared afterwards. `RECENT SEARCHES` stayed empty after a search (maybe saved only on submit; unverified). Note counts: 21 vs 9+2+3+4+3=21 OK.

## Admin-only controls seen (none used)
- Channels: `Add channel group`.
- Post `...` menu (unlabeled Button at the right of every post header, e.g. [934,398][1046,511]): `Copy text`, `Save post`, `Pin post`, `Turn off commenting`, `Hide post`, `Report post`, `Block user`, `Delete post` (a member should see fewer: Pin / Turn off commenting / Hide / Delete for others' posts - unverified).
- Events: host/admin button `Join live room` / `You manage this event`; calendar `Edit`.
- Notifications: moderation items (posts submitted for review, reported comments).
- Members: role chips Admin / Moderator.
- Courses: admin still sees `Buy` / `Enroll for free` (not auto-enrolled).
- Home `Sort` menu: MenuItems `Top`, `Recent activity`, `Latest`, `Oldest` (View `Dismiss menu` closes).
- The member account `testerA` was not compared (fewer top tabs is the owner's note; I saw 7 tabs as admin).

## Flutter / locator quirks
- No resource ids. Use desc; many descs contain newlines (shown as ` / ` above) so `description("...")` exact match fails; use `descriptionContains` or tap by bounds from a fresh page source.
- Duplicate desc: `Home` (top tab + bottom bar), `Notifications` (bottom bar + Settings row + page header), `Events`, `Members`, `Post` (bottom bar + composer button), course/channel names, member name in profile. Use `.instance(n)` or `$$`.
- Several clickable nodes have NO desc: avatar (14,131), search icon, post `...` menu, composer text field, tab-strip container.
- Top tab strip is a HorizontalScrollView; bounds and visible tabs change per selected tab (`Home` leaves the tree on Events, `Library` appears with Members). Admin tabs: Home, Channels, Courses, Events, Members, Leaderboard, Library.
- Detail pages often miss the `Back` node (profile, Library folder, Chat lists); system Back works, but from the Library folder and from the enrolled course player it exited the app. Relaunch with `adb shell am start -n com.ezycommunity.android/.MainActivity` (still logged in).
- Bottom sheets: system Back closes calendar, channel picker, post menu, sort menu; a Scrim tap sometimes does not (channel picker).
- The first system Back after a screen that auto-focuses an input (Embed, Search) only hides the keyboard.
- Scrolling: `mobile: swipeGesture` flings and overshoots on lists with big cards; `adb shell input swipe x y1 x y2 1500` (slow) is predictable. Lists keep their scroll position between visits. Cards outside the viewport are not in the tree.
- Invisible bidi marks surround user/channel names in descs (`⁨General⁩`); use contains-matching or strip U+2066-2069.
- Course list contains `AUTO_COURSE_*` rows created by web automation during the exploration, so counts change.

## Not covered / unverified
Comparison with testerA; reaction picker, comment composer, calendar `Edit`, Library files, Videos controls, registered-event detail (`event twwww`), enrolled course lesson list (blocked by the coach-mark overlay), `LINKS / Com-And` row, chat composers.
