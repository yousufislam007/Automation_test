# Coaching feature: how it works (from exploratory testing)

Explored on 2026-10-16 (build) and 2026-10-19 (re-check). Web admin: https://ezyyousuf.ezycourse.com (admin account from `.env`).
App: EzyCourse Android v5.0.4 on the emulator, test student (`TEST_STUDENT_*`), **view only** (nothing booked, started, replied to, submitted or tapped except navigation).
Everything below was observed. "Not verified" marks what was not confirmed.

**Logins:** 0 on 2026-10-16 (saved sessions reused). The saved web session had expired by 2026-10-19, so **1 login** was made with `npm run auth:refresh`.
The admin and the test student show the **same display name**, so a test must tell them apart by role, not by name.

> A multi-agent run on 2026-10-16 (7 explorers) stopped because the organisation's monthly spend limit was reached; none of its reports arrived.
> The content it had already created on the site is real and was re-checked from the app. Several web areas were therefore only read, see "Not verified".

## Test data and state I left behind

| Item | Value | Notes |
| --- | --- | --- |
| Category | **QA Coaching 2026-10-16**, id **1665** | Name must be under 30 characters ("QA Coaching Category 2026-10-16" was refused: "Name must be less than 30 characters."). Created with `POST /api/coach/coaching-category/create`. |
| Programs | 4244 One to One, 4245 Week Based, 4246 Continuous, 4247 Session Based, 4248 Evergreen (all "QA `<Type>` Coaching") | Public, Student Limit 5, Free, feature picture 144x144 and banner 1376x288 from the Gallery folder "QA Coaching 2026-10-16". |
| Options set | 4244: Enable Booking ON, 2 free slots, One-time, appointment 3864. 4246: Allow Submission on Previous Sessions ON, Allow Enrollment in Current Batch ON, Habit Tab ON. | The others keep defaults. |
| Appointment | id **3864** "QA Coaching Appointment", type **Custom Virtual Meeting** (link `https://example.com/qa-coaching-meeting`), 30 min, Sundays 10:00 and 10:30 | Made on `/dashboard/appointments/create/`. |
| Student enrollment | the test student is enrolled in all 5 (Program, ACTIVE, Lifetime, Manual = Yes, price Free) | Added on the student's page: Coachings tab > Add Enrollment. |
| Content (made by the agents) | 4245: 1 week (Week 1, **only Fri 16 Oct**) with a journal and a text lesson. 4246: journals and lessons. 4247: a journal and a text lesson (Session 1 / Subsession 1). 4248: a phase, a module, a journal and a text lesson. 4244: a chat thread (the student's app shows it with "2 replies"). | All "QA ... safe to delete". Exact counts per program: not verified. |
| Gallery | folder "QA Coaching 2026-10-16" (with `qa-coaching-feature.png`); `qa-coaching-banner.png` landed in the Gallery's **Home** | Upload goes to the folder that was opened last, not to the one just created (seen twice). |

**Clean-up (needs your go-ahead):** delete programs 4244-4248 (row menu > Delete), appointment 3864, category 1665, the Gallery files and folder. Check whether deleting a program removes its enrollments and content.

## Web admin

### Screens

| Screen | URL | What it has |
| --- | --- | --- |
| Coaching Programs | `/dashboard/coaching/coaching-programs/` | Cards **Programs** and **Active Clients** (`0/Unlimited`, so no plan limit). Filters: Category, Session Type (**Week Based, Session Based, Continuous, Evergreen, One One**), Clear Filters, Search. Table: ID, Title, Visit, Session Type, Category, Status, Start Date, End Date, Created At, Students Limit, Action. Row menu: **Edit, Delete, Add Coach, Pricing, Preview Checkout, Clients**. The table is split in two (header and body) in the DOM. |
| Create / Edit program | `/dashboard/coaching/coaching-programs/create/`, `/<id>/edit/` | See "Create form". After creating, the coaching type is **locked** (radios disabled). Top bar: Back, Details, Pricing. |
| Pricing | `/dashboard/coaching-program/<id>/product-price/` | "You don't have any prices yet", Add a price (no payment gateway on this site, so not tried). |
| Preview Checkout | `/checkout/?product_id=<id>&product_type=coaching_program` | The user, Coupon Code, the program and **FREE**, Complete Purchase (not pressed). |
| Add Coach | dialog on the list | "Manage Coaches": program name, "0 selected", search "Search and select coaches...", Cancel / Update Coaches. Not saved. |
| Clients / coach view | `/coaching/<slug>-<id>/` (tabs Activities, Clients) | The coach's own page, see "Coach view". |
| Coaching Categories | `/dashboard/coaching/categories/` | Add Category dialog: Category name (required, under 30 characters), Add Image (optional). Table: Category Id, Thumbnail, Name, Created, Action. |
| Coaching Library | `/dashboard/coaching/library/` | Tabs **Tasks, Exercises, Lessons, Trackers, Forms, Meal Plans ("Coming Soon!")**. Each has Search, Categories, and an add button (Add New Task / Exercise / Video / Tracker). All empty here except Forms (1 existing form, columns FORM NAME, DESCRIPTION, RESPONSES, STATUS, CREATED, ACTIONS). **Add New Task** form: Title (required), Description, Feature Image 294x166, **Category (required)**, Add Tracker (optional), Upload Files (optional), allowed student upload formats (Image, Video, Audio, PDF, Docs, PPT). |
| Coaching Quiz Submissions | `/dashboard/coaching/quiz-submissions/` | Filter "All Programs", table: Id, Coaching Program Name, Name, Number of Submissions, Feed Created, Coaching Program Created, Action; empty. |
| Student page | `/dashboard/students/<id>/details/` > **Coachings** | "Coaching Enrollments" (filter "Programs"): ID, Title, Type, Subscription Status, Enrollment Expires At, Manual, Action. **Add Enrollment**: pick a program (search), price (Free is chosen by itself, "$0 transaction fee will be deducted"), Add. |
| Appointments | `/dashboard/appointments/create/` | See "Appointment form". |

### Create form (`/dashboard/coaching/coaching-programs/create/`)

| Field | Notes |
| --- | --- |
| Title (required), Description (rich text), Short Description (required, 160) | |
| Category (required) | Only categories that exist; empty site = nothing to pick. |
| Access | Public (default), Private, Hidden, Restricted. |
| Student Limit (required) | Number, default 1. |
| Coaching type | **One-to-One:** One to One Coaching. **Date Based:** Week Based, Continuous. **Non-Date Based:** Session Based, Evergreen. |
| Feature Image 144x144 and Banner Image 1376x288 (both required) | Buttons "Click to upload ..." open the Gallery (no file input on the page). |
| After Checkout Page URL | Internal Page (pick a page) / External Page. |
| Create | Pressed once per program. A first attempt that matched the Gallery's "Create New Folder" button sent nothing (exact button text needed). |

Type-specific parts of the form (each type adds its own block):

| Type | Extra fields |
| --- | --- |
| One to One | **Appointment Settings**: Enable Booking (off). When on: **Allowed Free Slots** (required, number), **Free Slots Renewal Cycle** (One-time, Weekly, Monthly, Yearly), **Allow Additional Sessions** (switch, "additional charges may apply"), **Select Appointment** (list with "No appointments found", **Create Appointment** (opens `/dashboard/appointments/create/` in a new tab) and Refresh). |
| Week Based | **Submission Visibility** (All / Own), **Allow Submission on Previous Sessions** (Not Allowed), **Habit Tab** (Disabled). |
| Continuous | The same three plus **Allow Enrollment in Current Batch** ("new students can join the ongoing batch"). |
| Session Based | Submission Visibility (All / Own) only. |
| Evergreen | Nothing extra on the form. |

### Appointment form (`/dashboard/appointments/create/`)

Event name, **Event type** (In Person, Native Meeting, Google Meet, Custom Virtual Meeting), Location (In Person) or **Custom Link** (Custom Virtual Meeting), Sync with Google Calendar, Description/Instruction, Date Range (Specific days / Within a date range / Indefinitely), Duration (default 30 min), **weekly free hours**: tick a day and pick times one by one in a 12-hour picker (hour, minute in 15-minute steps, AM/PM, OK); **each time is one bookable slot** shown as a chip ("10:00 am" with edit and delete) and "Exclude specific dates & slots"; buffer start/end time, Access (Public / Restricted), Send a reminder before 30 minutes, Allow cancellation / rescheduling / booking slots, Allow multiple bookings at the same slot. Saved with `POST /api/teacher/appointment-events/create` (then `/dashboard/appointments/edit/<id>/`).

### Coach view (`/coaching/<slug>-<id>/`)

| Part | What it shows |
| --- | --- |
| Header | Banner, program picture, title, "No members yet" / members, **All Users** filter (a client's own view and charts). Tabs **Activities** and **Clients**. |
| Activities (Week Based, seen in detail) | Left: weeks ("No weeks available." and **Add New Week(s)**; after that a tab per week with **Edit Week**, **Notify Clients** (sends to clients: **not pressed**)). Middle: the day ("Today `<date>`", day menu **Edit Day** (pricing only) and **Feed Reorder**), journal and lesson cards. Right: **Notes** (Add Note: choose clients, then write). Below: "Select a user to view their submission charts and progress". |
| Add New Week(s) dialog | Start Date, End Date (enabled after a start date), Days of Week (Check all, Sun-Sat), **Starting Day of Week** (required), Pricing Free / Premium, **Preview Sessions**, Cancel, Add. |
| Edit Week | Week Name (required), "Days In This Week: 1 Fri : Oct 16", Pricing, **Delete Week**, Save Changes. |
| Add Lesson / Add Item | Only shown on the **current** day. Week 1 of 4245 was only Fri 16 Oct, so on 19 Oct they were gone (Not verified: forms). |
| Clients | "All Client (0)" with Search and a time filter; table Name, Activity Chart, Status, Notes, Enrolled On. |

Write calls seen for content (coach side): `POST /api/coach/feeds/add-journal/<slug>-<id>`, `.../add-lesson/<slug>-<id>`, `.../one-to-one-session-feeds/<slug>-<id>`, `POST /api/coach/coaching-session/createSession` (a week), `.../createModule`, `POST /api/coach/coaching-phase/create`, `POST /api/coach/coaching-programs/create`, `POST /api/coach/coaching-category/create`; enrollment `POST /api/teacher/orders/create-enrollment-v2`.

## App (test student, view only)

| Screen | What it shows | Locators and notes |
| --- | --- | --- |
| Coaching tab | "Coaching Programs - Join coaching sessions and track your progress", Search, rows "`<title>`\n`<n>` member" (no type shown). | Tab by **position** (x 640, y 2691): `descriptionStartsWith("Coaching")` also matches the Home heading "Coaching Programs". The list was empty ("No coaching programs found") until a **pull-down refresh** (same as Community, 2 places). |
| Home | A **Coaching Programs** section (cards) under Enrolled Courses once the student has programs. | `~Coaching Programs`, `~View all`. |
| Program screen (all types) | Title, **Close** (X), a ≡ button (no label, tap about x 83, y 240) that opens a side drawer: banner, title, "`<n>` Members" (grammar), then type content. | `~Close`. The Android Back key closes the drawer. |
| One to One | Tabs **Threads / Live Sessions / Files** (`Tab 1 of 3` ...). Threads: "Search threads", "Filter by date", the coach's chat thread ("Chat", "2 replies", Reply, ⋯), a **+** at the bottom (new thread). Live Sessions: **"Sessions Available - 2 of 2 remaining"** and **Book** (matches Allowed Free Slots 2); "No sessions booked yet". Files: "No feed items available". Drawer: Threads / Pinned. | Not tapped: Book, Reply, +, ⋯. |
| Week Based | "Hi, `<student>`", a status badge (**Active** on 16 Oct, **Ended** on 19 Oct: the 1-day week was over), cards **Today** and **Session** with dates, **Notes** button, then the day's feed: a journal card ("Submit Journal", "20,000 characters remaining", Add Comment) and a lesson card (type, text, Add Comment). Drawer: "Started at Fri, October 16", **Week 1** > "Fri: 16 Oct 2026" (day rows; future days disabled, a lock icon). | Journal desc "`<title>`\n`<prompt>`". Not tapped: Submit Journal, Add Comment, Notes. |
| Continuous | Like Week Based plus a **Habits** button: Habit screen with tabs **Habit Feed / Submissions** and a month calendar ("Month" switch). The program keeps running (**Active**, today = session date on 19 Oct). Drawer: Week 1 with 7 days (Fri 16 - Thu 22 Oct), future days disabled. | `~Habits`. |
| Session Based | "Hi, `<student>`", only a **Today** card (no Session card, no badge), Notes, the journal and lesson. Drawer: **Session 1 > Subsession 1**, **Session 2** (no dates). | |
| Evergreen | Opens a bottom sheet **"Start Your Journey"**: "Select your current phase", the phase "QA Phase - safe to delete" (pre-selected), **Start Your Journey**. Behind it "Select Your Phase" and a **Select Phase** button. The student has to choose a phase first. | Not tapped. Tapping the ≡ position dismissed the sheet. |

## How each type works (from what was seen)

| Type | In short |
| --- | --- |
| One to One | One coach and the client: a **chat thread** list, **booked live sessions** from an appointment (free slots with a renewal cycle, extra sessions optional), files. No weeks. |
| Week Based | A **calendar of weeks and days** the coach creates (start date, end date, which weekdays, starting weekday); each day holds lessons, items (journal, tasks) and notes; the program shows Active / Ended by date; days in the future are locked. |
| Continuous | Like Week Based but **ongoing batches**: new students may join the current batch, a **Habit** tab with a calendar, previous sessions can be submitted late. |
| Session Based | **No dates**: Sessions with Subsessions in order; content per subsession. |
| Evergreen | **No dates, phase based**: the client first picks a **phase** (the coach made phases and modules), then follows the content. |

## Possible bugs and questions

| # | What | Seen |
| --- | --- | --- |
| G1 | **Saving an appointment with event type Native Meeting fails** with HTTP **422** "User zone is required when event type is native" and "Server country is required when event type is native", but the form has **no field** for either. | once (retried with another type) |
| G2 | The **"1 members"** text (app list shows "1 member" but the program drawer shows "1 Members"). | 2 places |
| G3 | The app's **Coaching and Community lists stay stale** until a pull-down refresh. | 2 screens (Community 2x, Coaching 1x) |
| G4 | Gallery upload lands in the folder opened last, not the new one. | 2 uploads |
| G5 | Category name limit (30) is only shown after pressing Create (no counter or hint). | once |
| G6 | Coaching list filter says "**One One**" for One to One (the row label also "ONE ONE"); the form says "One to One Coaching". | seen in 2 places |
| Q1 | Does Evergreen's "Start Your Journey" ask for more information with other phases ("provide relevant information")? | not verified |
| Q2 | What do Premium pricing, extra sessions with charges and Premium weeks do (no payment gateway)? | not verified |
| Q3 | The Week Based week was 1 day: how does the app look with a long week and today inside it (Add Lesson / Add Item, locks)? | not verified |

## Not done

- **Web:** no price (no gateway), no coach added, no Notify Clients, no Premium weeks, no extra weeks, no custom Task/Exercise/Tracker made in the Library, no Native Meeting appointment (G1), nothing deleted.
- **App:** nothing booked, started, replied, submitted, commented, or posted; Habits, Notes and drawer rows only opened or read.
- **Not read in detail** (the agent run failed): the exact lesson/item/journal forms (Add Lesson, Add Item), the One-to-One session feed forms, the Evergreen phase and module forms, the Session Based session and subsession forms, the Habit forms.

## One to One booking, join and reschedule in the app (2026-10-19, test student)

Appointment 3874 ("QA 10-minute Appointment", Mon 12:00 and 12:15, 30 min, Custom Virtual Meeting) is linked to program 4244; the student and a second test student are enrolled.

| Step | Result |
| --- | --- |
| Live Sessions > **Book** | A calendar (past days disabled) and **Available Time Slots**. Today showed only **12:15 PM** (12:00 had passed, correct). **Confirm Booking** is disabled until a slot is chosen. After booking: status **ACCEPTED**, "Sessions Available 1 of 2 remaining", a card under "Upcoming Sessions" (`OCT 19`, title, date, time, duration, status). |
| Session card (tap) | Sheet with Status, Date, Time, Duration, Timezone, **Reschedule**, **Cancel**, and "Changes allowed until `<time>`" = **6 minutes (0.1 h) before the start**. After that point the buttons are gone. |
| **Join** | **No Join button at any time**: not before 12:15, and not at 12:16 / 12:17 (inside the 30-minute meeting). Not verified: whether the custom link is shown anywhere else. |
| Reschedule | The dialog lists dates and slots (your own slot is hidden for its date). Booking Mon 26 Oct 12:15 and rescheduling it to **Wed 21 Oct 12:00 PM** worked: the card moved, status stayed ACCEPTED. |

Possible bugs: **A1** a session that has started (12:16 of a 12:15-12:45 meeting) is already listed under **Past Sessions**, so it cannot be joined (seen 2 times). **A2** no Join button for a Custom Virtual Meeting session (before and during the meeting). **A3** the slot list is inconsistent: Tue 20 Oct showed 12:00 PM at 12:07 and "No slots" at 12:19; Mon 26 Oct offered **12:45 AM**, 12:00 PM, 12:15 PM although the appointment was set for 12:00 PM (and one slot the admin added); the cause may be the admin's later edits. **A4** the second test student: "2 Members" in the drawer but "1 member" in the list until refreshed.
