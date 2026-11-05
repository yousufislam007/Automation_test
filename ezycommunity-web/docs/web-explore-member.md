# Web explore: the MEMBER (student) view

Site https://sqa.ezycommunity.pro.bd, explored 2026-11-05 through the member browser (CDP 9226), logged in as the member account "testerA A" (role chip "Member", member since 2026-10-11). `/api/auth/me` returned 200, no 429, no login attempts. View only: nothing was posted, saved, followed, joined, registered, toggled or deleted. Other people's names are masked ("Member A"); the member's own email is shown as `<email>`. Admin comparison: `web-explore-community.md` (admin A) and `web-explore-feed-courses.md` (admin B). Live data changes by the minute (other testers post), so counts and ages are examples.

Console note (seen on nearly every app page, 15+ times): `403 /api/community/v1/paywall-intervals` (member has no right to this call; harmless to the UI). Not seen on course detail/watch pages.

## 1. Header and global UI (member)
- Header: logo link `Go to community feeds`, nav links Home `/feeds`, Courses, Events, Members, Leaderboard. **No "Getting Started" link and no `Community menu` button** (admin has both). Buttons by aria-label: `Open menu`, `Search community (Cmd+K)`, `Open messages`, `Open notifications`, `Open profile menu`. Small-screen buttons exist in DOM: `Home`, `Videos`, `Create post`, `Notifications` (with badge number), `Chat`.
- Profile menu (`button "Open profile menu"`, `[role=menu]`): header shows display name and `<email>`; items Profile (`/profile/testera-a`), **Settings** (opens dialog, URL unchanged), **Billing (anchor `/billing`, the member page; admin's goes to `/dashboard/billing`)**, Theme (Light / Dark / System), Log out. Not clicked: Log out, Theme buttons.
- Notifications panel (`[role=dialog]`): title "Notifications", `Mark all as read`, buttons `All`, `Community`, `Mention`, `Other` (plain buttons), groups "Today/Yesterday/Earlier", each row has `Delete notification`. Row types seen for the member: "<Member> posted in General: ...", "voted on your poll", "commented on your post", "reacted to your post", "Team SQA removed your post", "Team SQA approved your post", "You're in! Tap to open #New private Room", "Your request to join #private message room was declined". `Mention` tab empty ("No notifications here"); `Other` holds join-request/removed items. The member also gets "<member> is asking to join a private room ... tap to review" rows (admin-like row, odd for a member; seen twice, here and in an earlier run of the admin doc). Not clicked: rows, Mark all as read, Delete.
- Search dialog (Cmd+K button): input `Search posts, comments, people, and more`, chips All, Posts, Comments, People, Events, Courses, Lessons, Library, "RECENT SEARCHES / No recent searches yet", hint "navigate / select / esc close". Same as admin.
- Messages button: plain button (no href). Not clicked; see section 15 (/talk).
- Sidebar (left): top-left community logo and a "+" icon button (`aria-haspopup=menu`): **menu has one item, `Create Channel`** (not clicked; see section 17 Possible bugs). Items: Videos, Library, Channels list (below), group headings "test" (123) and "New test" (3 person-named channels), Links (Com-IOS, Com-And), `Add or restore links`.
- Sidebar channel rows (hover shows a button `a[href="/channels/<slug>"] + button`, `aria-haspopup=menu`). The **per-row menu for a member has ONE item** (admin has 8): joined channels (general, mineral, 123): `Unfollow`; public not-followed channels (hiii and the 3 person-named channels): `Follow Channel`; paid channels: `Join for $10/mo` (tunnel-paid), `Join for $80` (private-channel), `Join for $12/yr` (hydrogen), `Join for BDT 50/yr` (paid). Paid rows show a crown icon. No Manage Members / Edit / Copy ID / Delete. Unread badge on General. Not clicked: every one of these items.
- Channels visible in the sidebar for the member: General, Mineral, Tunnel - paid, Private channel, Hydrogen, hiii, paid, 3 person-named channels (public, "Follow Channel"), 123. **`private-channel-2` is not in the member sidebar.**

## 2. /feeds (title "(n) Feed | SQA Team", n = unread)
- Inline composer: `textarea[placeholder="Write Something..."]` (readonly, click opens a modal). Inline buttons: `Photo`, `Poll`, `Embed`, `Post`, sort `Latest`. **Missing vs admin: `Video` and `Go Live`.**
- Modal composer (`role=dialog`): author name, "Posting in" + `Select Channel`, `input[placeholder="Enter title"]`, rich body; top toggles `Post anonymously` (aria-pressed false), `Allow comments` (aria-pressed true), `Maximize`, `Close`; bottom toolbar `Slash commands` (the "+"), `Insert image`, `Insert video`, `Insert audio`, `Insert GIF`, `Insert emoji`, `Insert poll`, `Attach file`, `Code block` (aria-pressed false), `Post`. **Missing vs admin: `Mark as announcement`, the `More post options` menu (Schedule / Save as draft).** Escape closes without confirmation. Nothing typed.
- `Select Channel` dropdown groups: **"Your channels": General, Mineral, 123**; **"Public channels"** with a grey badge "follows on post": hiii and the 3 person-named channels. Paid/private channels are not listed (admin sees all nine). Posting to a "Public channels" item likely auto-follows (not clicked).
- `Slash commands` list (role=option): Text, Heading 1, Heading 2, Heading 3, Bullet List, Numbered List, Blockquote, Code Block, Image, Video, File.
- Sort (`Latest`, role=menuitemradio): Top, Recent activity, Latest, Oldest.
- Pinned carousel: `Previous slide` (disabled at start), `Next slide`.
- Post card "..." menu (unnamed `button[aria-haspopup=menu]`, last per card). **Someone else's post: Save Post, Follow Post, Hide Post, Report Post, Block User, Copy Link, View Post** (no Pin Post, no Turn off commenting, no Delete: those are admin). **Own post: Save Post, Unfollow Post, Edit Post, Turn off commenting, Copy Link, Delete Post, View Post** (no Pin). Pinned-carousel cards had no "..." button. Other card controls: `React` (popup), `Comment`, `Copy code`, media players, `Open on site`/`Expand embed`, poll radio inputs.
- Right rail: UPCOMING EVENTS (a "Going" chip on the registered event), RECENT POSTS list, MEMBERS (names) + "ONLINE USERS(n)", LIVE & UPCOMING. Items link to `/events/<slug>-<id>?d=<base64>`.
- Own post in review: on mineral and on the profile the member's pending post shows a block "Under review - Only you and the moderators can see these posts until they are approved" with `Pending` chip and `Edit` / `Delete` buttons. The admin sees an "N Pending" badge on the channel; the member also saw "1 Pending" text on mineral.
- Not clicked: Post, Photo/Poll/Embed, Insert *, toggles, React, Comment, post-menu items, Select Channel items.

## 3. Post detail `/p/<channel>/<slug>` (tested `/p/general/code-test`, own post)
Title = post title only. `Back to General`, "..." menu (own post list above), `React`, `Comment` (toggle), sort `button[role=combobox]` "Most Recent" (options Most Recent, Oldest), comment editor (`div[contenteditable=true]`, hidden `input[type=file][accept="image/*"]`), `Insert emoji`, submit `Comment`. Same as admin except the menu. Not clicked: submit, React.

## 4. Channels `/channels/<slug>` (member)
Title = channel name only. Sidebar and header same everywhere.

| channel | what the member sees |
| --- | --- |
| general | H1, `Post`, `Latest`, composer, pinned carousel, ~20 posts, poll with radio inputs. No lock banner. |
| mineral | joined. "1 Pending" text, right rail RESOURCES (`paid 1`, `Browse all`), own pending post with Edit/Delete, video/audio players, "3 comments" etc. |
| 123 | joined. QA-POST-size zip posts, poll, "2 reactions, see who reacted". |
| hiii | **public, not followed**: H1 emoji+name, button **`Follow`** next to Post/Latest, composer visible, empty state "No posts yet / Follow a channel and start the conversation!". |
| tunnel-paid | **locked partially**: header button `Join for $10/mo`, banner "Join Tunnel - paid to post, react, and comment. [Join for $10/mo]", composer visible, **empty state** "No posts yet" (the admin sees 1 post there). |
| hydrogen | header `Join for $12/yr`, same banner "Join Hydrogen to post, react, and comment.", the post card is replaced by a gate: "Bangladesh / Continue reading with access. This post is part of Hydrogen, a members-only channel. Get access to read it in full and join the conversation." + button `Get access`, then "No more posts". (post title visible, body hidden) |
| private-channel | **full lock screen**, no composer/sort. Header button `Join for $80`; body: label "PAID CHANNEL", H1 "Private channel", a one-line description, four feature rows (Members-only discussions / Resources you will not find elsewhere / A direct line to the team / Early access, with sub-lines), accordion buttons `How do I get access?` ("Choose a plan on this page and check out. The channel unlocks as soon as the payment goes through."), `What happens after I join?` ("The channel unlocks immediately and every post, file and discussion inside becomes available."), `Is anything shared outside the channel?` ("No. What gets posted here stays with the members of this channel."), price "$80" and button `Get access now`. Accordion is single-open. |
| paid | same lock screen, price "BDT 50 / year", struck "BDT 100", chip "SAVE 50%", `Join for BDT 50/yr`, `Get access now`. |
| private-channel-2 | **"Channel Not Found - This channel may have been deleted or doesn't exist. Back to Feeds"**, tab title "Channel", no composer (admin sees an empty channel). Not in the member sidebar. |

Not clicked: Join for ..., Get access, Get access now, Follow, `Post` in channel.
Admin vs member: no "Customize lock screen" banner button; lock screen replaces the banner.

## 5. /courses (title "Courses | SQA Team")
- Heading, subtitle, `input[placeholder="Search courses"]`, tabs `button[role=tab]` **`All Courses`** (selected) and **`Enrolled`**, sort `button[role=combobox]` "Newest" (options Newest, Oldest). **No `Create Course`, no Course actions / Edit Course, no grid/list toggles, no drafts.**
- Cards: price chip (Free/Paid), "Private" chip, level chip, 3 numbers (chapters / published lessons / enrolled), price text, and one button per card: **`Watch Course`** (link `/courses/<slug>/watch`, enrolled courses: testing course test, Testing Manual Paid Course, created course on staging) or **`Enroll Now`** (link `/courses/<slug>`, not enrolled: Test Course, Speak English with Confidence). 5 courses listed (admin sees 10 incl. AUTO drafts).
- `Enrolled` tab shows only the 3 enrolled courses (URL unchanged). Search "speak" gives 1 course; no match shows "No courses found / Try a different search term." Search was cleared.
- Draft slug (e.g. an `auto-course-...` slug) gives **404 "Course Not Found - The course you're looking for doesn't exist or has been moved. Back to Courses"** (tab title "... | SQA Team"; admin gets a draft preview). 

## 6. Course detail `/courses/<slug>` (not enrolled) and player
- Not enrolled, paid (`test-course`): "Back to courses", title (H1 + H2 duplicate), description, "About This Course", "Course Curriculum 2 chapters - 4 lessons", `Expand all chapters`, chapter accordions (`Chap1 2 lessons`), price `USD 50 / LTD` with struck `USD 60`, button **`Get Access`**. Not clicked.
- Not enrolled, free (`speak-english-with-confidence`): same layout, "Free", button **`Enroll in Course`**. Not clicked. (The admin sees "Log in as a member to purchase this course." instead: the member does not.)
- Enrolled courses redirect `/courses/<slug>` to **`/courses/<slug>/watch/<lessonId>`** (title "Watch | SQA Team").
- `/courses/<slug>/edit` (tested test-course): redirects to the detail page with `403 /api/course/slug/test-course` (permission check works).
- Player (testing-course-test, lesson one, video, already completed): `Back to courses`, `Lessons`, video controls `Play`, `Seek backward 10 seconds`, `Seek forward 10 seconds`, `Playback speed: 1x`, `Mute`, `Enable captions`, `Start casting`, `Enter picture-in-picture`, `Enter fullscreen`, `Download Lesson`; tabs `Overview` and `Comments` (`role=tab`); footer `Previous` (disabled on lesson 1), **`Mark incomplete`** (shown because the lesson is complete; for an incomplete lesson it reads `Complete`), `Continue`; right panel "Course content" with "2 of 5 lessons complete 40%", `Collapse course content`, chapter buttons "one 3 lessons 2/3", lesson rows "lesson one Video - Now playing", "lesson two Text lesson", "lesson three Download". Comments tab: editor (contenteditable), `Insert emoji`, `Comment`, sort `Latest` / `Oldest`, each comment with `React` and `Reply`. Text lesson URL `/watch/1864` ("TEXT LESSON, 1 min read", "Completed lesson two"). Interactive-embed course (`testing-manual-paid-course/watch/1862`): lesson type "Interactive embed", button `Complete`, "0 of 1 lessons complete 0%".
- Not clicked: Get Access, Enroll in Course, Enroll Now, Watch Course (only navigated via URL), Mark incomplete/Complete, Continue, Download Lesson, Play, Comment/React/Reply.

## 7. /videos (title "Videos")
Vertical video feed, no H1. Buttons: `Message`, `React`, `Comments`, `Save`, `More` (popup), `Close`, `Start from the newest video`, `Unmute`, `Previous` (disabled), `Next`, comment panel (`Close comments`, `Most recent`, `Insert emoji`, `Comment`). Text list of ~20 videos with author and age. Same as admin. Not clicked.

## 8. /library (title "Library | SQA Team")
- Left: `All Files 12` and 3 category buttons (counts 2 / 1 / 1), `Browse Library` (small screens). **No `Insights ADMIN`, no `New Category`, no storage line, no category edit/delete icons.**
- Toolbar: sort `combobox` "Newest first" (options Newest first, Name A-Z, Most downloaded), `Grid view`/`List view`, filter chips All / PDF / Docs / Slides / Video / Images / Audio / Links / Web pages (the Video chip shows 2 files). **No `Add Items`, `New Folder`, `Members`, no per-file Edit/Delete, no checkboxes / Select all.** A text input (search, no placeholder) and a hidden file input are in the DOM.
- Folders (2): `Open folder testing` ("1 item - Everyone"), `Open paid` ("1 item - Channel members"); `/library?folder=paid` opens ("paid / 1 file in this folder"; the member can open it and sees the mp3).
- Files: `Preview <name>` buttons (12). List view columns NAME / TYPE / SIZE / MODIFIED / ACCESS; ACCESS values for the member: Everyone, Channel members, **Locked** (one mp3 "mixkit-hip-hop-02-738.mp3" with Paid-access shows "Locked" to the member; admin saw "Paid access"). Per-file download counters shown in grid ("3 downloads").
- Not clicked: Preview (any), download, folders besides the URL check.

## 9. /get-started (title "Get Started | SQA Team")
**Reachable by the member** (the admin doc says admin only; the nav link is hidden). Page shows "Welcome to SQA Team, testerA A!", "Progress Bar 1 out of 6 tasks completed", accordions `Set up your profile` (Create account, done), `Personalize your profile` (text, `Edit Profile`, `Mark complete`), **`Configure your community`** (Customize branding with button `Configure your community` and `Mark complete`; Create channels), **`Start your community`** (Add members with `Invite Members` and `Mark complete`; "Send your launch announcement (optional)"). So the member sees admin-setup tasks. Console: `403 /api/community-settings/v1`. Not clicked: Edit Profile, Mark complete, Configure your community, Invite Members.

## 10. /events (title "Events | SQA Team")
- Heading "Events", "Events, meetings and webinars in this community, all in one place." Tabs `Calendar` (selected) / `List` (role=tab). Filter chips (aria-pressed): `All types` (pressed), `Events`, `Meetings`, `Webinars`; buttons `Everything`, `My calendar`, `Previous month`, `Today`, `Next month`. Month grid shows chips like "Test recurring 3:00 PM", "+1 more"; legend: Multi-day, Single session, "You're registered", Meeting, Webinar, Recurring; "Time shown in your local zone". Event buttons are not links in the grid.
- List tab: sub-chips All / APPOINTMENT / EVENT / LIVE / New2 and Upcoming / Past / All; entries show date, time, title, "Online", host, "N people are going", and a chip **`Registered`** or **`RSVP`**, links `/events/<slug>-<id>?d=<base64>`. `Meetings` filter keeps only meetings. `My calendar` kept the same list (member is registered for the other events: no visible change, not verified).
- Detail `/events/event-twwww-<id>?d=...` (not registered): "Back to events", title, "Hosted by Member A", DATE / TIME / WHERE, "Discussion" with comment editor and comments (`React`, `Reply`), side card with "Virtual event - link after registration", "1 hour", "Free - no card required", `3 going` (disabled), **`Register`**, `Add to Calendar` (menu), `Share event`. Not clicked: Register.
- Detail of a registered recurring meeting: chips "Recurring" and "You're going", `Recurring event`, "0 spots left - 1 max", status "Scheduled", "Starts in 4d 5h" (disabled button), text "The join button unlocks when the meeting starts.", `Add to Calendar`, `Share event`, `View more comments`.
- Unknown event slug: "Event not found" (title "Nope | SQA Team").
- Admin vs member: no New Event / hosting / manage controls.

## 11. /members (title "Members | SQA Team")
Heading, subtitle, `input[placeholder="Search by name"]`, two profile-question filter buttons (same as admin), role chips (`button[role=tab]`): All Members 43, Admin 5, Moderator 1, Member 34, Course Manager 1, QA Payment Settings Only 1, QA Orders Reviewer 1; sort `Newest`. Cards: avatar/initials, name, @handle, "N POSTS / N COMMENTS / 2026 JOINED", `Message` and `View Profile` (`/profile/<slug>`). `Previous` (disabled) / `Next` pagination. **No `Invite` menu.** No row menu (same as admin). Not clicked: Message, filters.

## 12. /leaderboard (title "Leaderboard | SQA Team")
Heading "Leaderboard", "The community's top members, ranked by points." and an empty state **"Gamification is turned off / Contact an administrator to enable this feature"** with `Back to feed`. No tabs or tables.

## 13. /profile/<slug>
- Own profile `/profile/testera-a` (title "Testera A | SQA Team"): `Add Cover Photo`, name, "Member since October 11, 2026", "Active now", button `Edit`, tabs (plain buttons, URL unchanged) **Feeds, Comments, Channels, Events, Saved** (an `About` tab button exists but is hidden on wide screens, `xl:hidden`; About is the right sidebar). Feeds: own "Under review" post + posts. Comments: "Commented on <post> / a post <age>" rows then "No more comments". Channels: names with `Visit channel`. Events: sub-chips "Upcoming" / "All", empty "No events yet / Events this member hosts will appear here." Saved: empty "No saved posts yet / When you save posts, they'll appear here for easy access." Sidebar About: bio, a link, custom answers (WHAT IS YOUR NAME ?, DISTRIC?, WHAT'S YOUR AGE?), ACTIVE IN chips.
- Another member's profile (`/profile/team-sqa`): **`Message` instead of `Edit`/`Add Cover Photo`, tabs Feeds, Comments, Channels, Events (no Saved)**; "No bio yet."; "ACTIVE IN ... +3 more". Posts show full cards including polls (radio inputs).
- Unknown slug `/profile/nobody`: 404 page "Member Not Found / This member profile doesn't exist or has been removed. Back to Members".
- Edit-profile / settings dialog: profile menu > Settings (section 14). The profile `Edit` button was not opened.

## 14. Profile Settings dialog (profile menu > Settings, `[role=dialog]`, URL stays `/feeds`)
Left tabs: Profile, Feed, Notification, Visibility, Security, Connected accounts, Blocked users, Hidden posts, Language. Footer buttons `Cancel`, `Save Changes`, `Close` (not clicked).
- **Profile**: title "Profile Settings / Update your profile photo, display name, and personal details". `Upload Photo`, `Upload Cover` (hidden file inputs). Fields: First Name* (`First name`), Last Name, Display Name, Username* (`your-username`), About You (textarea "Share a little about yourself...", counter "14/500"), Address (`Enter your address`), Links > Website (`https://example.com`), then community custom questions: "what is your name ?*", "what is your favourite food now?" (text), a select-like button ("RFL Group / Not determined"), a prefilled paragraph field, "Distric?*" (placeholder "Sylhet"), "What's your age?*" (`input[type=number]` "type your age"). Required fields marked `*`.
- **Feed**: "Choose what shows up in your feed. This only changes your own feed." radio-style options: "Channels I follow" and "Everything I can see" (also brings in public channels not joined; "Saved as soon as you pick one"). No Save button (auto-saves).
- **Notification**: "Community notifications" with a `Toggle all` button and a checkbox grid with Email and In-app columns, rows: Comments on my posts, Replies to my comments, Mentions, Reactions on my posts, Reactions on my comments, Polls, New members join, New posts in channels, Weekly digest, Review activity; `Cancel` / `Save Changes`. Many boxes on by default (21 checkboxes, 3 off at the time).
- **Visibility**: Profile Visibility radios "Everyone" (selected) / "Members Only"; Discovery switches "Show in search results", "Show in member directory" (both on); note that the email is never shared; Cancel / Save Changes.
- **Security**: Email Address (`<email>`) with `Change email`; Change Password with `input[type=password]` placeholders "Enter current password", "Enter new password", "Confirm new password"; Cancel / Save Changes. Not touched.
- **Connected accounts**: "This community hasn't enabled any social sign-in options yet." (empty).
- **Blocked users**: list with one blocked user and `Unblock` (Cancel / Save Changes).
- **Hidden posts**: "You haven't hidden any posts." (empty).
- **Language**: search `input[type=search][placeholder="Search languages"]`, region filter chips All 76 / Europe 33 / Asia 30 / Middle East 5 / Africa 16 / Americas 5 / Oceania 2, "Community default" option and ~76 language rows with flag, native name and English name.
- Admin vs member: the admin doc listed the same dialog (Language tab there); this member version also has Feed, Notification, Visibility, Security, Connected accounts, Blocked users, Hidden posts, and the custom profile questions.

## 15. /talk (layout only)
**`/talk` automatically redirected to `/talk?dm=2884`, i.e. it opened the most recent direct message** (requests: `GET /api/chat/v1/dms/2884/messages`). I did not click anything inside, but opening it may have marked that DM read. Layout: title "Talk | SQA Team", header "Back to community", community name "SQA Team" with "43 members", tabs `Threads`, `Mentions`, `Saved`, `Direct messages`, `Rooms`, button `New DM`, DM list rows (avatar, name, last-message preview such as "Video", "Voice message", a file name, relative time), `New room`, conversation pane with `Block <member>`, `Pinned messages`, `Files`, message list with day dividers and times, composer `div[contenteditable]` with `Attach file`, `Attach image`, `Attach video`, `Record voice message`, `Add emoji`, `Send` ("Shift + Enter for a new line"). Nothing typed or sent.

## 16. /billing (member page) and other routes
- `/billing` (title "Billing | SQA Team"): "Manage your subscriptions, payment methods, and billing details." Tabs `Transactions` (empty table PRODUCT / TYPE / GATEWAY / AMOUNT / NEXT RENEWAL / PAYMENT / SUBSCRIPTION DATE, "No orders found.", `Previous`/`Next` disabled), `Subscriptions` ("No active subscriptions / Your paywall subscriptions will appear here."), `Payment methods` ("No saved cards / Cards saved during checkout will appear here." + `Add payment method`), `Billing address` (empty message "No billing address saved yet. Add one below." and fields Address line 1 `123 Main Street`, Address line 2 `Apt, suite, unit, etc.`, Country, State / Province, City, ZIP / Postal code `10001`, buttons `Save address`, `Discard`). Reachable from the profile menu. Not clicked: Add payment method, Save address.
- **`/dashboard`: HTTP 200, H1 "Access Denied" - "You don't have permission to access this section. Contact your community admin for access."** (shell with `Toggle sidebar`, `Expand sidebar`). **`/dashboard/settings`: redirects to `/dashboard/settings/general`, "Settings / No permissions / Access Denied" (same text), console `403 /api/community-settings/v1/general`.** Each visited once.
- `/courses/<slug>/edit`: see section 6 (redirect to detail + 403).
- Unknown path (`/get-started/x`): app 404 "Page Not Found! Go Back Home". Public 404 page for `/no-such-page` uses the website shell (title "Page not found - SQA Team").
- **`/portal` (site portal) opens for the member**: title "Dashboard - SQA Team", sidebar Overview / My files / Members, "Back to the website", "Community", user name + `Sign out`, "Welcome back, testerA A", cards "Upload a file", "My files 0", "Site Database Connected", "Community Key Available". `/portal/uploads` shows "My files" with an upload input (no files). `/portal/jobs` shows "Post a job" button and the text "only site admins see this screen. You do not have access to this." with `403 /site-api/jobs/manage` x2. `/portal/enquiries` shows "Request failed (404)" (`404 /site-api/events`, same as admin). The public site header shows a **`Dashboard` link to `/portal`** for the logged-in member, plus `Community` and `Sign out`. Not clicked: Post a job, upload, Sign out.

## 17. Public pages as a logged-in member
`/` and `/blog`: website shell with header `Home, Menu, About, Events, Gallery, Visit us, Blog, Dashboard, Community, Sign out` (admin sees the same). `/login` and `/register` redirect to `/feeds`. `/forgot` still shows "Forgot password?", Email input, `Send reset link`, `Back to log in`. `/privacy` renders the app shell (member header: Home, Courses, Events, Members, Leaderboard), title "Privacy Policy - SQA Team". Home still shows the stray text "//eita ekta test" and the "Pach Vai" restaurant template.

## 18. Admin vs member: quick matrix
| area | member | admin |
| --- | --- | --- |
| header | no Community menu, no Getting Started | both |
| profile menu | Profile, Settings, Billing(`/billing`), Theme, Log out | Billing goes to `/dashboard/billing` |
| composer | Photo, Poll, Embed; no Video / Go Live; no announcement toggle; no Schedule / Draft | all |
| channel pickers | own channels + public ("follows on post") only | all nine |
| channel row menu | one item (Unfollow / Follow Channel / Join for price) | 7-8 admin items |
| post "..." menu | no Pin, no Delete on others; own: Edit, Delete, no Pin | Pin, Delete, Unpin |
| paid / private channels | lock screen or gate with join price | content + "Customize lock screen" |
| private-channel-2 | "Channel Not Found" | empty channel |
| courses | All Courses / Enrolled tabs, Watch Course / Enroll Now, no drafts, no create | Create Course, drafts, edit |
| library | read only, "Locked" access label | Add Items, edit, delete, Insights |
| members | no Invite | Invite menu |
| leaderboard | "Gamification is turned off" (same site setting) | same |
| /dashboard | Access Denied | full dashboard |
| /get-started | reachable, includes admin setup tasks | reachable |
| /portal | reachable (jobs 403) | reachable |

## 19. Possible bugs and oddities (member)
Each seen on at least two loads unless marked single.
1. `403 /api/community/v1/paywall-intervals` on every app page for the member (silent).
2. `/get-started` is reachable by a member and shows "Configure your community" / "Start your community" admin tasks (Customize branding, Add members) plus a `403 /api/community-settings/v1`.
3. The "+" sidebar menu offers `Create Channel` to a member (single menu item). Not clicked, so it is unknown whether it works for a member.
4. `/portal` and its sub-pages open for a member; the jobs page says "You do not have access to this" but still shows the `Post a job` button; the public header shows `Dashboard` linking to `/portal` (this is the site portal, not `/dashboard`).
5. Notifications panel gives the member "X is asking to join a private room ... tap to review" rows (admin-style).
6. `private-channel-2` shows "Channel Not Found" for the member while the admin sees an empty existing channel (could be by design for hidden channels).
7. `tunnel-paid` shows an empty state ("No posts yet / Follow a channel and start the conversation!") plus a Join banner, but the admin sees a post there; `hydrogen` shows the post title with a gate: different lock patterns per paid channel (tunnel-paid hides posts, hydrogen gates one, private-channel and paid show a full lock screen).
8. `/talk` opens the latest DM automatically.
9. Mojibake "Â·" in file cards on feed ("PDF File Â· 36.8 MB"), same as admin.
10. Page titles: channels, `/videos`, `/p/...` do not carry the "| SQA Team" suffix (same as admin).

## 20. Not clicked
Post / Photo / Poll / Embed / Insert * / toggles / Select Channel items, React, Comment, Reply, Register / RSVP, Enroll / Get Access / Enroll Now / Watch Course, Join for ..., Get access, Follow / Unfollow / Follow Channel, Create Channel, Mark complete / Complete / Mark incomplete / Continue, Download Lesson, Play, library Preview / downloads, Message buttons, DM controls, Edit / Delete (own pending post), profile `Edit`, Settings Save / Change email / Change password / Unblock / toggles, `Mark all as read`, `Delete notification`, notification rows, `Add payment method`, `Save address`, `Post a job`, Log out, Theme buttons, `Add or restore links`.
