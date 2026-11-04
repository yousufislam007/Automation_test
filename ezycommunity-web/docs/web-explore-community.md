# Web explore: community pages (additions), header menus, composer, post menus, channels, courses editor, library, get-started, profile, public

Site https://sqa.ezycommunity.pro.bd, explored 2026-11-04 as logged-in admin "Team SQA" through the shared CDP browser, view only. `/api/auth/me` returned 200, no 429, no login attempts. This file only adds what `web-explore-feed-courses.md` and `web-explore-events-admin.md` do not cover. Personal data is masked. Note: other testers post live (testerA, testerQA Auto) while exploring, so feed contents, times and counts change by the minute (the tab title shows an unread prefix, for example "(9+) Feed | SQA Team" and "(1) Code").

## 1. Header and global UI
Header buttons (accessible names): `Community menu`, nav links Home `/feeds`, Courses, Events, Members, Leaderboard; `Search community (Cmd+K)`, `Open messages`, `Open notifications`, `Open profile menu`. Small-screen buttons also exist in the DOM: `Open menu`, `Home`, `Videos`, `Create post`. There is no language switch in the header (language is in Profile Settings, "Language" tab) and no separate theme button (theme is inside the profile menu).

### Community menu (button "Community menu", role=menu, items role=menuitem links)
Dashboard `/dashboard`, Website `/dashboard/website`, Reports (badge 1) `/dashboard/reports`, Content `/dashboard/content`, Members `/dashboard/members`, Course tools `/dashboard/course-tools/certificate-blueprints`, Gamification, Meetings, Paywalls, Paywall Groups, Earnings And Orders `/dashboard/earning-and-orders`, Community App, Marketing, Automations, Roles & Permissions, Billing and Transactions `/dashboard/billing`, Settings `/dashboard/settings`, Developers, Analytics (a `div` menuitem with "Soon", not a link: disabled).

### Profile menu (button "Open profile menu")
Header block: display name "Team SQA" and the account email (a real mailbox, shown in full: mask it in reports). Items (role=menuitem): Profile (div, goes to `/profile/team-sqa`), Settings (div, opens the Profile Settings dialog), **Billing (inner `<a>` href `/dashboard/billing`)**, Theme with three buttons Light / Dark / System, Log out (div). Oddity: the earlier doc says the profile Billing item goes to `/billing`; here the anchor points to the admin `/dashboard/billing`. The member page `/billing` exists but is not linked from this menu (verify by opening the menu and reading the link).

### Notifications panel (button "Open notifications")
Opens a panel: title "Notifications", button "Mark all as read", tab buttons `All`, `Community`, `Mention`, `Other` (plain buttons, not role=tab), group label "Today" (then Yesterday/Earlier), rows with a "Delete notification" button each (20+ rows). Row types seen: "<member> posted in <Channel>: <title>" with relative time ("1 minute ago", "about 4 hours ago") and "<member> is asking to join a private room ... tap to review". Admin receives a notification for every post by other members (noisy). Not clicked: any row (marks read / navigates), Mark all as read, Delete.

### Messages (button "Open messages")
Not clicked this time (it opens `/talk?dm=<id>` with a DM, which may mark it read). See section 12 and the events/admin doc section 4 for the layout.

### Search
Covered in the events/admin doc (Cmd+K dialog). Not repeated.

