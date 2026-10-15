# EzyCourse Android app: how it works (from exploratory testing)

Explored on 2026-10-12 on the LIVE app (**v5.0.3**, package `com.ezycourse.ezycourse`), with the project's test **student** account.
Device: Android Studio emulator `Pixel_10_Pro`, Android 17, 1280x2856, driven with Appium (UiAutomator2), window visible.
Everything below was observed. "Not verified" marks what was not confirmed.

**Rules followed:** view only (nothing saved, sent, bought, marked complete or submitted), ONE login, session kept (noReset),
no web tests running at the same time. Personal data is masked in this file: `<student name>`, `<student email>`, `<other user>`, `<token>`.

> Status: **Rounds 1-5 of 5 done** (Login, Dashboard, bottom menu, Courses tab, bundle, course open, lesson list, one lesson of each type, player tabs and menus, Profile). Still to do (separate rounds, if wanted): a **site-owner pass** (needs its own single login), the Community and Coaching tabs in depth, and the lesson types not opened yet (PPT, Survey, Multiple, Live, Downloads, Embedded, SCORM).
> Rounds 1-5 used the old student account (`VALID_*`, confirmed by the owner). **From now on the app tests use the new accounts `TEST_STUDENT_*` and `TEST_ADMIN_*`** in `legacy-appium/.env`. The screens below may show different data (courses, points, notifications) for the new student. No content was created on the live site.

## How to read the locator tables
- "Best locator" order: accessibility id (`~text`) > UiAutomator (`ui:`) > XPath (last resort). `instance(n)` is avoided.
- "Verified" means the locator was run against the live screen and matched exactly the number of elements shown.
- **Changing** = text that changes between runs (time, progress, counts, names). Never assert on it exactly; match a stable prefix.
- Flutter note: Appium only sees what the app exposes as "semantics". Elements scrolled off screen disappear from the tree
  (for example "Change Cover" is found at the top of Edit Profile but not after scrolling). Scroll before you look for them.

## Test data seen (student account)
| Item | Notes |
|---|---|
| Enrolled courses | 3: the QA course (title masked, 30 lessons, started, 3 %), "Native meeting test" (13 lessons, not started), "Test 1" (1 lesson, not started) |
| Bundled courses | at least 1 bundle (2 courses) |
| Communities | "New" (1 member), "SQA Community" (2 members) |
| Coaching | "Currency test", "Evergreen quiz testing", "Test one to one coaching", "One coaching TBY" |
| Points | shown on Profile as "<n> pts" (changing) |

## New student account: first check (2026-10-12)
The old session was cleared with `adb shell pm clear com.ezycourse.ezycourse`, then ONE login with `TEST_STUDENT_*` (1 real login request).

