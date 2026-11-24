# Chat – manual test cases (app.ezycourse.com, school "amran")

Written from the 2026-11-19 exploratory run. "Result" = what I saw; **BUG** = confirmed problem.
Accounts: admin (school owner), Student A, Student B. Student chat URL: `https://amran.ezycourse.site/chat`.
Admin chat: Messages icon (top right) -> `/s/<school>/chat`. Admin settings: left sidebar Manage -> Chat.

Tip: the login API is rate limited. Log in once per account and keep the browser open.

## A. Admin – rooms (chat page)

| ID | Steps | Expected | Result |
| --- | --- | --- | --- |
| A-01 | Click Create room, leave Name empty, click Create room | Error "Give the room a name." dialog stays | Pass |
| A-02 | Create room: name, description, Public, Everyone can send | Room opens, admin is the only member | Pass |
| A-03 | Create room: Private + Admins and moderators only | Room shows lock icon; admin can still send | Pass |
| A-04 | Room settings (gear): change name, description, visibility, send option, Save | Values saved; empty name shows the same error | Pass |
| A-05 | After A-04 (rename), look at the page and reload | Room stays open under the new name | **BUG**: old link kept, "Conversation not found", reload does not fix it, only clicking the room in the list does |
| A-06 | Room info (member count button) | Name, Public/Private, members with role | Pass |
| A-07 | Room info -> ban icon next to a member -> Cancel, then Ban | Cancel keeps member; Ban removes them | Pass |
| A-08 | Leave room (header icon) on a private room | Confirm: "you'll need to ask to join again" | Pass |
| A-09 | Room list count vs header count after a ban | Counts match | Sidebar count updated late once (minor) |

## B. Admin – messages

| ID | Steps | Expected | Result |
| --- | --- | --- | --- |
| B-01 | Empty or spaces-only message | Send disabled | Pass |
| B-02 | Type text, Enter | Message sent | Pass |
| B-03 | Shift+Enter between lines | New line, one message | Pass |
| B-04 | Bold, Italic, Inline code, Code block, Bulleted list, Numbered list (toolbar) | Rendered correctly | Pass |
| B-05 | Type `<img src=x onerror=alert(1)> <b>raw</b>` | Shown as plain text, no script/bold | Pass |
| B-06 | Emoji button, pick an emoji | Emoji inserted | Pass |
| B-07 | Type `@` then letters, Enter | Only room members (and "everyone") offered; mention highlighted | Pass |
| B-08 | Attach file (.txt) and image, Send | File card / image appears | Pass |
| B-09 | Hover message -> React -> pick one | Reaction chip with count; click chip again removes | Pass |
| B-10 | ... menu -> Edit message -> change -> Save | Shows "(edited)" | Pass |
| B-11 | ... menu -> Pin message | "Pinned" label; listed in Pinned messages panel | Pass |
| B-12 | ... menu -> Save message | Appears in Saved | Pass |
| B-13 | ... menu -> Delete message -> Cancel, then Delete | Confirm text; Cancel keeps; Delete removes message and its thread | Pass |
| B-14 | Reply in thread, send reply, Follow/Unfollow | Reply count on message; button text switches Follow/Unfollow | Pass |
| B-15 | Threads, Mentions, Saved (top buttons) | Lists open; Threads shows unread badge | Pass |
| B-16 | Voice message, video attach | Not tested | – |

## C. Manage > Chat (admin)

| ID | Steps | Expected | Result |
| --- | --- | --- | --- |
| C-01 | Direct messages: choose "Anyone in the school" | Any two students can DM | Pass |
| C-02 | Choose "People who are connected" | Students sharing a room can DM | Pass |
| C-03 | Choose "Off", open an existing DM as a student | DM sending disabled with a clear reason | **BUG**: footer says "Only admins and moderators can send messages in this room." (it is a DM) |
| C-04 | Rooms tab -> Create room (empty name, then valid) | Same dialog and validation as chat page | Pass |
| C-05 | Row ... -> Edit room | Dialog prefilled; save updates the list | Pass (students see new name only after reload) |
| C-06 | Row ... -> Archive room | "Archived" badge, row greyed | Pass (no confirmation asked) |
| C-07 | Archived row ... -> Restore room | Badge removed | Pass |
| C-08 | Row ... -> Delete room -> Cancel, then Delete | Warning "removed for everyone, can't be undone"; room gone | Pass; student viewing it sees "Conversation not found" at once |
| C-09 | Join requests tab (private room request pending) -> Decline / Approve | Request leaves the list; Approve adds the student | Approve passes; Decline not tested |
| C-10 | Bans tab -> Unban | Ban removed; student can join again | Pass |
| C-11 | Open Manage > Chat after a student requests/gets banned | Counts update (tab badge "1", "1 request" on room) | Pass |

## D. Student

