import { sellerAccount } from '../../config/env'
import { SellerCourseFormPage } from '../../pages/seller/SellerCourseFormPage'
import { SellerDashboardPage } from '../../pages/seller/SellerDashboardPage'
import { SellerProductFormPage } from '../../pages/seller/SellerProductFormPage'
import { expect, marketplaceTest as test, withAdminSellersPage } from '../../playwright/marketplace-fixtures'
import { uniqueName } from '../../utils/test-data'

// Rule under test: a seller who is NOT approved must not be able to post products for sale.
// (Marketplace > Settings has "Auto-Approve Seller" and "Auto-Approve Seller Products" switched on/off by the admin.)
//
// The tests use one disposable seller (QA_SELLER_EMAIL / QA_SELLER_PASSWORD) and flip its approval status from the
// admin screen, so they must run one after another. They change data, so they use `marketplaceTest`
// (which builds on `writeTest`). Real login requests used per run: 4 (the login API allows only 10 per window).
test.describe.configure({ mode: 'serial' })

test.describe('Marketplace: seller approval', { tag: '@marketplace' }, () => {
    test.beforeAll(async ({ browser }) => {
        await withAdminSellersPage(browser, (sellers) => sellers.ensureSeller(sellerAccount()))
    })

    // Leave the seller the way a new admin-created seller starts: approved.
    test.afterAll(async ({ browser }) => {
        await withAdminSellersPage(browser, (sellers) => sellers.setApproval(sellerAccount().email, 'Approve'))
    })

    test('MKT-01: should not let a rejected seller log in or open the product form', async ({
        sellersAdmin,
        seller,
    }) => {
        await sellersAdmin.setApproval(seller.account.email, 'Reject')

        const session = await seller.logIn()
        // The login API answers 200 but asks for approval and gives no session.
        expect(session.login.status).toBe(200)
        expect(session.login.body).toMatchObject({ require_approval: true })
        expect(await session.hasSession(), 'a rejected seller must not get a session').toBe(false)

        const productForm = new SellerProductFormPage(session.page)
        await productForm.goto()
        await expect(session.page).toHaveURL(/\/en\/login/)
        await expect(productForm.titleInput).toHaveCount(0)
    })

    test('MKT-02: should tell a rejected seller that approval is needed', async ({ sellersAdmin, seller }) => {
        await sellersAdmin.setApproval(seller.account.email, 'Reject')

        const session = await seller.logIn()

        await expect(session.loginPage.approvalRequiredMessage).toBeVisible()
        await expect(session.page).toHaveURL(/\/en\/login/)
    })

    // KNOWN BUG (found 2026-10-09): after the admin rejects a seller, the seller's EXISTING session keeps working for about
    // 17 minutes (measured: access ended at ~1,004 s). During that time the seller can still open the product form.
    // The test describes the correct behaviour (blocked straight away); test.fail() makes it pass while the bug exists
    // and start failing, so you notice, once it is fixed.
    test('MKT-03: should stop an already logged-in seller from posting once approval is revoked', async ({
        sellersAdmin,
        seller,
    }) => {
        test.fail(true, 'Known bug: a rejected seller keeps access with an existing session for about 17 minutes')

        // 1. Approved seller logs in and gets a real session.
        await sellersAdmin.setApproval(seller.account.email, 'Approve')
        const first = await seller.logIn()
        expect(first.login.status).toBe(200)
        expect(await first.hasSession(), 'an approved seller gets a session').toBe(true)
        await new SellerDashboardPage(first.page).expectLoaded()
        const savedSession = await first.saveSession()
        await first.close() // the seller goes away: no browser keeps the session alive

        // 2. Admin rejects the seller.
        await sellersAdmin.setApproval(seller.account.email, 'Reject')

        // 3. The OLD session (cookies still present) must no longer reach the product form or the seller area.
        const stale = await seller.openWithSession(savedSession)
        for (const path of [SellerProductFormPage.path, SellerDashboardPage.path]) {
            await stale.page.goto(path)
            await expect(stale.page, `${path} for a rejected seller`).toHaveURL(/\/en\/login/)
        }
        await expect(new SellerProductFormPage(stale.page).titleInput).toHaveCount(0)
    })

    test('MKT-04: should not offer product creation to an approved seller who has no plan', async ({
        sellersAdmin,
        seller,
    }) => {
        await sellersAdmin.setApproval(seller.account.email, 'Approve')

        const session = await seller.logIn()
        const dashboard = new SellerDashboardPage(session.page)
        await dashboard.expectLoaded()
        await expect(dashboard.noPlanBanner).toBeVisible()

        await dashboard.openProductsMenu()
        await expect(dashboard.joinedCommunitiesLink).toBeVisible()
        await expect(dashboard.physicalProductsLink).toHaveCount(0)
        await expect(dashboard.addProductLink).toHaveCount(0)
    })

    // Even an APPROVED seller cannot post here: there is no seller plan ("No plan available yet"), and the server refuses
    // with HTTP 400 "Plan not found". This holds whatever Auto-Approve Seller / Auto-Approve Seller Products are set to.
    test('MKT-07: should refuse to create a course for an approved seller who has no plan', async ({
        sellersAdmin,
        seller,
    }) => {
        await sellersAdmin.setApproval(seller.account.email, 'Approve')

        const session = await seller.logIn()
        const courseForm = new SellerCourseFormPage(session.page)
        await courseForm.goto()
        await courseForm.fill(uniqueName('TC seller course'), 'Created by an automated test. Must be refused.')
        const answer = await courseForm.submit()

        expect(answer.status).toBe(400)
        expect(answer.body).toContain('Plan not found')
        await expect(courseForm.planNotFoundMessage).toBeVisible()
        await expect(session.page).toHaveURL(/\/seller\/courses\/create\//) // nothing was created, so we stay on the form
    })

    // Posting a physical product also needs a category and an image. No category is offered to the seller on this site
    // (the only product type an admin can create categories for is "Digital"), so the form cannot be completed.
    // eslint-disable-next-line playwright/expect-expect -- parked: nothing to check until the prerequisite exists
    test.fixme(
        'MKT-05: should let an approved seller post a product (sent for approval)',
        {
            annotation: {
                type: 'needs',
                description:
                    'a seller plan ("No plan available yet" today) and a product category the seller can pick (only "Digital" categories exist)',
            },
        },
        async () => {}
    )

    // eslint-disable-next-line playwright/expect-expect -- parked: nothing to check until the prerequisite exists
    test.fixme(
        'MKT-06: should refuse the product API call from a rejected seller',
        {
            annotation: {
                type: 'needs',
                description:
                    "the product-creation API endpoint (captured from MKT-05) to call it directly with a rejected seller's session",
            },
        },
        async () => {}
    )
})
