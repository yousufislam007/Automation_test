# Held comments ("Post for review"): test cases

Source: Trello card #1053 "[Bug] [Web] [Live] Comments submitted for review are visible to other members without admin approval" and the dev doc for PR #4466 (branch `fix/community-comment-review-hold`). Test site: `https://pr4466-community.ezysites.com`.

Status column: `-` = not run. Priority: P1 core, P2 important, P3 edge.
Surfaces: **F** = feed post, **E** = event discussion, **C** = course lesson discussion. A case marked "F/E/C" is run on all three.

## Rules from the dev doc (the expected results come from here)

- A comment flagged by the AI spam check shows a warning. The member can choose **Post for review** or **Edit**.
- A held comment has `status = on_hold`. Only the author and admins/moderators (`community:content:moderator`) see it, with an **Under review** label.
- Held comment: no notification, no live (socket) update, no counts, no automation, no AI re-scan. Nobody (author and admin included) can reply to it or react to it.
- Admin decides in Dashboard > Reports. **Approve comment / Dismiss** makes it live once for everyone (time = approval time, counts, notifications and live update fire, author gets "Admin approved your comment"). **Remove content** deletes it (author gets "Admin rejected your comment").
- Held edit of a live comment (`edit_pending`): others keep the old text; author and admins see the new text + label. Approve = new text live. Remove = edit dropped, old text stays, author gets "Admin rejected your comment edit".
- Author edits a held comment to clean text: it goes live without an admin and the report closes.
- If the report cannot be filed, the comment is published normally.
- Moderator without `community:report:action` cannot approve (403).
- Hidden from non-authorised users everywhere: post, feed preview, profile tab, search, media library, API, deep link, socket.

## Setup and data

- Accounts: admin (owner), member A (author), member B (viewer), member C (second viewer, optional), moderator M1 with `community:report:action`, moderator M2 without it, course instructor I1 (not admin/moderator), a trusted member T1, logged-out guest.
- Settings: Spam Protection ON, AI spam check ON. For the cases that need "not spam" text, use a normal sentence.
- Spam text to use: a clearly spammy line such as `BUY CHEAP WATCHES NOW!!! http://spam.example win $1000 click here`. Name every test comment with a prefix `HC-<case id>` so it can be found and removed.
- Content: one feed post in a channel all members can read, one event with discussion, one course with a lesson discussion. Posts are created by the admin.
- Login rule: log in once per account and keep the browser open (login API is rate limited). Run with the shared-browser pattern.
- Clean up after each case: delete the test comments. Do not touch the owner's real content.

## A. The reported bug (card scenario) and basic flow

| ID | P | Case | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| HC-A-01 | P1 | Card repro: held comment hidden from other members | 1. Spam Protection on. 2. As A post spam comment on a feed post, click Post for review. 3. As B open the same post (reload). 4. As admin open the post. | A sees the comment + "Under review". B does NOT see it. Admin sees it + label. | - |
| HC-A-02 | P1 | Spam warning appears | As A type the spam text on a post and submit | Warning appears with two choices: Post for review and Edit | - |
| HC-A-03 | P1 | Post for review holds the comment | After HC-A-02 click Post for review | Comment saved with status on_hold; A sees it with "Under review" label | - |
| HC-A-04 | P1 | Report is created | After HC-A-03 open Dashboard > Reports as admin | A new pending report for the held comment shows, with author and comment text | - |
| HC-A-05 | P1 | Choose Edit in the warning | As A submit spam, in the warning click Edit | Nothing is saved; text stays in the editor; no report | - |
| HC-A-06 | P2 | Close the warning without choosing | Submit spam, close/dismiss the warning (X or outside click) | Nothing saved, no report, composer keeps the text | - |
| HC-A-07 | P2 | Clean comment is not held | As A post a normal comment | Posted live, no warning, no label, B sees it at once | - |
| HC-A-08 | P2 | Post for review twice quickly (double click) | Click Post for review twice fast | Only one held comment and one report | - |
| HC-A-09 | P2 | Label wording and place | Look at the held comment as A and admin | Label reads "Under review", shown below the comment, not shown to B | - |
| HC-A-10 | P2 | Held comment after reload | As A reload the page | Comment still there with label | - |
| HC-A-11 | P2 | Held comment after logout and login | A logs out, logs in again | Comment still there with label | - |
| HC-A-12 | P3 | Spam warning with Spam Protection OFF | Turn Spam Protection off, post the spam text | No warning, posted live normally | - |
| HC-A-13 | P3 | AI spam check OFF only | Keep Spam Protection on, AI check off, post spam text | No warning from AI; behaviour matches the setting | - |