### Left sidebar (new details)
- Top two icon-only buttons with `aria-haspopup=menu` (no accessible name): the "+"-style menu offers **Create Channel**, **Create Channel Group**; the group-level menu offers **View Channels**, **Edit Channel Group**, **Delete Channel Group**.
- Each channel row has a hover-only icon button (`aria-haspopup=menu`, no name) located next to the link (`li > a[href="/channels/<slug>"] + button`). It is hidden until the row is hovered; a plain `.click()` times out ("not visible/covered by the unread badge"), hover first. Menu items (admin): Edit Channel, Manage Members, Manage Prices, Paywalls, [Copy Checkout URL], Copy ID, Unfollow, Delete Channel. "Copy Checkout URL" only exists on channels with prices (tunnel-paid, hydrogen, paid, private-channel); general, mineral and 123 do not have it.
- Channel rows show an unread badge (General 9, 123 21 at the time).
- "Add or restore links" (`aria-haspopup=menu`) manages the Com-IOS / Com-And store links (menu not opened).
- Not clicked (changes data or opens destructive flows): Create Channel, Create Channel Group, Edit/Delete items, Unfollow, Delete Channel.

## 2. /feeds: post composer (new)
- The inline box (`textarea[placeholder="Write Something..."]`) is **readonly**: clicking it opens a modal composer (`role=dialog`, URL unchanged). Inline buttons: `Photo`, `Video`, `Poll`, `Embed`, `Go Live` (aria-label "Go Live"), `Post`, sort `Latest`. Photo/Video use hidden `input[type=file][accept="image/*"][multiple]`.
- Modal composer: author "Team SQA", "Posting in" + button `Select Channel`, title `input[placeholder="Enter title"]`, rich text body (empty `div` contenteditable), toggle-like buttons with aria-pressed: `Mark as announcement` (false), `Post anonymously` (false), `Allow comments` (true); `Maximize`, `Close`; toolbar buttons `Slash commands`, `Insert image`, `Insert video`, `Insert audio`, `Insert GIF`, `Insert emoji`, `Insert poll`, `Attach file`, `Code block` (aria-pressed false); `Post` and `More post options`.
- `Select Channel` list (menuitems): 123, General, 😍 hiii, Hydrogen, Mineral, paid, Private channel, Private Channel 2, Tunnel - paid (alphabetical, includes paid/private ones).
- `Slash commands` list (button role=option): Text, Heading 1, Heading 2, Heading 3, Bullet List, Numbered List, Blockquote, Code Block, Image, Video, File.
- `More post options` menu: Schedule, Save as draft.
- Escape closes the composer without a confirmation. Nothing typed or attached.
- Not clicked: Post, Go Live, Photo/Video/Embed/Poll buttons, Insert * (pickers / file chooser), the three toggles, Schedule, Save as draft.
- Oddity (seen, not confirmed): the modal "Post" button is rendered enabled even with no title and no body (could be validated on click; do not click to check).

### Sort menu (button "Latest", role=menuitemradio)
Top, Recent activity, Latest, Oldest.

### Post card "..." menu (feed, admin, someone else's post)
Unnamed icon button (`aria-haspopup=menu`, after the author row; it is the last `button[aria-haspopup=menu]` per card). Items: Save Post, Follow Post, Hide Post, Pin Post, Turn off commenting, Report Post, Block User, Copy Link, Delete Post, View Post. Menu opened only, nothing clicked.
Note: on post detail `/p/general/code` (own pinned post) the menu is different: Save Post, Unfollow Post, **Unpin Post**, **Edit Post**, Copy Link, Delete Post (no Report/Block/Hide: own post). So Edit Post only for own posts, even for the admin on someone else's post (not present in the other-user menu above: admin cannot edit others' posts; a possible gap or by design).
Other card controls: `React` (aria-haspopup=dialog, opens a reaction picker on click; hover did not open it; not clicked as it would add a reaction), `Comment`, "N comments", "1 reaction, see who reacted" (opens a reactors list, not clicked), `Copy code`, `Open on site` / `Expand embed`, `Watch video` link (`/videos?v=<id>`), media players (Play, Seek backward/forward 10 seconds, Mute, Playback rate).
Right rail: "UPCOMING EVENTS" cards link to `/events/<slug>-<id>` (the Nov 9 card links with `?d=<base64 date>`), live feed activity list "<member> posted in channel: <Channel> <time>", MEMBERS list with "See all". Also a "Session options" menu button on a session card (Community Meeting, 5 Nov; items not opened).

