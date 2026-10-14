import type { Locator, Page } from '@playwright/test'

/**
 * The small pop-up messages (toasts) the app shows, for example "Lesson name is required!".
 * They are not part of the normal page text, and the app renders each one twice (the visible pop-up and a
 * screen-reader copy), so we always take the first match.
 */
export class Toast {
    constructor(private readonly page: Page) {}

    withText(text: string | RegExp): Locator {
        return this.page.getByText(text).first()
    }
}