## B. Visibility by role (run F/E/C)

| ID | P | Case | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| HC-B-01 | P1 | Author sees own held comment | As A open the post | Comment + label | - |
| HC-B-02 | P1 | Other member never sees it | As B open the post, reload, scroll | No trace of the comment, comment count unchanged | - |
| HC-B-03 | P1 | Admin sees it | As admin open the post | Comment + label | - |
| HC-B-04 | P1 | Moderator sees it | As M1 and M2 open the post | Both see comment + label (moderator permission) | - |
| HC-B-05 | P1 | Logged-out guest cannot see | Open the public post URL logged out | No held comment | - |
| HC-B-06 | P2 | Course instructor (not admin/mod) | As I1 open the lesson | Held comment hidden | - |
| HC-B-07 | P2 | Trusted member T1 | As T1 open the post | Held comment hidden | - |
| HC-B-08 | P2 | Post author (not the comment author) | If B owns the post, B opens it | Held comment hidden from the post owner | - |
| HC-B-09 | P2 | Followers of the post | A follower of the post opens it | Held comment hidden | - |
| HC-B-10 | P2 | Another member in a different browser session | B on another device or private window | Hidden | - |
| HC-B-11 | P2 | Banned or suspended member viewer | Open the post as a suspended member | Hidden (and no extra access) | - |
| HC-B-12 | P3 | Member with a role that has moderator content permission | Give a custom role the permission and open the post | Role sees comment + label | - |
| HC-B-13 | P3 | Moderator permission removed while held | Remove the permission from M1, reload | M1 no longer sees the held comment | - |

## C. Hidden everywhere else (B and guest must not find it)

| ID | P | Case | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| HC-C-01 | P1 | Comment list pagination | Post 25+ normal comments plus one held; B loads more | Held comment never appears on any page | - |
| HC-C-02 | P1 | Deep link to the comment | As B open the post URL with the comment id / anchor | Not found or normal post, no held text | - |
| HC-C-03 | P1 | Feed preview box / latest activity | Feed card shows latest comments for B | Held comment not shown in the preview | - |
| HC-C-04 | P1 | Profile tab of A | As B open A's profile > comments/activity | Held comment not listed; A sees own | - |
| HC-C-05 | P1 | Search | As B search a unique word from the held comment | No result | - |
| HC-C-06 | P2 | Search as author and admin | Same search as A and admin | Author and admin result rules follow the doc (visible to them) | - |
| HC-C-07 | P1 | Media library | Held comment with an image; B opens media library | Image not listed (list and single file URL) | - |
| HC-C-08 | P2 | Direct file URL | As B open the image URL of the held comment | Blocked/not found | - |
| HC-C-09 | P1 | API: comment list | As B call the comments list API for the post | Held comment not in response, no `status` field exposed to B | - |
| HC-C-10 | P1 | API: single comment | As B request the held comment by id | 404/forbidden | - |
| HC-C-11 | P2 | API: replies list | As B request replies of a thread that has a held reply | Held reply absent | - |
| HC-C-12 | P2 | Socket / live frame | B keeps the post open while A posts for review | B receives no live update (no flash, no count change) | - |
| HC-C-13 | P2 | Admin dashboard stats | Compare comment totals before/after held comment | Totals unchanged while held | - |
| HC-C-14 | P2 | Profile counters of A | Check A's comment counter | Not raised while held | - |
| HC-C-15 | P3 | Notification list of B | After the held comment, B checks the bell | Nothing about it | - |
| HC-C-16 | P3 | RSS / share / SEO page of the post | Open any public render of the post | Held comment absent | - |

