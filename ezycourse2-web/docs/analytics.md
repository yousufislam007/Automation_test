# Analytics

Explored 2026-11-17, view-only, on the prototype https://ezycourse20uiux.pages.dev/ (mock data, no login). Route = the part after `/#`; open it with `page.goto('/#<route>')`.
The sidebar names, tab names and table columns below are exact (taken from the page), so use them in page objects and assertions.

## /analytics/overview

- Headings: `Overview`
- Tabs: -
- Table columns: -
- Table rows shown: 0
- Inputs: -
- Buttons: `Add widget`, `Last 30 days 7 Aug – 5 Sep 2026`, `vs Previous period`, `USD`, `Gross revenue`, `Refunds`, `MRR from subscriptions`, `Churn rate`, `Top products`, `1 Advanced Excel for Analysts $12,840`, `2 Foundations of Product Design $9,610`, `3 Financial Modelling I $8,220`, `See all ›`, `New contacts`, `Active users`, `Enrollments`, `Completion rate`

## /analytics/reports

- Headings: `Reports`, `USERS`, `COURSES`, `CERTIFICATES`, `B2B`, `Export User list`, `Save segment`
- Tabs: `All`, `Users`, `Courses`, `Certificates`, `B2B`, `Custom segments`, `CSV`, `XLSX`
- Table columns: -
- Table rows shown: 0
- Inputs: `text:Search for a report`, `text:name@company.com, comma separated`, `text:e.g. At risk, under 40% complete`
- Buttons: `Scheduled reports 5`, `All`, `Users`, `Courses`, `Certificates`, `B2B`, `Custom segments`, `User list Browse and filter every user on your site.`, `User progress Progress, study time and scores for every user.`, `Active users See who has logged in recently.`, `Inactive users Find users who haven't logged in for a while.`, `Never logged in Users who registered but never signed in.`, `Mobile users Users who last signed in from a phone.`, `Tablet users Users who last signed in from a tablet.`, `Desktop users Users who last signed in from a desktop browser.`, `Mobile app users Users who have signed in through the mobile app.`, `In-app purchasers Users who bought through the iOS or Android app.`, `Users at risk Users who are inactive with low completion.`, `Never enrolled Registered users not enrolled in anything.`, `Not started Enrolled users who haven't begun a course.`, `Top scorers Rank users by average score.`, `Certified users Users who have earned certificates.`, `Active members per membership Active members per membership, per period.`, `Course users Per-user progress inside a single course.`, `Course abandonment watchlist Recent enrollments stalled under 20% progress.`, `Issued certificates Every certificate issued, with ID and status.`, `Expiring certificates Certificates expiring soon.`, `Organization monthly users Active users from one client account, enrolled in the last 30 d`, `Organization monthly certificates Certificates issued to one client account in the last 30`, `Organization expired certificates Certificates past their expiry date for one client accou`, `Data The table rows as CSV or XLSX`, `Visual PDF with the KPI strip, the chart as shown, and the first 25 rows`, `Both The PDF plus the data file`, `CSV`, `XLSX`, `Cancel`, `Export`, `Save segment`, `Confirm`, `Close`, `View full profile`

## /analytics/product-insights

- Headings: `Product insights`
- Tabs: `All products`, `Course`, `Community`, `Coaching`, `All`, `Paid`, `Free`, `Users`, `New access`, `Engaged`, `Engagement rate`, `Most users`, `Highest engagement rate`, `Lowest engagement rate`
- Table columns: `TYPE`, `PRODUCTS`, `USERS ↓`, `NEW ACCESS`, `ENGAGED`, `ENGAGEMENT RATE`, `VS PREV`, `PRODUCT`, `NEVER ENGAGED`
- Table rows shown: 21 (first row: Course | 5 | 4,228 | 892 | 2,981 | 70.5% | ▲ 2.1pp)
- Inputs: `checkbox:`, `text:Page number, 1 to 2`
- Buttons: `Export`, `Revenue insights`, `All products`, `Course`, `Community`, `Coaching`, `Last 30 days 7 Aug – 5 Sep 2026`, `vs Previous period`, `All types`, `All`, `Paid`, `Free`, `Users with access`, `Engaged users`, `Chart data · 5 buckets`, `Users`, `New access`, `Engaged`, `Engagement rate`, `Course 61.5% 4,228`, `Community 10.8% 742`, `Digital product 10.7% 738`, `Membership 8.9% 612`, `Bundle 7.1% 486`, `Coaching program 0.9% 64`, `Most users`, `Highest engagement rate`, `Lowest engagement rate`, `Advanced Excel for Analysts Course 1,142`, `Workplace Safety Essentials Course 1,020`, `Foundations of Product Design Course 864`, `Design Feedback Community 742`, `Financial Modelling I Course 612`, `Introduction to Python Course 590`, `Design Review Toolkit Digital product 410`, `Product Practitioner Bundle 286`, `Product Practitioner Membership 286`, `Compliance Annual Membership 198`, `Other (7 more) 720`, `Priya Nandan 7 courses`, `Jonas Weber 7 courses`, `Mustakim Rahman 7 courses`, `Adaeze Okafor 5 courses`, `Lena Fischer 5 courses`, `See all ›`, `15`

## /analytics/revenue-insights

- Headings: `Revenue insights`
- Tabs: `Overview`, `Subscriptions`, `Order date`, `Paid date`
- Table columns: `PERIOD`, `GROSS`, `NET`, `PAYMENTS`, `#`, `PRODUCT`, `% OF TOTAL`, `GROSS REVENUE`, `VS PREV`, `COUNTRY`
- Table rows shown: 30 (first row: 07 Aug | $1,307 | $1,159 | 9)
- Inputs: -
- Buttons: `Export`, `Last 30 days 7 Aug – 5 Sep 2026`, `Daily`, `vs Previous period`, `USD`, `Product`, `Overview`, `Subscriptions`, `Order date`, `Paid date`, `Chart data · 30 rows`, `Show all 30 rows`, `Subscription 42.6% $20,537`, `One-time 38.1% $18,368`, `Installment 14.8% $7,135`, `Free 3.2% $1,543`, `Donation 1.3% $627`, `Chart data · 5 rows`, `California $1,182 · 28.1%`, `New York $786 · 18.7%`, `United Kingdom (VAT) $712 · 16.9%`, `Germany (VAT) $498 · 11.8%`, `Ontario $362 · 8.6%`, `Other $668 · 15.9%`, `Card 71.4% $34,422`, `Wallet 16.2% $7,810`, `Bank transfer 8.1% $3,905`, `Manual 4.3% $2,073`

