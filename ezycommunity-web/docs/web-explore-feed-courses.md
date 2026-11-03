# EzyCommunity web exploration: feed, channels, posts, courses, videos, library, get-started, portal, public pages

Site: https://sqa.ezycommunity.pro.bd (QA community "SQA Team"). Explored 2026-11-03, view-only, headed Chromium, **as logged-in admin "Team SQA" (badge "Admin")** via the shared CDP browser; public pages explored earlier logged out. No 429. Nothing was changed (no clicks on actions). Dump script: scratchpad `feed2/dump.js` (DOM text, buttons, links, 4xx/5xx per page).

## Routes (admin)
`/feeds`, `/channels/<slug>` (9: general, mineral, tunnel-paid, private-channel, private-channel-2, hydrogen, hiii, paid, 123), `/p/<channel>/<slug>`, `/p/<channel>/<id>/photos/<n>`, `/courses`, `/courses/<slug>`, `/courses/<slug>/edit` (+ `/drip`, `/staff`, `/enrollments`, `/setting` with sub-routes `/visibility /access-control /pricing /branding /lock-screen /engagement /certificate /awarded-certificates`, `/chapter/<id>`, `/chapter/<id>/lesson/<id>`, `/chapter/create`, `/watch`), `/videos`, `/videos?v=<id>`, `/library`, `/library?folder=<name>`, `/get-started`, `/create-community` (link only, not opened), `/portal`, `/portal/uploads`, `/portal/enquiries`, `/portal/jobs`, `/portal/members` (404).
Header nav (admin): Home, Courses, Events, Members, Leaderboard, **Getting Started** (new vs logged out). Sidebar: Videos, Library, Channels (9), Links (Com-IOS, Com-And store links: placeholder apps).
Header icon buttons (aria-label): "Open menu", "Search community (Cmd+K)", "Open messages", "Open notifications", "Open profile menu". Mobile-style buttons seen: "Home", "Videos", "Create post", "Notifications", "Chat". "Add or restore links" button on every page (sidebar links manager, not opened).

## /feeds  (title "Feed | SQA Team")
- Composer: textarea placeholder "Write Something...", buttons "Post", "Go Live", "Photo", "Video", "Poll", "Embed", hidden file inputs. Sort button "Latest". Not used.
- "Pinned Post" carousel with "Previous slide"/"Next slide" (pinned: Code, Webinar staging, this is the pdf, a Mineral post).
- Post cards: author, "Admin" badge, "in <Channel>", relative time (7d, 4h), title/body, reaction summary (count), "React" (or "Adore" when the viewer already reacted), "Comment", "N comments". Attachments: PDF "large-doc.pdf PDF File · 36.8 MB" (bunny CDN link), DOCX file card, embed card with "Open on site"/"Expand embed", YouTube-style title post, video posts link to `/videos?v=<id>`, code block with "Copy code" (post "Code" shows literal `<h1>This is header</h1>`, rendered as text: correct escaping).
- Right rail: "LIVE & UPCOMING" / "UPCOMING EVENTS" (Local Business Networking Breakfast 4 Nov, Test recurring 9 Nov, event twwww 18 Nov, a "sqa persistence test rec" event), "MEMBERS" (4 names, "See all"). Another worker covers events/members.
- Seen posts (General): Code, Webinar staging, this is the pdf (Mineral), Defensive Body without title content. (4h), Test, test video, Edited, G-Eazy... title, 111 (docx, 10 comments), 444 (8 comments), 333, 2222, 111. Oddity: text "Â·" mojibake in the PDF card ("PDF File Â· 36.8 MB") - encoding bug, repro: open /feeds, look at large-doc.pdf card.
- Console: no errors, no 4xx.

