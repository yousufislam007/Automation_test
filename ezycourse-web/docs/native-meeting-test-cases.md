# Native Meeting: test cases (web admin + Android app)

Status: **DRAFT for review. Nothing has been run.** Testing starts only after the owner says so.
Site: the EzyCourse site in `ezycourse-web/.env`. Web = admin / host side. App = student side (Android, `ezycourse-app`).

## What "Native Meeting" is here (from earlier notes, 2026-10-16 to 10-29)
- An event type of **Appointments** (event type "Native Meeting", Video Meeting, Secured yes/no, duration, Public/Private) and of **Events** (the "video meeting" type).
- Admin joins from the booked list (`/dashboard/appointments/booked/<id>/`, row action **Join Meeting**), opens a new tab with a **lobby** (camera, name, **Join now**), then the room as **HOST** with a timer, "Meeting ends in N min" and **End meeting** (Cancel / Leave meeting / End for everyone).
- Student joins from the app card (Profile > Appointments & Events) or the Events pop-up. Join is disabled with a countdown until the host starts the room, then shows **Live now / Join now**.
- Admin list of all rooms: `/dashboard/meeting/` (Room ID, Title, Product Type, Product ID, Host, Scheduled Start, Status, Duration).
- Known from the first run (2026-10-29, see `appointment-meeting-test-cases.md`): wrong countdown ("Starts in 7d") before the host starts; after "End for everyone" the app card and the web row did not show Ended. These are re-checked below (NM-END-05, NM-END-06, NM-TIME-04).

## Phase 0: discovery (needed before the cases below are final)
I have not yet seen every control inside the room. Phase 0 is a view-only walk of the lobby and the room on web and app to list every button, menu and setting. **Any control found that has no case below gets a case added before testing it**, so nothing is missed. Cases marked (verify) assume a control that may not exist; if it does not exist the result is "Not available", not "Pass".

## Setup and rules for running
- Accounts: admin (host), student (participant), and the course manager / second student if in `.env` (second participant). A second participant needs a second browser profile or a second device.
- One login per account, reuse the session. Never retry a login (about 10 per window, then 429 for 10-15 min).
- Audio / video: Chromium fake devices (`--use-fake-device-for-media-stream --use-fake-ui-for-media-stream`, optional `--use-file-for-fake-audio-capture`). On the phone: real mic and camera, permission dialogs handled by Appium. I can verify that a stream is sent and received (track state, audio level, a remote video element playing); I cannot judge audio quality by ear. Anything that needs a human ear or eye is marked **(owner check)**.
- **End meeting / End for everyone, cancel, delete and refunds are irreversible. Each runs once on a booking made for that test, with the start state recorded and a stop check.** No bulk creation: one booking per case that needs one.
- Mask student and host names, emails, meeting links and tokens in notes. Delete temporary screenshots, recordings and downloads.
- A bug is listed after it repeats twice. Confirmed bugs go to the Discord webhook (cropped screenshots), never the URL.

## A. Create and configure a Native Meeting (web admin)
| ID | Steps | Expected |
| --- | --- | --- |
| NM-SET-01 | Appointments > create an event, open Event Type. | "Native Meeting" is offered next to other types. |
| NM-SET-02 | Create with all required fields only. | Saved; shows in the list with type Native Meeting. |
| NM-SET-03 | Leave each required field empty one at a time. | Clear validation message per field, nothing saved. |
| NM-SET-04 | Title: 1 char, 120+ chars, emoji, HTML/script text, only spaces. | Accepted or rejected consistently; no raw HTML rendered. |
| NM-SET-05 | Duration: 5, 15, 20, 60, 480 min, 0, negative, decimal, text. | Valid values saved; invalid rejected. |
| NM-SET-06 | Secured Yes / No. | The setting is saved and changes the join behaviour (see NM-SEC). |
| NM-SET-07 | Public vs Private visibility. | Private not visible to students who are not invited. |
| NM-SET-08 | Availability: days, time windows, buffer, timezone (verify each). | Slots shown to students follow the rules and the timezone. |
| NM-SET-09 | Price: free, paid (verify), currency, coupon (verify). | Free books directly; paid goes through checkout. |
| NM-SET-10 | Max attendees / seats (verify). | Limit enforced at booking and at join. |
| NM-SET-11 | Description, image, host/staff assignment (verify). | Shown on the student side. |
| NM-SET-12 | Edit an event that has bookings. | Existing bookings keep their slot; the change is clear to the admin. |
| NM-SET-13 | Duplicate / disable / delete the event (verify; delete only my own test event). | Disabled event cannot be booked; delete handles existing bookings with a warning. |
| NM-SET-14 | Events type "video meeting" (Events > create): repeat NM-SET-02/03/05. | Works the same; see NM-EVT. |

## B. Booking (student, web and app)
| ID | Steps | Expected |
| --- | --- | --- |
| NM-BOOK-01 | Student books a free slot (web). | Booking confirmed, appears in the booked list (web) and in the app card. |
| NM-BOOK-02 | Student books on the app. | Same result as NM-BOOK-01. |
| NM-BOOK-03 | Book a slot already taken / book the same slot twice. | Blocked with a clear message (note: two bookings at the same 12:00 slot were seen before). |
| NM-BOOK-04 | Book a slot in the past or at "now". | Blocked or clearly handled. |
| NM-BOOK-05 | Timezone: student in another timezone (change browser timezone). | Slot time converts correctly; the app shows the local time. |
| NM-BOOK-06 | Reschedule within the allowed window. | New slot saved; the old slot is free; admin list updates. |
| NM-BOOK-07 | Reschedule / cancel after the "changes allowed until" time. | Blocked (buttons disabled, text explains it). |
| NM-BOOK-08 | Cancel a booking (own test booking only). | Card gone from the app; admin row shows cancelled; slot freed. |
| NM-BOOK-09 | Confirmation email / notification to student and host (check the test inbox if available). | Sent once, correct time, correct join link. |
| NM-BOOK-10 | Add to Calendar (web and app). | Correct title, time, link; the Android chooser opens and can be cancelled. |
| NM-BOOK-11 | Admin books for a student (verify). | Appears for that student only. |

