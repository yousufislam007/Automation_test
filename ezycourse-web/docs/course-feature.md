# Course feature: how it works (from exploratory testing)

Explored on 2026-10-09 against https://ezyyousuf.ezycourse.com as the admin, by creating a real test course.
Everything below was observed in the app, not assumed. "Not verified" marks what I could not confirm.

## Test data I created (safe to delete, named "QA-Explore")
| Item | ID | Notes |
|---|---|---|
| Course "QA-Explore Course" | **49589** | Single course, **Draft**, free (no price), 0 enrollments |
| Chapter "Chapter 1 - Basics" | **168197** | |
| Lesson "Lesson 1 - Welcome (text)" | **734090** | Text lesson, not draft |
| Lesson "Lesson 2 - Quiz" | **734091** | Quiz lesson, no questions yet |

Nothing was deleted. Nothing was published, priced, or enrolled.

## Model
`Course` -> `Chapter` -> `Lesson`. A course is either a **Single course** or a **Bundle course** (bundle not explored).
A course with no price is **free**. Sequence in the UI: create course -> add chapter -> add lessons -> (optionally) drip, pricing, settings -> publish.

## URLs
| Page | URL |
|---|---|
| Course list | `/dashboard/mycourses/` |
| Choose type | `/dashboard/courses/course-type/` |
| Create single course | `/dashboard/courses/create/` |
| Course editor (Curriculum) | `/dashboard/courses/{courseId}/` |
| Settings (Basic information) | `/dashboard/courses/{id}/setting/` |
| Settings sections | `/setting/advance-info/`, `/setting/accessibility/`, `/setting/certificate/`, `/setting/grade-settings/` (also: Landing page, After checkout page, Motivation popup, Redirect to checkout page) |
| Drip | `/dashboard/courses/{id}/drip/` |
| Pricing | `/dashboard/courses/{id}/pricing/` |
| Create chapter | `/dashboard/courses/{id}/chapter/create/` |
| Chapter | `/dashboard/courses/{id}/chapter/{chapterId}/lesson/` |
| Create lesson | `/dashboard/courses/{id}/chapter/{chapterId}/lesson/create/` |
| Edit lesson | `/dashboard/courses/{id}/chapter/{chapterId}/lesson/{lessonId}/` |
| Admin "Course preview" (student player) | `/dashboard/courses/{id}/watch/{lessonId}` |

## API calls seen (all `POST`, answered 200)
`/api/teacher/course/createCourse`, `/api/teacher/chapter/createNewChapter`, `/api/teacher/lesson/createLesson`.

## Flows and fields

### 1. Add a course
Course list -> **Add Course** -> "Select Course Type" (**Single course** / **Bundle course**) -> **Create single course** form.

| Field | Locator hint | Rule |
|---|---|---|
| Course name * | `#title`, placeholder "Course name" | Required. Empty -> "Please write a name for your course" (toast + inline) |
| Short description | `#short_description` | Max **255** characters (counter "0 / 255") |
| Description | rich-text editor (`[contenteditable]`) | Optional. Toolbar: tables, bold/italic, lists, links, image, video, audio, code... |
| Category | `#category_ids` (searchable select) | Optional |
| Course image / video | Upload buttons | Max 10 MB (image) |
| Preview type | Image / Video radios | Disabled until media is uploaded |
| Accessibility status | **Public** (default) / Private / Hidden / Restricted Access | Radios |
| Hide enrollment count | `#enrollment_count_hidden` | **Checked by default** |
| Publishing status | **Published** (default) / Draft | Radios |
| Motivational popup | `#motiv_popup` | Unchecked by default |
| Limit course enrollments | checkbox | Unchecked by default |
| **Create** button | | Calls `createCourse`, goes to `/dashboard/courses/{newId}/` |

### 2. Course editor
Top tabs: **Curriculum, Settings, Drip, Pricing**; buttons **Back to Courses**, **Course preview**.
- **Curriculum:** left sidebar lists chapters (drag handle to reorder, chevron to expand lessons, **+ Create New Lesson**, **+ Create New Chapter**). Empty course shows "Please Create Your Chapter!" with **+ Create New Chapter** and **+ Clone Chapter**.
- **Settings:** left menu: Basic information, Advanced information, Landing page, After checkout page, Certificate, Course accessibility, Motivation popup, Grade settings, Redirect to checkout page. Basic information has name, **slug** (auto: `qa-explore-course`), image, video, short and long description, limit enrollments, **Save**.
  - Advanced information: language, video duration, course level, course assurance, show quiz/assignment counts, custom "course includes", learning outcomes, FAQ, enable course review, enable gifting (Stripe and one-time only).
  - Course accessibility: Accessibility status, **Publishing status** (Published / Draft), **Presell settings** (Off toggle), **Save**.
  - Certificate: "Provide a certificate at the end of this course" + **Update**. Grade settings: "Enable grading and marksheets".
