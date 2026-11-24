# Products > Media library (admin): explore notes

Explored 2026-11-24 as the school admin on `https://app.ezycourse.com/s/ezyyousuf-hqtm4o/products/media-library` (live site, school ezyyousuf-hqtm4o). View-only: the Create dialog was opened and cancelled, Reorder was opened without saving, nothing was created or changed. No test cases were run. The school had **no libraries** at the time, so the list, card and edit views were not seen.
Test cases drafted from the dialog screenshots: [media-library-create-test-cases.md](media-library-create-test-cases.md).

## Page (empty state)

- Header: **Media library**, a List/Grid switch (two tabs), **Reorder**, **Create library** (primary).
- Toolbar: **Search libraries** (search box), **Filters**, and a columns button (View options) at the right.
- Empty state: "No libraries yet / Libraries you create appear here." with a second **Create library** button.
- Grid tab shows the same empty state.

## Filters (popover)

| Filter | Values |
| --- | --- |
| Media type | Any, Video, Audio |
| Status | Any, Published, Draft |
| Category | "Coming" badge (not usable yet) |
| Episodes | Any, Empty, 1-9, 10-24, 25 or more |
| Duration | Any, Under 1 hour, 1-5 hours, 5-12 hours, 12 hours or more |

"Episodes" and "Duration" show a library holds episodes with a length (content added after creation).

## View options (columns button)

- **Sort by**: Custom order, Newest created, Oldest created, Title A-Z, Most episodes.
- **Columns** (with "Reset to default"): Library (always on), Type, Category, Episodes, Status, Created at.

## Reorder

- Switches the page into reorder mode with **Cancel**, **Save order**, a **Group by category** option (badge "Coming") and "Library order: Custom order". With no libraries there is nothing to drag.

## Create media library (dialog)

| Field | Details |
| --- | --- |
| Library title * | text, placeholder "Studio sessions", no max length attribute |
| Brief description | textarea, placeholder "One line shown on cards and listings", counter `0/120`, `maxlength=120` on the field |
| Category | text input "Search or create a category", badge "Coming" |
| Media type | radio cards **Video** (default) / **Audio** |
| Thumbnail | upload, hint "JPG or PNG, 16:9" |
| Promo video | upload, hint "MP4 or MOV" |
| Visibility | **Public** (default), **Membership only**, **Private**, **Hidden** (each with a short explanation) |
| Who can open it | **Anyone**, **Logged-in users**, **Enrolled users** |
| Right panel | Library card preview (type badge, visibility badge, thumbnail, title, description, category) and a summary: Media "Video only", Access "Public · free to enrolled users", Thumbnail None, Promo video None, Status Draft; note "Content is added after the library is created." |
| Footer | Cancel, **Create as** Draft / Published toggle, **Create library** |

Defaults when opened: Video, Public, Draft, nothing uploaded, preview "Untitled library / Brief description appears here / No category".

## Things to check when the cases are run

- The description field has `maxlength=120`, yet your screenshot showed `136/120` with the text kept. Find out how it got past the limit (paste, drag-drop, autofill, or an edit path) before logging it as a bug. Case MLC-014.
- Thumbnail hint says **JPG or PNG, 16:9**: add cases for a non-16:9 image (crop or stretch or reject?).
- Category (field and filter) and "Group by category" are all "Coming": expected to be inert for now.
- The page has no existing libraries in this school; create test libraries with unique names and delete them afterwards.