## Channels (admin view)
All use the same layout: H1 channel name, composer, "Latest" sort, list, end marker "No more posts" or empty state "No posts yet / Be the first to share something here." Titles = channel name only (e.g. "General", not "General | SQA Team": inconsistent with other pages).
| channel | content seen | notes |
| general | many posts (Code, test, 111, 444, 333, 2222, 111 ...) | pinned posts |
| mineral | ~14 posts (Bin6cumibuh, fefef, Hi, Testing update new, Update u, video/audio posts with player buttons Play/Mute/Playback rate/Open media) | "1 Pending" badge (admin: pending items), right rail "RESOURCES: paid, 1, Browse all" linking `/library?folder=paid` |
| tunnel-paid | 1 post "Video" by Yousuf007 (13d, reaction "Curious") | title "Tunnel - paid" |
| private-channel | 1 post "ffff" (2 comments), banner "Anyone without access to this channel sees the default lock screen instead of these posts." + button "Customize lock screen" (admin-only) | |
| private-channel-2 | empty ("No posts yet") | new in the sidebar vs logged out (hidden from anonymous) |
| hydrogen | 1 post "Bangladesh" by Sojib Patwoyari (Admin) | |
| hiii | empty; channel name is an emoji (heading shows only the emoji, sidebar name "hiii") | |
| paid | empty; lock-screen banner + "Customize lock screen" | sidebar label "paid test"? it reads "paid" with "test" as separate text node: not verified |
| 123 | empty | |
Admin-only controls seen: "Customize lock screen" (private/paid channels), "1 Pending" badge (mineral). Channel create/settings/menu not seen on the page (probably in the sidebar hover or profile menu; not verified). Console: clean for all 9.

## Post detail `/p/<channel>/<slug>` (checked code, bin6cumibuh, 444)
Title "<post title>" only. "Back to <Channel>" link, author + badge + "in <channel>" + age, body, reactions, "React"/"Comment", "Most Recent" comment sort, comments with "React"/"Reply", "View more comments" (444 shows 5 of 8), comment box with "Insert emoji" and file input. Slugs: derived from title (`code`, `444`, `111-08ecada6` when duplicated) or a 12-hex id when the post has no title (`23727cc1e31c`). Post "..." menu was not opened (not found as a labelled button; icon buttons have no aria-label: locator gap). Oddity: comment count "1 comment" button vs list; counts in the video panel differ (reactions vs comments swapped? not verified).

## /courses  (title "Courses | SQA Team")
Heading "Courses", subtitle "Learn, grow, and master new skills with our community-driven courses.", search input placeholder "Search courses", sort button "Newest", **"Create Course"** (admin). Each card: status chip (Draft/Published), price chip (Free/Paid), "Private" chip, level chip, 3 unlabeled numbers (on the edit page these correspond to chapters / lessons / enrolled: for "testing course test" cards show 2, 5, 4 and edit page says 2 chapters, 6 lessons (5 published), 4 enrolled, so the second number is PUBLISHED lessons), price "USD 555 / Monthly", and a "Course actions"/"Edit Course" button (links to `/edit`).
10 courses: 5 Draft `AUTO_COURSE_<id>_<ts>` (Free, 0/0/0, leftovers from automated tests), "testing course test" (Published, Paid, USD 555 / Monthly, 2/5/4), "Testing Manual Paid Course" (Published, Free, Private, ADVANCED, 1/1/1; description just repeats name and slug), "created course on staging" (Published, Free, 1/5/6), "Test Course" (Published, Paid, USD 50 / LTD, also USD 60 shown on the detail page, 2/4/1), "Speak English with Confidence" (Published, Free, 2/3/3). Descriptions on several courses are random lorem-style bios (data oddity).

## Course detail `/courses/<slug>` (admin view)
Back link "Back to courses", title, description ("About This Course" + "See More" when long), "Course Curriculum" with "N chapters · M lessons", "Expand all chapters"/"Collapse all chapters", chapters with lesson counts and lesson names (lesson badges: Free, pdf, Audio), price box. **BUG/oddity:** as admin the page shows "Log in as a member to purchase this course." (no Enroll/Continue button, no "Edit" button). Repro: open `/courses/test-course` while logged in as admin. Draft course page shows banner "Draft preview — only course managers can see this page. Publish the course to make it visible to members." and "No chapters available yet." Private course (Testing Manual Paid Course) still opens for admin. "testing course test" shows 5 lessons on the page but 6 in the editor (1 draft lesson hidden: correct).
Data: testing course test: chapters "one" (lesson one/two/three) and "Real-World Examples" (2). test-course: Chap1 (Less1, Less2), Chap2 (2). Speak English: "Common Pitfalls to Avoid" (1), "Final Thoughts and Next Steps" (2). created course on staging: "chapter one" 5 lessons (downloadable lesson, pdf, Audio).

