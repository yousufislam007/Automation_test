# Sell

Explored 2026-11-17, view-only, on the prototype https://ezycourse20uiux.pages.dev/ (mock data, no login). Route = the part after `/#`; open it with `page.goto('/#<route>')`.
The sidebar names, tab names and table columns below are exact (taken from the page), so use them in page objects and assertions.

## /sell/orders

- Headings: `Orders`
- Tabs: `Orders`, `Transactions`, `Subscriptions`, `Installment plans`
- Table columns: `Customer`, `Product(s)`, `Order`, `Product type`, `Amount`, `Status`, `Order date`
- Table rows shown: 11 (first row: RA Rafiq Ahmed rafiq.ahmed@example.com | UI Design Masterclass · Standard +2 bonu | #1044 | Course | ৳17,213.00 | Paid | 1 Oct 2026 09:20)
- Inputs: `text:Search orders, names or emails`, `text:Page number, 1 to 1`
- Buttons: `Export`, `Orders`, `Transactions`, `Subscriptions`, `Installment plans`, `Filters`, `Customer`, `Product(s)`, `Order`, `Product type`, `Amount`, `Status`, `Order date`, `25`

## /sell/approvals

- Headings: `Approvals`
- Tabs: `Purchase requests`, `Manual payments`
- Table columns: -
- Table rows shown: 0
- Inputs: `text:Search requests, names or emails`, `text:Page number, 1 to 1`
- Buttons: `Purchase requests`, `Manual payments`, `All`, `Pending`, `Link sent`, `Paid or enrolled`, `Rejected`, `Filters`, `Price`, `Order`, `⋯`, `25`

## /sell/checkout-statistics

- Headings: `Checkout statistics`, `Checkout funnel`, `Conversion rate`, `Top decline reasons`, `Recovery`, `Pre-orders`
- Tabs: `Overview`, `Sessions`, `Products`, `Payment methods`
- Table columns: -
- Table rows shown: 0
- Inputs: `text:All products`
- Buttons: `Last 30 days 1 Sep – 30 Sep 2026`, `Compare`, `USD · US Dollar`, `Overview`, `Sessions`, `Products`, `Payment methods`, `100% 1,284 Viewed Checkout loaded`, `55% 702 Started Entered their details`, `36% 468 Tried to pay Pressed Complete purchase`, `32% 412 Completed Order created`, `See failed checkouts`, `Cart abandoned automations`, `View recovered checkouts`, `View pre-orders`

## /sell/offers

- Headings: `Offers`
- Tabs: `Coupons`, `Order bumps`, `Upsell flows`, `Bonus items`
- Table columns: `Name`, `Code(s)`, `Discount`, `Duration`, `Redemptions`, `Status`, `Ends`
- Table rows shown: 6 (first row: Black Friday 30% | BF30 | 30% off | Once | 0 / 100 | Draft | 30 Nov 2026)
- Inputs: `text:Search coupons and codes`, `text:Page number, 1 to 1`
- Buttons: `New coupon`, `Coupons`, `Order bumps`, `Upsell flows`, `Bonus items`, `Filters`, `Name`, `Code(s)`, `Discount`, `Duration`, `Redemptions`, `Status`, `Ends`, `25`

## /sell/pricing

- Headings: `Pricing`
- Tabs: -
- Table columns: `Price name`, `Product`, `Product type`, `Price type`, `Amount`, `Sales`, `Revenue`
- Table rows shown: 11 (first row: Standard | Brand Asset Library | Asset library | One-time | $49 | 0 | $0)
- Inputs: `text:Search prices or products`, `text:Page number, 1 to 1`
- Buttons: `Export`, `New price`, `All`, `One-time`, `Subscription`, `Installment`, `Archived`, `Filters`, `Price name`, `Product`, `Product type`, `Price type`, `Amount`, `Sales`, `Revenue`, `25`

## /sell/memberships

- Headings: `Memberships`
- Tabs: `Plans`, `Groups`, `Access gate`
- Table columns: `Membership`, `Group`, `Items`, `Users`, `Status`
- Table rows shown: 8 (first row: AA All-Access | Northwind tiers · tier 4 | 30 | 188 | Published)
- Inputs: `text:Search memberships`, `checkbox: x9`, `text:Page number, 1 to 1`
- Buttons: `Create group`, `Create membership`, `Plans`, `Groups`, `Access gate`, `Filters`, `Membership`, `Group`, `Items`, `Users`, `Status`, `188`, `356`, `86`, `22`, `1,406`, `924`, `1,812`, `25`