## C. Joining and the lobby
| ID | Steps | Expected |
| --- | --- | --- |
| NM-JOIN-01 | Host: booked list > Join Meeting. | New tab with the lobby (camera preview, name, Join now). |
| NM-JOIN-02 | Host joins before the slot time. | Allowed or a clear message; record the allowed window. |
| NM-JOIN-03 | Student taps Join before the host started. | Disabled with a correct countdown and the text "You can join once the meeting starts". |
| NM-JOIN-04 | Host starts the room. | The app card turns to "Live now" with Join now enabled, without a manual refresh (record how long it takes). |
| NM-JOIN-05 | Student joins on the app. | Lobby (mic / camera toggles), then in the room; host sees the student. |
| NM-JOIN-06 | Student joins on web (same booking). | Same as NM-JOIN-05. |
| NM-JOIN-07 | Lobby: name field empty, very long, special chars. | Validation or trimmed; name shown correctly in the room. |
| NM-JOIN-08 | Lobby: join with mic off / camera off / both off. | Joined in that state; tiles show it. |
| NM-JOIN-09 | Lobby: permission denied for mic / camera (browser and Android). | Clear message; can still join without the device; no crash. |
| NM-JOIN-10 | Lobby: no camera / no mic device present. | Graceful message; join possible. |
| NM-JOIN-11 | Lobby: device selector for mic, speaker, camera (verify). | Lists devices; the choice is applied in the room. |
| NM-JOIN-12 | Join with the meeting link while logged out. | Redirected to login or blocked, per the Secured setting. |
| NM-JOIN-13 | Join with a link of someone else's booking (another student). | Blocked. |
| NM-JOIN-14 | Open the room in two tabs / two devices with the same user. | Handled consistently (second session replaces or is blocked, no ghost tile). |
| NM-JOIN-15 | Join after the slot's end time / after "End for everyone". | Cannot rejoin; clear message. |
| NM-JOIN-16 | Join with a capacity limit reached (verify). | Blocked with a message. |
| NM-JOIN-17 | Join latency: time from tap to first remote video. | Recorded; no hang over 15 s. |

## D. Audio and video
| ID | Steps | Expected |
| --- | --- | --- |
| NM-AV-01 | Mic on: speak (fake audio file) on web; check on the other side. | Remote audio track active, level above silence; speaking indicator shown. **(owner check: clarity)** |
| NM-AV-02 | Mic mute / unmute, repeated 10 times quickly. | State matches the icon on both sides; no stuck state. |
| NM-AV-03 | Camera on / off, repeated 10 times. | Remote tile switches between video and avatar/initial; no frozen frame. |
| NM-AV-04 | Audio from the app to web, and web to app. | Both directions work. |
| NM-AV-05 | Video from the app to web, and web to app. | Both directions work. |
| NM-AV-06 | Switch camera front/back on the app (verify). | Works; the other side sees the new view. |
| NM-AV-07 | Change mic / speaker / camera mid-meeting (verify). | Takes effect without leaving. |
| NM-AV-08 | Speaker volume / output mute (verify). | Applies locally only. |
| NM-AV-09 | Active-speaker highlight with 2 and 3 participants. | The highlight follows who talks. |
| NM-AV-10 | Layout: grid vs speaker view, pin a participant, fullscreen (verify each). | Works; pin and fullscreen can be undone. |
| NM-AV-11 | Video quality / resolution / background blur or virtual background (verify). | Setting applies; no crash. |
| NM-AV-12 | Noise suppression / echo cancellation toggle (verify). | Setting applies. |
| NM-AV-13 | Host mutes a participant's mic / turns off camera (verify). | Participant sees it; can they unmute themselves is recorded. |
| NM-AV-14 | App to background (home button) for 30 s with mic on, then return. | Audio/video resume or a clear rejoin prompt. |
| NM-AV-15 | App: incoming phone call or lock screen during the meeting. | The meeting recovers afterwards. |
| NM-AV-16 | App: Bluetooth / wired headset connect and disconnect (if available). | Audio route follows. |

