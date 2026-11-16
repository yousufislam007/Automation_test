# Voice note: test cases (post and comment)

Feature: record a voice note and attach it to a **post**, a **comment** or a **reply**. Written for the Android app on the physical phone (`R5CYA314MRH`). Web behaviour verified on 2026-11-09 is used as the expected result where the app has no spec; any difference on the app is a candidate bug to confirm with the owner.

Status column: `-` = not run. Priority: P1 core, P2 important, P3 edge.

## Setup and data

- Roles: admin (community owner) and a member (testerA). Run each case as admin first, then repeat the P1 cases as member.
- A channel the user can post in. Another account to view the result (admin views member's notes and the reverse).
- Phone: microphone permission not yet granted for the first run (TC-VN-01); network on. Test data names: `VN-<case id> <date>`.
- Delete everything a case creates when it ends. Do not run on the owner's real posts.
- Expected controls (from web): `Record voice note`, `Discard recording`, `Pause recording` / `Resume recording`, `Finish recording`, timer `0:xx / 10:00`, `Play voice note`, `Record again`, `Add to post`, `Playback speed`, `Remove voice note`.

## A. Post: record and attach

| ID | P | Case | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| VN-P-01 | P1 | Mic permission prompt (first use) | Open the post composer, tap the voice note button | System permission dialog appears; Allow starts recording | Pass 2026-11-16 |
| VN-P-02 | P1 | Record, finish, preview | Tap record, speak 5 s, tap Finish | Preview shows with Play, Record again, Add to post; duration about 5 s | Pass 2026-11-16 |
| VN-P-03 | P1 | Add to post and publish | After VN-P-02 pick a channel, add a title, tap Add to post, then Post | Post is published with a playable voice note chip | Pass 2026-11-16 |
| VN-P-04 | P1 | Playback in feed | Open the new post in the feed, tap Play | Audio plays, progress moves, tap again pauses | Pass 2026-11-16 |
| VN-P-05 | P1 | Other user can play | Log in as the other account, open the post | Note is visible and plays | - |
| VN-P-06 | P2 | Timer while recording | Record 10 s | Timer counts up `0:xx / 10:00` | - |
| VN-P-07 | P2 | Pause and resume | Record 3 s, Pause, wait 5 s, Resume, record 3 s, Finish | Timer stops while paused; total about 6 s, not 11 s | - |
| VN-P-08 | P2 | Discard recording | Record 3 s, tap Discard | Recording is dropped, composer returns to normal, nothing uploaded | - |
| VN-P-09 | P2 | Record again | In preview tap Record again | Old take is replaced by a new recording | - |
| VN-P-10 | P2 | Remove the attached note | After Add to post tap Remove voice note | Chip is removed; post can still be published as text only | - |
| VN-P-11 | P2 | Playback speed | Tap Playback speed on the chip and in the feed | Cycles 1x, 1.5x, 2x and audio speed changes | - |
| VN-P-12 | P2 | One player at a time | Two posts with notes; play one, then the other | The first pauses when the second starts | - |
| VN-P-13 | P2 | Post without a channel | Attach a note, do not pick a channel, tap Post | Message "Please select a channel"; note is kept | - |
| VN-P-14 | P2 | Voice note only (no text) | Attach a note with an empty body, post | Behaviour is consistent with the title rule (post allowed or a clear message); no crash | - |
| VN-P-15 | P2 | Note survives reload | Publish, close and reopen the app, open the post | Note still plays | - |
| VN-P-16 | P2 | Audio-first feed order | A post with a voice note and no other media | Post shows in the feed normally (owner's earlier ruling: an audio-only post first in the feed is a bug) | - |
| VN-P-17 | P3 | Permission denied | Deny the mic permission (or revoke in Settings) and tap record | Clear message / link to settings; app does not freeze or crash | Pass 2026-11-16 |
| VN-P-18 | P3 | 10:00 limit | Record until 10:00 (or the limit is reached) | Recording stops at the limit and the note is kept, or a clear message shows | - |
| VN-P-19 | P3 | Very short note | Record under 1 s, Finish | Either saved with the right duration or a clear "too short" message; no corrupt note | - |
| VN-P-20 | P3 | No network on publish | Attach a note, switch on airplane mode, Post | Clear failure message; note and text are not lost; works after network returns | - |
| VN-P-21 | P3 | Interrupt by phone call / app switch | Start recording, switch to another app or lock the screen, return | Recording state is clear (paused, stopped or continued) and the take is not corrupted | - |
| VN-P-22 | P3 | Edit a voice post | Open Edit on a post with a note | Note is kept, can be removed or replaced; save works | - |
| VN-P-23 | P3 | Delete a voice post | Delete the post | Post disappears; no orphan note in the feed | - |
| VN-P-24 | P3 | Note plus other media | Add an image to a post that has a voice note | Both are kept and shown, order is sensible | - |

## B. Comment and reply

| ID | P | Case | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| VN-C-01 | P1 | Record and send a comment note | Open a post, tap record in the comment box, speak 5 s, Finish | Note is sent directly (no "Add to post" step); the submit button shows `Uploading…` while it uploads | Pass 2026-11-16 |
| VN-C-02 | P1 | Comment note plays | Tap Play on the new comment | Audio plays, tap pauses | Pass 2026-11-16 |
| VN-C-03 | P1 | Other user can play | Log in as the other account, open the post | Comment note plays | - |
| VN-C-04 | P1 | Reply with a note | Tap Reply on a comment, record and send | Note appears under the comment as a reply and plays | - |
| VN-C-05 | P2 | Discard, pause and resume | Same as VN-P-07 and VN-P-08 in the comment box | Same results; nothing is sent after Discard | - |
| VN-C-06 | P2 | Note survives reload | Reopen the app and the post | Comment and reply notes are still there and play | - |
| VN-C-07 | P2 | Playback speed | Change speed on a comment note | 1x, 1.5x, 2x | - |
| VN-C-08 | P2 | One player at a time | Play a post note, then a comment note | First one pauses | - |
| VN-C-09 | P2 | Comment count | Send a note comment | Comment count on the post increases by 1; no duplicate comment | - |
| VN-C-10 | P2 | Double tap on send | Tap the submit button twice quickly during `Uploading…` | Only one comment is created | - |
| VN-C-11 | P2 | Comment note and text together | Type text, then record a note | Both are kept (or the app clearly allows only one); no text lost | - |
| VN-C-12 | P2 | Delete own comment with a note | Delete the comment | Comment and note disappear; count decreases | - |
| VN-C-13 | P2 | Admin removes a member's note comment | As admin delete a member's note comment | Comment is removed; member no longer sees it | - |
| VN-C-14 | P3 | Permission denied | As VN-P-17 in the comment box | Clear message, no crash | - |
| VN-C-15 | P3 | Upload fails (no network) | Send a note comment in airplane mode | Clear failure; the app does not show a fake comment; retry works | - |
| VN-C-16 | P3 | Keyboard and record button | Open the comment box with the keyboard up, tap record | Recorder UI is fully visible and tappable (not hidden by the keyboard) | - |
| VN-C-17 | P3 | Locked or no-comment case | Post in a channel where the user cannot comment (e.g. comments off or view-only) | Record button is hidden or disabled, matches the text comment rule | - |
| VN-C-18 | P3 | Long thread | A post with 20+ comments, several with notes | Scroll is smooth; each note plays; players do not overlap | - |

## C. Cross-cutting

| ID | P | Case | Expected | Status |
| --- | --- | --- | --- | --- |
| VN-X-01 | P2 | Notes recorded on the web play on the app, and app notes play on the web | Same duration, audio plays, waveform / duration shown | - |
| VN-X-02 | P2 | Upload flow (via network log) | `presign` -> PUT to CDN -> `register` (`voice-note-<date>.m4a`) -> post/comment API succeed; post content carries a voice note with duration and peaks | - |
| VN-X-03 | P3 | Bluetooth headset / speaker routing | Recording uses the selected mic; playback follows the phone's audio output | - |
| VN-X-04 | P3 | Phone silent mode / volume 0 | Playback behaviour is sensible (plays on media volume or shows a hint) | - |
| VN-X-05 | P3 | Rotation during recording / playback | Recording is not lost; playback continues | - |
| VN-X-06 | P3 | Accessibility labels | Buttons have the labels listed under Setup (needed for Appium locators) | - |
| VN-X-07 | P3 | Notification for a note comment | Post owner gets a notification for the comment; wording is sensible (no empty text) | - |

## Notes for automation

- The app side cannot record real audio from Appium unless the phone has a mic; the recording tests are manual or semi-automatic (speak or play a sound). Everything after Finish (preview, send, play, delete) can be automated by label (`Play voice note`, `Remove voice note`, `Playback speed`).
- Web automation uses Chromium with `--use-fake-device-for-media-stream --use-fake-ui-for-media-stream` and permission `microphone` (see the voice note memory); that gives a fake tone, enough for upload and playback checks.
- On the web, typing into the post body after attaching a note replaces the note node: type the title in the title input only.

## Not yet confirmed (ask the owner)

- Maximum note length on the app (web: 10:00) and whether a post may contain only a voice note.
- Whether the app should show the same `Add to post` step as the web, or send directly.
- Whether the member account for testing is testerA or the duplicate WEB_MEMBER pair in `.env`.

## Run log 2026-11-16 (phone R5CYA314MRH, logged in as the community admin "Team SQA", SQA Team community)

Run by hand with adb taps and screenshots (first batch only; the other cases are still `-`). The test post and its comment were deleted afterwards.

- VN-P-01 pass: first tap on Voice note shows the system prompt "Allow EzyCommunity to record audio?".
- VN-P-02 / VN-P-03 / VN-P-04 pass: record, Done, the note appears in the composer (no preview or "Add to post" step on the app), post publishes with a player `00:00 / 00:05`; play shows progress and pause, plus 1x, loop and stop controls.
- VN-C-01 / VN-C-02 pass: comment box has a mic button; after Done the note shows as a thumbnail with a send arrow (it is not sent until you tap send); the comment shows a waveform player and plays.
- Differences from the web: no preview step in the post composer; comment note is not sent automatically.

Candidate issues (not reported; ask the owner first):

1. **Voice note silently dropped in the post composer when the body is not focused.** Steps: open Post, type a title, hide the keyboard, tap Voice note, record, Done. No note is attached and no message shows. With the body focused the note attaches (first run and the retry). Likely the note is inserted at the body cursor.
2. **Not reproduced on 2026-11-16** (was: after "Don't allow" the recorder opened and the permission showed granted). Re-run with the permission revoked by adb: "Don't allow" shows a "Microphone permission denied" dialog with a Close button, the recorder does not open and the permission stays denied. The first result was most likely my tap landing on another button.
3. Comment voice note shows only the elapsed time (`0:00`, then `0:04`), no total duration, unlike the post player (`00:00 / 00:05`).