- **Drip:** "Choose drip type": **Immediately** (default, available on enrollment), **Enrollment based** (X days after enrollment), **Specific date**. **Save**.
- **Pricing:** with no price, "You don't have any prices. So your course is considered as free now." **Add a price** shows 6 plan types: One-time (Standard), Split Payment, Subscription (Standard), One-time (Tiered), Subscription (Tiered), Donation (One Time).
  **Blocker:** the page says "You have to configure at least one payment gateway for your website", so paid pricing cannot be tested until a gateway is configured.

### 3. Add a chapter
`/chapter/create/`: **Chapter Name** `#title` (required, empty -> "Please input name"), **Description** `#content`, "Set New Lesson by draft" `#lesson_draft`, "Enable motivational popup" `#motiv_popup`, **Create**.
After creating, you land on `/chapter/{chapterId}/lesson/` with "Please Create Your Lesson!".

### 4. Add a lesson
`/lesson/create/` shows "Please Select New Lesson Type". **14 types:**
Build with AI (new, uses AI credits, not tried), Video, Text, PPT, PDF, Audio, Quiz, Survey, Assignment, Download, Live, Embedded, SCORM/HTML, Multiple.
The URL does not change when you pick a type, and a type switcher stays at the top of the form.

Common fields: **Lesson Name** `#title` (required, max **150**, empty -> "Lesson name is required!"), description (rich editor), two colour pickers, **Create**.
Common settings (checkbox ids): `#is_published` (label **Draft**), `#is_free` (Free preview), `#is_prerequisite`, `#is_discussion` (Enable discussions), `#is_disable_video_analytics` (Student Watch Time Analytics), `#motiv_popup`.

| Type | What is different |
|---|---|
| Video | downloadable for web / app, **video completion requirement**, **block forward seeking**, autoplay |
| Text | "Make this lesson printable" `#printable`, optional downloadable file |
| PPT, Audio | downloadable for web / app |
| PDF | "PDF Stamp" `#is_pdf_stamp_enabled`, downloadable for web / app |
| Quiz | no Free preview; **Quiz** and **Quiz settings** tabs after creation |
| Survey | choose a survey form `#form_id` |
| Assignment | "Assignment title", allow points, disable auto approval, allow editing a submission, multiple attachments, allowed file types (docx, doc, pptx, ppt, pdf, txt, audio, video, image, zip) |
| Download | files for students to download |
| Live | live type `#live_type`. Triggers HTTP 404 on `/api/teacher/ezy-meeting/license` (needs the meeting addon) |
| Embedded | radios: iframe link / HTML / internal page link, textarea `#embedded_link` |
| SCORM/HTML | "Passing required" `#pass_required` |
| Multiple | printable; combines several content blocks |

After **Create**: success toast "Lesson created successfully", the form stays on the type picker so more lessons can be added.

**What each type needs to be created (verified by automated tests, `tests/course/lessons.spec.ts`):**

| Type | Minimum to create | If missing |
|---|---|---|
| TEXT, PPT, PDF, QUIZ, ASSIGNMENT, EMBEDDED | a name only | "Lesson name is required!" |
| MULTIPLE | a name only. Saved as `lesson_type: "text"` (a "multiple" flag). After creating, the page shows a **summary card**; its pencil icon (`span._multi_edit`) opens the normal edit form with **Delete Lesson** | |
| VIDEO | a video | "A video is required for this lesson" (nothing is sent to the server) |
| AUDIO | an audio file | "An audio file is required for this lesson" |
| DOWNLOAD | a **zip** file ("Only zip files") | "A downloadable file is required for this lesson" |
| SCORM/HTML | a SCORM/HTML zip | "A scorm/html file is required for this lesson" |
| LIVE | a live lesson type | "Please select a live lesson type" (the dropdown offered no options) |
| SURVEY | a survey form | the server answers **422** "Form ID is required for survey lessons" (the dropdown offered no forms) |

The create call returns the saved lesson (`id`, `title`, `lesson_type`, `course_id`, `chapter_id`, `is_published` = `PUBLISHED` or `DRAFT`). Delete is `POST /api/teacher/lesson/deleteLesson` after the confirmation "Delete this lesson?" (Cancel / OK).

**Race condition to wait for in tests:** the app fills in `course_id` from `getSingleCourse/{id}` and `getLessonByChapterId/{chapterId}`. Clicking **Create** before those finish gives HTTP 422 "Course is required".