## Course editor `/courses/<slug>/edit`
Title "Edit | SQA Team". Top tabs: Curriculum, Drip, Staff, Enrollments, Settings, **Preview** (`/watch`); buttons "Save"/"Saved" (appears on chapter/settings pages). Left curriculum tree with "Search lessons", chapters and lessons, "New chapter", "Add lesson". Overview stats: Chapters (2, "2 published"), Lessons (6, "5 published"), Enrolled (4, "total members"). Empty state "Select a lesson to start editing".
- Drip: "Release content over time"; release type radio cards: Immediately, Enrollment based, Specific dates; "No drip schedule" empty state; buttons "Discard", "Save schedule".
- Staff: "Who runs this course", "No staff yet.", "Add staff member".
- Enrollments: "4 students enrolled", "Enroll student", search "Search students", table STUDENT/ENROLLED (names and emails visible, masked here: <email>), dates Oct 15-29, Previous/Next. Note: text says "Instructors are managed on the Instructors tab" but the tab is called Staff (copy inconsistency).
- Settings (`/setting`): left list General, Visibility, Access Control, Pricing, Branding, Lock Screen, Engagement, Certificate, Awarded, Grade (marked SOON). General: Course Name (19/255), Slug (read only prefix sqa.ezycommunity.pro.bd/courses/...), Short Description (placeholder "A one-liner that appears in directory cards", 0/280), Course Level select ("Select a level"), rich-text Description with toolbar buttons (Format text as heading, List options, Blockquote, Code Block, Link, More options). Other settings sub-pages not opened (visible links only).
- Chapter page `/edit/chapter/<id>`: chapter title input (placeholder "Untitled chapter"), Draft/Published toggle, optional description, lesson list with status, "Add lesson", "Chapter settings: Motivational Popup / Show after chapter completion" checkbox, **Danger Zone "Delete Chapter"** (admin destructive, not used). Lesson pages not opened (would show editor).

## /videos  (title "Videos", no site suffix)
Full-screen vertical video feed (reels style), no H1. Buttons: "Message", "React", "Comments", "Save"/"Unsave", "More", "Close", "Start from the newest video", "Unmute", "Previous", "Next", "Close comments" with comment panel ("Most recent", "Insert emoji", "Comment"). Items come from channel video posts (authors Asif QA, Team SQA, testerA A, Sojib Patwoyari, Yousuf007, Afsar Tanvir ...; 20 listed, ages 1d to 20d). Deep link `/videos?v=<id>`. Autoplay: a video may start muted on load (I did not interact; tab closed). Not played deliberately.

## /library  (title "Library | SQA Team")
Left panel: "All Files 12", **"Insights ADMIN"**, CATEGORIES (😍 free free 2, 📚 free category 1, 📚 paid 1) each with admin icons ("New subcategory in ...", "Edit category", "Delete category", "Copy ID"), "New Category", STORAGE 167.9 MB. Main: "Library - Shared docs, guides, templates and links for the community", buttons "Add Items", "New Folder", "Members", sort "Newest first", "Grid view"/"List view", filter chips All, PDF, Docs, Slides, Video, Images, Audio, Links, Web pages. FOLDERS (2): "folder testing" (1 item, Everyone), "paid" (1 item, Channel members). FILES (12) with checkboxes + "Select all": mp4 98.0 MB, 5 mp3, 2 links ("web pages", "read"), jpg, mp4 app_003, docx, large-doc.pdf 36.8 MB; each with size, date (Oct 15/22) and "N downloads" counter. Type badges AUD/LINK/DOC. Oddity: category count text duplicated in DOM (e.g. "All Files12" and "All Files 12": likely screen-reader duplicate). Nothing opened/downloaded.

