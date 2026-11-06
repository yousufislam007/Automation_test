# Web explore: the MEMBER view, second pass (headed browser)

Site https://sqa.ezycommunity.pro.bd only, explored 2026-11-06 in a visible (headed) Chromium over CDP, 1 login (HTTP 200, no 429). View only: nothing was posted, joined, requested, registered, reacted, saved, followed or deleted. Names of other people are masked or left out. Adds to `web-explore-member.md` (first pass); read that one first.

**Account note:** the `.env` has the `WEB_MEMBER_EMAIL` / `WEB_MEMBER_PASSWORD` keys twice. The first pair (the one `dotenv` uses) logged in as a **different member from the first pass**: "Tanjil Siddique" (joined 2026-11-05, role Member, only General joined, no DMs, no enrolled courses), not "testerA A". So some counts differ from the first pass (45 members here). Decide which account the tests should use and remove the duplicate keys.

## 1. /talk (messages) as a member with no DMs
- `/talk` stays on `/talk` (no DM to auto-open, unlike the first pass). Header: back arrow "Back to community", "SQA Team / 45 members", three tiles `Threads`, `Mentions`, `Saved`, tabs `Direct messages` / `Rooms`.
- Empty states: Threads "No threads you're following yet. Reply to a message or follow a thread to see activity here."; Mentions "No mentions yet. When someone @-mentions you, it'll show up here."; Saved "No saved messages yet. Tap the bookmark on any message and it'll show up here."; Direct messages "No DMs yet." Right pane: "Nothing selected / Pick a room or DM to start. / Select a conversation to start chatting".
- **Rooms tab**: filter chips `All` / `Joined` / `Not joined`; `Joined` is empty ("... to browse."); rooms: "Test" (9 members, `Join`), "public message room" (7 members, `Join`), "New private Room" (lock, "Members only", `Request`), "private message room" (lock, `Request`); `+` next to "Rooms" and a `Create a new room` button. Clicking a public room (not joined) shows "Welcome to <room> / 7 members / Join to see the conversation and start chatting with the rest of the room." with `Join room` and the footer "Join this room to send messages" (no messages are visible before joining). Not clicked: Join, Join room, Request.
- **Create a room dialog** (opened, Escape closed it, nothing created): "Rooms organize conversations by topic. Make it public, private, or paid." TYPE cards **Public** ("Open to all..."), **Private** ("Listed but locked... must request to join"), **Hidden** ("Fully invisible... only admins can add members"); NAME & TILE (emoji/shape/image picker, default 📓), TOPIC (optional), note "You can change these later in Room settings."; `Cancel`, `Create room`. A member can open it (can create rooms).
- No `New DM` button was found on the Direct messages tab for this account (empty list, no start-DM control); DMs start from the `Message` button on member cards/profiles (not clicked).

## 2. Search dialog (Cmd+K button), real query "test"
- Result page title "Search results for "test"", tabs with counts: All 29, Posts 17, Comments 2, People 3, Events 4, Courses 3 (Library and Lessons tabs did not show for this query). Filter row: `All Spaces` (dropdown with its own filter box "Filter All Spaces..." and the channel list **including paid/private channels** Tunnel - paid, Private channel, Hydrogen), `Author`, `Date` (Any time, Past 24 hours, Past week, Past month, Past year), `Relevance` sort at the right. Hits are highlighted; post rows show author, age, title, one body line, channel, thumbnail. "View all 17" per group. Footer hint: navigate / select / esc. Typing is debounced (~2 s). Nothing was opened.
- Search results for this member contained only General and Mineral posts (no leak from the locked channels seen).

## 3. Notifications panel
Same as the first pass: "Notifications", `Mark all as read`, tabs All / Community / Mention / Other, group "Yesterday", rows "<member> posted in General: ...", "Anonymous 1 commented on your post: 265". Nothing clicked.

## 4. Library file previews (dialog, opened and closed)
12 `Preview <name>` buttons. Video file: dialog with "VID" badge, name, "Video - 98.0 MB - Added Oct 22 - 2 downloads", buttons `Play video`, `Close` (**no Download for the member**). Audio file: player with `Play`, `Seek backward 10 seconds`, `Seek forward 10 seconds`, `Playback rate 1`, `Mute`, time 0:00 / 1:57, `Download`, `Close`. PDF: "PDF document - 36.8 MB - Added Oct 15 - 2 downloads", `Download`, `Close` (no inline preview). Folders in dark mode: "folder testing" (1 item, Everyone), "paid" (1 item, Channel members). Locked file shows a lock icon next to the date. Nothing played or downloaded.

