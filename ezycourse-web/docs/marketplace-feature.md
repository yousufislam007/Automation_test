# Marketplace feature: how it works (from exploratory testing)

Explored on 2026-10-09 against https://ezyyousuf.ezycourse.com, as the admin and as a disposable test seller.
Everything below was observed in the app. "Not verified" marks what could not be confirmed.

## Test data and state I left behind
| Item | Value | Notes |
|---|---|---|
| Test seller | **ID 1307**, user id 1894895, `qa.seller.test@example.com` | Created from Marketplace > Seller > Add New Seller. Left **APPROVED**. Credentials are in `.env` (`QA_SELLER_EMAIL`, `QA_SELLER_PASSWORD`, git-ignored). Needed by the seller tests. |
| Marketplace settings | unchanged | I switched Auto-Approve Seller OFF and Auto-Approve Seller Products ON for an experiment, then restored the original values (Auto-Approve Seller **ON**, Auto-Approve Seller Products **OFF**). |
| Product category "QA Category" | deleted | Was needed to test the product form. |
| Test images in the seller's gallery | deleted | |

## Admin screens (`/dashboard/myaddons/marketplace/...`)
| Screen | URL | What it has |
|---|---|---|
| Dashboard | `/` | Total Sellers / Courses / Orders / Revenue, seller package prices ("After the first 40 sellers ... $5 per seller") |
| Settings | `/settings/` | Switches (current values in brackets): Enable Marketplace (ON), Display your Products on Marketplace (off), Enable seller signup (ON), Enable email verification (off), **Auto-Approve Seller (ON)** with default commission 20 %, Show notifications for plan or commission changes (off), Count seller courses in categories (off), Receive product sale approval notifications (ON), **Auto-Approve Seller Products (off)**, Best seller (ON, threshold 20), Allow Seller Refund (ON), Social links (off). Also "Which product do you want to sell?": Course, Digital product, Community (all ticked). Saves with `POST /api/teacher/addon/update-universal-addon-settings`. |
| Seller | `/seller/` | Table: ID, Profile pic, User id, Name, **Approval status**, Commission, Email, Action. Filter "All seller" / "Deleted seller". **Add New Seller** (first name, last name, email, password, plus the admin's own current password). Row menu (the ⋮ icon): View, **Approve**, **Reject**, Edit, Settings, Soft delete, Remove bank account, Generate A Magic Login. Approve/Reject ask "Are you sure?" (Cancel / OK) and call `POST /api/teacher/marketplace/update-seller-approval-status`. |
| Billings | `/billings/` | Commissions table |
| Seller Dashboard | `/seller-dashboard/` | Custom menu items for the seller sidebar |
| All Seller Products | `/pending-approvals/` | Requests dashboard for seller courses, communities, products |

A seller created by the admin starts **APPROVED**.

## Seller side
- A seller logs in on the normal storefront login (`/en/login`) and lands on **`/seller/dashboard/`** ("Seller Dashboard | EzyYousuf").
- Sidebar: Dashboard, Products & Services (only "Joined Communities"), Deals & Sales (Orders), Settings (Invoice Settings, Emails & Notifications).
- Red banner: "You don't have an active plan yet. Please purchase a plan to start creating and selling." The plan page (`/seller/dashboard/update-plan/`) says **"No plan available yet."** So **no seller can get a plan on this site**.
- Creation pages exist and can be opened by URL even though the menu hides them: `/seller/courses/create/`, `/seller/products/create/` ("Create A Physical Product"), `/seller/communities/create/`. List pages: `/seller/courses/`, `/seller/products/`, `/seller/communities/`. (`/seller/digital-products/` is a 404.)

## Approval rules (verified)
| Situation | What happens |
|---|---|
| **Rejected** seller logs in | Login API answers **HTTP 200 `{"require_approval": true}`**, sets no session cookie, and the page shows "**Please wait for a teacher to approve your account**". `/seller/*` redirects to `/en/login`. |
| Approved seller logs in | Session cookies are set, lands on `/seller/dashboard/`. |
| Seller is **rejected while already logged in** | **Bug:** the existing session still works for about **17 minutes** (measured: the product form stayed open until about 1,004 s after the rejection, then redirected to login). During that time the seller can still open the product creation page. |

## Can a seller post products? (tested with Auto-Approve Seller OFF and Auto-Approve Seller Products ON)
| Product kind | Result |
|---|---|
| Course (`/seller/courses/create/`) | Server answers **HTTP 400 "Plan not found"** (toast "Plan not found"). |
| Community (`/seller/communities/create/`) | Form needs name, description and a picture; with all of them the server answers **HTTP 400 "Plan not found"**. |
| Physical product (`/seller/products/create/`) | Form needs title, description, short description, **category** and an image. The seller's category dropdown is **empty** (the only product type an admin can create categories for is "Digital"), so it cannot be completed. |

Public marketplace page `/en/marketplace/` ("Discover products": Course / Community / Digital Product / Physical Product tabs; filters Seller, Price Paid/Free, Category, Level, Video duration, Rating, Language) lists **nothing** (Paid 0, Free 0). Nothing from a seller can appear because no seller can create anything.
Not verified: what happens to a seller product once a plan exists; a brand-new seller signing up while Auto-Approve Seller is OFF.

## Possible bugs / gaps found
| # | Where | What | Severity |
|---|---|---|---|
| 1 | Revoking approval | A rejected seller with an existing session keeps access for about 17 minutes (access token appears to be short-lived, the cookies themselves last 7 days). They can still open the product creation page. | **High** (business rule / security) |
| 2 | No seller plans | "No plan available yet", so no seller can ever create a course, community or product. | Blocker for the feature |
| 3 | Seller product form | Category is required but the dropdown is empty; physical-product categories cannot be created (only "Digital"). | Medium |
| 4 | Product Categories | The delete dialog says "**Partners** with these IDs 4897 will be deleted" (wrong word). | Low |
| 5 | Login of a rejected seller | The API answers HTTP 200 (not an error status) with `require_approval: true`; the message says "teacher" instead of admin. | Low |
| 6 | Creation pages | Hidden from the menu but still reachable by URL (the server does refuse the save with "Plan not found", verified for course and community). | Low |
| 7 | Upload boxes | The admin **lesson** Upload box opens nothing (not even after 10 s, and two HTTP 404 resource errors are logged), while the same kind of box on the seller product form opens the "Upload From Gallery" modal. | Medium |

## Automated test cases (`tests/marketplace/seller-approval.spec.ts`)
Run with `npm run test:marketplace` (headless) or `npm run test:marketplace:headed` (visible, slowed down). They are **not** part of `npm test`: they log the seller in 4 times (the login API allows 10 requests per window) and change the seller's approval status. They finish by setting the seller back to Approved.

| ID | What it checks | State |
|---|---|---|
| MKT-01 | A rejected seller gets `require_approval`, no session, and cannot open the product form | passes |
| MKT-02 | A rejected seller is told "Please wait for a teacher to approve your account" | passes |
| MKT-03 | A seller logged in before being rejected is blocked at once | **known bug** (`test.fail`), passes while the bug exists |
| MKT-04 | An approved seller with no plan sees the plan banner and no product creation in the menu | passes |
| MKT-07 | An approved seller with no plan gets HTTP 400 "Plan not found" when creating a course | passes |
| MKT-05 | An approved seller can post a product (sent for approval) | skipped (`fixme`): needs a plan and a category |
| MKT-06 | The product API refuses a rejected seller | skipped (`fixme`): needs the product-creation endpoint |

## Open questions for you
- Should sellers be able to buy a plan? Is there supposed to be at least one seller plan (or a free plan)?
- Is "Physical product" meant to be sellable? Only "Digital" categories can be created today.
- Is the 17-minute window after rejecting a seller expected? (It looks like an access-token lifetime; revoking should probably take effect immediately.)
- Should I test a brand-new seller signing up while **Auto-Approve Seller is OFF**? That creates another test user.