## /get-started  (title "Get Started | SQA Team", nav "Getting Started")
"Welcome to SQA Team, Team SQA!", "Progress Bar - 1 out of 6 tasks completed", button "Change" (progress/avatar?, not verified). Sections (accordion): "Set up your profile" (done: "Create account"), "Personalize your profile" (text "Add your photo and a short bio so members know who you are.", buttons "Edit Profile", "Mark complete"), "Configure your community", "Start your community" (collapsed, contents not opened). Oddity: the admin has the same "Set up your profile" and welcome copy, "6 tasks" but only 4 section headings visible.

## /portal  (title "Dashboard · SQA Team", separate site-admin dashboard)
Sidebar WORKSPACE: Overview, My files, Members; MANAGE: Event enquiries, Jobs; "← Back to the website", "Community", user "Team SQA", "Sign out". Overview: "Welcome back, Team SQA", cards "Upload a file", My files 0, Event enquiries "—", Jobs 0, "Site Database Connected", "Community Key Available", "Recent files: No files yet. Upload your first file".
- `/portal/uploads`: "My files", file input, "Images up to 10 MB, documents up to 500 MB", "No files yet."
- `/portal/jobs`: "Post a job", "Listed on /jobs ... only site admins see this screen", "No jobs yet."
- `/portal/enquiries`: shows **"Request failed (404)"** - BUG: `GET /site-api/events` returns 404 (also on `/portal` overview where Event enquiries shows "—"). Repro: open /portal/enquiries logged in as admin; console shows 2 x 404.
- `/portal/members`: sidebar link "Members" points to `/portal/members` which gives "Page Not Found! Go Back Home" (404, no title) - BUG: dead sidebar link.

## Public pages (logged out; from earlier run, still valid)
Public site (restaurant-style landing "Pach Vai", Sylhet): `/`, `/menu`, `/about`, `/gallery`, `/visit`, `/blog`, `/blog/<slug>` (qa-scheduled-blog-test, reflections-on-the-past-year, threefour, onetwoblog), `/events`, `/portal`, `/login?redirectTo=`, `/register?redirectTo=`, `/forgot`, `/privacy`, `/terms`.
404s ("Page not found · SQA Team"): `/home`, `/feed`, `/channels`, `/getting-started` (real route is `/get-started`, admin only).
Trailing slash: `/menu`, `/about`, `/gallery`, `/visit` redirect to `/menu/`; `/blog`, `/login` do not.
Titles: `/` "SQA Team"; "Menu · SQA Team"; "About · SQA Team"; "Gallery · SQA Team"; "Visit us · SQA Team"; "Blog · SQA Team"; `/login` "Login | SQA Team"; `/register` "Register | SQA Team"; `/forgot` "Forgot | SQA Team"; "Privacy Policy — SQA Team"; "Terms and Conditions — SQA Team"; "Courses | SQA Team"; "Library | SQA Team"; "Feed | SQA Team"; "Get Started | SQA Team"; `/videos` "Videos"; channels just the channel name; `/portal` "Dashboard · SQA Team"; 404 "Page not found · SQA Team".
- `/` landing: nav Home, Menu, About, Events, Gallery, Visit us, Blog dropdown, Log in, Join; hero "Sylheti food, cooked like home", "Book a table", "See the menu". Oddity: stray text "//eita ekta test" in the header; one 404 resource.
- `/menu`: sections Sylheti Specialties, Shutki & Bhorta, Bhuna Jhol & Curries, Rice Biryani & Khichuri, From the Tawa, Drinks Lassi & Tea, Something Sweet. Oddity: visible placeholder "Prices ... are sample figures — replace them with your real menu before publishing."
- `/about`, `/gallery` (no alt text found), `/visit` (address, 24 hours, tel link, Maps link, FAQ with 4 questions).
- `/blog`: search `input[type=search][placeholder="Search posts"]`; 4 posts, two share the title "Reflections on the Past Year"; one card shows "New post..." text.
- `/login`, `/register`: DOM scan found no form fields (renders late or in iframe; not verified). `/forgot`: H1 "Forgot password?", input placeholder "you@example.com", button "Send reset link", link "Back to log in".
- `/privacy` (9 sections), `/terms` (11 sections): header brand reads "Ezycommunity" (branding inconsistency).
- Logged-out community app: `/feeds` shows "Log in to see your feed / Follow channels and posts will appear here." plus recent posts names and events; channel list visible to anonymous (8 channels; private-channel-2 hidden); `/courses` shows 5 published courses ("Enroll Now"/"Invite only"), no drafts; `/library` "Become a member / Sign in to view this community's content"; `/videos` empty page with no gate message. Logged-out 401s on `/api/auth/me`, `/api/community-plans/v1/entitlements`, `/api/community/v1/paywall-intervals`, `/api/auth/refresh` are expected.

