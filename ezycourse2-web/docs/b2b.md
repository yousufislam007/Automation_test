# B2B

Explored 2026-11-17, view-only, on the prototype https://ezycourse20uiux.pages.dev/ (mock data, no login). Route = the part after `/#`; open it with `page.goto('/#<route>')`.
The sidebar names, tab names and table columns below are exact (taken from the page), so use them in page objects and assertions.

## /b2b/organizations

- Headings: `Organizations`
- Tabs: -
- Table columns: `Organization`, `Manager`, `Seats`, `Products`
- Table rows shown: 8 (first row: Cascade Federal Credit | IB Imani Brookes i.brookes@cascadefcu.co | — | Manage)
- Inputs: `text:Search by organization or manager`, `text:Page number, 1 to 1`
- Buttons: `Visit manager dashboard`, `Create organization`, `Filters`, `Organization`, `Manager`, `Seats`, `Products`, `Manage`, `10`

## /b2b/pricing-plans

- Headings: `Pricing plans`
- Tabs: -
- Table columns: `Plan`, `Product type`, `Price type`, `Pricing model`, `Starting price`, `Billing`, `Status`, `Organizations`, `Seats sold`
- Table rows shown: 10 (first row: All-Access Corporate Library | Membership | Subscription | Flat packages | From US$3,900/mo 3 packages | Monthly | Active | 1)
- Inputs: `text:Search plans or plan ID`, `text:Page number, 1 to 1`
- Buttons: `Export`, `Add pricing plan`, `All`, `Subscription`, `One-time`, `Archived`, `Filters`, `Plan`, `Product type`, `Price type`, `Pricing model`, `Starting price`, `Billing`, `Status`, `Organizations`, `Seats sold`, `25`

