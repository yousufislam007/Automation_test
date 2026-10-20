# Web admin dashboard site map

Crawled with headless Chrome (WebdriverIO) on 2026-10-09 against https://ezyyousuf.ezycourse.com, logged in as the admin user.
Read-only crawl: pages were opened by URL, no buttons were clicked and no data was changed. **113 dashboard pages**, all loaded without a crawl error.

Credentials are not stored here. They live in `.env` as `WEB_BASE_URL`, `WEB_ADMIN_EMAIL`, `WEB_ADMIN_PASSWORD`.

## Login page (`/en/login`)
| Element | Locator |
|---|---|
| Email | `#email` (`input[type=email]`) |
| Password | `#password` |
| Submit | `button[type=submit]` with text "Sign In" |
| Forgot password | `a[href="/en/forgot-password"]` |
| Sign up link | `a[href="/en/signup"]` |

A successful login goes to `/dashboard/` (page title "Dashboard | Admin"). A cookie banner ("Accept Cookies") shows on public pages.

## Things to know before writing tests
- Many list pages redirect to the same URL with `?page=1&pageSize=10` (43 of 113). Assert on the path, not the exact URL.
- Pages take about 4-6 s to settle in headless Chrome, so use explicit waits for a table or heading, never fixed sleeps.
- Three pages have an empty `<title>`, so don't rely on title alone: `/dashboard/all-addons/`, `/dashboard/myaddons/ai-subtitle-generator/`, `/dashboard/help-center/`.
- `/dashboard/myaddons/student-private-chat/` redirects to `/dashboard/myaddons/private-chat/`.

## Findings (possible app bugs, seen while crawling)
| Count | Console message | Notes |
|---|---|---|
| 108 / 100 pages | `<svg> attribute width/height: Expected length, "{24}"` | A JSX value rendered as a string, harmless but sloppy |
| 92 pages | `GET /img/man.jpg` returns 404 | Missing default avatar image |
| 26 pages | `/api/student/socket/connect` returns 429 | Rate limited, probably caused by loading pages quickly |
| 27 pages | `clientApi error` | Not investigated |
| 3 pages | React error #418 / #425 (hydration mismatch) | `/dashboard/`, `/dashboard/global-settings/`, `/dashboard/magic-checkouts/statistics/` |
| 1 page | `TypeError: Cannot read properties of undefined` | `/dashboard/analytics/` |
| 1 page | `/api/teacher/ezy-meeting/license` and `/license/summary` return 404 | `/dashboard/meeting/` |

## Pages by area

### home
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/` | Dashboard / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Update Site Setting | 2 |

### analytics
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/analytics/` | Analytics / Admin | Referrer, Total, Device type, Total, Country, Total, Page, Total | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug | 1 |
| `/dashboard/analytics/realtime-analytics/` | Realtime Analytics / Admin | Referrer, Total, Device type, Total, Country, Total, Page, Total | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug | 0 |
| `/dashboard/analytics/students-history/` | Students History / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Search | 1 |
| `/dashboard/analytics/course-insights/` | Course Insights / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Enable Now | 0 |

### pages
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/pages/` | Pages / Admin | ID, Primary Info, Page Type, Price, Status, Cache, Page Slug, Last Updated | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Create Page | 4 |

### site-menu
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/site-menu/` | Site Menu / Admin | Name, Menu Type, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Menu Settings | 0 |

### banners
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/banners/` | Banner / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Global Banner | 0 |

### variables
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/variables/` | Variables | Name, Desktop, Tablet, Mobile | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add Collection | 0 |

### color-schema
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/color-schema/` | Color Schema | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Reset | 14 |

### custom-css
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/custom-css/` | CSS setting / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Save | 1 |

### global-javascript
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/global-javascript/` | Javascript setting / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Save | 1 |

### global-js-script
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/global-js-script/` | JS Script setting / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Save | 2 |

### settings
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/settings/fonts/` | Font Settings / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Upload | 1 |
| `/dashboard/settings/` | Settings / Admin | Record type, Host*, Value | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Save | 11 |
| `/dashboard/settings/checkout/` | Checkout Settings / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add Field | 9 |
| `/dashboard/settings/email/` | Email settings / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Save | 0 |
| `/dashboard/settings/student-dashboard-settings/` | Student Dashboard Settings / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Save | 3 |
| `/dashboard/settings/login-sessions/` | Login Sessions / Admin | ID, Device, IP, Last active at | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Force Logout | 0 |

### language
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/language/` | Web Language | S.I, Name, Native Name, Code, Flag, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Global Language Settings | 0 |