| What | Result |
|---|---|
| First start after the clear | The system asks **"Allow EzyCourse to send you notifications?"** (Allow / Don't allow) before the login screen shows. Allowed on the emulator. Not seen in rounds 1-5 because the session had `autoGrantPermissions` set. Tests that clear app data must handle this dialog (it is outside the app tree: `id:com.android.permissioncontroller:id/permission_allow_button`). |
| Login | **Worked.** Lands on the Dashboard (Home) as before. |
| Dashboard | The greeting and learner name differ (new student). **No "Ongoing / Enrolled / Bundled Courses" sections appeared**, only the banner and the three quick actions (Edit Profile, Notifications, Announcements). |
| Courses tab | **Failed to load:** `~Oops! Something went wrong`, `~No internet connection`, `~Retry`. **Retry (tapped once) gave the same error.** The emulator itself has internet (ping, DNS, Wi-Fi validated). |
| Cause (from the app log) | The app cannot resolve the host **`yousuf.comm.pro.bd`** (`SocketException: Failed host lookup ... No address associated with hostname`). The same name also fails on the PC with the default resolver and with 8.8.8.8 (**DNS name does not exist**, and the parent `comm.pro.bd` does not exist either). The web site used by the web tests is `ezyyousuf.ezycourse.com`, a different host. |

**Which numbers differ for the new student:** everything that is course data could NOT be re-checked, so these are now **unverified for the new account** (they are true only for the old student): the 3 enrolled courses and the bundle, the course names and lesson counts (30, 13, 1), the percent (3 %) and "1/30", the 31 items / 2 chapters of the QA course, the points (394), the notification and announcement lists, the 10+ comments, the community list (2) and the coaching list (4). **Unchanged by design (same app, same screens):** the login screen, the bottom menu, the Profile menu and the screen layouts, locators and Appium visibility findings (sections 1-3, 5a, 7a-7c, 8) were not re-checked either, but they do not depend on the account.
**Possible issue:** the error message says "No internet connection" although the real cause is a host name that does not exist (misleading text, or the new account points at an unusable site/API host).
**Waiting for the owner:** confirm the new student belongs to the test site and fix or confirm the host, then re-run. Nothing else was explored for the new student.

## Update (same day): the new student's Courses data DID load
A few minutes after the first check the Courses tab loaded without any change on my side (the Dashboard now also shows an "Enrolled Courses" section), even though `yousuf.comm.pro.bd` still does not resolve from this PC. So the first error was a **slow or failed first load**, not a permanent problem. What the new student sees (course names are test data, to be confirmed by the owner):

| Item | New student |
|---|---|
| Enrolled courses (3) | "Yousuf course" (0 lessons), "Packet Tracer 7.2. and Cisco IOS Introduction" (10 lessons), "Master Linux : For Absolute Beginners" (20 lessons). All "Start" (0 %). |
| Bundles | none ("No courses found" on the Bundle tab) |
| Category chips | All, Network & Security, Networking, Operating System. Network & Security and Networking show only "Packet Tracer..."; Operating System shows "Yousuf course" and "Master Linux...". |
| Search | typing "Linux" does **not** filter by itself (all 3 stay, also after 10 s); **pressing Enter** filters to "Master Linux..." only (seen 2x). Ask the owner whether live filtering was intended. |

## Automated tests: Courses tab (`tests/courses/courses.spec.ts`)
Run with `npm run test:courses` (from `legacy-appium/`). ONE login for the whole file.

> **Changed after the new APK (different credentials, courses and users):** the tests no longer contain any fixed course names. They read two names from `legacy-appium/.env` (`config/env.ts`): `COURSE_NAME` (a course the student is enrolled in) and `BUNDLE_COURSE_NAME` (a bundle the student owns). The spec stops before the login if either is empty. `test-data/courses.ts` now only holds the two names a student cannot see (`notEnrolled`, `draft`). No test message prints a course name. **Not run yet with the new data.** The table below shows the first run, which used the old test student; its course names and the old category lists no longer apply.

| ID | Check (current version) | First run, old student (2026-10-12) |
|---|---|---|
| CRS-01 | the course named in `COURSE_NAME` shows in Courses > Enrolled Courses | passed (with 3 fixed names) |
| CRS-02 | a course the student is not enrolled in is not in Enrolled | **skipped: needs `courses.notEnrolled`** |
| CRS-03 | a Draft course is hidden from the student | **skipped: needs `courses.draft`** |
| CRS-04 | the Bundle tab shows the bundle in `BUNDLE_COURSE_NAME`; opening it shows at least one course (the old student had no bundle, so this was skipped) | not run yet |
| CRS-05 | searching the full `COURSE_NAME` + Enter shows that course | passed (with a fixed search word) |
| CRS-06 | every category chip on screen filters to courses that are in the full list (skips if the site has no chips). It does NOT check which course belongs to which category; give me a category-to-course list if that is wanted | passed (3 chip tests with fixed lists) |
| CRS-07 | tapping the `COURSE_NAME` card opens the lesson player | passed |

Findings while building them:
- **The first tap on the Courses tab right after login can be ignored** (the app stayed on Home, the Dashboard was still loading). The first run failed on this. The tests now repeat the tap until the Courses page shows. Seen in 2 runs; to confirm whether this is a real app delay.
- The Courses list can show "Oops! Something went wrong / No internet connection / Retry" at first. The tests tap Retry.
- A student cannot see non-enrolled or Draft courses in the app, so CRS-02 and CRS-03 need their names from the web admin.
- Limit: only the course cards currently on screen are read (the list has 3 courses, so this is enough for now).
- CRS-07 leaves the app inside a lesson; the spec closes the app afterwards so nothing keeps playing.

## New APK (v5.0.4): the course to complete, first look (2026-10-12, view only)
Goal of the owner: a student completes a course through the app. This is a **look only**: nothing was completed, skipped, started, submitted, downloaded or shared. ONE login with `TEST_STUDENT_*` (fresh install of v5.0.4). The course and bundle names come from `.env` (`COURSE_NAME`, `BUNDLE_COURSE_NAME`) and are masked here as `<COURSE>` and `<BUNDLE>`.

### 1. Right site, right course?
- The app showed `<COURSE>` on the Dashboard and on the Courses tab (the card text starts with exactly `COURSE_NAME`). **Yes.**
- The app log shows it talks to **`yousuf.ezycourse.com`** (chat: `realtime.ezycommunity.com`), with no failed host lookups. **The web tests use `ezyyousuf.ezycourse.com`, a different name.** The owner has to confirm they are the same site (the course matches, so it was not treated as a stop).

### 2. The course: 2 chapters, 20 lessons (Text 15, Video 3, Pdf 2)
No Quiz, Assignment, Survey, Live or Embedded lesson in this course. **CORRECTION (later the same day): there IS a `Certificate` row after lesson 20 (the 21st row, locked). My first scroll did not reach the end of the list, so my first note "no Certificate" was wrong.** Lesson titles repeat inside and between chapters, so **never find a lesson by title alone**.

| # | Chapter 1 "Putting It All Together" (10 lessons) | Type | | # | Chapter 2 "Bringing It All Together" (10 lessons) | Type |
|---|---|---|---|---|---|---|
| 1 | Introduction to Variables | Text | | 11 | Understanding Error Handling | Text |
| 2 | Working with Forms and Input | Text | | 12 | Introduction to Vocabulary Building | Text |
| 3 | Introduction to Loops | **Video** (29 s) | | 13 | Introduction to Conditional Statements | Text |
| 4 | Basic Sentence Structure | **Pdf** (5 pages) | | 14 | Wrapping Up: Key Takeaways | Text |
| 5 | Working with Arrays and Lists | Text | | 15 | Working with Forms and Input | **Video** |
| 6 | Introduction to Conditional Statements | **Video** | | 16 | Setting Up Your Workspace | Text |
| 7 | Wrapping Up: Key Takeaways | Text | | 17 | Basic Sentence Structure | Text |
| 8 | Setting Up Your Workspace | Text | | 18 | Working with Arrays and Lists | Text |
| 9 | Basic Sentence Structure | **Pdf** | | 19 | Chapter Review and Practice | Text |
| 10 | Chapter Review and Practice | Text | | 20 | Working with Arrays and Lists | Text |
| | | | | 21 | **Certificate** (not a lesson: a locked row, see the section below) | Certificate |

The Lessons tab shows "Lessons 20" (the number is **changing** data). The bundle `<BUNDLE>` holds 1 course (its detail page was not opened).

### 3. How a lesson is completed (what was seen, and what the owner told me)
| Where | What |
|---|---|
| **Bottom of the player: `Mark Complete & Continue`** (blue, always on screen, enabled from the start, also before any video was watched) | **Told by the owner: this completes the lesson, and the student does NOT have to open the lesson page first.** It acts on the **current** lesson (the highlighted row, whose title is shown above the tabs), then moves on. Position on this screen: x 48 to 1232, y 2640 to 2784 (centre about 640, 2712). **Not tapped.** |
| `...` button next to the tabs > **`Mark as Complete`** | A second way, in the "Options" sheet (the sheet also has `Course description`). In this course there is **no "Marksheet"** entry (the older course had one). **Not tapped.** The sheet is still open (see "State left behind"). |
| `SKIP TO NEXT LESSON` (top panel, shown when the current lesson is not a video/audio) | Not tapped. Not known whether it only moves on or also completes. |
| The lesson pages themselves | **Text page:** Back, title and the text only (a short page). **Pdf page:** Back, title with `Page n of 5`, `Notes`, `Zoom Out`, `Zoom In`; no Download or Share here; nothing new appears on page 5 of 5. **Video:** collapse arrow, centre play/pause, `HD` quality button, seek bar, fullscreen; **no download icon** on this video. None of them has a "complete" control. What happens when a video ends (29 s) was not tested (not played). |

### 4. How progress is shown
Seen now (0 %, nothing started):
- **Dashboard:** section "Enrolled Courses" with the card `<COURSE>`, text `Start` and `20 lessons`. There is **no "Ongoing Courses" section** yet.
- **Courses tab > Enrolled:** the row text is `<COURSE>`, `0/20 lessons`, `Start`. No category chips in this site any more.
- **Player header:** the course title, a progress bar and `View desc="0%"`.
- **Chapter header:** `01 / Putting It All Together / 10 lessons · 0 done`; at 0 % there is no percent badge.
- **Lesson rows:** the title and the type name. The current lesson is highlighted with a play circle.

Seen earlier on the OLD course (started course, same app design): the card moves to **"Ongoing Courses"** with `Resume · Lesson n`, a bar and `n%`; the Courses row shows `k/N lessons` and `n%` with a bar; the chapter header shows `N lessons · k done` plus a **percent badge**; a **completed lesson shows a green check** instead of its type icon. Percents are rounded (1 of 30 = 3 %). These were not seen with this new course yet. The numbers are **changing** text: never assert them as fixed strings.

### 5. What could stop a student from finishing
- **Nothing in the app screens:** no lock icon and no tick in the parts I looked at (top of the list and the end of Chapter 2 by screenshot; the middle rows were not checked by eye), no Quiz (pass mark), no Assignment (submission), and `Mark Complete & Continue` is enabled before anything is watched or read.
- **Not known (would need the web admin or a real try):** content drip or "available on" dates, a "complete in order" or prerequisite setting, a minimum watch time for videos, what happens on the last lesson (does the course finish, is a certificate or message shown), whether completing is blocked when the student is offline or the course is Draft. Please check the course settings in the web admin.
- **Not undoable from the app:** there is no "mark incomplete". A completed course cannot be repeated unless the owner resets the progress in the web admin. The test needs a reset plan.

### 6. What Appium cannot see, and the workaround
| Situation | Not visible | Visible | Workaround |
|---|---|---|---|
| **A Video (or Audio) lesson is the current lesson**, or the mini player is shown | the tabs, the lesson rows, the chapter headers, the lesson title, `Mark Complete & Continue`, the `0%` header | the time label (`View desc="0:00 / 0:29"`, **changing**), `HD`, the tutorial buttons | Tap by position (this doc gives them): `Mark Complete & Continue` at about (640, 2712); play/pause at about (640, 516); collapse at about (75, 231). Use ratios of the screen size, not fixed pixels, so it works on another device. To read the list or the progress, first make a **non-video lesson current**, or leave the player and read the Courses tab / Dashboard. |
| **A non-video lesson is the current lesson** (Text, Pdf...) | the row icons (type, tick, lock) | everything else: `Button ~Mark Complete & Continue`, `~Go to lesson`, `~SKIP TO NEXT LESSON`, `View desc="0%"`, chapter headers `desc="01\nTitle\n10 lessons · 0 done"`, rows `desc="Title\nType"` | Use text, not icons: the chapter header "k done" and the course percent are the completion signals. A lesson-level "done" tick can only be checked by screenshot. |
| Any screen | the unlabeled icons: play/pause, collapse arrow, fullscreen, the `...` tab button, the X that closes the Options sheet | | Position taps. |
| Text and Pdf lesson pages | (nothing important) | the text; for a Pdf each text line is a `View desc`, and the header `Page n of 5` (changing while scrolling) | Good for assertions. |
| First video of a fresh install | | a 3-step tutorial (`Skip`/`Next`/`Done`, text "STEP n OF 3") covers the player | Tap `Done` (or `Skip`) first; a test that clears app data must handle it. |

### Other things seen
- **After a fresh install the video did NOT autoplay** (0:00 / 0:00, then 0:00 / 0:29 after about 10 s); the old APK autoplayed. Seen once.
- **My browsing moved the "current lesson"** from lesson 1 to the Pdf lesson (#4) without completing anything: the course now opens there. The progress is still 0 %.
- The Text and Pdf pages have the type icon on the `Go to lesson` button.
- **State left behind:** the "Options" sheet is open on the player and the video lesson is paused at 0:00. The student is logged in. My Appium session is still attached (one session, no new login).

**Questions for the owner:** (1) Is `yousuf.ezycourse.com` the same site as `ezyyousuf.ezycourse.com`? (2) The completion test should start at lesson 1: may I select lesson 1 again (look only)? (3) What should happen after the last lesson (course complete message, certificate)? (4) Are there drip, order, or video-watch rules in the web admin? (5) How is the progress reset after the test, so it can run again?

## Unified enrollment progress and certificate sync: first look (2026-10-12, view only)
The owner turned **"Unified enrollment progress"** ON in the web admin (the app cannot change it). Plan: when progress goes up in the single course, the same course inside the bundle must show the same value; the certificate must unlock in both places. This look used the TEST student who was **still logged in** (no new login request). **Nothing was completed, skipped, downloaded or shared. Logout was not used. No video autoplayed.** Names are masked: `<COURSE>`, `<BUNDLE>`.

### The course (see also the table above)
20 lessons in 2 chapters of 10: **Text 15, Video 3, Pdf 2**, plus the locked `Certificate` row (21st). If progress is counted by lessons, **1 lesson = 5 %** (1 done = 5 %, 2 = 10 %, 4 = 20 %, 20 = 100 %). That is a guess from the old build (1 of 30 = 3 %, 1 of 19 = 5 %, rounded); it is **not confirmed in this build**.

### "Mark Complete": where it is, per lesson type
The real label is **`Mark Complete & Continue`** (a blue button at the bottom of the player, the screen shown BEFORE entering the lesson). It acts on the **current** lesson (the highlighted row; its title is above the tabs). The owner confirmed it completes the lesson. **Not tapped.**

| Type | Does the lesson PAGE have a complete button? | Where is `Mark Complete & Continue` and how to tap it |
|---|---|---|
| **Text** | **No** (only Back, the title and the text), same as on the older build | Bottom of the player while a Text lesson is current. Appium sees it: `~Mark Complete & Continue` (Button, enabled, clickable, bounds x 48 to 1232, y 2640 to 2784 on the 1280x2856 screen). |
| **Pdf** | **No** (Back, title with `Page n of 5`, `Notes`, `Zoom Out`, `Zoom In`; nothing new on page 5 of 5) | Same button, same place, same locator while a Pdf lesson is current. |
| **Video** | **No** (collapse arrow, centre play/pause, `HD`, seek bar, fullscreen) | Same button, same place. It was enabled before the video was played. **Appium does NOT see it while a Video lesson is current**: tap by position, centre x = 50 % and y = 95 % of the screen (640, 2712 here). |

Other controls I did **not** use (the owner said not to use another way): `SKIP TO NEXT LESSON` (top panel) and `...` > `Mark as Complete` (Options sheet).

**Which lesson would be completed:** the current one, and the current lesson is kept **per entry**: opened from the single course the player resumed at the Pdf lesson I had looked at earlier (Chapter 1, #4); opened from the bundle it resumed at lesson 1 (Text). Seen once. A test must select the lesson it wants (tap its row and come back) and check the title above the tabs before tapping the button.

### Where progress is shown (locators) and the values now
| Place | What it shows | Locator | Now |
|---|---|---|---|
| **Single course**, Courses tab > Enrolled | row text in 3 lines: title, `k/20 lessons`, then `Start` (0 %) or `N%` | `descriptionStartsWith("<COURSE>")` (line 2 and 3 of the text; a ProgressBar appears once progress exists, old build) | `0/20 lessons`, `Start` |
| Single course, Dashboard > Enrolled Courses card | 3 lines in a different order: title, `Start` or `N%`, `20 lessons` | `descriptionStartsWith("<COURSE>")` | `Start`, `20 lessons`; no "Ongoing Courses" section yet |
| Single course, player header | `View desc="<COURSE>"` and `View desc="0%"` | `descriptionMatches("^[0-9]+%$")`: **1 match now**; after a chapter has progress its badge (for example "5%") also matches, so take the upper one (y about 978) | `0%` |
| Single course, chapter headers | `01 / Putting It All Together / 10 lessons · 0 done` and the same for chapter 2; a % badge appears after progress | `descriptionContains("lessons · ")` (2 headers; only the visible one is in the tree) | `0 done` in both |
| **Bundle**, Courses tab > Bundle | row `<BUNDLE>` + `1 Courses`: **no progress on this row** | `descriptionContains(" Courses")` with class ImageView | no progress shown |
| **Bundle detail page** (tap the bundle row) | Back, the title and ONE course card in the same format as the single course | `className("android.widget.ImageView").descriptionContains(" lessons")` | `0/20 lessons`, `Start` |
| Bundle, player opened from the card above | same header and chapter headers as the single course | same locators as above | `0%`, `0 done` |
| Dashboard > Bundled Courses card | `<BUNDLE>` + `1 Courses`: no progress | | none |

**Single course and bundle are EQUAL now: 0 of 20, 0 %.** Background: on the OLD build (before this feature) the same course showed `0/30 lessons, Start` inside the bundle while the single course showed `1/30 lessons, 3 %`. The format with progress (`N%`, the bar, the green tick) was seen only on the old build; I will confirm it in this build after the first completion.

### Certificate
- **Where:** the last row of the lesson list, after lesson 20, in the single course **and** in the course opened from the bundle. Locator: `ui:new UiSelector().descriptionStartsWith("Certificate")` (`View desc="Certificate\nCertificate"`, clickable, enabled). You must scroll to the very end of the list to see it (several big swipes).
- **Not shown on:** the bundle detail page (it has only the course card), the Dashboard, the Options sheet. `Profile > Certificates` says **`No certificates yet`** (`~No certificates yet`).
- **Locked (now):** a lock icon in front of the title and dimmed grey text. **The lock icon is not in Appium's tree**: the locked row has the same attributes (`enabled=true`, `clickable=true`) as a normal lesson row. Tapping the locked row once showed **no message and nothing opened**.
- **Unlocked:** **UPDATE 2026-10-14: seen after the whole course was completed, see "Completion run" below.** (Before that it could not be seen.)
- **What unlocks it: was NOT FOUND in the app before the run; the run showed it unlocks when all 20 lessons are completed (see below).** There is no text on the row or after a tap; `Course description` (opened from the Options sheet) has only generic filler text with no certificate wording; `Profile > Certificates` only shows the empty message. Not guessed. **Asking the owner.**

### What Appium cannot see, and the workaround
| Situation | Not visible | Workaround |
|---|---|---|
| A **Video** lesson is current (or the mini player) | the tabs, lesson rows, chapter headers, the course `0%`, the lesson title and **`Mark Complete & Continue`** | Tap by position (ratios of the screen size). Or make a non-video lesson current first: then everything is visible. To read progress, leave the player and read the Courses tab or the bundle detail card. |
| A Text or Pdf lesson is current | the row icons (type, green tick, **lock**) | Use text: chapter header `k done`, the `%`, the row text. Locked or unlocked cannot be read from the tree (see Certificate). |
| Anything scrolled out of view | the node does not exist (for example the `0%` header after scrolling the list, the Certificate row until the list is scrolled to the end) | Scroll first, then look. The `0%` header needs the page scrolled to the top. |
| Unlabeled controls | play/pause, collapse, the `...` button, the X of a sheet | Position taps. |

### Seen once (not confirmed): the current lesson differs per entry
Single-course entry resumed at the Pdf lesson, bundle entry at lesson 1 (see above). It matters for tests because `Mark Complete & Continue` completes the current lesson of the entry that is open.

### State left behind
The app is on the Home tab; no sheet is open; progress is 0 % in both places. Student still logged in. My Appium server and session are still running (stop them before a test run).

### Questions for the owner (nothing was assumed)
1. Is the bottom button `Mark Complete & Continue` the "Mark Complete" you mean? (The Text and Pdf pages themselves have none.)
2. The current lesson differs per entry (single course: Pdf #4, bundle: lesson 1). Which lessons should SYN-02, SYN-04 and SYN-05 complete (the course has two Pdf lessons, #4 and #9 of Chapter 1; Text and Video lessons are many)? Should they be completed from the single course?
3. **What unlocks the certificate** (all 20 lessons? 100 %? anything else)? I could not find it in the app.
4. The lock icon is not visible to Appium. How should the test tell locked from unlocked? Do you know what the row shows or does when unlocked (for example the text changes, or a certificate screen opens)?
5. In the bundle I found the certificate only as the last row of the lesson list when the course is opened from the bundle. Is that the place you mean?

## Completion run: progress sync and certificate sync (2026-10-14, headed, owner approved)
The owner asked to complete ALL lessons of the single course with the bottom button and to check the same course inside the bundle (progress and certificate). Done on the emulator with its window in front. **0 login requests** (the student was still logged in). Names are masked: `<COURSE>`, `<BUNDLE>`. **The course is now 100 % complete for the test student. This cannot be undone from the app: the owner must reset the progress in the web admin before the run can be repeated.**

### Results of the owner's test cases
| ID | What | Result |
|---|---|---|
| SYN-01 | start: single course and bundle (record) | both `0/20 lessons`, `Start` (0 %) |
| SYN-02 | complete one Pdf (Chapter 1 #4) | single went from 0 % to **5 %** (`1/20`), PASS |
| SYN-03 | bundle equals single after SYN-02 | bundle `1/20`, `5%` = single, PASS |
| SYN-04 | complete one Text (#5) | single `2/20 10%`, bundle `2/20 10%`, equal, PASS |
| SYN-05 | complete one Video (#6) | single `3/20 15%`, bundle `3/20 15%`, equal, PASS |
| SYN-06 | restart the app | both still `3/20 15%`, equal, PASS |
| CRT-01 | start: certificate in single and bundle (record) | **locked in both** (lock icon, dimmed text) |
| CRT-02 | all 20 lessons done: certificate unlocked in the single course | **unlocked**, PASS |
| CRT-03 | same course opened from the bundle | **unlocked**, PASS |
| CRT-04 | restart the app | still unlocked in both, progress still equal, PASS |

### Progress after each of the 20 completions (single course vs the course card in the bundle)
Order and types: #4 Pdf, #5 Text, #6 Video, #7 Text, #8 Text, #9 Pdf, #10 Text, #11 Text, #12 Text, #13 Text, #14 Text, #15 Video, #16 Text, #17 Text, #18 Text, #19 Text, #20 Text, #1 Text, #2 Text, #3 Video (this one finished the course).
**At every step the single course and the bundle showed the same `k/20` and the same percent, and the percent was exactly k x 5** (5, 10, 15 ... 95). Checked after each lesson (20 comparisons) and after two restarts. **At 20/20 both show `20/20 lessons` and the word `Completed` instead of "100%"** (Courses tab row and bundle card); the Dashboard card shows `<COURSE>`, `Completed`, `20 lessons`. The in-player header also reads a percent while the course is not finished (`View desc="85%"` etc.). Chapter header: `10 lessons · k done` with a chapter percent badge (for example `90%` at 9 of 10).

### Certificate
- **Requirement (found by the run, not assumed):** it stayed **locked at 17 of 20 (85 %)** in the single course and unlocked when the **20th lesson** was completed. I did not look at it at 18 and 19, so "all 20 lessons" is the rule that fits; a lower limit between 85 % and 100 % is not excluded.
- **Locked:** a lock icon and dimmed text. **Unlocked:** a round badge icon (check seal) and normal text. In Appium's tree the row is **identical** in both states (`View desc="Certificate\nCertificate"`, clickable, enabled): **the state can only be told from the icon (screenshot) or by tapping.**
- **Tapping the unlocked row:** a dialog `Certificate is generating` (spinner, `View desc="Certificate is generating"`), then after about 5 s a PDF viewer: header `<COURSE>` + `Page 1 of 1`, buttons `Zoom Out`, `Zoom In`, **`Download`, `Share` (not tapped)**, and the certificate text ("CERTIFICATE OF COMPLETION", the student name, the course name, an issue date, a certificate id). Tapping the **locked** row does nothing (checked before).
- **Where it also appears:** `Profile > Certificates` now lists it (a card with the course name, "Enrolled ..." and "Completed ... min ago" lines, a `View` button and one unlabeled button; none tapped). Before the run it said `No certificates yet`.
- Opened from the bundle the Certificate row is at the end of the lesson list too, and was unlocked. **I did not open the certificate from the bundle** (it may create another certificate record); only the single-course tap generated one.

### What the app does when you complete a lesson (new facts)
- `Mark Complete & Continue` completes the **current** lesson, shows **confetti and a green `Lesson complete` message**, and **opens the next lesson** (a Text or Pdf lesson opens its page; a Video opens inline). The page has no button: go `Back` to the player.
- **On the last row of the list** the button is labelled just **`Mark Complete`** (no "& Continue"), and the top panel has no `SKIP TO NEXT LESSON`.
- **A completed lesson** shows `Completed` (green check) and `Next Lesson` in the bottom bar instead of `Mark Complete & Continue` (`Button desc="Next Lesson →"`). After the very last lesson only `Completed` shows. Completed rows get a **green check** icon.
- **Where the course resumes** is not the next lesson: it resumes at the last **completed** lesson (or the last Text/Pdf page that was opened), **separately for the single-course entry and the bundle entry** (single: the last one worked on; bundle: lesson 1 all the time). A test must read the current lesson title, and must tap the next row or `Next Lesson` itself. Seen many times.
- Videos did **not** autoplay on this build (all three stayed at `0:00`).
- Locators used: `~Mark Complete & Continue` (also `~Mark Complete` on the last lesson), `~Next Lesson →`, `~Go to lesson`, rows `~<title>\n<type>` (duplicates exist: use the type and the order), course percent `View desc="<n>%"` (`descriptionMatches("^[0-9]+%$")`, upper one), chapter header `descriptionContains("lessons · ")`, courses rows `descriptionContains(" lessons")`, the Certificate row `descriptionStartsWith("Certificate")` (scroll to the end of the list first: about 14 big swipes in the lower half).

### Appium blind spots met again, and the workaround that worked
| Situation | Not visible | Workaround |
|---|---|---|
| A Video lesson is current (or the mini player is shown) | the list, the title, the percent and the bottom bar (`Mark Complete & Continue` or `Next Lesson`) | The three videos are identified by their length (`0:29`, `0:31`, `0:13` in the time label). The bottom button is tapped by position (centre x 50 %, y 95 %; `Next Lesson` is the right part, x about 62 %). Before the first tap on each video a screenshot confirmed the label. |
| The mini player is docked (after Back from a video) | the whole page | Close it with its X (about 1184, 2455) before reading anything. |
| Lock or tick icons | the icons | Counts and the `Completed` text; the certificate only by icon or by tapping. |

### Open points for the owner
1. **Reset:** the progress must be reset in the web admin before this run can be repeated (the course is complete).
2. The automated spec for SYN and CRT was **not written**: this run was done with a driving script, one lesson at a time with checks. Tell me if you want the spec written (it cannot be run until the reset).
3. A certificate record was generated by the tap (Profile > Certificates shows it). Please note it for the reset.

## Events (2026-10-15, view only): the student's enrolled event
The owner said the test student is enrolled in one event and that Event tests may come later. I looked for it with the test student (still logged in, 0 login requests). Nothing was tapped except navigation (arrows, view switch).

**Where I looked and what I saw (event and community names are masked as `<EVENT>` and `<NAME>`):**

| Place | Result |
|---|---|
| Dashboard (Home) | no events section; the quick-tile row shows only Edit Profile, Notifications, Announcements |
| Notifications | `No notifications found` |
| Community tab | `No Communities Found` (so no community events) |
| Profile > Appointments & Events, **October 2026** | calendar with today selected: `No events or appointments for this day`; list view: `No appointments or events available`; no event marker on any date |
| Same screen, **November 2026** | calendar: no marker on any date, `No events or appointments for this day` for the selected day |
| Other months, past or future | not needed: the owner gave the date (16 October). **On the first look there was NO red dot on any date; after the owner's hint and a reopen of the screen the dot was under 16** (the event was probably added after the app had loaded). |

**The Appointments & Events screen** (Profile menu row `~Appointments & Events`; it can also be a Dashboard quick tile when enabled in Quick Access Settings):
- `~Back` (top left), title `View desc="Appointments & Events"`, and an **unlabeled round button at the top right** (about x 1190, y 240) that switches between the two views.
- **Calendar view:** previous and next month arrows (unlabeled buttons at the left and right of the month name), the month name `View desc="<Month> <Year>"` (changing), a view switch `View desc="2 weeks"`, one cell per day `View desc="Thursday, October 15, 2026"` (the full date is the id, so it changes every day; today is highlighted), and under the grid the list of the selected day. Empty text for a day: `No events or appointments for this day`.
- **List view:** the same arrows and month name; empty text for the month: `No appointments or events available`.
- In calendar view the "no events" text is about the selected DAY only, so it says nothing about the rest of the month. **Owner's rule: a date with a red dot always has an event or an appointment.** The red dot is drawn on screen only and is NOT in Appium's tree, so look for it on a screenshot. The owner also said the student's event is on **16 October 2026** (my first screenshots of October and November showed no red dot; the event may have been added after the app loaded, so reopen the screen).
- The elements of an event card, the pop-up and the details page are described under "The event found" below. The OLD test student's notifications showed that events can be bought (`You got ... points by purchasing event`) and that reminders arrive as notifications (`Reminder: <EVENT> @ <date and time (time zone)>`, the same one several times).
- Not tapped: the `2 weeks` switch (its other choices are unknown).

### The event found (16 October 2026; masked: `<EVENT>`, `<HOST>`, `<place>`)
Opening and navigation only; **nothing was cancelled, registered, or turned on**. Steps and elements:

| Step | What you see | Locator and notes |
|---|---|---|
| 1. Profile > Appointments & Events (calendar view) | A **red dot under the date 16** (not in Appium's tree, so only a screenshot shows it). Today (15) is an outlined circle. | Day cells `~Friday, October 16, 2026` (the full date is the id, **changing**). |
| 2. Tap the date 16 | The date becomes a filled circle and the list under the calendar shows **one event card**. | Card: `View desc="12:00 PM - 02:00 PM\n<EVENT>"` (clickable): time range, then the title. Find it with `descriptionStartsWith("12:00 PM")` (time is the stable part; the title is event data). |
| 3. Tap the card | A pop-up over the screen (a full-screen `View desc="Dismiss"` behind it; a round X in the picture also closes it). | One text node `View desc="<EVENT>\nDate: \nFriday, October 16, 2026\nTime: \n12:00 PM - 02:00 PM\nEvent Start: \n October 16, 2026 12:00 PM"`, `Button desc="View"` and `Button desc="Cancel Registration"` (red). **`Cancel Registration` showing means the student is registered. NOT tapped.** |
| 4. Tap `View` | The **Event Details** page. | Title `View desc="Event Details"`. **The back arrow has NO label** (`Button` at x 24 to 144, y 180 to 300; `~Back` does not work here: use the phone Back key or a tap by position). Then: picture, `View desc="<EVENT>"`, green status **`View desc="Registered"`**, `Button desc="Cancel Registration"` (NOT tapped), `HOSTED BY` with the host's name (a person: `<HOST>`), `SCHEDULE`: `Event Time:` + `Friday, October 16 2026`, `Local Event Time` + `Friday, October 16, 2026`, `Single Session`, and **two round icon buttons with no label** (a bell and a calendar icon, probably reminder and add-to-calendar; NOT tapped). |
| 5. Scroll down | `Local Event Duration:` + `12:00 PM - 02:00 PM`; `EVENT DETAILS`: `Event Type:` + `In-person`, `Location: <place>, Bangladesh`; `ABOUT EVENT:` with three paragraphs of text. | The page ends there. |

Facts for later Event tests:
- This event is **In-person** and a **Single Session**: no Join button or meeting link was seen (an online event may have one: unknown).
- **Registered state** = the green `Registered` text AND the `Cancel Registration` button (both on the details page; the button also on the pop-up).
- **Cancelling is a data change** and may not be easy to undo (can the student register again? unknown): a test needs a start state, a stop check and a reset, as for the course.
- The event date is fixed (16 October 2026), so any test on it is stale after that day; the calendar also marks "today" by date, so use relative dates in tests.
- Not seen and not tapped: the bell and calendar icons, the `2 weeks` switch choices, the list view with an event, paid or online events, other months.
- Appium: the red dot is invisible (use the card as the proof); the details-page back arrow is unlabeled; the pop-up hides the calendar underneath (close it first).

(The owner's rule is saved in my notes: a date with a red dot always has an event or an appointment.)

## 1. Login screen
**How to get there:** first screen of a fresh install or after app data is cleared. (A saved session goes straight to the Dashboard.)

| Element | Best locator | Verified | Notes |
|---|---|---|---|
| Version label | `~v5.0.3` | page source | Changing (app version). Do not assert exactly. |
| Heading | `~Welcome back` | page source | Stable |
| Sub-heading | `~Login to your account` | page source | Stable |
| Email field | `ui:new UiSelector().className("android.widget.EditText").instance(0)` | yes (existing tests) | No id/desc. Only `hint="EMAIL\nyou@example.com"` (hint is NOT reachable with `text()`). `instance(0)` is the only non-XPath way; XPath `//android.widget.EditText[@hint="EMAIL\nyou@example.com"]` also works in principle (not run here). |
| Password field | `ui:new UiSelector().descriptionStartsWith("PASSWORD").childSelector(new UiSelector().className("android.widget.EditText"))` | yes (existing tests) | `~PASSWORD` is only a wrapper. Its desc changes on error. Field has `password=true`. |
| Show/hide password eye | none | not reachable by id | Clickable `View` with no desc, inside the PASSWORD wrapper, at the right end of the field. Use `fromParent`/coordinates. |
| Remember me | `~Remember me` | page source | A checkbox-like View (not ticked by default). Not ticked during this exploration. |
| Login button | `~Login` | yes | Stable. Hides briefly while logging in. |
| Terms of Use / Privacy Policy | `~Terms of Use`, `~Privacy Policy` | page source | Buttons. Not opened. |

**What the user can do:** type email and password, show/hide password, tick Remember me, log in, open Terms / Privacy.
**Hidden from Appium:** the eye icon (no label); the validation messages (they are appended to the email `hint` and to the PASSWORD description, see `legacy-appium/CLAUDE.md`).
**Typing needs the Flutter workaround** (`BaseScreen.typeInto`): tap the lower part of the field, then `mobile: type`, then read back.
**Stable text:** Welcome back, Login to your account, Login, Remember me. **Changing:** the version label.
**Login result:** a successful login lands on the Dashboard (Home tab) after a few seconds. Used 1 login request for this whole exploration.

## 2. Dashboard (Home tab)
**How to get there:** after login, or tap the Home tab.

| Element | Best locator | Verified (matches) | Notes |
|---|---|---|---|
| Greeting + name | `ui:new UiSelector().descriptionStartsWith("Good ")` | yes (1) | **Changing**: "Good morning/afternoon/evening," + `<student name>`. Not clickable. |
| Profile picture (left) | none | no | Not exposed to Appium at all. |
| Bell icon (top right) | none (a clickable `View` with no desc, about 114x114 at the right) | no id | Opens **Notifications**. Tap by coordinates (about 82 % of width, 8 % of height). |
| Chat icon (top right) | none (same, just right of the bell) | no id | Opens **Chats**. |
| Red dot on the bell | none | not exposed | Visible in the screenshot only. Stayed after viewing Notifications (seen once, see "To re-check"). |
| Banner | `~Welcome to EzyCourse`, `~Continue your learning journey` | yes (1 each) | Stable |
| Quick actions (swipe sideways) | `~Edit Profile`, `~Notifications`, `~Announcements` | yes (1 each) | Stable. "Announcements" is cut off at the right edge (partly off screen). |
| Section headings | `~Ongoing Courses`, `~Enrolled Courses`, `~Bundled Courses` | yes (1 each) | Stable. Each section is a View that contains its own "View all" button. |
| "View all" | `~View all` matches **3**, so scope it: `ui:new UiSelector().description("Ongoing Courses").childSelector(new UiSelector().description("View all"))` (same with Enrolled / Bundled) | yes (1 each) | |
| Ongoing course card | `ui:new UiSelector().descriptionContains("Resume")` | yes (1) | desc = "`<course title>`\nResume · Lesson `<n>`\n`<n>`%". **Changing:** lesson number, percent. |
| Enrolled course cards | `ui:new UiSelector().descriptionContains("<course title>")` (also matches the Ongoing card, so scope or take the second) | | desc = "`<title>`\n`<n>`% or Start\n`<n>` lessons". Cards scroll sideways; the 3rd card is mostly off screen. |
| Progress bar | `ui:new UiSelector().description("Ongoing Courses").childSelector(new UiSelector().className("android.widget.ProgressBar"))` | yes (1 per section) | desc/text = the percent number ("3" / "3.0"). **Changing.** 2 bars on the page in total. |
| Bundled course card | `ui:new UiSelector().descriptionContains("Courses")` is too broad; use the title | | desc = "`<bundle title>`\n`<n>` Courses". Mostly below the fold. |
| Bottom menu | see section 3 | | |

**What the user can do:** open notifications / chat / edit profile / announcements, open a course (Resume or Start), "View all" of each section, scroll, switch tab.
**Hidden from Appium:** avatar, bell/chat icon labels, the red dot, the "NO IMAGE AVAILABLE" placeholder images, anything below the fold until you scroll.
**Stable text:** all headings and quick-action names. **Changing:** greeting, name, course titles, lesson numbers, percentages, lesson counts, "Resume" vs "Start".

### 2a. Screens one tap away from the Dashboard (first level only, view only)
| Screen | How to get there | Elements (best locator) | Notes |
|---|---|---|---|
| **Notifications** | `~Notifications` quick action, or the bell | `~Back`, `~Notifications` (title), `~Mark all as read` (NOT tapped), list under the `~Earlier` group | Each row: desc = "`<other user>` `<message>`\n`<time ago>`" (changing). Rows are `ImageView` or `View`. List loads more when scrolled. Types seen: chat message in a group, post in a channel, points earned, badge unlocked, event reminder. |
| **Announcements** | `~Announcements` quick action | `~Back`, `~Announcements` (title), cards | Each card: desc = "`<letter>`\n`<title>`\n`<message>`\n`<n>` Days ago" (changing). Read only. |
| **Edit Profile** | `~Edit Profile` quick action | `~Back`, `~Edit Profile`, `~Change Cover` (NOT tapped), `~PERSONAL INFORMATION`, `~ABOUT ME`, `~SOCIAL LINKS`, `~Save Changes` (NOT tapped) | Fields (no id, find by hint): First Name, Last Name, country code (desc "flag +1"), Phone Number, About me, Facebook, LinkedIn, YouTube, Website link. Best locator is XPath `//android.widget.EditText[@hint="Phone Number"]` (verified, 1 match; `text("Phone Number")` finds nothing). First/Last Name show their current value as `text`. The profile photo is a clickable `ImageView` with no desc. |
| **Chats** | the chat icon | `~Back`, `~Chats`, `~Search person`, `~Search`, tabs `Personal Chat\nTab 1 of 2` (selected) and `Group chats\nTab 2 of 2`, list rows | A row shows the contact name, "`<n>` days ago" and the last message. Conversations were NOT opened (opening could mark messages as read). One personal chat is listed. |

## 3. Bottom menu (5 tabs)
| Tab | Best locator | Verified | Selected state |
|---|---|---|---|
| Home | `ui:new UiSelector().descriptionStartsWith("Home")` | yes (1) | `selected=true` on the active tab. This is a reliable "where am I" check. |
| Community | `ui:new UiSelector().descriptionStartsWith("Community")` | yes (1) | same |
| Coaching | `ui:new UiSelector().descriptionStartsWith("Coaching")` | yes (1) | same |
| Courses | `ui:new UiSelector().descriptionStartsWith("Courses")` | yes (1) | same (this tab is a bit taller than the others) |
| Profile | `ui:new UiSelector().descriptionStartsWith("Profile")` | yes (1) | same |

The real accessibility id is "Home\nHome" (the label twice, with a line break), so `~Home` does not match. Use `descriptionStartsWith`.
The bar stays visible on all five tab screens. It is not shown on Notifications, Announcements, Edit Profile or Chats (these have a Back button instead).

### First look at each tab (details come in later rounds)
| Tab | What it shows | Key elements |
|---|---|---|
| **Community** | "Communities - Connect, share posts and grow together" | search box (`hint="Search"`), community rows: desc = "`<name>`\n`<n>` members\n`<n>` Posts" (counts change) |
| **Coaching** | "Coaching Programs - Join coaching sessions and track your progress" | search box, rows: desc = "`<name>`\n`<n>` member(s)" |
| **Courses** | "My Courses" with tabs `Enrolled Courses\nTab 1 of 2` (selected) and `Bundle courses\nTab 2 of 2`; category chips (`All`, and four more, scroll sideways); search box | course rows: desc = "`<title>`\n`<done>/<total>` lessons\n`<percent>%` or Start". Detailed in round 2. |
| **Profile** | `<student name>`, `<student email>`, points ("`<n>` pts", changing), then a menu | menu rows: `~Edit Profile`, `~Change Email`, `~Change Password`, `~Certificates`, `~Downloads`, `~Watch Later`, `~Video Library`, and more below (not scrolled yet). None opened yet. |

On the Community, Coaching, Courses and Profile tabs the whole page is one big clickable `View` (the page header, 1280 x 2586). Taps by coordinates still reach the items inside.

## 4. Courses tab (round 2)
**How to get there:** bottom menu > Courses (`descriptionStartsWith("Courses")`).

| Element | Best locator | Verified | Notes |
|---|---|---|---|
| Heading | `~My Courses\nContinue learning and explore new courses` (one id with a line break; use `descriptionStartsWith("My Courses")`) | page source | Stable. This View is also clickable and covers the whole page. |
| Sub-tabs | `descriptionStartsWith("Enrolled Courses")`, `descriptionStartsWith("Bundle courses")` | yes (clicked) | desc = "`<name>`\nTab 1 of 2" / "Tab 2 of 2". The active one has `selected=true`. The exact id with the line break also works as `~Bundle courses\nTab 2 of 2`. |
| Category chips (scroll sideways) | `~All`, `~test44`, `~Pricing`, `~D27`, `~Checkout Check` (more off screen) | page source | Buttons. `All` is selected by default. Chip names are site data (changing). Not tapped. |
| Search box | `//android.widget.EditText[@hint="Search"]` | page source | Same hint-only problem as Edit Profile. Not typed in. |
| Course row | `descriptionStartsWith("<course title>")` | yes | desc = "`<title>`\n`<done>`/`<total>` lessons\n`<percent>`%" (started) or "...\nStart" (not started). Rows are `ImageView` (no progress) or `View` (with progress bar). **Changing:** done count, percent. Stable: the title. |
| Progress bar | `ProgressBar` inside the row | yes | desc = percent number. Only started courses have one. |
| Row arrow, picture | none | no | Not exposed. Whole row is the tap target. |

**What the user can do:** switch Enrolled / Bundle, filter by category, search, open a course.
**List seen:** 3 enrolled courses (nothing to scroll). Bundle tab: 1 bundle row, desc = "`<bundle title>`\n2 Courses".
**Hidden from Appium:** thumbnails (the "NO IMAGE AVAILABLE" placeholder is only visible on screen), the row arrow, the progress bar when 0 %.

### 4a. Bundle detail
**How to get there:** Courses > Bundle courses > tap the bundle row.
Elements: `~Back`, title (desc = bundle title), then course rows with the same desc format ("`<title>`\n`<done>`/`<total>` lessons\nStart").
Seen: the bundle holds 2 courses. One of them is the QA course and showed **"0/30 lessons, Start"** here, but **"1/30 lessons, 3 %"** in the Enrolled list (see oddity 5).

## 5. Opening a course (round 2)
**How to get there:** Courses > Enrolled Courses > tap a course row. **There is no separate course detail page**: the tap opens the **lesson player** at once, on the lesson the learner reached (for the QA course: "Video lesson").
- **The video starts playing by itself.** It played about 33 s before I paused it (the progress was not changed as far as I could see: still 1 done, 5 %).
- The very first time, a **3-step tutorial** covers the player: step 1 "Swipe up to go fullscreen", step 2 "Double-tap to seek" (left/right 10 s), step 3 "Swipe down to minimise". Buttons: `~Skip` / `~Next` (step 1), `~Back` / `~Next` (step 2), `~Back` / `~Done` (step 3). Each step's desc starts with "STEP n OF 3". The tutorial is probably shown once per install (not verified).

### 5a. Lesson player: what Appium can and cannot see (important)
| Part | Reachable by Appium? | Notes |
|---|---|---|
| Video area | partly | Whole screen is one `ImageView` whose desc is the **video watermark** (learner name + email + id). **Masked here, never copy it.** Inside: unlabeled clickable Views for: collapse (top left, about 75,231), download (top right area, about 1090,231), settings (about 1211,231), play/pause (centre, about 640,516), fullscreen (bottom right, about 1199,741). Time is readable: `View desc="0:33 / 1:28:46"` (**changing**). |
| Lesson title, tabs (Lessons 31 / About / Resources / Comments 10+ / more), chapter rows, lesson rows, **"Mark Complete & Continue"** | **NO, but only while a VIDEO or AUDIO lesson is the current lesson** (and in the docked mini player) | Visible on screen, but **not in Appium's tree** while the video/audio player is on screen: `~About`, `descriptionStartsWith("Lessons")`, `("Comments")`, `("Resources")` all return 0 and the whole tree has only about 10 nodes (re-checked in round 4). Workaround: coordinates (this doc lists them), screenshots, or make a non-media lesson current first (see 7a: then the tabs and lesson rows ARE visible). |

### 5b. Lesson list (read from screenshots, because Appium cannot see it)
Tab **Lessons 31** (the number = 30 lessons + 1 Certificate). Chapters are collapsible (chevron on the right).

| Chapter | Header text | Lessons seen |
|---|---|---|
| Chapter 1 | "01 Chapter 1 - 19 lessons - 1 done" with a "5%" badge | Just video (Video), **Video lesson** (Video, current, highlighted, has an info icon), Text lesson (Text), PDF lesson (Pdf), Audio lesson (Audio), Quiz lesson (Quiz), PPT lesson (Ppt), ... Quiz lesson 2 (Quiz) |
| Chapter 2 | "02 Chapter 2 - 11 lessons - 0 done" | Live lesson (Live), Understanding Object-Oriented Concepts (Text), then many Live lessons (names are test junk: "wa etewtew", "rt6uyrt", "se ryr"...) |
| End | | **Certificate** (Certificate), shown with a **lock** icon (locked until the course is finished) |
Each row = an icon for the type + the title + the type name ("Video", "Text", "Pdf"...). The completed lesson shows a different icon. Lesson types seen so far: Video, Text, Pdf, Audio, Quiz, Ppt, Live, Certificate (Assignment not seen yet in the part I scrolled).

### 5c. Leaving the player
System **Back** does not return to the list directly: it **docks the video as a mini player** at the bottom of the Courses screen (thumbnail, title "Video lesson", play button, X). **While the mini player is shown, Appium sees the whole app as one empty `View`.** Closing it with the X (about 1184,2455) brings the normal tree back. (Seen twice: player and mini player.)

## 6. Lesson types (round 3)
**How to get there:** open the course (section 5), then tap a row in the lesson list. While a video/audio lesson is current the rows are NOT in Appium's tree (section 5a), so tap by coordinates or scroll first and read a screenshot. While a non-media lesson is current (for example the Assignment, which is what the course resumes on after round 3) the rows ARE visible as `View desc="<title>\n<type>"` (section 7a) and can be tapped by id. Rows are about 128 px tall in a list that starts at about y=1390 in the player (a scroll fling moves it a lot; use small swipes inside the lower half only).
**Rows seen in Chapter 1, in order:** Just video (Video), Video lesson (Video), Text lesson (Text), PDF lesson (Pdf), Audio lesson (Audio), Quiz lesson (Quiz), PPT lesson (Ppt), Survey lesson (Survey, **already completed**: green check icon), Assignment (Assignment), then more (a "Multiple" type, another Quiz, a PPT, "Youtube video" (Video), Quiz lesson 2). Chapter 2 is mostly Live lessons plus one Text. Types seen overall: Video, Text, Pdf, Audio, Quiz, Ppt, Survey, Assignment, Multiple, Live, Certificate.
**The player changes with the lesson type.** For every type except video and audio the top area becomes a dark panel with a **Back arrow**, a **"Go to lesson"** button and **"SKIP TO NEXT LESSON"** (NOT tapped: it may mark the lesson done). The tabs shrink: video = Lessons / About / Resources / Comments / more; audio = Lessons / Resources / Notes; text, quiz = Lessons (+ Resources) / Notes. Tapping a row in the list opened the lesson page at once (no extra "Go to lesson" tap needed).

| Lesson | What the page is | Elements Appium can see (best locator) | Hidden / notes |
|---|---|---|---|
| **Video** (section 5a) | Player at the top. **Autoplays** every time (seen 2x). Starts from 0:00, not from where it was paused. | time label `View desc="0:08 / 1:28:46"` (changing). Watermark ImageView (masked). | Play/pause (centre, about 640,516), collapse, download, settings, fullscreen: unlabeled Views, tap by coordinates. |
| **Text** | Own full screen: `~Back`, title `~Text lesson`, a scrolling article. | Headings and paragraphs as `View desc="..."` (the whole text is readable), table cells (`Column 1`...), embedded **web views** (a YouTube player and an MP4 player) whose inner controls show up as native nodes (`Button desc="Play video"`, `ToggleButton text="Play, 34.mp4"`, `SeekBar`...). | **No "Mark Complete" button on this page.** A content `Button desc="Button"` at the bottom is part of the lesson text, not an app control. Images have no desc. Embedded videos not played. |
| **PDF** | Own viewer: `~Back`, title (file name, here a 200 MB test PDF), `~Notes`, `~Download` (NOT tapped), `~Share` (NOT tapped). | `View desc="Downloading... 7%"` and a `ProgressBar` (changing). | The PDF is **downloaded first**: about 1 % per 10 s on this emulator, so a 200 MB file takes about 15 minutes before it can be seen. I did not wait. The bar `desc` ("8") and the text ("7%") differ by one. |
| **Audio** | Player at the top, **autoplays** (0:03 of 3:03). | times `View desc="0:32"` and `desc="3:03"` (changing). | Unlabeled Views: collapse, download, speed (speedometer icon), back 10 s (about 463,573), play/pause (640,573), forward 10 s (about 817,573), seek bar. Tabs: Lessons / Resources / Notes. |
| **Quiz (start page)** | Own screen with a **web view** ("... Watch" page). It shows "Initializing..." for about 10 s, then the start page. | `TextView text="Only your last score counts in retake"`, `text="Leaderboard"`, **`text="Start"`** (NOT tapped: starts the quiz timer), `text="0/0Questions"`, `-Correct`, `-Skipped`, `-Incorrect`, `- %`, `Button text="Complete & View answers"` and `Button text="Complete & Continue"` (both **DISABLED**), `text="Hide Bar"`, `Button desc="Report a bug"`. | Inside a web view the texts are `text=`, not `desc=`: use `textContains` / `text()`. The "Start" label is not a Button node. "0/0 Questions" may mean the quiz has no questions or they load after Start (not verified). |
| **Assignment** | Own screen: `~Back`, title `~Assignment`. | one clickable block `View desc="Attachment\n<file name>\nSubmit Assignment"`; `Button desc="Download"` (task file, NOT tapped), `EditText hint="Write something"` (answer box, not typed in), `Button desc="Upload your assignment file"` (not tapped), `Button desc="Reset"`, `Button desc="Submit"` (**NOT tapped**). | The answer box has only a hint (use XPath `@hint`). The attachment is an `.opus` audio test file. |

**Not opened (not in your list):** PPT, Survey (already completed), Multiple, Live, Certificate (locked), the second Quiz.
**Checked afterwards:** the course still shows "1/30 lessons, 3 %" (nothing was marked complete). The Dashboard "Ongoing" card was not re-checked.

## 7. Player tabs, menus and download buttons (round 4)
View only: nothing typed, posted, selected or downloaded.

### 7a. When can Appium see the player tabs and lesson rows?
| Current lesson | Tabs and lesson rows in Appium's tree? |
|---|---|
| **Non-media** (Assignment, Text, Quiz...) | **Yes.** Tabs: `ui:new UiSelector().descriptionStartsWith("Lessons")` (desc "Lessons\n31", the count is **changing**), `~About`, `~Resources`, `~Notes`. Rows: `View desc="<title>\n<type>"`, for example `~Quiz lesson\nQuiz`, `~Assignment\nAssignment`. Buttons `~Go to lesson`, `~SKIP TO NEXT LESSON` (NOT tapped), `~Back`. The lesson title is `View desc="<title>"`. |
| **Video or audio** | **No** (see 5a). Tap by coordinates (below). |
| Docked mini player | **No** (the whole app is one empty `View`). Close it first. |
Opening the course resumes on the last lesson tapped. After round 3 that was the Assignment, so the course now opens in the "non-media" mode.
Extra lesson types seen in the visible list: **Downloads** (type "Download"), **Embed iframe**, **Embed HTML**, **Embed internal page** (type "Embedded"), **Scorm** (type "SCORM/HTML"), **Multiple lesson** (type "Multiple"). Not opened.

### 7b. The tabs
| Tab | Content | Locators / notes |
|---|---|---|
| **Lessons** | Chapter headers and lesson rows (see section 5b and 6). | `~Lessons\n31` |
| **About** | Course title, the course percent (`View desc="3%"`, **changing**) and the course description text (a long story text, stable). | Only in some modes. Title: `View desc="<course title>"`. |
| **Resources** | A list of downloadable files. Seen: one file named "untitled folder.zip" with an **unlabeled clickable icon** on the right (not tapped, probably a download). | The file name is `View desc="<file name>"`. The icon has no id: tap by coordinates, or by position next to the name. |
| **Comments** (video mode only, "Comments 10+") | Threaded comments: author, "3 hours ago" (**changing**), text, **Like** and **Reply** under each, a `Write a comment…` box with a **+** button at the bottom. Not reachable by Appium (video mode). Not typed in. | Comment authors and texts are masked here. |
| **Notes** | `EditText hint="Add a note…"` (not typed in), empty state `~No notes yet` and the stable text `Capture thoughts and reminders for this lesson. Notes are private to you.` | Note box: XPath `//android.widget.EditText[@hint="Add a note…"]`. |
| **More (...)** | A round button right of the tabs opens an **"Options"** sheet: `~Marksheet`, `~Course description` (NOT chosen) and an X button (unlabeled) to close. The sheet is a clickable scrim `~Scrim` that also closes it. | Closed with the X at about (1160, 2352). |

Tab positions in the VIDEO player (page scrolled to the top, with the course header showing): the tab row is at about y=1256; Lessons x=110, About x=378, Resources x=593, Comments x=858, "more" button x=1193. The row moves up or down when the layout changes (a first tap at y=1131 missed). Read a screenshot before tapping.

### 7c. Settings and speed menus (opened, nothing selected)
| Player | How to open | What is listed |
|---|---|---|
| **Video** | tap the gear at the top right (about 1211, 231) | A bottom sheet with `~Quality\nAuto (240p)` and `~Playback speed\nNormal` (the second line is the current value, **changing**). The sheet **is** visible to Appium (clickable `View`s) although the tabs are not. **Inside Quality** (opened in round 5, nothing chosen): `~Auto`, `~240p` (only these two). **Inside Playback speed:** `~0.25x`, `~0.5x`, `~0.75x`, `~Normal`, `~1.25x`, `~1.5x`, `~2x`. Each option is a clickable `View` (tapping one selects it at once, so it was NOT tapped). The sheet's back arrow is an unlabeled View at the left edge just above the options (about 69,2391 for Quality, 69,1656 for Playback speed). Close the whole sheet: tap outside it (about 640,1900); the video stays paused and the values stay unchanged. |
| **Audio** | the speedometer icon at the top right | Not opened in this round (only the icon was seen). |

### 7d. Download buttons: only whether one is visible (none tapped)
| Lesson / place | Download button visible? | Where |
|---|---|---|
| Video | **Yes** | download arrow in the player header (unlabeled, about 1090, 231) |
| Audio | **Yes** | download arrow in the player header (unlabeled) |
| Text | **No** | the page has only Back and the title |
| PDF | **Yes** | `~Download` in the page header (with `~Share` and `~Notes`) |
| Quiz (start page) | **No** | only Report a bug, Hide Bar, Start, Leaderboard |
| Assignment | **Yes (different purpose)** | `~Download` for the **task file** (the attachment), not the learner's work |
| Resources tab | **Yes** (probably) | unlabeled icon beside each file |
Compare with each lesson's download permission in the web admin (owner request).

### 7e. Video position after leaving (re-checked)
Two fresh cycles (plus the sighting in round 3):

| Cycle | Paused at | After leaving the player, closing the mini player and re-opening the course |
|---|---|---|
| 1 | 0:13 | starts again at about 0:03 and **autoplays** |
| 2 | 0:25 | starts again at about 0:04 and **autoplays** |
Caveat: I left through the mini player's X (which closes it). Leaving some other way (for example keeping the mini player) was not tested.

## 8. Profile tab (round 5)
**How to get there:** bottom menu > Profile (`descriptionStartsWith("Profile")`). View only: nothing typed, saved, toggled, downloaded or logged out.

**Top of the page:** title `~Profile`, `~Manage your account and preferences`, the avatar (not exposed), the learner name `View desc="<student name>"`, the email `View desc="<student email>"`, points `View desc="394 pts"` (**changing**; use `descriptionContains("pts")`). Name, email and points are the learner's own data: never assert on them literally.

**Menu rows** (each is a clickable `View desc="<name>"`, found by `~<name>`; all verified by tapping). The list scrolls (about 17 rows, only the visible ones are in the tree) and **returns to a slightly different scroll position after Back**, so scroll and re-find each time:

| Row | Opens | What is there | Locators and notes |
|---|---|---|---|
| **Edit Profile** | the form from section 2a | first/last name, phone, about me, social links, `~Save Changes` (not tapped) | same screen as the Dashboard quick action |
| **Change Email** | form | text "Update the email associated with your account. We'll send a verification code to confirm the change.", label `~NEW EMAIL ADDRESS`, `EditText hint="Enter your new email"`, `Button ~Send Code` (**NOT tapped: it sends a verification code**), `Button ~Reset` | the field has only a hint (XPath `@hint`) |
| **Change Password** | form | `~Update your account password`, three fields with hints "Enter current password", "Enter new password", "Confirm new password" (all `password=true`), an unlabeled eye `Button` beside each, `Button ~Change Password` (NOT tapped), `Button ~Reset` | **`~Change Password` matches 2 elements** (the screen title `View` and the `Button`): use `className("android.widget.Button").description("Change Password")`. |
| **Certificates** | list | empty state `~No certificates yet` | stable text |
| **Downloads** | list | `~No downloads yet`, `~Downloaded videos will appear here` | confirms downloads are stored inside the app |
| **Watch Later** | list | `EditText hint="Search video tracks"`, a filter `~All`, empty state `~No video found` | |
| **Video Library** | "Video Gallery" | one collection row `ImageView desc="<name>\n<description>\n<n> video"` | row text is site data (changing) |
| **Audio Library** | list | one row `desc="<name>\n<description>\n<n> audios"` | |
| **Blogs** | list | `EditText hint="Search blogs..."`, category chips (`~All`, ...), blog cards `View desc="<category>\n<n> min read\n<title>\n<excerpt>\n<authors>\n<n> days ago"` | **Back button has NO label** here |
| **Announcements** | list | same as section 2a | |
| **Appointments & Events** | calendar | `~October 2026` (month, **changing**), `~2 weeks` (view switch), unlabeled prev/next arrows and a top-right button, day cells `View desc="Monday, September 28, 2026"` (full date in the id, changing) | |
| **Physical Products** | grid | `EditText hint="Search"`, product cards `desc="<name>\n<short text>"` | **Back button has NO label** here |
| **Digital Products** | grid | same | |
| **Blocked Users** | list | empty state `~No blocked users` | |
| **Theme** | choice list | `~System Default\nFollow device appearance`, `~Light\nLight mode with bright surfaces`, `~Dark\nDark mode with low-light friendly colors`. Tapping one applies it at once: NOT tapped. | |
| **Quick Access Settings** | switch list | `~Reset to Default` (NOT tapped), then one row per Dashboard quick tile: `View desc="<name>\nEnabled"` or `"...\nDisabled"` with a `Switch` (`checked` when on). At the time of the look: Edit Profile, Notifications, Announcements, Blogs, Appointments & Events = Enabled; Certificates, Chat, Theme, Quick Access Settings = Disabled. | the state text is **changing** (the user can toggle). No switch was touched. |
| **Logout** | (not opened) | `View desc="Logout"` at the very bottom of the list | **NOT tapped.** No "Delete account" option was found anywhere in the list. |

**Hidden from Appium:** the avatar, the eye buttons in Change Password (no id), the calendar arrows, row icons and chevrons.
**Stable text:** all menu row names, the form hints and descriptions, the empty-state messages. **Changing:** points, the email and name, library/product/blog rows, calendar dates, Quick Access states.
**What the user can do here:** edit profile, change email (code is sent) or password, view certificates, downloads, watch-later, libraries, blogs, announcements, events, products, blocked users, switch theme, choose which quick tiles appear on the Dashboard, log out.

## Possible bugs and oddities
**Confirmed (repeated at least twice):**

| # | Where | What | Steps | Seen |
|---|---|---|---|---|
| A | Video lesson | **NOT A BUG (owner confirmed: by design).** The video always restarts from 0:00 (and autoplays) when the course is opened again, although the Dashboard card says "Resume" (that means "continue at the lesson", not at the second). Keep it as a documented behaviour; a test may rely on it. | 1. Courses > open the QA course (video lesson). 2. Let it play, pause at a later time (0:13, 0:25). 3. Back, close the mini player (X). 4. Open the same course again: time starts at about 0:03. | 3x |
| B | Video and audio lessons | Lessons **autoplay** when opened (video 2x, audio 1x). May be by design. | Open the course or tap an audio lesson: the time counter starts at once. | 3x |
| C | Lesson player (testability, not a user bug) | Tabs, lesson rows and "Mark Complete & Continue" are invisible to Appium while a video/audio lesson or the mini player is on screen; visible for non-media lessons. | Open a video lesson, run `descriptionStartsWith("Lessons")`: 0 matches. | 4x |

**Seen once, to re-check:**

| # | Where | What | Seen |
|---|---|---|---|
| 1 | Dashboard bell | The red dot was still there after opening Notifications (the list shows only an "Earlier" group; no "New" group). Possibly "unread" only clears with "Mark all as read", which I must not tap. | 1x |
| 2 | Notifications | The same event reminder appears 4 times in a row with the same time (looks like the reminder is sent several times). Could be test data. | 1x |
| 3 | Announcements | Message bodies start with "`<name>` , ..." (a space before the comma). Cosmetic. | 1x |
| 4 | Chats | The chat preview shows the raw meeting link including a long login token as the last message. Not copied anywhere. | 1x |
| 5 | Bundle vs Enrolled list | The same course shows "0/30 lessons, Start" inside the bundle but "1/30 lessons, 3 %" in the Enrolled list. | 1x |
| 6 | (moved up: see B) | | |
| 9 | (moved up: see A) | | |
| 10 | PDF lesson | A 200 MB PDF downloads at about 1 % per 10 s with no way seen to start reading earlier; the page shows only "Downloading... n %". | 1x |
| 12 | Blogs, Physical Products | The **Back button has no accessibility label** on these screens (it has `desc="Back"` on all the other screens). Not usable with `~Back`. | 1x each |
| 13 | Change Password | The screen title and the submit button have the same text "Change Password" (2 matches for one id). Testability only. | 1x |
| 11 | Quiz start page | Shows "0/0 Questions" (**unconfirmed**: the owner will check in the web admin whether this quiz has questions) and takes about 10 s of "Initializing..." before the page appears. | 1x |
| 7 | (moved up: see C) | | |
| 8 | Lesson player layout | Right after the tutorial the course header and a "3 %" peek out from under the video. Cosmetic. | 1x |

## Questions for you
**Answered:** the student account was `VALID_*` for rounds 1-5; it is now replaced by `TEST_STUDENT_*` (and `TEST_ADMIN_*` for the later owner pass). The 200 MB PDF is skipped until the owner adds a small (about 1 MB) PDF lesson to the AUTO_TEST course. The "0/0 Questions" quiz is **unconfirmed** until the owner checks the web admin.

**Still open:**
**Also answered:** video restart is by design; Quality and Playback speed may be opened (done); Logout may be scrolled to but not tapped (done); the owner pass comes later as a separate round with one login; the owner compares the download table (7d) with the web admin.

**Still open:**
1. Should "Remember me" be tested? It needs another login and a log out, so it would use extra login requests.
2. "Mark all as read" on Notifications and opening a chat conversation stay off limits (assumed). Correct?
3. Should the Community and Coaching tabs be explored in depth (rows, a community feed, a coaching program), or are they out of scope?
4. Which of the lesson types not opened yet (PPT, Survey, Multiple, Live, Downloads, Embedded, SCORM) do you want looked at?
5. Quick Access Settings: should a later round test the toggles (it changes the Dashboard tiles of this test account, and can be undone with "Reset to Default")? Not touched so far.
6. The small PDF in the AUTO_TEST course: tell me when it exists and I will add the PDF lesson to the notes (section 6).