## D. Counts

| ID | P | Case | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| HC-D-01 | P1 | Count while held | Note the post comment count, A posts for review | Count unchanged for A, B, admin | - |
| HC-D-02 | P1 | Count on approve | Admin approves | Count +1 for everyone | - |
| HC-D-03 | P1 | Count on remove | Admin removes a held comment | Count unchanged, never negative | - |
| HC-D-04 | P2 | Count on author delete while held | A deletes the held comment | Counts not lowered, no live update | - |
| HC-D-05 | P2 | Feed card count for B | B looks at the feed card | Same as post count, no held comment included | - |
| HC-D-06 | P2 | Held reply count | Hold a reply, check parent reply count | Reply count unchanged until approve | - |
| HC-D-07 | P3 | Count on held edit approve | Approve an edit | Count unchanged (edit does not add a comment) | - |

## E. Notifications while held and after

| ID | P | Case | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| HC-E-01 | P1 | Post owner not notified while held | A holds a comment on B's post | B gets no bell, email or push | - |
| HC-E-02 | P1 | Followers/mentioned not notified while held | A holds a comment that mentions @C | C gets nothing | - |
| HC-E-03 | P1 | Usual notifications on approve | Admin approves | B (post owner), followers, mentioned user get the normal comment/mention notification | - |
| HC-E-04 | P1 | Author gets "approved" | After approve | A gets bell + toast + email "Admin approved your comment"; link opens the post and jumps to the comment | - |
| HC-E-05 | P1 | Author gets "rejected" | Admin removes held comment | A gets "Admin rejected your comment" | - |
| HC-E-06 | P1 | Author gets "edit rejected" | Admin removes a held edit | A gets "Admin rejected your comment edit"; link opens the post, old text still there | - |
| HC-E-07 | P2 | Link when comment no longer exists | Click the "rejected" notification | Opens the post without error | - |
| HC-E-08 | P2 | Mute "content flagged" notifications | A mutes content flagged, admin approves/rejects | A gets none of the three notifications | - |
| HC-E-09 | P2 | Push notification | A has the mobile app push on | Push arrives for each of the three | - |
| HC-E-10 | P2 | Email content | Open the email for each of the three | Correct text, correct link, no spam text leaked to others | - |
| HC-E-11 | P2 | Admin/moderator notification when held | A posts for review | Admin sees the new Report (and any report notification as before) | - |
| HC-E-12 | P3 | No mention notification on approve if mentioned user left | Mentioned member removed before approve | No error, others notified normally | - |
| HC-E-13 | P3 | Notification text language | Switch the community language and trigger each of the three | Text translated, or flagged as missing translation | - |
| HC-E-14 | P3 | Toast while A is online | A has the site open when admin approves | Toast shows live | - |

## F. Reports page (admin)