## 3. Post detail `/p/<channel>/<slug>` (new)
Title "(n) <post title>" with unread prefix when notifications exist. Controls: link "Back to General", the "..." menu (above), `React`, `Comment` toggle, comment sort `button[role=combobox]` (options: **Most Recent**, **Oldest**), comment editor (empty contenteditable, `Insert emoji`), submit `Comment`. The submit `Comment` button is not disabled while the box is empty (checked via DOM only; not clicked). Slug of a duplicate title gets a suffix (`test-0506b843`, `code-test`, `google`).

## 4. Channel pages `/channels/<slug>` (new details)
All nine load 200 with no console errors. Header row: H1, a **`Post` button** next to the title (opens the same composer with the channel prefilled; not clicked), sort `Latest`, then the composer strip.
| channel | extra header items |
| --- | --- |
| general | badge "2 Pending", Pinned Post carousel (Previous/Next slide) |
| mineral | badge "1 Pending", pinned carousel, right rail RESOURCES (`a[href="/library?folder=paid"]` "paid 1", "Browse all library resources" `/library`), embed card buttons Open on site / Expand embed, audio players |
| tunnel-paid | 1 post, "1 reaction, see who reacted" and "Curious" reaction chip, no lock banner for admin |
| private-channel | banner "Anyone without access to this channel sees the default lock screen instead of these posts." + button `Customize lock screen` |
| private-channel-2 | no banner, empty state "No posts yet / Be the first to share something here." (despite the name it shows no lock banner) |
| hydrogen | 1 post; no lock banner although its row menu has "Copy Checkout URL" (has pricing) |
| hiii | H1 is emoji + name (heading text "😍 | hiii"), empty |
| paid | lock banner + `Customize lock screen`, empty |
| 123 | many "QA-POST-size NMB" zip posts by testerA (ZIP file cards) |
Differences: only `private-channel` and `paid` show the lock banner; "Copy Checkout URL" in the sidebar menu does not map 1:1 to the banner (hydrogen and tunnel-paid have it without banner). Test as a non-member to see the lock screen itself (not seen here).

## 5. /courses and course editor (new)
- List: besides search `Search courses`, sort `button[role=combobox]` "Newest" (options **Newest, Oldest**), `Create Course`, there are **two unnamed `button[role=tab]` view toggles** (grid/list; not toggled), each card has `Course actions` (menu button) and `Edit Course` link. Another tester keeps creating `AUTO_COURSE_<id>_<ts>` drafts (slugs like `auto-course-xd07d-1793778002462`: the list grows during runs).
- Editor header: "Back to courses", course title, tabs as links Curriculum `/edit`, Drip `/edit/drip`, Staff `/edit/staff`, Enrollments `/edit/enrollments`, Settings `/edit/setting`, `Preview` (link `/watch` and a `Preview` button), status "Saved", `Save`. Curriculum tree: `Search lessons`, `Collapse chapter`/`Expand chapter`, lesson status buttons `Published`/`Draft`, `Chapter options` menu (only **Delete chapter**), `New chapter`, `Add lesson`. Chapter URLs `/edit/chapter/<id>`, lesson URLs `/edit/chapter/<id>/lesson/<id>`, new: `/edit/chapter/create`, `/lesson/create`.
- Lesson editor `/courses/testing-course-test/edit/chapter/1008/lesson/1863` (title "Lesson | SQA Team"): title input placeholder "Untitled lesson"; Draft/Published toggle; LESSON TYPE buttons Video, Text, Audio, PDF, Slides, Download, Embedded; LESSON VIDEO card (file name, `Replace`, `Delete file`, `Play video`); DESCRIPTION rich editor "Start typing..." with toolbar Bold, Italic, Underline, Format text as heading (menu), Blockquote, Code Block, Add image from gallery, More options (toolbar buttons are `disabled` until the editor is focused, so Playwright clicks wait forever: focus the editor first); LESSON SETTINGS switches (`span[role=switch]` with hidden checkbox): Prerequisite (off, "Make this lesson a prerequisite for the next one"), Free preview (off, "Allow non-members to view"), Enable discussions (on, "Comments under this lesson"), Allow download (on, "Members can download this video for web"); ENGAGEMENT: Motivational popup (off, "Show after completion") + `Edit Popup`; DOWNLOADABLE RESOURCE "File members can download alongside this lesson" with "Upload a handout or source file" and `Browse files`; **Danger Zone** `Delete Lesson`. Not clicked: Save, switches, Replace, Delete file, Browse files, Edit Popup, Delete Lesson, Delete chapter.
- Oddity: the lesson editor description shows the text "awfervrfvrgvrgv" (test data) and "Allow download ... for web" label for a video lesson.

