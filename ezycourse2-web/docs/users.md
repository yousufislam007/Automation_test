# Users

Explored 2026-11-17, view-only, on the prototype https://ezycourse20uiux.pages.dev/ (mock data, no login). Route = the part after `/#`; open it with `page.goto('/#<route>')`.
The sidebar names, tab names and table columns below are exact (taken from the page), so use them in page objects and assertions.

## /users/all-contacts

- Headings: `All contacts`
- Tabs: `Contacts`, `Segments`, `Tags`, `Fields`
- Table columns: `User`, `User type`, `Email marketing`, `Enrolled`, `Last active`
- Table rows shown: 10 (first row: MH Mehedi Hasan mehedi.h@gmail.com | Contact | Subscribed | — | Never signed in Joined 3 Sep 26 | Manage)
- Inputs: `text:Search name or email`, `text:Page number, 1 to 2`
- Buttons: `Export`, `Add contact`, `Contacts`, `Segments`, `Tags`, `Fields`, `All`, `Leads`, `Users`, `Customers`, `Team`, `Filters`, `Manage`, `10`

## /users/team-and-roles

- Headings: `Team & roles`
- Tabs: `Team`, `Roles & permissions`
- Table columns: `Name`, `ID`, `Roles`, `Last login`, `Status`, `Added`
- Table rows shown: 7 (first row: AA abc abc abc.dev@gmail.com | 10502 | Developer | 3 months ago | Suspended | 2 Feb 2026)
- Inputs: `text:Search by name, email or ID`, `text:Page number, 1 to 1`
- Buttons: `Add admin`, `Team`, `Roles & permissions`, `Filters`, `15`