## E. Screen share
| ID | Steps | Expected |
| --- | --- | --- |
| NM-SCR-01 | Host shares screen / a tab / a window (web). | Participants see it; sharing indicator shown. |
| NM-SCR-02 | Student shares (if allowed). | Allowed or blocked per setting; message clear. |
| NM-SCR-03 | Stop sharing (button and the browser's own stop bar). | Share ends on both sides, layout returns. |
| NM-SCR-04 | Two people try to share at the same time. | One at a time or both handled; no stuck tile. |
| NM-SCR-05 | App viewing a share; rotate the phone. | Remains visible, correctly scaled. |
| NM-SCR-06 | App starts a screen share (verify). | Android permission dialog; works or "Not available". |
| NM-SCR-07 | Share with system / tab audio (verify). | Audio reaches the other side. |

## F. In-room chat, reactions and other tools (each only if found in Phase 0)
| ID | Steps | Expected |
| --- | --- | --- |
| NM-CHAT-01 | Send a message host -> student and student -> host. | Delivered both ways in real time, correct name and time. |
| NM-CHAT-02 | Empty, whitespace-only, 5000 chars, emoji, link, HTML/script. | Empty blocked; long handled; HTML not executed; link clickable and safe. |
| NM-CHAT-03 | Message history for a late joiner. | Late joiner sees earlier messages (or not, record it). |
| NM-CHAT-04 | Unread badge when the chat panel is closed. | Badge counts and clears on open. |
| NM-CHAT-05 | File / image attachment in the chat (verify; one file only). | Sent and downloadable, or "Not available". |
| NM-CHAT-06 | Chat after the meeting ended. | Not writable; history behaviour recorded. |
| NM-TOOL-01 | Raise hand / lower hand (verify). | Host sees the hand; ordering shown. |
| NM-TOOL-02 | Emoji reactions (verify). | Appear on both sides and fade. |
| NM-TOOL-03 | Polls, Q&A, whiteboard, notes, breakout rooms, waiting room, captions/transcript, file share (verify each). | One block of cases per tool found in Phase 0, created then. |

## G. People panel and host controls
| ID | Steps | Expected |
| --- | --- | --- |
| NM-PPL-01 | Open People on web and on the app. | Lists everyone with the right names and a HOST tag. |
| NM-PPL-02 | A participant joins and leaves. | The list and the participant count update live; a join/leave sound or notice (verify). |
| NM-PPL-03 | Host removes a participant (verify). | The participant is thrown out with a message; can or cannot rejoin is recorded. |
| NM-PPL-04 | Host mutes all / mute one / lock the room (verify). | Applies to participants; a locked room blocks new joiners. |
| NM-PPL-05 | Make a participant co-host / transfer host (verify). | Controls change for that person. |
| NM-PPL-06 | A student cannot see host-only controls (End for everyone, remove, mute others). | Controls hidden and the API refuses direct calls. |
| NM-PPL-07 | Host leaves (Leave meeting) while the student stays. | Room continues or ends, per the rule; the student sees a clear state. |
| NM-PPL-08 | Student leaves and rejoins 3 times. | No duplicate tiles, no stuck "ghost" participant. |
| NM-PPL-09 | Three or more participants (admin, student, course manager). | All tiles and audio work; the list is correct. |

## H. Timer, duration and time rules
| ID | Steps | Expected |
| --- | --- | --- |
| NM-TIME-01 | Timer in the room. | Counts up from start; matches the other side within 2 s. |
| NM-TIME-02 | "Meeting ends in N min" text. | N matches the event duration minus elapsed time. |
| NM-TIME-03 | Warning before the end (verify, e.g. 5 min / 1 min). | A visible warning appears. |
| NM-TIME-04 | Student countdown on the app card before the host starts. | Counts to the booked slot start (the 29 Oct run counted toward the wrong date; re-check). |
| NM-TIME-05 | Let the meeting run to the end of the duration. | Auto-ends or offers an extension; both sides are told; status becomes Ended. |
| NM-TIME-06 | Device clock / timezone differences (browser timezone changed). | Times shown are correct for that timezone. |
| NM-TIME-07 | Meeting longer than the duration if the host keeps it open. | Behaviour recorded (hard stop or allowed). |

## I. End, leave and status
| ID | Steps | Expected |
| --- | --- | --- |
| NM-END-01 | Student taps Leave. | Student back to the card; the host stays; the list shows one fewer person. |
| NM-END-02 | Host: End meeting > dialog. | "End meeting for everyone?" with Cancel / Leave meeting / End for everyone. |
| NM-END-03 | Dialog > Cancel. | Dialog closes, meeting continues. |
| NM-END-04 | Dialog > Leave meeting. | Host leaves; the room state follows NM-PPL-07. |
| NM-END-05 | Dialog > End for everyone (once, fresh booking). | All participants are disconnected at once; nobody can rejoin. |
| NM-END-06 | After END-05: app card, calendar list, web booked list, `/dashboard/meeting/`. | All show **Ended** and no Join action (first run showed "Live now" and Join; re-check). |
| NM-END-07 | End without a student ever joining. | Ends; the status is Ended everywhere. |
| NM-END-08 | Close the host tab without leaving. | Room ends or the host is shown as disconnected after a timeout; record which. |
| NM-END-09 | After the meeting: the student is sent to a feedback/summary page (verify). | Page shown; no broken link. |
| NM-END-10 | Browser Back after ending. | Cannot re-enter the room. |

## J. Recording, transcript and after-meeting data (verify)
| ID | Steps | Expected |
| --- | --- | --- |
| NM-REC-01 | Host starts / stops recording. | A recording indicator is visible to everyone; start/stop works. |
| NM-REC-02 | Participants are told when recording starts. | A notice is shown. |
| NM-REC-03 | After the meeting: the recording is listed and plays (web admin). | Appears after processing; video and audio play; duration is right. |
| NM-REC-04 | Students' access to the recording. | Follows the setting. |
| NM-REC-05 | Download / delete the recording (one file, own test only). | Works; delete asks for confirmation. |
| NM-REC-06 | Transcript / AI summary (verify, spend or credits check first). | Generated; credits shown correctly. |
| NM-REC-07 | Attendance report: who joined, when, how long. | Matches the real join/leave times. |

## K. Admin list `/dashboard/meeting/`
| ID | Steps | Expected |
| --- | --- | --- |
| NM-DASH-01 | Open the list. | Columns: Room ID, Title, Product Type, Product ID, Host, Scheduled Start, Status, Duration. |
| NM-DASH-02 | Our test meetings appear with correct data. | Matches the booking. |
| NM-DASH-03 | Status changes: Scheduled > Live > Ended. | Updates; matches the booked list. |
| NM-DASH-04 | Search, filter, sort, pagination (verify each). | Work and keep the state on refresh. |
| NM-DASH-05 | License / usage numbers: `/api/teacher/ezy-meeting/license` returned 404 earlier. | Re-check; no broken page or console error. |
| NM-DASH-06 | Row actions: view, join, delete (verify). | Work; delete only my own test rows, with confirmation. |

## L. Events type "video meeting" (student pop-up, calendar)
| ID | Steps | Expected |
| --- | --- | --- |
| NM-EVT-01 | Register for the event; pop-up shows the countdown. | Registration works; the join button is disabled with a correct countdown. |
| NM-EVT-02 | At the start time: Join Event. | Opens the same native room. |
| NM-EVT-03 | Cancel Registration; the bell and calendar icons. | Work as labelled. |
| NM-EVT-04 | Max attendees reached (the seat limit). | Next person cannot register. |
| NM-EVT-05 | Recurring event: each occurrence opens its own room. | Separate rooms, correct dates. |

## M. Security and permissions
| ID | Steps | Expected |
| --- | --- | --- |
| NM-SEC-01 | Secured: Yes vs No: join logged out, join with a link copied from the room. | Secured requires login/authorisation. |
| NM-SEC-02 | A student who did not book opens the room link. | Denied. |
| NM-SEC-03 | A student calls host-only APIs (end, remove, mute) directly. | 403. |
| NM-SEC-04 | The link in notifications and chat previews contains a login token (seen in the app chat preview). | Token is single-use / short-lived; report if not. |
| NM-SEC-05 | Link of an ended meeting. | Dead. |
| NM-SEC-06 | Admin of another role (course manager) opens the booked list. | Allowed or denied per role. |
| NM-SEC-07 | XSS in name, title, chat. | Escaped. |

## N. Reliability and network
| ID | Steps | Expected |
| --- | --- | --- |
| NM-NET-01 | Web: go offline 10 s, then online. | "Reconnecting" state, then automatic recovery. |
| NM-NET-02 | App: Wi-Fi off 10 s / switch Wi-Fi to mobile data. | Same recovery. |
| NM-NET-03 | Throttle to a slow network (CDP). | Video degrades, audio keeps; no crash. |
| NM-NET-04 | Refresh the host page in the room. | Rejoins as host (or lobby), no duplicate tile. |
| NM-NET-05 | Kill the app and reopen during a live meeting. | The card shows Live now; rejoin works. |
| NM-NET-06 | 30-minute soak with 2 participants. | No memory growth crash, no audio drift, timer correct. |
| NM-NET-07 | Rate limits: `POST /api/student/socket/connect` returns 429 on some loads. | Note only; the room still connects. |

## O. UI, responsive and accessibility
| ID | Steps | Expected |
| --- | --- | --- |
| NM-UI-01 | Lobby and room at 1440, 1024, 768, 390 px. | No overflow; controls reachable. |
| NM-UI-02 | App: portrait and landscape rotation in the room. | Layout adapts; no black tiles. |
| NM-UI-03 | Dark / light theme, language (verify). | Texts readable; translations present (the Japanese test found missing ones elsewhere). |
| NM-UI-04 | Keyboard navigation and focus order in lobby and room (web). | All controls reachable; visible focus. |
| NM-UI-05 | Button labels / tooltips / aria-labels. | Every icon button has a name. |
| NM-UI-06 | Console errors and failed requests during a full meeting. | None, or listed. |
| NM-UI-07 | Browser support: Chromium, and Firefox / WebKit (verify; Playwright only). | Works or a clear unsupported message. |

## P. Cross-platform end-to-end (web host <-> app student)
| ID | Steps | Expected |
| --- | --- | --- |
| NM-X-01 | Full flow: create event, student books on the app, host joins on web, student joins, talk, chat, share, end. | Everything works; statuses end up Ended on every screen. |
| NM-X-02 | Reverse: student on web, host on web, second student on the app. | Same. |
| NM-X-03 | Host on the app (if a teacher app exists, verify). | Same as web host or "Not available". |

## Discovery log (2026-11-10, admin host, view only except the one instant meeting created)

Site: `https://ezyyousuf.ezycourse.com`. Native Meeting is a product of its own at **`/dashboard/meeting/`** (Products & Services > Meetings, "Native Meeting List"), built on Skreno (`/api/teacher/skreno/*`). It is bigger than the appointment event type, so the cases below are ADDED to the sections above.

**Meeting list page:** licence banner ("License Active, Hosts: 1, Max Participants: 300"); **Your Personal Room** card (permanent room URL, up to 5 participants, button "Create your personal room"); **New meeting** menu with "Start an instant meeting" and "Schedule a meeting"; filter dropdown (All) and Sort (Default); table columns Room ID, Title, Product Type (INSTANT / appointment / event), Product ID, Host, Scheduled Start, Status (Completed...), Duration, Type, Format, Security, Recording, Created at, Join, Action ("No actions" on completed rows). Only one Instant or Personalized meeting can run at a time (you may hold several drafts).

**New Instant Meeting dialog** (tabs Information / Settings, buttons Cancel, Create, Create & Start):
- Information: Maximum participants (default 5, plan max 300), **Secured meeting (require admission)** = waiting room (default ON).
- Settings (all default ON): Participants can chat; can ask questions (and "Questions are visible to everyone"); can see who else is here; can share their screen; can unmute themselves (off = everyone joins muted).
- API: `POST /api/teacher/ezy-meeting/instant/create` body `{maxParticipants, isSecured, userZone, participantSettings:{allow_chat, allow_questions, allow_qa_visible_to_all, allow_see_participants, allow_screen_share, allow_audio}}`, then `POST /api/teacher/ezy-meeting/instant/<roomId>/start`. Room URL: `/room/<uuid>` (opens in a new tab).
- A web-push prompt ("We'd like to notify you...", Later / Allow) can appear over the dialog and blocks clicks: dismiss with Later.

**Lobby** (`/room/<uuid>`): name field (prefilled), microphone and camera toggles (both OFF by default), microphone select, camera select, **Join now**, gear "Device settings": Camera (preview, camera select, Mirror my camera), Audio (microphone, speaker & headphones, Noise suppression ON, Echo cancellation ON, Auto gain control OFF), Visual effects (Backgrounds: None, Slight Blur, Blur, Add image, Office, Home Office, Bookshelf, Conference and more; Filters tab).

**Room, host view:** timer (01:17) and "2:58:42 left" (a 3-hour meeting), your tile with HOST tag. Bottom bar: Microphone, Camera, Share screen, **React** ("2 left"), **Record**, Chat, **Waiting** (waiting room), Q&A, **Polls**, **Offers** (show a special offer to everyone), People (count badge), Settings (gear), **End meeting**.

**In-room panels seen so far:** People (search, tabs All / Hands / Speaking, host row with HOST tag); Settings dialog with tabs **Room** (live toggles, "applies to everyone, immediately": Chat, Q&A, Everyone sees questions, Participant list), Camera, Audio, Visual effects. Chat, Waiting, Q&A, Polls, Offers, React and Record panels are not opened yet.

**Access:** opening `/room/<uuid>` as student 2 with no token shows **"Unable to Access Meeting — Missing meeting token."** (expected for a bare link; students must get a link with a token). Still to find: where the host copies the invite link or how a student gets the token for an instant meeting (list "Join" / "Action" for the running row, or a share control in the room).

**Scheduled meeting and how students reach it (2026-11-10, run 1):**
- Form "New Scheduled Meeting": title (max 120), Date & time (picker, typing `YYYY-MM-DD HH:mm` works), Duration (default 60), Timezone (default Dhaka), Max participants (default 5), Secured (default on), plus the same six participant switches. API `POST /api/teacher/ezy-meeting/check-schedule-overlap`, then `POST /api/teacher/ezy-meeting/instant/create` with `title, scheduledStartTime, durationMinutes, timezone`. The list shows it as **Draft**, Product Type INSTANT, Format "Instant 1-on-1" (looks mislabelled), with a **Start** button; the row menu has **Generate Invite Link** and **Delete draft**.
- **Overlap rule:** a second meeting whose time falls inside a Draft meeting's window is not created (no row appeared; the form gave no visible reason I could see). Keep scheduled meetings apart, or delete the draft.
- **Community:** Community page > Meetings tab > "Meeting List" (an Ant select, pick with the keyboard) + **Add Meeting** posts it (`POST /api/teacher/community/createFeed`, `uploadType: NATIVE_MEETING`). Empty select + Add Meeting shows "Please select a meeting". The post shows a countdown, then "The meeting has started! Join Meeting". Students must be community members: **Join now** on a free community opens a checkout with **Complete Purchase** (free).
- **Student join (web and app), secured meeting:** Join Meeting opens `/room/<uuid>` with "Request to join" + name + **Request admission**; student sees "Waiting for the host… / Cancel request". Host: **Waiting** panel shows "n / 5 in room · k slots open", each request with **Deny / Admit**. Web student 2 went straight into the room after Admit; the **app student got a pre-join screen** ("Choose how you want to join": Mic on, Camera off, **Join meeting**) first, then the room: 3 tiles, timer, bottom bar Mic, Camera, Raise hand, Chat, "..." More, End call. Android showed a **"find, connect to and determine relative position of nearby devices" permission dialog** at join. Student web toolbar: Microphone, Camera, Share screen, Raise hand, React, Chat, Q&A, Polls, People, Settings, Leave (no Record, Waiting, Offers, End).
- Display names: students and the host share a first name, so tiles show "Yousuf" for both the host and the app student.

**New cases from this discovery** (added to the plan, all unrun):

| ID | What to test |
| --- | --- |
| NM-LST-01..06 | List page: licence banner numbers, filters (All / types / status), sort options, columns, Join and Action buttons per status, pagination. |
| NM-PR-01..06 | Personal room: create, permanent URL stays the same, 5-participant limit (6th is refused), only one instant/personal room at a time (starting a second one is blocked with a message), rejoin the same URL, delete/reset (verify). |
| NM-INS-01..08 | Instant meeting dialog: max participants 1, 5, 300, 301, 0, negative, text; Secured on/off; each of the 6 participant settings off, then checked in the room (chat hidden, Q&A hidden, people list hidden, screen share blocked, joins muted); Create (draft) vs Create & Start; hold several drafts; start two at once. |
| NM-WAIT-01..08 | Secured meeting: student sees a waiting screen; host sees them under Waiting; Admit, Reject, admit all (verify); rejected student cannot rejoin; non-secured meeting joins directly; host leaves while someone waits. |
| NM-LOB-01..08 | Lobby: name edit, mic/camera defaults off, device selects, Device settings (camera select, mirror, microphone, speaker, noise suppression, echo cancellation, auto gain, backgrounds None / Slight Blur / Blur / image / presets, filters), a chosen setting carries into the room. |
| NM-REACT-01..03 | React: the "2 left" counter (what the limit is, when it resets), reaction shown to others. |
| NM-POLL-01..08 | Polls: create, options, single/multi choice (verify), launch, vote as student, results live, end poll, results after the meeting. |
| NM-QA-01..06 | Q&A: student asks, visible to everyone vs host only, host answers or dismisses, order, setting off hides the panel. |
| NM-OFFER-01..04 | Offers: host shows a special offer (verify what can be offered), participants see it, close, link works. |
| NM-REC-08.. | Record: start, stop, where the file appears (the list column Recording), who can see it. |

## Run log 1 (2026-11-10, scheduled meeting "QA NM Sched 1", secured, via QA Community; host on web, students 2-4 on web, student 1 on the Android app)

Legend: PASS / OBS (observation or candidate bug, seen once) / NOT RUN. Audio/video were measured from RTP byte counters (web side); the phone's camera was seen working on the host's screen; no one listened to the sound (owner check).

| Case | Result |
| --- | --- |
| NM-JOIN web student via community post, secured | PASS: Request to join > Waiting > host Admit > in room. |
| NM-JOIN app student | PASS: community > Meetings > Join Meeting > Request admission > Admit > pre-join (mic/camera) > Join meeting. |
| NM-WAIT admit / deny | PASS. Host sees "n / 5 in room", Deny/Admit. Denied student sees "Admission declined ... Try again". |
| NM-WAIT re-request after Deny | OBS: "Try again" shows the form again but a second request is declined at once and never reaches the host (so "Try again" does nothing). Seen once. |
| NM-AV audio+video web<->web, both directions | PASS: audio ~36 KB / 3 s and video ~550 KB / 3 s each way. |
| NM-AV mute (host mic off, student camera off, host "Mute" on a student) | PASS: that sender's counter drops to ~0 (42 bytes), others keep flowing. |
| NM-AV phone camera -> web | PASS (host sees the phone's live video). Phone shows real camera; mic indicator follows. |
| NM-CHAT web both ways, app -> host, host -> app | PASS. Empty message: Send disabled. Whitespace-only: Send enabled but nothing is sent and the box is not cleared (OBS). HTML text shown escaped (PASS). 1200-character message accepted with no limit (OBS: no max length). Host can Pin / Delete messages, students can delete their own, Like, Reply. Unread badge on the app chat icon. |
| NM-TOOL raise hand | PASS: host People shows Hands 1 and "Lower hand"; host gets a "1 HAND UP ... Allow" toast. |
| NM-REACT | PASS: 21 reactions (Like, Love, ... Angry). **Limit of 2 per person per meeting**; after 2 the button reads "You have used all 2 of your reactions" and is disabled. |
| NM-QA ask / host actions | PASS: student asks; host sees Upvote, Add to stage, Reply, Mark answered, Delete question; "Add to stage" shows ON STAGE for everyone; Mark answered updates both sides. |
| NM-POLL | PASS: create (disabled until a question is typed), 2+ options, live "n of m voted", students vote, **a student can change the vote**, End poll closes it, results kept, host can Show on stage / Delete. |
| NM-PPL host menu | PASS: per-participant menu with Mute and Remove from meeting. Remove asks "will be disconnected immediately and won't be able to rejoin". |
| NM-PPL removed student rejoin | PASS (blocked), but OBS: the removed student is dumped on the marketing home page `/en` with no message, and a rejoin attempt says "The host has declined your request" although the host did nothing. |
| NM-PPL stale hand | OBS: after removing student 2, the host still shows "1 HAND UP" for the removed user with a raw id (`user_<number>`) instead of a name. |
| NM-ROOM settings (live) | PASS: Chat OFF removes the message box for students (history still visible), ON restores it. Participant-list OFF not verified (the check was blocked by an open panel). |
| NM-REC | PASS: Record starts (shows "Preparing", then REC timer); students get a REC banner (web) and a red frame (app). OBS: once recording, the Record button disappears from the toolbar, so there was no way to stop it before ending the meeting. After the meeting the list shows "Adding to gallery... / View Recording". |
| NM-END End for everyone | PASS: everyone is disconnected at once. OBS: host and students are sent to the marketing home page `/en`, no "meeting ended" message. List row: Completed. |
| NM-END status on community post | OBS: web community post still said "The meeting has started! Join Meeting" about 36 minutes after the meeting was Completed, on a fresh page load. The app showed "Meeting has ended" after a pull-to-refresh (before the refresh it still said started). |
| NM-LST Join on Completed rows | OBS (seen on 2 meetings): a "Join" cell is still shown on Completed rows. |
| NM-SET scheduled form copy / label / overlap | OBS: form says "Your meeting starts as soon as you click Start."; list shows Product Type INSTANT / Format "Instant 1-on-1" for a scheduled meeting; a second meeting inside a Draft's time window was not created and no reason was shown. |
| NM-UI accessibility | OBS: while a side panel (Chat, People, Q&A...) is open, most toolbar buttons have no accessible name (read as "?"); some have no name even with panels closed. |

**Not run yet:** Share screen (web and app), Offers, host Leave (keep the meeting running) and rejoin, host closing the tab, Participant-list OFF, Q&A "everyone sees questions" OFF, "participants can unmute themselves" OFF, "can share screen" OFF, device settings (backgrounds, blur, noise suppression), personal room (5 participants), non-secured meeting, appointment/event native meetings, instant meeting with an invite link, network drop and reconnect, app in background, 5-person limit, meeting auto-end at the duration, recording playback, timezone cases, the app's "More" menu, app screen share, and all the section A/B setup cases.

## Run log 2 (2026-11-10, appointment native meetings: event 3973 "Freelancers Meetup Dhaka", Secured: No; new appointment 4021 "QA NM Appt 1")

Setup facts: Appointment event type list = In Person / **Native Meeting** / Google Meet / Custom Virtual Meeting. "Configure Native Meeting" (Information + Settings tabs): Beta notice, **expiry rule "if the meeting is not started within 30 minutes of the scheduled time it will automatically expire"**, Available Hosts 1/1, Max participants 300, Meeting type fixed to Video Meeting, timezone, Secured checkbox, six participant switches (chat, questions, Q&A visible, see participants, screen share, unmute). The meeting is created automatically when a booking is made (it then appears in `/dashboard/meeting/` as Product Type APPOINTMENT, Format "Group", Type "Scheduled", status "Starts in ...", Security "Open"/"Secured"). Create form needs: name, type, description, duration, a slot list (each slot is a start time added through a time picker, 15-minute steps), "Maximum Bookings per slot" and "Before n hours" once multiple bookings / cancellation are ticked. Students book from the public `/en/appointment` page, **which only lists the events selected in the website page block** (`get-selected-events?ids[]=...`), so a new appointment (4021) is not bookable there until it is added to that page block (not done). The student booking is a free checkout ("Complete Purchase"); admin booked list shows Join Meeting / Cancel; web student list shows Join Appointment / Reschedule / Cancel / Add to Calendar.

| Case | Result |
| --- | --- |
| NM-JOIN-02 host joins an hour early | PASS: allowed (lobby, then in the room) with no restriction. |
| NM-JOIN-03 web student before the slot | PASS: room page "Your Meeting Starts Soon 00 HRS 03 MIN 14 SEC ... This page will automatically refresh." After the start time it was still on 00:00:00 15 s later and had switched to the lobby within 55 s. |
| NM-JOIN-03 app student before the slot | PASS: card shows disabled "Starts in 1h 25m" / "Starts in 5m 33s" with the right countdown (the 29 Oct "7d" bug did not appear). The app Join stays disabled until the slot time even when the host is already in the room. At the slot time the card shows "Live now" + "Join now". |
| NM-JOIN non-secured join | PASS: no waiting room; web student and app student go straight to the lobby / pre-join. |
| NM-BOOK app refresh | OBS: a booking made on the web did not show in the app after pull-to-refresh or reopening the screen; it appeared after a cold start of the app. |
| NM-BOOK cancel/reschedule window | OBS: Reschedule and Cancel are disabled once the slot is inside the "before 0.1 hour" window (message "The window to cancel or reschedule has closed"); the 3:00 PM card still allowed changes. |
| NM-TIME countdown pill | PASS: app shows a remaining-time pill (e.g. "12m 14s") during the meeting. |
| NM-OFFER | PASS: create (Title, Badge, Description, Image upload/link, currency, price, "was" price, button label, link, spots left, countdown min, position Top-left/Bottom-right), saved as DRAFT, **Show to everyone** makes it LIVE; web student sees the card with countdown and "Buy now". OBS: the app did not show the offer. Offers are per meeting. |
| NM-SCR share screen (web host) | PASS: "You are presenting / Stop sharing" bar, tile "You's screen" (OBS: odd label "You's"), video 3 MB / 3 s, Stop sharing returns to the normal layout. App share not run. |
| NM-AV mirror camera | PASS: Settings > Camera > "Mirror my camera" ON = the video is flipped (`scaleX(-1)`), OFF = not flipped, on the tile and in the preview; default is ON. |
| NM-AV audio switches | OBS: Noise suppression / Echo cancellation / Auto gain control toggles change the UI but the live audio track settings stayed NS=true EC=true AGC=true (AGC shows OFF yet the track reports true). Possibly applied only on re-acquire; seen once. |
| NM-AV app mic/camera | PASS: phone mic off lowers the audio the host receives; phone camera off halves the video; both back on restores it. |
| NM-APP More menu | Seen: reactions (7 shown, "2 reactions left"), People (count), Chat, Q&A, Polls, **Speaker on / Use earpiece**, **Switch camera**. After tapping Switch camera the phone's own tile was black with a yellow weak-connection icon (OBS, seen once; the host still received video). |
| NM-LEAVE host Leave | PASS: "Leave meeting" keeps the room; the same link opens the lobby again. Host lands on the marketing page `/en` after leaving. |
| NM-END End for everyone (appointment) | PASS: host and student sent to `/en`; `/dashboard/meeting/` shows Completed. The 1:45 bookings were no longer in the first rows of the booked list afterwards (ordering changed; not verified they were removed). |
| NM-LST appointment rows | Product Type APPOINTMENT, Product ID = event id, Type Scheduled, Format Group, Security Open. |

**Not run yet:** Events meeting (native events in the admin list: 7756 "Appium Event Meeting", 7752, 7751, 7746 ... Event Type "native"; row menu View Event / Event Participants / Duplicate / Edit / Update Category / Delete), one-to-one coaching meeting (program 4244 + appointment 3864), 30-minute expiry rule, reschedule/cancel flows, reminder emails, recurring slots, paid appointment, secured appointment, "excluded dates/slots", multi-booking capacity, the room switches at creation (screen share off, unmute off, chat off), phone share screen / hand raise / earpiece, network drop on the phone, 3:00 PM booking (8712) left for later, and adding appointment 4021 to the booking page.

## Run log 3 (2026-11-10, Events native meeting; capacity)

Events: `/dashboard/event-create/` (Events list; Create Event). Event Type options: In Person / Custom Virtual Meeting / **Native Live**. For Native Live the date and time fields of the form disappear and a "Configure Native Meeting" dialog asks for **Start Time**, **Duration (minutes)**, timezone, Meeting Type (Meeting, up to 300), Secured and the six participant switches; the same 30-minute expiry notice is shown. Creating needs a name, a cover image (picked from the media gallery, then a crop dialog), short description and description (rich text). API: `POST /api/teacher/events/create-event` with `event_type:"native"` and an `event_time` block (`meeting_type`, `is_secured_meeting`, `participant_settings`). The row menu has View Event, Event Participants, **Duplicate Event**, Edit Event, Update Category, Delete Event. **Edit Event is blocked for an ended event** ("You cannot edit because this event has ended"). The event student page `/event/<slug>/<id>/` shows Register; after registering it shows "Unregister" and "Join Event". The meeting appears in `/dashboard/meeting/` with Product Type EVENT.

| Case | Result |
| --- | --- |
| NM-SET-10 appointment slot capacity (max bookings per slot = 2) | PASS: the third student sees "No slots available" for the full slot; the first two get "Purchased successfully / Appointment booked successfully". |
| NM-EVT duplicate of an ended native event (7756 -> 7819, new date today 2:55 PM) | **Candidate bug (seen twice):** the duplicate's event page shows the new date, but its native meeting keeps the OLD schedule: the meeting list says "Thursday, 29 Oct 2026, 03:29 PM ... Ended"; a student's "Join Event" opens the lobby, the room timer starts at **287:15:43**, the host sees "Meeting has ended - disconnecting 00:51", and both are sent to `/en` about a minute after joining; a second "Join Event" goes straight to `/en` with no lobby. The new date/time chosen in the duplicate dialog is not copied to the meeting. |
| NM-JOIN Join Event before the event start | OBS: the student's Join Event opened the lobby about 10 minutes before the event start (the appointment meeting shows a countdown page instead). |
| NM-EVT new native event 7820 "QA NM Event 1" (3:30-3:50 PM, secured) | Created OK; four students registered through a free checkout. Run pending. |
| NM-COACH appointment 3864 (QA Coaching Appointment) is "Custom Virtual Meeting" | OBS: the Event type of an existing appointment cannot be switched to Native Meeting on the edit page (the select ignores the choice), so a 1:1 coaching native meeting needs a new appointment created as Native and attached to the program. Not run. |

## Run log 4 (2026-11-10 3:00 PM appointment slot, two bookings; coaching booking dialog)

| Case | Result |
| --- | --- |
| NM-BOOK two bookings of the same slot made at different times | **Candidate bug (seen once):** student 1 booked the 3:00 PM slot at 1:33 and student 2 at 2:54; `/dashboard/meeting/` then had **two separate meetings** for that slot (`32515fe5...` and `2c822612...`). The first one was already "Completed" at 3:00 (the host had joined and left it early), so student 1's app card showed "Meeting ended" at 3:00 PM while the host and student 2 were live in the other meeting. (At 1:45 two bookings made one minute apart shared one meeting.) |
| NM-APP ended card | PASS: after a cold start the app shows "Meeting ended" (disabled) for the finished 1:45 meeting. |
| NM-SCR student screen share (web) | PASS: host sees "(student name)'s screen"; the student sees "You's screen"; stop returns to normal. |
| NM-COACH program 4244 (one-to-one) | It is linked to appointment 3973 "Freelancers Meetup Dhaka" (a Native Meeting). Student view: Live Sessions tab, "You have 3 sessions left" (5 free slots, one-time), Upcoming / Past sessions with Details, **Book a session** dialog (appointment info, calendar, "Available slots", Cancel, Confirm Booking). No slot was available today or on the 17th in the dialog, so no coaching meeting could be started. |
| NM-APPT 4022 "QA Coaching NM Appt" | Created as Native Meeting, Tue 4:00 PM, 1 booking per slot. Not linked to a program. |

## Run log 5 (2026-11-10 3:30 PM native event 7820 "QA NM Event 1", host + students 2 and 3 on web + student 1 on the phone)

| Case | Result |
| --- | --- |
| NM-JOIN event countdown | PASS: "Join Event" before 3:30 shows "Your Meeting Starts Soon 00 HRS 00 MIN 20 SEC ... will automatically refresh"; the lobby appeared within about a minute after the start. |
| NM-WAIT event created with "Secured" ticked | **Candidate bug (seen once):** the create request had `is_secured_meeting: true` and the meeting list shows Security "Secured", but students (web and app) joined straight into the room with no "Request to join" and the host toolbar had no Waiting button. |
| NM-APP join event | PASS: the app card shows Date, Time, Event Start, View, "Live now" and Join now; the pre-join screen then the room (4 people). |
| NM-ROOM participant list OFF | PASS: the student's People button disappears. |
| NM-ROOM Q&A "Everyone sees questions" OFF | PASS: a question from student 3 is visible to student 3 and the host only, not to student 2. |
| NM-ROOM Q&A OFF | PASS: the Q&A button and the ask box are gone for students. |
| NM-ROOM Chat OFF (app) | PASS: the app chat shows "Chat is off. You can still read messages." |
| NM-TOOL raise hand (app) | PASS: the phone shows "1 hand up - You"; the host's People panel shows Hands 1 with "Lower hand". |
| NM-NET app weak connection | PASS/seen: the app showed "Weak connection - Turn off incoming video to keep audio smooth. Screen share stays on." with a switch; turning it on gives "Audio only - Others' cameras are off for you. Your own camera and audio are unchanged." and the other tiles show avatars. |
| NM-END End for everyone (event) | PASS: the list shows Completed; the app card switched to "Meeting ended" within a minute without a restart. |
| NM-LST Join cell on Completed rows | **Confirmed (seen on 3+ meetings):** the list keeps a "Join" cell next to "No actions" on Completed rows. |
| NM-END student event page after the meeting | OBS: the student's event page still shows the "Join Event" button after the meeting ended. |

## Reporting
Results go in the Run log of this file (ID, date, platform, result, short note), masked. Not tested or not available items are listed at the end of each round.