| ID | P | Case | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| HC-F-01 | P1 | Report row for held comment | Open Dashboard > Reports | Row shows comment text, author, post link, status Pending, wording for held comments | - |
| HC-F-02 | P1 | Approve comment | Click Approve comment | Comment goes live for everyone once, report closes | - |
| HC-F-03 | P1 | Dismiss | Click Dismiss on a held comment | Same as approve: comment goes live, report closes | - |
| HC-F-04 | P1 | Remove content | Click Remove content | Comment deleted, report closes | - |
| HC-F-05 | P2 | Suspend user | Use the suspend-user action from the report | User suspended; the held comment is handled as the doc says (check it is not left visible to others) | - |
| HC-F-06 | P2 | Warn only | Choose warn only on a held comment | Toast "still waiting for review", report stays Pending, comment still held | - |
| HC-F-07 | P2 | Report wording for held edit | Create a held edit | Row wording differs from a held new comment and says edit | - |
| HC-F-08 | P2 | Time shown after approve | Approve after waiting 5 min | Comment time = approval time, not post time | - |
| HC-F-09 | P2 | Comment order after approve | Approve an old held comment among newer ones | Position follows approval time | - |
| HC-F-10 | P2 | Reports filters | Filter by status/type if available | Held comment reports appear under correct filters | - |
| HC-F-11 | P2 | Another member reports the held comment (held-edit case) | A member reports the comment whose edit is held | One report row only; approve applies the edit | - |
| HC-F-12 | P3 | Report link opens the post | Click the post link in the row | Opens the right post/comment | - |
| HC-F-13 | P3 | Reports pagination with many held comments | Create 15+ held comments | All listed, no duplicates | - |
| HC-F-14 | P3 | Reports page for moderator M1 / M2 | Open Reports as each | M1 sees and can act; M2 view/action follows permission | - |

## G. Approve (after effects)

| ID | P | Case | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| HC-G-01 | P1 | B sees it live without reload | B keeps the post open, admin approves | Comment appears live for B; count +1 | - |
| HC-G-02 | P1 | Label removed for author | A keeps the post open, admin approves | "Under review" label disappears live | - |
| HC-G-03 | P1 | Approve runs once | Two admins click Approve at the same time | Comment published once, one notification set | - |
| HC-G-04 | P2 | After approve: reply and react work | B replies and reacts to the approved comment | Allowed | - |
| HC-G-05 | P2 | Two tabs of the author | A has two tabs open, admin approves | Both tabs update without reload | - |
| HC-G-06 | P2 | Mention notification after approve | Held comment with @C, approve | C notified once | - |
| HC-G-07 | P2 | Automations after approve | If an automation fires on new comment, approve | It fires once, after approval | - |
| HC-G-08 | P2 | Approve after post was edited | Edit the post text, then approve the held comment | Comment goes live, no error | - |
| HC-G-09 | P3 | Approve after author was removed from community | Remove A, then approve | No crash; defined behaviour (note result) | - |
| HC-G-10 | P3 | Approve the same report twice (stale page) | Open two Reports tabs, approve in both | Second action shows clear message, no duplicate | - |

## H. Remove (after effects)

| ID | P | Case | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| HC-H-01 | P1 | Held comment disappears for author and admin | Admin removes | Comment gone for A and admin; B never saw it | - |
| HC-H-02 | P1 | No notification to others | Admin removes | Post owner, followers get nothing | - |
| HC-H-03 | P2 | A can re-post a new comment | After remove, A posts a clean comment | Posted live | - |
| HC-H-04 | P2 | Waiting row cleanup | Remove a held edit, then edit again | A new waiting edit can be made, no old data | - |
| HC-H-05 | P2 | Live update for open pages | A and admin have the post open when removed | Comment disappears live | - |
| HC-H-06 | P3 | Remove a held comment that has a held reply | Remove parent | Reply handled without error | - |

## I. Edit flows (held edit and edit of held comment)