## 6. /library (new)
- Left: `All Files 12`, `Insights ADMIN`, categories as buttons, `New Category`, `Browse Library` (menu button, small screens), storage 167.9 MB.
- Toolbar: `Add Items`, `New Folder`, `Members` (not clicked: open flows that create data; an attempt to open them was blocked by the harness, so their dialogs are unknown), sort `button[role=combobox]` "Newest first" (options **Newest first, Name A-Z, Most downloaded**), `Grid view` / `List view` (list view columns NAME, TYPE, SIZE, MODIFIED, ACCESS; ACCESS values seen Everyone, Channel members, Paid access), filter chips All / PDF / Docs / Slides / Video / Images / Audio / Links / Web pages.
- Folders (2): `Open folder <name>`, `Edit folder <name>`, `Delete folder <name>` buttons. Folder URL `/library?folder=paid` (header "paid / 1 file in this folder", same toolbar).
- Files: `Preview <file name>` button, checkbox `span[role=checkbox]` "Select <file name>", per-file `Edit` and `Delete` buttons, `Select all`. Item with same name appears twice (mixkit-hip-hop-02-738.mp3 with different access: Channel members and Paid access).

## 7. /get-started (expanded, new)
Six tasks (resolves the earlier "6 vs 4 headings" oddity): sections are accordions (`button[aria-expanded]`): "Set up your profile" (Create account, done), "Personalize your profile" (Edit Profile, Mark complete), "Configure your community" (tasks: **Customize branding** "Set your community's theme, logo, and cover image to match your brand." with button `Configure your community`, `Mark complete`; **Create channels**), "Start your community" (**Add members** "Invite your first members to kickstart discussions and activity." with `Invite Members`, `Mark complete`; **Send your launch announcement (optional)**). The accordion behaves like single-open per group (opening the later ones collapsed "Personalize your profile" in my run). `Change` button at the top left (not clicked, unknown). Header text "Progress Bar - 1 out of 6 tasks completed". Not clicked: Mark complete, Edit Profile, Invite Members, Configure your community, Change.

## 8. /members (new)
Invite is a menu (`Invite`, aria-haspopup=menu): **Invite Member using Email**, **Create Invite Link** (not clicked). Sort `button[role=combobox]` "Newest": options **Newest, Oldest**. The two profile-question filters are buttons ("what is your name ?", "what is your favourite food now?") that did not open any popover on click in my run (possible bug or they need a typed value: unclear). **No row menu on member cards**: each card has only `Message` and `View Profile`; per-member admin actions live in `/dashboard/members`. Role chips are `button[role=tab]`.