## Locator hints
button "Open profile menu", "Search community (Cmd+K)", "Open messages", "Open notifications", "Add or restore links"; composer `getByPlaceholder('Write Something...')`, buttons Post/Go Live/Photo/Video/Poll/Embed, "Latest"; post actions "React", "Comment", "Reply", "View more comments", "Insert emoji", "Copy code"; carousel "Previous slide"/"Next slide"; courses `getByPlaceholder('Search courses')`, "Create Course", "Newest", "Edit Course", `a[href^="/courses/"]`; editor `getByPlaceholder('Search lessons')`, `getByPlaceholder('Search students')`, tabs as links `/edit/drip` etc.; library buttons "Add Items", "New Folder", "Grid view"/"List view", "Edit category"/"Delete category" (aria-labels), "New Category"; get-started "Edit Profile", "Mark complete". Many icon buttons have NO accessible name (dozens of unnamed buttons per page): accessibility gap, and post "..." menu not findable by name.

## Network/console
Admin pages: clean (no console errors, no 4xx) for feed, channels, posts, courses, editor, videos, library, get-started. Only 404s: `GET /site-api/events` (portal) and `/portal/members`.

## Bugs/oddities summary
1. Course detail shows "Log in as a member to purchase this course." to a logged-in admin.
2. `/portal/enquiries` "Request failed (404)" from `/site-api/events`; `/portal/members` sidebar link is a 404.
3. Mojibake "Â·" in file card metadata on /feeds.
4. Inconsistent page titles (`/videos`, channel pages lack "| SQA Team").
5. Copy mismatch "Instructors tab" vs "Staff" tab in enrollments.
6. Draft AUTO_COURSE leftovers (5) in the course list; private-channel names exposed logged out (private-channel visible, private-channel-2 not).
7. Unlabeled icon buttons / unlabeled course stat numbers.

## Test case ideas
- Feed: composer visible for admin; pinned carousel next/previous; post card counts vs detail page; attachment cards (pdf/docx) render; sort "Latest"; end-of-list marker.
- Channels: each of 9 loads with correct title, empty states (private-channel-2, hiii, paid, 123), lock-screen banner and "Customize lock screen" only on private/paid channels, "1 Pending" badge on mineral, tunnel-paid access for non-members.
- Posts: `/p/<channel>/<slug>` loads, "Back to <channel>", comment sort, "View more comments", slug rules (duplicate title suffix, untitled id slug).
- Courses: list search/sort, draft/published/private/price chips, counts vs editor counts, card -> detail -> edit navigation, draft preview banner, admin sees purchase prompt (bug), editor tabs, drip types, enrollments table and search, settings sub-pages, role visibility vs student (students must not see drafts or /edit).
- Videos: deep link `?v=<id>`, next/previous, comments panel, save/unsave (student).
- Library: category counts (12 total, 2+1+1 categories + 2 folders), filters by type, grid/list toggle, select all, folder access labels (Everyone / Channel members), storage figure, admin-only Insights/New Category/Delete.
- Get-started: progress "1 out of 6", sections expand, Mark complete (state change; run once with recorded start state).
- Portal: site admin only; student gets denied; 404 bugs above; empty states.
- Public/logged out: nav links, trailing-slash redirects, blog search, `/forgot` validation, 404 pages, legal anchors, gating of `/feeds /library /videos /channels/*`, `redirectTo` on login/register.
