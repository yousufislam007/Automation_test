# Appointment (Native Meeting): Join and End test cases

Status: **written only, nothing run yet.** Web = admin dashboard, App = student Android app (test student).

## Test data (2026-10-29)

- Appointment event id 3973 "Freelancers Meetup Dhaka": event type **Native Meeting** (Video Meeting, Secured: No), 20 minutes, Public.
- Booked list: `/dashboard/appointments/booked/3973/` (row actions: Join Meeting, Cancel; status text after the slot: Ended).
- App: Profile > Appointments & Events (calendar view, today's cards).
- Test student bookings today: 8647 at 11:40 AM, 8646 at 04:00 PM. Booking 8633 (28 Oct 12:30 PM) already shows **Ended**.
- The admin sees an **End** button only **after joining** the meeting (owner's information).

## Rules for running

- Join and End cannot be undone. Run each once, one booking at a time, never retried. Record the start state first (booking status on web, card on app). Stop if it is not as expected.
- Use only the bookings above. Do not book or cancel anything that is not listed here.
- Mask student names and emails in notes and file names. Delete temporary screenshots.

## Join

| ID | Steps | Expected |
| --- | --- | --- |
| JOIN-01 | App: open today's card at its slot time, tap Join. | The meeting opens for the student. |
| JOIN-02 | Web: booked list, row of the same booking, tap Join Meeting. | The admin enters the same meeting as the student. |
| JOIN-03 | Both inside: look at the participants on web and on the app. | Each side sees the other. |
| JOIN-04 | App: tap Join on a card **before** its slot time. | Not joined, or a clear "not started" message (record what happens). |
| JOIN-05 | Web: tap Join Meeting on a booking **before** its slot time. | Same as JOIN-04 (record what happens). |
| JOIN-06 | After joining, look at the booking row on web and the card on the app. | Status does not show Ended while the meeting is running. |

## End (force end from the web)

| ID | Steps | Expected |
| --- | --- | --- |
| END-01 | Web: join, stay a few minutes, then tap **End** in the meeting. | The meeting closes for the admin. |
| END-02 | After END-01, app: look at the same card (pull down / reopen the screen to refresh). | The card shows **Ended**. |
| END-03 | After END-01, student still inside the meeting. | The student is removed from the meeting. |
| END-04 | After END-01, app: tap Join on the ended card. | Join is disabled or does nothing; no new meeting starts. |
| END-05 | After END-01, web booked list. | The row shows **Ended** (as booking 8633 does), no Join Meeting action. |
| END-06 | After END-01, web: tap Join Meeting again (if still shown). | Not possible to enter the ended meeting (record what happens). |
| END-07 | End without the student ever joining. | Booking shows Ended on web and on the app. |

## Cancel (only if the owner asks)

| ID | Steps | Expected |
| --- | --- | --- |
| CAN-01 | Web: Cancel a booking. | The card disappears from the app (and its red dot if it was the only one that day). |

## Open points

- Does the app need a refresh to show Ended? (END-02 records it.)
- Booking window for Join: how many minutes before and after the slot is Join allowed? (JOIN-04, JOIN-05 record it.)
- Not yet looked at: what the meeting screen looks like in the app and on the web, so no locators are written yet.

## Run log

### 2026-10-29, booking 8647 (11:40 AM slot), app card, view only

| Time | What the app showed | Result |
| --- | --- | --- |
| 11:39 (1 min before the slot) | Card detail: Join button **disabled**, text `Starts in 7d 0h`, `You can join once the meeting starts`. Also Reschedule, Cancel, `Changes allowed until Nov 5, 11:34 AM`. | Join not possible (JOIN-04 for the app: blocked before the slot, but the countdown is wrong: the slot is today). |
| 11:41 (1 min after the slot start) | Same card: Join still **disabled**, text `Starts in 6d 23h`. | **JOIN-01 blocked.** The countdown ticks down toward about 5 Nov 11:34 (the end of the "changes allowed" window / date range), not toward today's 11:40. Seen twice (11:39 and 11:41). |

Not done: Join, End, Cancel, Reschedule on web or app. Open: is the app's Join time taken from the wrong date (bug), or does Native Meeting only open when the admin starts the room first?

### 2026-10-29, booking 8649 (12:00 PM slot, new booking made 11:48), web then app

| Time | Step | Result |
| --- | --- | --- |
| 12:00:46 | Web (headed): booked list > Join Meeting. | A new tab opens a room lobby: camera off, name field, `Join now`. |
| ~12:01 | Web: `Join now`. | In the room as **HOST**, timer running, controls incl. **End meeting** (not tapped). |
| 12:01 | App: card detail. | Now shows green **Live now** and an enabled **Join now** (before the admin started, the 11:40 card showed a disabled `Starts in 7d 0h`). |
| 12:01 | App: Join now > lobby (Mic on, Camera off) > Join meeting. | JOIN-01 ok. The student is in the room, sees the host tile ("HOST") and own tile. Timer 00:05. |

Seen: with Native Meeting the app Join is enabled only after the admin joined (card says Live now). Not yet checked: the web side showing the student in People; END-01 to END-07 (End not tapped); the wrong `Starts in 7d` countdown before the host starts.
An accidental tap on `Add to Calendar` opened the Android "Complete action using" chooser; it was cancelled with Back, nothing chosen.

### 2026-10-29, booking 8649, End from the web (run once)

| Time | Step | Result |
| --- | --- | --- |
| 12:05 | Web: Join Meeting again, Join now (the room kept running, timer 04:43 / `Meeting ends in 15 min`). Student still inside on the app. | Both inside. |
| 12:05 | Web: **End meeting** | Dialog `End meeting for everyone?` with **Cancel / Leave meeting / End for everyone**. Text: "The other person will be disconnected right away, and nobody can rejoin it." |
| 12:06:58 | Web: **End for everyone** (once). | Admin page goes to `/en`. App: the student was thrown out of the room back to the card detail (END-03 ok). |
| 12:07 | App: card detail and calendar list after leaving and reopening the screen. | Card still says green **Live now** with an enabled **Join now**; Reschedule and Cancel are disabled (`The window to cancel or reschedule has closed`). **No Ended.** END-02 and END-04 **fail** (seen on the first look and again after reopening). |
| 12:08 | Web booked list for 8649. | Row still shows **Join Meeting** and **Cancel**, status is **not Ended** (booking 8633 shows Ended). END-05 **fails**. Also a second booking 8650 exists at the same 12:00 slot (created 11:51 by someone else). |

Not tapped: Join now on the ended card (END-04 not tried on purpose, it would start a new room). Open: does Ended appear later (the 20-minute slot ends 12:20), or never for a force end? Recheck after 12:20.