| ID | P | Case | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| HC-I-01 | P1 | Live comment edited into spam + Post for review | A edits own live comment to spam, Post for review | A and admin see new text + label; B still sees OLD text | - |
| HC-I-02 | P1 | B keeps old text | B reloads during held edit | Old text, no label | - |
| HC-I-03 | P1 | Approve held edit | Admin approves | New text live for B (live, no reload), label gone | - |
| HC-I-04 | P1 | Remove held edit | Admin removes | Old text stays, A notified "edit rejected" | - |
| HC-I-05 | P1 | Author fixes held comment to clean text | A edits a held comment to a normal sentence | Goes live without admin; report closes; B sees it | - |
| HC-I-06 | P1 | Author fixes held edit to clean text | A edits again to clean text | New text live; report closes | - |
| HC-I-07 | P2 | Author re-edits held edit with spam again | A edits to different spam, Post for review | Still one waiting edit; report text updated | - |
| HC-I-08 | P2 | Edit then choose Edit in warning | A edits live comment to spam, chooses Edit | Nothing saved, old text stays | - |
| HC-I-09 | P2 | Edited label for live comment | A edits a live comment to clean text | Normal edit behaviour (Edited label if shown), unchanged from before | - |
| HC-I-10 | P2 | Admin edits held comment | Admin edits A's held comment (if allowed) | Defined behaviour; note result | - |
| HC-I-11 | P2 | Edit during pending approve race | Admin approves while A edits | No lost update, no stuck state | - |
| HC-I-12 | P3 | Held edit visible in comment history/edit log | Check any edit history UI | Does not expose pending text to B | - |
| HC-I-13 | P3 | Held edit on a reply | Hold an edit on a reply | Same rules as a comment | - |
| HC-I-14 | P3 | Held edit after approve of earlier held comment | Hold comment, approve, edit to spam again | New held edit created correctly | - |

## J. Replies and reactions

| ID | P | Case | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| HC-J-01 | P1 | No Reply/React buttons on held comment | As A and admin look at the held comment | Reply and React buttons not shown | - |
| HC-J-02 | P1 | API reply to held comment | Call the reply API on the held comment | 404 | - |
| HC-J-03 | P1 | API reaction to held comment | Call the reaction API | 404 | - |
| HC-J-04 | P1 | Spammy reply held | A replies to a live comment with spam, Post for review | Reply held; B does not see it; parent shows "View replies" for A | - |
| HC-J-05 | P1 | "View replies" for author after reload | A reloads the page | "View replies" still shown and the held reply visible with label | - |
| HC-J-06 | P2 | "View replies" for admin | Admin opens the thread | Held reply visible with label | - |
| HC-J-07 | P2 | "View replies" for B when only a held reply exists | B opens the thread | No "View replies" link, no reply count | - |
| HC-J-08 | P2 | Held reply notifications | Held reply to B's comment | B not notified until approve | - |
| HC-J-09 | P2 | Approve held reply | Admin approves | Reply live for all, B notified | - |
| HC-J-10 | P3 | Reply to a comment that has a held edit | B replies to the live (old text) comment | Allowed, reply attached normally | - |
| HC-J-11 | P3 | Nested reply depth | Hold a reply at the maximum depth | Held and shown correctly | - |

## K. Author actions on a held comment

| ID | P | Case | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| HC-K-01 | P1 | Author deletes held comment | A deletes it | Gone; counts not lowered; no live update for others; waiting report closes | - |
| HC-K-02 | P2 | Edit and delete controls | A looks at the held comment | A keeps edit and delete controls | - |
| HC-K-03 | P2 | Admin deletes held comment directly | Admin deletes it from the post | Gone; report closes | - |
| HC-K-04 | P2 | Author copies the comment link | A copies link of the held comment and sends to B | B cannot see it (until approve) | - |
| HC-K-05 | P3 | Author reports own held comment | A uses Report on it | No duplicate report or defined message | - |
| HC-K-06 | P3 | Author pins/shares own held comment | If options exist | Not available or harmless | - |

## L. Permissions

| ID | P | Case | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| HC-L-01 | P1 | Moderator without `community:report:action` | M2 tries Approve | Blocked (403/message), comment stays held | - |
| HC-L-02 | P1 | Moderator with the permission | M1 approves | Works | - |
| HC-L-03 | P2 | Admin without extra roles | Admin approves | Works | - |
| HC-L-04 | P2 | Member tries the approve API | A or B calls the approve endpoint | 403 | - |
| HC-L-05 | P2 | Member tries to read `status` | B inspects API response | No `status` field for held items | - |
| HC-L-06 | P2 | Author tries to publish own held comment by API | A calls approve | 403 | - |
| HC-L-07 | P3 | Member A tries comment_edits data | A requests another user's held edit | Not accessible | - |