### mycourses
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/mycourses/` | Courses / Admin | Thumbnail, ID, Course Title, Instructors, Enrollments, Status, Course Created, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Dismiss banner | 7 |

### category
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/category/` | Categories / Admin | Icon, ID, Category name, Courses/Bundles, Category Created, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add Category | 11 |

### certificates
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/certificates/` | Certificates / Admin | Enrollment ID, User, Email, Course, Enrolled Date, Completion Date, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug | 3 |

### certificate-blueprints
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/certificate-blueprints/` | Certificates / Admin | ID, Name, Courses, Created At, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Create | 1 |

### question-bank
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/question-bank/` | Question Bank / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug | 0 |

### import-questions
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/import-questions/` | Import Questions / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Download Sample CSV | 1 |

### quiz-submissions
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/quiz-submissions/` | Quiz submissions / Admin | Id, Course name, Chapter name, Lesson name, Number of Submissions, Lesson Created, Course Created, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Delete | 14 |

### assignment
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/assignment/` | Assignment Submissions / Admin | Id, Icon, Name, Course, Chapter, Lesson, Points, Status | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Who did not submit assignment | 7 |

### surveys
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/surveys/` | Survey submissions / Admin | Id, Course Name, Chapter Name, Lesson Name, Number of Submissions, Lesson Created, Course Created, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Delete | 6 |

### reviews
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/reviews/` | Reviews / Admin | Profile, ID, Course Name, Student Name, Comment, Rate, Status, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug | 2 |

### coaching
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/coaching/coaching-programs/` | Coaching Programs | ID, Title, Visit, Session Type, Category, Status, Start Date, End Date | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add New Program | 3 |
| `/dashboard/coaching/library/` | Coaching Library / Tasks / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Reset Filter | 3 |
| `/dashboard/coaching/categories/` | Coaching Category / Admin | Category Id, Thumbnail, Category name, Category created, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add Category | 3 |
| `/dashboard/coaching/quiz-submissions/` | Coaching Quiz submissions / Admin | Id, Coaching Program Name, Name, Number of Submissions, Feed Created, Coaching Program Created, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Delete | 3 |

### products
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/products/?is_digital=1` | Digital Products / Admin | ID, Thumbnail, Title, Price, Strike Through Price, Enrollments, Created at, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add Product | 3 |
| `/dashboard/products/categories/` | Product Category / Admin | Category Id, Thumbnail, Category name, Product, Category created, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add Category | 3 |

### appointments
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/appointments/` | Appointments / Admin | ID, Event Name, Description, Total Booked, Session Duration, Active, Multiple Bookings, Maximum Bookings | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Create Appointment Event | 3 |

### communities
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/communities/` | Communities / Admin | Thumbnail, ID, Name, Total posts, Pending posts, Status, Privacy, Dashboard | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add New Community | 3 |

### groups
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/groups/` | Groups / Admin | Image, ID, Name, Pricing, Total Members, Last Activity, Created At, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add Group | 3 |

### private-chat-settings
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/private-chat-settings/` | Private Chat Settings / Admin | Image, User ID, Name, Type, Chat Expiration Date, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add Member | 4 |

### video-gallery
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/video-gallery/` | Video Gallery / Admin | ID, Name, Description, Status, Total Videos, View Enrolled Students, Created at, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add video library | 3 |
| `/dashboard/video-gallery/?is_audio=1` | Audio Gallery / Admin | ID, Name, Description, Status, Total Audios, View Enrolled Students, Created at, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add audio library | 3 |

### video-category
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/video-category/` | Video categories / Admin | Id, Name, Created At, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add category | 3 |
| `/dashboard/video-category/?is_audio=1` | Audio categories / Admin | Id, Name, Created At, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add category | 3 |

### event-create
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/event-create/` | Event Create / Admin | ID, Event Name, Event Start Date, Event End Date, Enrollments, Price, Strike Through Price, Event Type | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug | 4 |

### membership
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/membership/` | Membership / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug | 0 |

### meeting
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/meeting/` | Meetings | Room ID, Title, Product Type, Product ID, Host, Scheduled Start, Status, Duration (minutes) | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug | 3 |

### addons/marketplace
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/myaddons/marketplace/` | Marketplace / Addon / Dashboard | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug | 0 |
| `/dashboard/myaddons/marketplace/settings/` | Marketplace / Addon / Settings | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Increase Value | 7 |
| `/dashboard/myaddons/marketplace/seller/` | Marketplace / Addon / Seller | Select, ID, Profile pic, User id, Name, Approval status, Commission, Email | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add New Seller | 3 |
| `/dashboard/myaddons/marketplace/billings/` | Marketplace / Addon / Seller | ID, Order Id, Commission, Total Amount, From Seller, Status, Created at | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug | 3 |
| `/dashboard/myaddons/marketplace/seller-dashboard/` | Marketplace / Addon / Seller | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Create | 3 |
| `/dashboard/myaddons/marketplace/pending-approvals/` | Marketplace / Seller / Approval Requests | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug | 0 |