## 9. /profile/team-sqa tabs (new)
Tabs are plain buttons (Feeds, Comments, Channels, Events, Saved), URL unchanged. Comments tab lists "Commented on <post>" rows with age; Channels tab lists each channel with "Visit channel"; Saved tab lists saved posts and "No more posts"; sidebar About shows "You haven't added a bio yet." and three custom profile answers (WHAT IS YOUR NAME ? = Admin, DISTRIC? = Sylhet, WHAT'S YOUR AGE? = 29, labels shown uppercase with raw typos), ACTIVE IN chips with "+3 more". Profile content includes buttons `Add Cover Photo`, `Edit`.

## 10. /billing (member page)
Reachable by URL (title "Billing | SQA Team"): "Manage your subscriptions, payment methods, and billing details." tabs Transactions / Subscriptions / Payment methods / Billing address; table header PRODUCT TYPE GATEWAY AMOUNT NEXT RENEWAL PAYMENT SUBSCRIPTION DATE, empty "No orders found.", Previous / Next.

## 11. Public pages as a logged-in admin (new behaviour)
- `/login` and `/register` **redirect to `/feeds`** when logged in (200, no form shown); `/forgot` still shows "Forgot password?", `input[type=email][placeholder="you@example.com"]`, `Send reset link`.
- `/` landing, `/menu`, `/about`, `/gallery`, `/visit` (restaurant "Pach Vai" template, H1 e.g. "Sylheti food, cooked like home", "Everything we cook, section by section", "About Pach Vai", "A look inside Pach Vai", "Find us in Sylhet"). Header nav: Home, Menu, About, Events, Gallery, Visit us, Blog dropdown + "View all posts", and for admin **Dashboard, Community, Sign out** (logged out: Log in, Join). `/menu`, `/about`, `/gallery`, `/visit` redirect to a trailing slash.
- `/blog`: `input[type=search][placeholder="Search posts"]`, first post "QA Scheduled Blog Test".
- `/privacy`, `/terms` render the **app shell** (header with Community menu, profile menu, etc.) for a logged-in user, whereas the public pages use the website header. Both have a hidden file input (composer markup) in the shell. Titles "Privacy Policy - SQA Team", "Terms and Conditions - SQA Team".

## 12. /talk and /videos
Not re-opened. `/talk` was not visited because the app may open the latest DM automatically (marking it read); see the events/admin doc for its layout. `/videos` unchanged since the feed doc.

## 13. Possible bugs and oddities (new)
1. Profile menu "Billing" opens `/dashboard/billing` (admin billing), while the member `/billing` page is not linked from the menu.
2. Composer modal `Post` and post-detail comment `Comment` buttons are enabled while empty (DOM state; not verified by clicking).
3. Admin's post "..." menu on others' posts has no Edit Post; own post has Edit/Unpin. Compare roles in tests.
4. Sidebar per-channel menu button is hover-only and has no accessible name (use `a[href="/channels/<slug>"] + button`), same for the post "..." button.
5. Members profile-question filter buttons did nothing on click.
6. Lesson editor toolbar buttons are `disabled` until the editor has focus.
7. `/privacy` and `/terms` render the logged-in app shell, not the public site header; `/login` and `/register` redirect to the feed when logged in.
8. Notifications panel: the admin gets one notification per member post (30+), duplicates of the "asking to join a private room" request (also noted before).
9. Course list keeps growing with AUTO_COURSE drafts from automated runs.

## 14. Not clicked
Post, Go Live, Photo, Video, Poll, Embed, Insert image/video/audio/GIF/emoji/poll, Attach file, Code block, Mark as announcement, Post anonymously, Allow comments, Schedule, Save as draft, React (and reaction picker), Comment, Save/Follow/Hide/Pin/Report/Block/Copy Link/Delete/Edit post items, "see who reacted", Create Channel / Group, Edit/Delete channel, Unfollow, Manage Members/Prices/Paywalls, Customize lock screen, Create Course, Course actions, Save/Publish toggles in editors, Add Items / New Folder / Library Members (blocked), library Edit/Delete/Preview/checkboxes, Mark complete, Edit Profile, Invite Members, Change (get-started), Invite menu items, notification rows, Mark all as read, Delete notification, Open messages, `/talk`, Log out, Theme buttons, New Event wizard (covered by the events doc), Hosting/Manage tags (covered).