## 5. /events list (member)
- List tab: sub-chips Upcoming (2: "Test recurring", "event twwww"), Past (14), All (14). **Every row, including the 12 past events, shows an `RSVP` chip** (e.g. "Be the first to RSVP" on ended events). Detail pages of ended events show an "Ended" chip, "This event has ended", and **no Register button** (side card: date, "Virtual event - link after registration", duration, "N going", `Share event`).
- Ended event details: "Annual Charity Fundraising Gala" (4 Nov), "Digital Marketing Workshop(1)", "eVNT", "Event Test 3" (chip "Paid", tags #EVENT #APPOINTMENT), "in person meet" (map with Leaflet, "Open in Google Maps"), each with Discussion + `Comment`. No Add to Calendar button on ended events.

## 6. Theme (profile menu > Theme: Light / Dark / System)
Start: System selected (`aria-pressed`). `Dark` sets `<html class="dark">` and `localStorage.theme=dark`; `System` set it back to `theme=system` (restored, nothing else changed). Dark mode looked correct on /feeds, /courses and /library (no unreadable text, cover banner kept). Theme is stored client-side (localStorage key `theme`).

## 7. Responsive pass (390 px and 768 px, 11 pages)
Pages checked: /feeds, /courses, /events, /members, /library, /videos, /leaderboard, /profile/<slug>, /talk, /billing, /get-started. **Only `/members` overflows horizontally at both sizes** (390: scrollWidth 520 vs 380; 768: 848 vs 758): the two profile-question filter buttons next to the search box are cut off at the right edge and the page scrolls sideways. Role chips (All Members 45, Admin, Moderator...) scroll inside their own row. On mobile the header shows a menu icon + search, a bottom bar (Home, Videos, "+", Notifications, Chat), and the cover banner stays 4:1.

## 8. Other facts
- Courses page has **two `<main>` elements** (nested landmarks; /feeds has one). `Enrolled` tab for this account: "No enrolled courses / Courses you enroll in will show up here." Card for "testing course test": Paid, USD 555 / Monthly, `Enroll Now`; "Testing Manual Paid Course": "Invite only".
- Own profile (this member): Feeds shows own post; Comments tab "No comments yet / Comments on posts will appear here."; Channels lists General with `Visit channel`; Events "No events yet"; Saved empty. About: "You haven't added a bio yet." + three custom answers.
- /videos: list of videos with `Message` buttons (not clicked).

## 9. Possible bugs and oddities (each seen at least twice unless marked single; owner decides)
1. **/members at 390 and 768 px: page scrolls sideways, the profile-question filter buttons are clipped** (seen at both widths).
2. **Past events still show an `RSVP` chip on the list** while their detail page says "This event has ended" and has no Register button (all 12 past rows).
3. /courses has two `<main>` landmarks (single page, DOM check).
4. Search "All Spaces" lists paid/private channels to a member who cannot open them (channel names only; design may be intended).
5. `.env` has duplicate `WEB_MEMBER_*` keys and the first one is not the "testerA" member used before.

## 10. Not done (needs the owner's OK, changes data)
Join / Join room / Request (rooms), Create room, Message / start a DM and sending, Register / RSVP, React, Comment, Follow channel, Enroll / Get Access, Settings Save, Change password/email, Add payment method, Save address, Log out. Not explored: playing videos in /videos, the post "..." menu on this account's pages (same as first pass), appointment booking flow, coaching, certificate and community-app screens, the Android app as member.

## 11. Room join request round trip (2026-11-06, owner allowed it; data was changed)
Room: the private room "private message room" (2 members before). Member = Tanjil (2 logins today in total with the admin one, no 429).
1. Member: /talk > Rooms > click `Request` on the row opens a room preview "Private - private message room / 2 members / ...is a private room - request to join and an admin will review." with `Request to join`; that opens a form "Add a short note so ...'s admins know who you are. Optional. 0/500", `Cancel`, `Send request`. `POST /api/chat/v1/rooms/<id>/join-requests` 200. Then the panel shows "Request pending / Sent just now. You'll be notified when an admin reviews it." with the note and `Withdraw request`, footer "Waiting for admin approval". Note used: "QA test join request (automated check, 2026-11-06)".
2. Admin: bell notification (within a minute) "<member> is asking to join a private room: "<note>"" (Today). Clicking it opens `/dashboard/members/chat-room-requests?highlight=<id>` (page "Chat room requests - People asking to join private chat rooms. Approving adds them to the room immediately.", tabs Pending / Approved / Declined, row "<member> wants to join <room> - just now", `Decline`, `Approve`, the note). The sidebar item "Chat Room Requests" showed a badge 1. `Approve` -> `POST /api/chat/v1/join-requests/<id>/approve` 200; Pending says "Nothing here / No one is waiting for a decision."; Approved tab lists it with "Approved - just now". (The `Approved` tab button also matches `name: 'Approve'` in a non-exact Playwright locator: use `exact: true`.)
3. Member: notification "You're in! Tap to open #private message room" (1 minute later); the room moved to joined, "3 members", full message history became visible (older messages by other members).
4. Member sent "QA test message from member (2026-11-06)": composer `[contenteditable=true]` + `Send`, `POST /api/chat/v1/rooms/<id>/messages` 200, shown under "TODAY" with the member name and time.
5. **Admin "Team SQA" cannot read or write in that room**: opening it as admin shows the same join gate ("Request to join", "1 of 2 attempts left.", "Join this room to send messages") although the admin is the one who approved requests; admins are not members of a private room automatically. So the admin reply step was not done (not clicked: admin `Request to join`). Possible oddity: an admin who can approve a room cannot see its messages; also "1 of 2 attempts left" shows a join-attempt limit.
State left: member is now a member of that room and the test message stays in it; request status Approved. Not reverted.