### students
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/students/` | Students / Admin | Student, Status, Tags, Activity, Actions | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Export | 9 |

### revenue_share
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/revenue_share/` | Revenue Partners / Admin | Image, ID, Revenue Partner Name, Total Partnerships, Auto-Assign Revenue Share, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add Revenue Partner | 3 |

### admin-user
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/admin-user/` | Role Manager / Add Members | Picture, ID, Name, Email, Last login, Role list, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add New Admin | 4 |

### role-manager
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/role-manager/` | Role Manager / Ezycourse | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Save | 0 |

### b2b-users
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/b2b-users/` | B2B Users | ID, Organization Name, Manager details, Total Enrollments, Actions | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug | 3 |

### upsells
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/upsells/` | Order Bumps / Admin | Thumbnail, ID, Title, Price, Strike Through Price, Created at, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add Order Bump | 4 |

### one-click-upsells
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/one-click-upsells/` | Upsells / Admin | Page, ID, Order, Title, Price, Strike Through Price, Created at, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add Upsell | 4 |

### bonus-items
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/bonus-items/` | Bonus Items / Admin | Thumbnail, ID, Title, Created at, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add Bonus Package | 4 |

### coupons
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/coupons/` | Coupons / Admin | For, Coupon, Code, Discount type, Discount, Duration, Quantity, Times Redeemed | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add New | 4 |

### orders
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/orders/` | Orders / Admin | Order no., Name, Email, Product, Product type, Transaction Reason, Coupon, Amount | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Export Orders data | 6 |

### preorders
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/preorders/` | Preorders / Admin | Order ID, Customer, Email, Course, Coupon, Amount, Discount, Type | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Charge All | 5 |

### manual-orders
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/manual-orders/` | Manual Orders / Admin | Order no., Name, Product, Product type, Coupon, Amount, Type, Delivery Status | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug | 5 |

### requests
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/requests/` | Private Product Purchase Requests / Admin | Thumbnail, ID, User name, Product title, Product image, Product type, Coupon, Request created | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Delete | 3 |

### magic-checkouts
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/magic-checkouts/statistics/` | Magic Checkout Statistics / Admin | ID, Product, Product Type, IP, Location, User, Email, Total amount | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Export All Stats Data | 13 |

### affiliate-users
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/affiliate-users/` | Affiliate Users / Admin | ID, Affiliate user, Email, Clicks, Signups, Sales, Commission Amount, Payment owed | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add new affiliate | 2 |
| `/dashboard/affiliate-users/all-transactions/` | Transactions / Admin | Tran. ID, Affiliate user, Purchased by, Product Id, Product type, Reason, Commission Amount, Original amount | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug | 2 |

### affiliate-settings
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/affiliate-settings/` | Affiliate default settings / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Increase Value | 2 |

### email
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/email/statistics/` | Overall Email Statistics / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug | 3 |
| `/dashboard/email/` | Email setting / Admin | ID, Template Name, Subject, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Edit Template | 4 |

### campaigns
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/campaigns/` | Campaigns / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Start New Campaign | 3 |

### campaign-topics
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/campaign-topics/` | Campaign Topics / Admin | Id, Topic Name, Description, Status, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add Topic | 1 |

### push-notifications
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/push-notifications/` | Push Notifications / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Start New Campaign | 0 |

### custom-forms
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/custom-forms/` | Custom Forms / Admin | Form Id, Form Name, Double Opt In, Contacts Count, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add New Form | 2 |

### advanced-form-builder
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/advanced-form-builder/` | Advanced Form Dashboard | Form Name, Fields, Responses, Status, Actions | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Create New Form | 2 |

### email-templates
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/email-templates/` | Email Templates / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Create Template | 1 |

### automation-workflows
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/automation-workflows/` | Automation Workflows | ID, Status, Automation Name, Username, Total Steps, Created At, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Search | 2 |

### automation-topics
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/automation-topics/` | Automation Topics / Admin | Id, Topic Name, Description, Status, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add Topic | 2 |

### tags
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/tags/` | Tags / Admin | Id, Tag Name, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add Tag | 1 |

