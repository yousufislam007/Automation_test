# Anonymous posting and alias - explore (2026-11-18)

Community: https://yousuf.communitycdn.net (second test community). Accounts: admin and student (`TEST_WEB_ADMIN_*`, `TEST_WEB_STUDENT_*`). Channel used: **New channel** (was empty). Browser: one login per account in a shared CDP browser (2 logins, recorded in `playwright/.rate/logins.json`).

## Where the setting is
Per channel, not community-wide: sidebar channel -> ⋯ -> **Edit Channel** -> **Access Control** -> scroll to **Post identity**. Saves automatically ("Access control updated successfully", no Save button).
- **Anonymous posts**: shown as "Anonymous 1, 2, 3", numbered per post, never linked across posts.
- **Aliases**: persistent alias with its own name and avatar.
- **Review before publishing**: anonymous and alias posts wait for a moderator.
Original state in New channel: Anonymous ON, Aliases OFF, Review OFF. Restored to exactly that at the end.
Admin page: Dashboard -> **Reveal log** (`/dashboard/reveal-log`).

## What was tested (all passed unless noted)
| # | Step | Result |
|---|------|--------|
| 1 | Student composer: avatar chevron -> "Post as: You / Anonymous" | OK. Hint: "Hidden from members. Moderators can see who you are." Footer: "In small groups, people may still guess who posted." |
| 2 | Student posts anonymously | Shows "Anonymous" with a lock icon (author's own view only) |
| 3 | Student comments on own anon post (comment identity defaults to Anonymous) | Shows "Anonymous" + **Author** badge |
| 4 | Admin views that post | "Anonymous", no lock. Post menu has **Reveal author** (student's menu has Edit/Delete, no Reveal) |
| 5 | Reveal author: reason < 10 chars | Reveal button disabled; 10+ chars enabled |
| 6 | Reveal with reason | Shows the student's name + View profile; entry appears in Reveal log (member, revealed by, post id, reason) |
| 7 | Aliases ON: composer shows "Alias - Set up your alias" | Create alias dialog: name (hint 3-30), 11 characters, 13 colors |
| 8 | Create alias "QAOwl" and post | Post shows name, **Alias** badge, lock for the owner. Admin sees no lock |
| 9 | Click alias name as admin | Alias page `/a/<id>`: "Hide this alias", "Reveal author", "Suspend alias" |
| 10 | Suspend alias (reason >= 10 chars) | Badge "Suspended". Student: alias post disappears from the feed, alias is greyed out in the composer ("Suspended by moderators"). Admin feed shows the post as "Former alias" |
| 11 | Restore alias | One click, no reason needed; post and alias come back |
| 12 | Review before publishing ON, student posts as alias | Toast "Post submitted for moderator review"; student sees "Under review" + Pending + Edit/Delete; admin sees "1 Pending" -> `?pendingApproval=1` with View / Approve / Reject |
| 13 | Admin Approve | Post goes live in the student's feed |

## Candidate bugs (not repeated twice, so only candidates)
- **Alias name length** (reported to Discord 2026-11-18, reproduced twice): the dialog says "Use 3 to 30 characters" but Create alias stays enabled with 2 and with 31 characters and the field accepts 31. Server side untested (not submitted).
- Follow button after posting: seen once, NOT reproduced on a second run (student unfollowed, posted anonymously: header switched to the menu at once). Treated as a one-off, not reported.
- Suspended alias: admin sees the post author as "Former alias" in the feed but "QAOwl (Suspended)" on the alias page. Probably intended, noting it.

## Not tested
Hide this alias, Reject, anonymous/alias comments on someone else's post and replies, editing an alias, one alias per user vs per channel, alias in a second channel, admin posting anonymously, what happens to existing alias posts when Aliases is turned off, notifications, mobile app, Review before publishing for normal "You" posts.

## Left in place (ask before deleting)
In New channel: posts "QA follow check", "QA anon post 1" (with 1 comment), "QA alias post 1", "QA alias post 2 review"; student's alias QAOwl; one Reveal log entry; the student now follows New channel.