## M. Surfaces: events and courses (repeat key cases)

| ID | P | Case | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| HC-M-01 | P1 | Event discussion: held comment hidden | A holds a comment on an event; B opens the event page | B does not see it | - |
| HC-M-02 | P1 | Event discussion: approve shows live | Admin approves | B sees it live | - |
| HC-M-03 | P1 | Course lesson: hidden from students | A holds a comment in a lesson; B (enrolled) opens lesson | Hidden | - |
| HC-M-04 | P1 | Course lesson: hidden from non-admin instructor | I1 opens the lesson | Hidden | - |
| HC-M-05 | P1 | Course lesson: admin/moderator sees with label | Admin and M1 open the lesson | Visible with label | - |
| HC-M-06 | P2 | Course approve notifies course staff as normal | Admin approves | Instructor gets the usual comment notification | - |
| HC-M-07 | P2 | Staff and trusted members skip the check | Admin, M1, I1 and T1 post the spam text | Posted live, never held, on F/E/C | - |
| HC-M-08 | P2 | Course discussion held edit | Hold an edit in a lesson | Same behaviour as feed | - |
| HC-M-09 | P2 | Event discussion held edit and reply | Hold an edit and a reply on an event | Same behaviour as feed | - |
| HC-M-10 | P3 | Course progress/completion not affected | Held comment on a lesson | No change to lesson completion or certificate | - |
| HC-M-11 | P3 | Group/paid space comments | Run HC-A-01 in a paid group or paywalled channel | Held comment hidden from other members | - |
| HC-M-12 | P3 | Live meeting chat comments (card title says Live) | If live comments exist, hold one | Hidden from other members; note result | - |

## N. Anonymous and alias comments

| ID | P | Case | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| HC-N-01 | P2 | Anonymous held comment | In an anonymous channel A posts spam as Anonymous, Post for review | Held; admin sees it with the right identity; B sees nothing | - |
| HC-N-02 | P2 | Approve anonymous comment | Admin approves | Shows "Anonymous N" to B, real name not leaked | - |
| HC-N-03 | P2 | Alias held then approved | Same with an alias | Alias shown correctly after approve | - |
| HC-N-04 | P2 | Author keeps edit/delete | A views own anonymous held comment | Edit and delete shown | - |
| HC-N-05 | P3 | Report row identity for anonymous | Open the report | Admin sees the real author as before, B never does | - |

## O. Content types inside a held comment

| ID | P | Case | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| HC-O-01 | P2 | Held comment with image | Spam text + image | Hidden from B, image not in media library for B; after approve both show | - |
| HC-O-02 | P2 | Held comment with GIF/emoji | Add a GIF and emoji | Same | - |
| HC-O-03 | P2 | Held comment with voice note | Add a voice note | Not playable by B; after approve plays | - |
| HC-O-04 | P2 | Held comment with link preview | Add a URL | No preview or link leaked to B | - |
| HC-O-05 | P2 | Held comment with mention | Mention @C | C gets nothing until approve (see HC-E-02) | - |
| HC-O-06 | P3 | Very long comment | Paste a very long spam text | Held correctly, layout fine | - |
| HC-O-07 | P3 | Non-English / emoji-only spam | Post spam in another language | Behaves per AI result; if held, same rules | - |
| HC-O-08 | P3 | HTML/script in the comment | Add `<script>` text | Escaped, no XSS in Reports or post | - |
| HC-O-09 | P3 | Empty/whitespace comment | Submit empty | Not submitted, no report | - |

## P. Spam Protection settings

| ID | P | Case | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| HC-P-01 | P2 | Settings text | Open Spam Protection settings | Text says a post or comment that looks like spam is held for review | - |
| HC-P-02 | P2 | Turn setting off while a comment is held | Turn Spam Protection off, check the held comment | Held comment stays held until admin decision (note result) | - |
| HC-P-03 | P2 | Trusted member list | Add A as trusted, A posts spam | Posted live, no warning | - |
| HC-P-04 | P3 | Settings changed while A is typing | Toggle during an open composer | No crash; next submit uses the new setting | - |
| HC-P-05 | P3 | Held post (not comment) regression | Hold a spam post | Post behaviour as before the PR; mentions notified only after approval | - |

