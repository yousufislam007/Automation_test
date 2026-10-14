import { expect, type Locator, type Page } from '@playwright/test'
import { env } from '../config/env'

export type SellerStatus = 'APPROVED' | 'REJECTED' | 'PENDING'

/** Admin screen: Marketplace > Seller (list of sellers with their approval status). */
export class MarketplaceSellersPage {
    readonly heading: Locator
    readonly addSellerButton: Locator

    constructor(private readonly page: Page) {
        this.heading = page.getByRole('heading', { name: 'All Seller' })
        this.addSellerButton = page.getByRole('button', { name: 'Add New Seller' })
    }

    async goto() {
        await this.page.goto('/dashboard/myaddons/marketplace/seller/')
        await expect(this.heading).toBeVisible()
        await expect(this.addSellerButton).toBeVisible()
    }

    /** The table row of the seller with this email. */
    row(email: string): Locator {
        return this.page.getByRole('row').filter({ hasText: email })
    }

    async status(email: string): Promise<SellerStatus> {
        const text = await this.row(email).innerText()
        const match = text.match(/\b(APPROVED|REJECTED|PENDING)\b/)
        if (!match) throw new Error(`Could not read the approval status of ${email}. Row text: ${text}`)
        return match[1] as SellerStatus
    }

    /** Creates the seller from the "Add New Seller" form if it is not in the list yet. */
    async ensureSeller(seller: { name: string; email: string; password: string }) {
        await this.goto()
        if ((await this.row(seller.email).count()) > 0) return

        const [first, ...rest] = seller.name.split(' ')
        await this.addSellerButton.click()
        await this.page.locator('#form_in_modal_first_name').fill(first)
        await this.page.locator('#form_in_modal_last_name').fill(rest.join(' ') || first)
        await this.page.locator('#form_in_modal_email').fill(seller.email)
        await this.page.locator('#form_in_modal_password').fill(seller.password)
        await this.page.locator('#form_in_modal_own_password').fill(env.adminPassword) // the form asks for the admin's own password
        await this.page.getByRole('button', { name: 'Add', exact: true }).click()
        await expect(this.row(seller.email)).toBeVisible()
    }

    /** Approves or rejects the seller (row menu -> Approve / Reject -> OK) and waits until the list shows the result. */
    async setApproval(email: string, decision: 'Approve' | 'Reject') {
        const wanted: SellerStatus = decision === 'Approve' ? 'APPROVED' : 'REJECTED'
        await this.goto()
        await expect(this.row(email)).toBeVisible()
        if ((await this.status(email)) === wanted) return // already in the wanted state

        await this.row(email).locator('td').last().locator('svg').first().click() // the ⋮ icon
        await this.page.getByText(decision, { exact: true }).click()
        const [response] = await Promise.all([
            this.page.waitForResponse((r) => r.url().includes('/marketplace/update-seller-approval-status')),
            this.page.getByRole('button', { name: 'OK' }).click(),
        ])
        expect(response.status(), 'update-seller-approval-status').toBe(200)

        await this.goto() // reload: the list must show what the server saved
        await expect(this.row(email)).toContainText(wanted)
    }
}