| ID | Steps | Expected | Result |
| --- | --- | --- | --- |
| D-01 | Log in at the school site, click Chat icon | Chat opens; New message icon only, no Create room | Pass |
| D-02 | Open a public room not joined yet | Preview card with "Join room" | Pass |
| D-03 | Join room | Full history visible; message box appears; header has Pinned, members, Leave | Pass |
| D-04 | Own message ... menu | Save, Edit, Delete (no Pin) | Pass |
| D-05 | Other person's message ... menu | Save only | Pass |
| D-06 | Open pinned panel | Pinned messages listed | Pass |
| D-07 | React, thread reply, Save on admin's message | Works; student auto-follows own thread | Pass |
| D-08 | Mention admin with @ | Highlighted; appears in admin's Mentions | Pass |
| D-09 | Open an admin-only ("Team posts only") room | No message box; text "Only admins and moderators can send messages in this room." | Pass |
| D-10 | Leave a public room, join it again | Confirm text; can rejoin | Pass |
| D-11 | Open a private room -> Request to join (with note) | "Request pending", note shown, Withdraw request | Pass |
| D-12 | Withdraw request, request again | Attempts counter ("1 of 2 attempts left") | Pass |
| D-13 | After admin approves | Room opens with message box | Pass |
| D-14 | Admin bans student, student clicks Join room | Toast "You are banned from this room." (403) | Pass (the Join button still shows) |
| D-15 | Student list shows private rooms they are not in | Per the create dialog: "Only its members see it" | Needs owner decision (names and member counts are visible) |
| D-16 | Mentions page lists a mention; Saved lists saved messages; Threads lists followed threads | Lists correct | Pass |
| D-17 | Bell on student site after a mention/DM | Not clear if chat should notify | Bell shows only community notifications |

## E. Direct messages

| ID | Steps | Expected | Result |
| --- | --- | --- | --- |
| E-01 | New message icon, search a name that does not exist | "Nobody matches that name." | Pass |
| E-02 | Search by part of a name | Matching people, role label | Pass |
| E-03 | Pick a person, send a message | DM opens; other user gets it live with unread badge | Pass |
| E-04 | Reply from the other user | Appears live | Pass |
| E-05 | Block (icon in DM header) -> confirm | Blocker sees "You blocked X. Unblock to send messages."; other user's box is replaced by "You can't reply to this conversation." | Pass |
| E-06 | Unblock | Both can send again (other side may take a few seconds) | Pass |

## Known bugs to report
1. A-05: renaming a room leaves the old link -> "Conversation not found" (also from student side and from Manage > Edit room).
2. C-03: wrong footer text for DMs when Direct messages is Off.

## Not covered
Voice and video messages, large files, group DMs, notification emails, moderator role, "Decline" for join requests, Manage > Activity logs.

## Re-check 2026-11-24 (school ezyyousuf-hqtm4o, admin + User1)

Status of earlier reports. "Not re-checked" = no new evidence this run.

| Earlier report | Status now | Notes |
| --- | --- | --- |
| A-05 stale link after room rename ("Conversation not found") | **Still a bug** | Admin: URL stays on the old slug, "Conversation not found", reload does not fix it. Student side opens the new slug and sees the new name live (within ~20 s). |
| Admin cannot delete members' messages | **Fixed** | Admin "Message actions" on a member's message now offers Save / Pin / **Delete message**. |
| Private room visible to non-members | **Still present** | Student sees "QA Secret Room" and "Private room" in the list; opening shows "Private", "Join room" button. Possibly by design (owner question). |
| Admin Ctrl/Cmd+K search | **Still dead** | Ctrl+K opens nothing. |
| Create room, send, student join, student message | Pass | Regression of the basics. |
| DM-off footer text, banned user "Join room", over-limit draft erase, 0-byte upload label, @everyone by Team member, moderator permissions, deleted file URL, admin header badge | Not re-checked | Ban test blocked: could not find the Room info members button. |

Cleanup: test room "QA Regress A Renamed" deleted from Manage > Chat.

### Re-check 2026-11-24, part 2 (owner said these are fixed)

| Reported issue | Status now | Evidence |
| --- | --- | --- |
| Admin has no Delete option for members' messages | **Fixed** | Admin menu on a member's message shows Delete message. |
| Moderator cannot pin any message | **Fixed** | Moderator pinned the admin's message; it shows "Pinned" and the Pinned count went up. Moderator menu on others' messages: Save / Pin / Delete. |
| Moderator cannot ban members | **Fixed** | Room info shows an actions menu with Ban next to a regular member (not next to Team members); ban confirm text correct; member left the room (3 -> 2). |
| `@everyone` does not work for custom role with full chat permissions | **Looks fixed (not fully proven)** | Moderator's `@everyone` message raised the admin's Mentions count to 1. The message text is plain in the DOM for admin and moderator alike, so only the Mentions count shows it worked. No custom role other than Moderator was available to test. |
| Banned user still sees "Join room" button | **Still present** | Banned student sees the Join room button; clicking shows "You are banned from this room." (so it is blocked, but the button is misleading). |

Cleanup: room "QA Regress B" deleted (bans went with it).
