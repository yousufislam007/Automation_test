import type { Locator, Page } from '@playwright/test'
import { Toast } from '../components/Toast'

/** The seller's "Create course" form (`/seller/courses/create/`). */
export class SellerCourseFormPage {
    static readonly path = '/seller/courses/create/'

    readonly titleInput: Locator
    readonly shortDescriptionInput: Locator
    readonly createButton: Locator
    /** The refusal a seller without a plan gets from the server. */
    readonly planNotFoundMessage: Locator

    constructor(private readonly page: Page) {
        this.titleInput = page.locator('#title')
        this.shortDescriptionInput = page.locator('#short_description')
        this.createButton = page.getByRole('button', { name: 'Create', exact: true })
        this.planNotFoundMessage = new Toast(page).withText('Plan not found')
    }

    async goto() {
        await this.page.goto(SellerCourseFormPage.path)
    }

    async fill(title: string, shortDescription: string) {
        await this.titleInput.fill(title)
        await this.shortDescriptionInput.fill(shortDescription)
    }

    /** Presses Create and returns what the server answered. */
    async submit(): Promise<{ status: number; body: string }> {
        const [response] = await Promise.all([
            this.page.waitForResponse(
                (r) => r.request().method() === 'POST' && r.url().includes('/course/createCourse')
            ),
            this.createButton.click(),
        ])
        return { status: response.status(), body: await response.text() }
    }
}