### exports
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/exports/` | Exports / Admin | ID, EXPORT TYPE, STATUS, REQUESTED, EXPIRES, DOWNLOAD | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Refresh | 0 |

### email-settings
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/email-settings/` | Domain White Labeling / Admin | Record type, Host, Value | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Update | 5 |

### global-settings
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/global-settings/` | Global Settings - Ezycourse | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Update | 25 |

### email-setup
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/email-setup/` | Email setting / Agency | STATUS, TYPE, HOST, VALUE | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Get started | 2 |

### gamification
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/gamification/` | Gamification Settings / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Update | 6 |
| `/dashboard/gamification/leaderboard/` | Leaderboard / Admin | Rank, User, Point | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug | 1 |

### video-data
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/video-data/` | Video data / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Search | 2 |

### web-hook
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/web-hook/data-in/` | Data in / Webhook | - | Gallery, Enable Webhook | 0 |
| `/dashboard/web-hook/data-out/` | Data out / Webhook | Parameters, Description, Parameters, Description, Parameters, Description, Parameters, Description | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Regenerate URL | 23 |

### redirect-url
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/redirect-url/` | Redirect URL / Admin | ID, Incoming Slug, Destination URL, Status Code, Status, Created, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Add Redirect URL | 3 |

### all-addons
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/all-addons/` | (none) | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Buy Now | 2 |

### addons/advanced-interactive-course-view
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/myaddons/advanced-interactive-course-view/` | Advanced Interactive Course View / Addon | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Update | 0 |

### addons/auto-payout
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/myaddons/auto-payout/` | Auto payout / Addon | - | Gallery, Disabled auto payout | 0 |

### addons/ai-subtitle-generator
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/myaddons/ai-subtitle-generator/` | (none) | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug | 0 |

### addons/drm
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/myaddons/drm/` | Digital rights management (DRM) / Addon | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Update | 0 |

### addons/gamification
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/myaddons/gamification/` | Gamification / Addon | Thumbnail, Title, Coin, Price, Strike Through Price, Action, Thumbnail, Title | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Gift Coin | 2 |

### addons/popup
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/myaddons/popup/` | Push Notifications / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Start Popup Campaign | 0 |

### addons/announcement-popup-knowledge-base
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/myaddons/announcement-popup-knowledge-base/` | Announcement Popups and Knowledge Base / Addon | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Update | 0 |

### addons/multi-layer-page-caching
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/myaddons/multi-layer-page-caching/` | Multi-Layer Page Caching / Addon | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Update | 0 |

### addons/private-chat
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/myaddons/private-chat/` | Private Chat Settings / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Update Settings | 2 |

### addons/link-tracking
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/myaddons/link-tracking/` | Link Tracking / Addon | Title, Short Description, Main URL, Unique Clicks, Total Clicks, Total Product Purchased, Total Earnings, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Create Trackable Link | 1 |

### addons/site-wide-search-engine
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/myaddons/site-wide-search-engine/` | Site Wide Search Engine / Addon | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Hide search bar | 0 |

### addons/social-network
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/myaddons/social-network/` | Dashboard / Social Network / Addon | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug | 0 |

### addons/student-private-chat
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/myaddons/student-private-chat/` | Private Chat Settings / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Update Settings | 2 |

### addons/video-analytics
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/myaddons/video-analytics/` | Student Watch Time Analytics and AI | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Update | 0 |

### addons/web-push-notification
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/myaddons/web-push-notification/` | Web push notification / Addon | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Enabled push notification | 0 |

### blogs
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/blogs/` | Blogs / Admin | ID, Slug, Title, Category, Views, Status, Publish date, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Import blogs | 4 |
| `/dashboard/blogs/categories/` | Features Categories / Admin | ID, Name, Created At, Action | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Watch tutorial | 2 |
| `/dashboard/blogs/membership-one-time-pricing/` | Blogs Membership Pricing / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Increase Value | 2 |
| `/dashboard/blogs/membership-subscription-pricing/` | Blogs Membership Pricing / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Increase Value | 1 |

### affiliate-partner
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/affiliate-partner/` | Affiliate Partner / Admin | - | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Become An Affiliate | 0 |

### help-center
| Path | Title | Table columns | Buttons | Inputs |
|---|---|---|---|---|
| `/dashboard/help-center/` | (none) | Ticket ID, Your Tickets, Category, Status, Created At | Gallery, Connect Skreno, AI CREDITS 0 / 1k NEW, Record a bug, Sort by: Date | 4 |
