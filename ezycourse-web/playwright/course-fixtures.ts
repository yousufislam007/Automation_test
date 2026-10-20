import { LessonPage } from '../pages/LessonPage'
import { writeTest } from './fixtures'

/**
 * For tests that create lessons in the QA course (see config/env.ts -> qa).
 *
 * Each test gets a `lessons` page object that is already on the "create lesson" screen with the course data
 * loaded. When the test ends, pass or fail, every lesson the test created is deleted again, so runs leave
 * nothing behind.
 */
export const courseTest = writeTest.extend<{ lessons: LessonPage }>({
    lessons: async ({ page }, use) => {
        const lessons = new LessonPage(page)
        await lessons.gotoCreate()
        await use(lessons)
        await lessons.deleteCreatedLessons()
    },
})

export { expect } from './fixtures'