## Q. Edge cases

| ID | P | Case | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| HC-Q-01 | P2 | Post deleted while a comment is held | Admin deletes the post | Report closes, nothing breaks, A's profile has no broken item | - |
| HC-Q-02 | P2 | Report cannot be filed (safety net) | If it can be simulated (report service down) | Comment is published normally, never stuck hidden | - |
| HC-Q-03 | P2 | Author removed or banned while held | Ban A | Held comment handled without error; admin can still decide | - |
| HC-Q-04 | P2 | Channel set to read-only or archived while held | Change channel then approve | Defined behaviour; no error | - |
| HC-Q-05 | P2 | AI re-scan never cancels a held report | Trigger a re-scan | Report and held state kept | - |
| HC-Q-06 | P3 | Slow network / offline submit | Submit while offline, then reconnect | No duplicate held comments | - |
| HC-Q-07 | P3 | Rate of held comments | A holds 10 comments quickly | 10 reports, no failure | - |
| HC-Q-08 | P3 | Back/forward navigation | A navigates away and back | Label and comment persist | - |
| HC-Q-09 | P3 | Time zones | Admin in another timezone approves | Approval time correct for each viewer | - |
| HC-Q-10 | P3 | Dark mode / small screen | View the label on mobile web and dark theme | Readable, not clipped | - |

## R. Mobile app and API (`/api/app/...`)

| ID | P | Case | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| HC-R-01 | P1 | App: B does not see held comment | B opens the post in the Android app | Hidden | - |
| HC-R-02 | P1 | App: author sees it with label | A opens the post in the app | Comment + "Under review" | - |
| HC-R-03 | P2 | App: spam warning flow | A posts spam in the app | Warning and Post for review work as on web | - |
| HC-R-04 | P2 | App: approve shows live/after refresh | Admin approves on web | App shows comment and count +1 | - |
| HC-R-05 | P2 | App: push for approve/reject | A has the app | Push received | - |
| HC-R-06 | P2 | App API list/single/replies | Call `/api/app/...` endpoints as B | Held comment never returned | - |
| HC-R-07 | P3 | App: no Reply/React on held comment | A opens held comment in app | Buttons absent | - |

## S. Regression (published comments unchanged)

| ID | P | Case | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| HC-S-01 | P1 | Old comments still show | Open posts with comments from before the PR | All visible to everyone | - |
| HC-S-02 | P1 | Normal comment, reply, react, edit, delete | Do each as A and B | Work as before | - |
| HC-S-03 | P2 | Normal comment notifications | A comments on B's post | B notified as before | - |
| HC-S-04 | P2 | Comment search and media library | Search normal comment, view media | Work as before | - |
| HC-S-05 | P2 | Performance of long comment threads | Open a post with 200+ comments | Loads in similar time to before | - |
| HC-S-06 | P3 | Reports page for other report types | Check post reports and member reports | Unchanged | - |

## Summary

| Section | Cases |
| --- | --- |
| A Reported bug and basic flow | 13 |
| B Visibility by role | 13 |
| C Hidden everywhere else | 16 |
| D Counts | 7 |
| E Notifications | 14 |
| F Reports page | 14 |
| G Approve | 10 |
| H Remove | 6 |
| I Edit flows | 14 |
| J Replies and reactions | 11 |
| K Author actions | 6 |
| L Permissions | 7 |
| M Events and courses | 12 |
| N Anonymous and alias | 5 |
| O Content types | 9 |
| P Spam settings | 5 |
| Q Edge cases | 10 |
| R Mobile app and API | 7 |
| S Regression | 6 |
| **Total** | **185** |
