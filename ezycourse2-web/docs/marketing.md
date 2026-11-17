# Marketing

Explored 2026-11-17, view-only, on the prototype https://ezycourse20uiux.pages.dev/ (mock data, no login). Route = the part after `/#`; open it with `page.goto('/#<route>')`.
The sidebar names, tab names and table columns below are exact (taken from the page), so use them in page objects and assertions.

## /marketing/email-insights

- Headings: `Email insights`
- Tabs: `Email report`, `Suppression`, `Verification`, `All`, `Campaigns`, `Sequences`, `Overview`, `Recipients`, `Links`, `Bounces`, `Complaints`, `Email log`, `Per hour`, `Cumulative`
- Table columns: `Email`, `Sent`, `Open rate`, `Click rate`, `Bounce rate`, `Unsubscribe rate`, `Complaint rate`, `Revenue`
- Table rows shown: 11 (first row: September masterclass invite | 3,118 | 45.8% | 13.3% | 1.8% | 0.9% | 0.13% | $2,938)
- Inputs: `text:Search emails`
- Buttons: `Last 30 days 19 Oct – 17 Nov 2026`, `Daily`, `Compare`, `Email report`, `Suppression`, `Verification`, `All`, `Campaigns`, `Sequences`, `Overview`, `Recipients`, `Links`, `Bounces`, `Complaints`, `Email log`, `Per hour`, `Cumulative`, `Email`, `Sent`, `Open rate`, `Click rate`, `Bounce rate`, `Unsubscribe rate`, `Complaint rate`, `Revenue`

## /marketing/campaigns

- Headings: `Campaigns`
- Tabs: `All`, `Draft`, `Scheduled`, `Sent`, `Archived`
- Table columns: `Name`, `Type`, `Status`, `Send date`, `Delivered`, `Opened`, `Clicked`, `Bounced`
- Table rows shown: 11 (first row: Cohort re-engagement | Sequence | Draft | —)
- Inputs: `text:Search campaigns by name or subject`, `checkbox: x12`, `text:Page number, 1 to 1`
- Buttons: `Create campaign`, `All`, `Draft`, `Scheduled`, `Sent`, `Archived`, `Filters`, `Name`, `Type`, `Status`, `Send date`, `Delivered`, `Opened`, `Clicked`, `Bounced`, `25`

## /marketing/automations

- Headings: `Automations`
- Tabs: `All`, `Automations`, `Scheduled`
- Table columns: `Name`, `Type`, `Status`, `Runs`, `Created at`
- Table rows shown: 8 (first row: All actions showcase | Automation | Draft | — | 24 Sep 2026 | Manage)
- Inputs: `text:Search automations`, `text:Page number, 1 to 1`
- Buttons: `Create automation`, `All`, `Automations`, `Scheduled`, `Filters`, `Name`, `Type`, `Status`, `Runs`, `Created at`, `All actions showcase`, `Manage`, `Re-engage contacts inactive for 90 days`, `Trial ending in 3 days`, `B2B seat invitation chase`, `Abandoned checkout recovery`, `Monday digest to active members`, `Welcome and first lesson nudge`, `Certificate expiry reminder`, `25`

## /marketing/forms

- Headings: `Forms`
- Tabs: -
- Table columns: `Form`, `Responses`, `Status`, `Created`
- Table rows shown: 16 (first row: Every element — field reference | — | Draft | 20 Sep 2026 | Manage)
- Inputs: `text:Search forms`, `checkbox: x17`, `text:Page number, 1 to 1`
- Buttons: `Create form`, `All`, `Published`, `Draft`, `Closed`, `Filters`, `Form`, `Responses`, `Status`, `Created`, `Manage`, `216`, `398`, `88`, `744`, `412`, `731`, `1284`, `47`, `268`, `921`, `162`, `1140`, `3902`, `5611`, `25`

## /marketing/funnels

- Headings: `Funnels`
- Tabs: `All`, `Published`, `Draft`
- Table columns: `Name`, `Status`, `Revenue`, `Conversion`, `Views`, `Steps`, `Last edited`
- Table rows shown: 6 (first row: Free Python mini-course | Published | $83,720 | 2% | 14,280 | 5 | 2 hours ago)
- Inputs: `text:Search funnels by name`, `checkbox: x7`, `text:Page number, 1 to 1`
- Buttons: `Create funnel`, `All`, `Published`, `Draft`, `Filters`, `Name`, `Status`, `Revenue`, `Conversion`, `Views`, `Steps`, `Last edited`, `25`

## /marketing/newsletter

- Headings: `Newsletters`
- Tabs: `All`, `Published`, `Draft`, `Archived`
- Table columns: `Newsletter`, `Status`, `Subscribers`, `Paid`, `Posts`, `Last sent`
- Table rows shown: 4 (first row: The Weekly Rep | Published | 12,480 | 1,204 | 64 | 12 Sep 2026 5 days ago)
- Inputs: `text:Search newsletters by title or slug`, `text:Page number, 1 to 1`
- Buttons: `New newsletter`, `All`, `Published`, `Draft`, `Archived`, `Filters`, `Newsletter`, `Status`, `Subscribers`, `Paid`, `Posts`, `Last sent`, `25`

## /marketing/marketplace

**Not built:** opening this route ends on `/marketing` (the sidebar item exists but the page does not).

## /marketing/crm

**Not built:** opening this route ends on `/marketing` (the sidebar item exists but the page does not).