**Not automated yet:** creating VIDEO, AUDIO, DOWNLOAD, SCORM/HTML (need a file picked through the Gallery media manager; the lesson's Upload box did nothing when automated and logged two 404 resource errors), LIVE (needs a configured live integration) and SURVEY (needs a survey form). They are `test.fixme` cases with the reason written in the test.

### 5. Edit a lesson
`/lesson/{lessonId}/`: **Update**, **Delete Lesson**, "Share this lesson" link + **Copy**, lesson settings panel (same checkboxes). The "Student Watch Time Analytics" box is checked and disabled with a warning that the addon "is installed but not enabled".

### 6. Quiz lesson
- **Quiz** tab: Quiz Type **Normal** or **On-Demand Randomized**; **Add Questions** (opens the **Question bank**: a list of subjects with copy, edit and delete icons, plus **Create new subject**); **Generate Random Questions**.
- **Quiz settings** tab: show in mobile app, allow partial marking, allow negative marking, allow skipping questions, shuffle options, when to show answers (at end of quiz / after each question / on retake), **Passing score**, **Number of retake**, **Quiz time**, **Per quiz time** (all default 0).
- Not explored: building questions, taking a quiz as a student.

### 7. Student view
"Course preview" opens the player (`/dashboard/courses/{id}/watch/{lessonId}`): tabs **Course content / Transcript / Notes**, chapter progress "Chapter 1 - Basics (0/1)", lesson body, **Complete & Continue**, **Hide Bar**, **Close**.
Not verified: a real enrolled student's experience, enrollment flow, completion, certificate, reviews.

## Possible bugs / UX issues found
| # | Where | What | Severity |
|---|---|---|---|
| 1 | Lesson editor "Share this lesson" link `/student/courses/{id}/watch?lesson_id={lessonId}` | Opening it as the admin returns **404 "Oops! Page not found"**. Might only happen because the course is Draft (not verified). Check with a Published course. | High if confirmed |
| 2 | Course editor root `/dashboard/courses/{id}/` | Main area still says "**Please Create Your Chapter!**" although the sidebar already lists "Chapter 1 - Basics" | Low |
| 3 | Lesson editor | "Student Watch Time Analytics" checkbox shown **checked but disabled** while the addon is not enabled | Low |
| 4 | Create lesson | An earlier validation error toast stayed on screen next to the "Lesson created successfully" toast | Low |
| 5 | Validation messages | Inconsistent wording: "Please write a name for your course", "Please input name", "Lesson name is required!" | Low |
| 6 | Checkbox | `id="is_published"` is labelled **"Draft"** (works, but confusing for locators and maybe for maintainers) | Info |
| 7 | Live lesson | HTTP 404 from `/api/teacher/ezy-meeting/license` (same as the Meeting page) | Medium |
| 8 | Pricing | Paid plans impossible without a payment gateway | Blocker for tests |
| 9 | Create lesson | **Create** is enabled before the course data has loaded; an early click fails with HTTP 422 "Course is required" (the user does see that message) | Medium |
| 10 | Lesson Upload box (VIDEO/AUDIO/DOWNLOAD/SCORM) | Clicking it opens nothing (checked again with a 10 s wait) and logs two HTTP 404 resource errors. The same kind of box on the **seller product form** opens the "Upload From Gallery" modal normally (see docs/marketplace-feature.md), so this looks like a problem specific to the lesson form. Not verified in a normal (non-automated) browser. | Medium |
| 11 | MULTIPLE lesson | Saved as type "text" by the API; after creating it you land on a summary card, and the name field only appears after clicking a small pencil icon | Low |

## Suggested test cases (to automate)
**Course:** create with name only (Draft); empty name; 255-char short description and 256; each accessibility status; Published vs Draft shows in list with the right status; slug generated from the name; duplicate name; special characters / emoji / very long name; cancel with Back.
**Chapter:** create; empty name; reorder by drag; "lesson by draft" default; clone chapter; delete chapter.
**Lesson:** create each of the 13 types with the minimum fields; empty name; 150 / 151 characters; Draft, Free preview, Prerequisite, Discussions toggles persist after reload; update; delete (with confirmation); copy share link.
**Quiz:** type Normal / Randomized; add questions from the bank; passing score, retakes and time limits (including negative and non-numeric values); partial and negative marking.
**Drip:** each type saves and reloads; enrollment-based with 0, 1 and invalid days; specific date in the past.
**Pricing:** free by default; blocked message without a gateway.
**Student side (needs an enrolled test student):** enroll in a free course, open lessons, complete & continue, progress %, drip locks, prerequisites, certificate.

## Open questions for you
- Should the QA-Explore data stay for your tests, or should I delete it afterwards?
- Is there a **test student account** (and ideally a second admin) for enrollment and student-side tests?
- Is a **payment gateway** available in a test mode, so pricing can be tested?
- Is it safe to **Publish** a test course on this storefront (it will show on the public site)?
