# Courses

Explored 2026-11-17, view-only, on the prototype https://ezycourse20uiux.pages.dev/ (mock data, no login). Route = the part after `/#`; open it with `page.goto('/#<route>')`.
The sidebar names, tab names and table columns below are exact (taken from the page), so use them in page objects and assertions.

## /courses/all-courses

- Headings: `Courses`
- Tabs: `All courses`, `Reviews`, `Presets`
- Table columns: `Course`, `Instructor`, `Enrollments`, `Type`, `Status`, `Created`
- Table rows shown: 13 (first row: Product Design Foundations | NR LM | 1,284 | Evergreen | Published | 12 Mar 2026 | Manage)
- Inputs: `text:Search course titles`, `checkbox: x14`, `text:Page number, 1 to 105`
- Buttons: `Reorder`, `Create course`, `All courses`, `Reviews`, `Presets`, `All`, `Evergreen`, `Cohort`, `Bundle`, `Filters`, `Course`, `Instructor`, `Enrollments`, `Type`, `Status`, `Created`, `NR LM`, `1,284`, `Published`, `Manage`, `TB`, `3,910`, `AO`, `412`, `PN`, `1,067`, `PN SW`, `2,455`, `SW`, `Draft`, `HB`, `8,120`, `JF`, `640`, `ML`, `LR`, `932`, `OC`, `NR`, `488`, `OC AO`, `186`, `25`

## /courses/submissions

- Headings: `Submissions`
- Tabs: `Grid`, `List`
- Table columns: -
- Table rows shown: 0
- Inputs: -
- Buttons: `Grid`, `List`, `Choose a course`, `Customer Success Mastery 4 items · 39 users · 20 to grade`, `Cybersecurity Foundations 4 items · 29 users · 9 to grade`, `Data Analytics for Managers 5 items · 37 users · 17 to grade`, `Leadership & Management Essentials 4 items · 37 users · 10 to grade`

## /courses/quiz

- Headings: `Quiz`
- Tabs: `Quizzes`, `Question banks`
- Table columns: `Quiz`, `Questions`, `Points`, `Attempts`, `Avg score`, `Status`
- Table rows shown: 12 (first row: Programme design mid-block review | 18 | 46 | — | Draft | Manage)
- Inputs: `text:Search quizzes`, `checkbox: x13`, `text:Page number, 1 to 1`
- Buttons: `Import`, `Create quiz`, `Quizzes`, `Question banks`, `All`, `Published`, `Draft`, `Archived`, `Filters`, `Quiz`, `Questions`, `Points`, `Attempts`, `Avg score`, `Status`, `Manage`, `25`

## /courses/certificates

- Headings: `Certificates`
- Tabs: `Awarded`, `Blueprints`
- Table columns: `User`, `Course`, `Blueprint`, `Issued`, `Expires`, `Status`
- Table rows shown: 25 (first row: HL Hannah Lewis hannah.lewis@gmail.com | Product Design Foundations | Course completion — gold | 5 Oct 2026 Yesterday | Never | Active | Download)
- Inputs: `text:Search user, course or certificate ID`, `checkbox: x26`, `text:Page number, 1 to 3`
- Buttons: `Export`, `Awarded`, `Blueprints`, `Filters`, `User`, `Course`, `Blueprint`, `Issued`, `Expires`, `Status`, `Download`, `Reissue`, `25`

