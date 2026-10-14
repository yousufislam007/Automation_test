import { env } from '../../config/env'
import type { LessonTypeLabel } from '../../pages/LessonPage'
import { courseTest as test, expect } from '../../playwright/course-fixtures'
import { uniqueName } from '../../utils/test-data'

// One test case for every lesson type, in the dedicated QA course (config/env.ts -> qa).
// Creating a lesson changes data, so these tests use the `lessons` fixture: it opens the "create lesson" screen
// and deletes every lesson the test created when the test ends, so runs leave nothing behind.

// Types that can be created with just a name.
const CREATABLE: { id: string; label: LessonTypeLabel }[] = [
    { id: 'LESSON-02', label: 'TEXT' },
    { id: 'LESSON-03', label: 'PPT' },
    { id: 'LESSON-04', label: 'PDF' },
    { id: 'LESSON-06', label: 'QUIZ' },
    { id: 'LESSON-08', label: 'ASSIGNMENT' },
    { id: 'LESSON-11', label: 'EMBEDDED' },
    { id: 'LESSON-13', label: 'MULTIPLE' },
]

// Types that need more than a name. Without it the app must refuse to create the lesson and say why.
// "create" is the full happy path, parked (fixme) until the prerequisite exists on the site.
const NEEDS_CONTENT: { id: string; reqId: string; label: LessonTypeLabel; message: string; prerequisite: string }[] = [
    {
        id: 'LESSON-01',
        reqId: 'LESSON-17',
        label: 'VIDEO',
        message: 'A video is required for this lesson',
        prerequisite: 'a video file chosen through the Gallery media manager (the Upload box could not be automated)',
    },
    {
        id: 'LESSON-05',
        reqId: 'LESSON-18',
        label: 'AUDIO',
        message: 'An audio file is required for this lesson',
        prerequisite: 'an audio file chosen through the Gallery media manager',
    },
    {
        id: 'LESSON-09',
        reqId: 'LESSON-19',
        label: 'DOWNLOAD',
        message: 'A downloadable file is required for this lesson',
        prerequisite: 'a zip file chosen through the Gallery media manager (the form says "Only zip files")',
    },
    {
        id: 'LESSON-10',
        reqId: 'LESSON-20',
        label: 'LIVE',
        message: 'Please select a live lesson type',
        prerequisite: 'a live lesson type; the dropdown offers none until a live integration is configured',
    },
    {
        id: 'LESSON-12',
        reqId: 'LESSON-21',
        label: 'SCORM/HTML',
        message: 'A scorm/html file is required for this lesson',
        prerequisite: 'a SCORM/HTML zip chosen through the Gallery media manager',
    },
]

test.describe('Create lessons', { tag: '@course' }, () => {
    for (const { id, label } of CREATABLE) {
        test(`${id}: should create a ${label} lesson`, async ({ lessons }, testInfo) => {
            const name = uniqueName(`TC ${label} lesson`)
            await lessons.chooseType(label)
            await lessons.fillName(name)

            const created = await lessons.create()
            testInfo.annotations.push({ type: 'lesson_type', description: created.lesson_type })

            expect(created).toMatchObject({
                title: name,
                course_id: Number(env.qa.courseId),
                chapter_id: Number(env.qa.chapterId),
                is_published: 'PUBLISHED',
            })
            expect(created.lesson_type, 'lesson_type saved by the server').toBeTruthy()

            // It really persisted: reopen it and the name is still there.
            await lessons.open(created.id)
            await expect(lessons.nameInput).toHaveValue(name)
        })
    }

    for (const { id, reqId, label, message, prerequisite } of NEEDS_CONTENT) {
        // eslint-disable-next-line playwright/expect-expect -- parked: nothing to check until the prerequisite exists
        test.fixme(
            `${id}: should create a ${label} lesson`,
            { annotation: { type: 'needs', description: prerequisite } },
            async () => {}
        )

        test(`${reqId}: should require content for a ${label} lesson`, async ({ lessons }) => {
            const createRequestSent = lessons.watchCreateRequests()
            await lessons.chooseType(label)
            await lessons.fillName(uniqueName(`TC ${label} without content`))
            await lessons.createButton.click()

            await expect(lessons.message(message)).toBeVisible()
            expect(createRequestSent(), 'no lesson should be created').toBe(false)
        })
    }

    // SURVEY: the browser lets the request through, the server then refuses it (HTTP 422).
    // eslint-disable-next-line playwright/expect-expect -- parked: nothing to check until the prerequisite exists
    test.fixme(
        'LESSON-07: should create a SURVEY lesson',
        {
            annotation: {
                type: 'needs',
                description: 'a survey form to select (the "Select form" dropdown offers none on this site yet)',
            },
        },
        async () => {}
    )

    test('LESSON-22: should require a form for a SURVEY lesson', async ({ lessons }) => {
        await lessons.chooseType('SURVEY')
        await lessons.fillName(uniqueName('TC SURVEY without form'))

        const rejected = await lessons.createExpectingFailure()

        expect(rejected.status).toBe(422)
        expect(rejected.body).toContain('Form ID is required for survey lessons')
    })

    test('LESSON-14: should create a lesson as a draft', async ({ lessons }) => {
        await lessons.chooseType('TEXT')
        await lessons.fillName(uniqueName('TC draft lesson'))
        await lessons.draftCheckbox.check()

        const created = await lessons.create()

        expect(created.is_published).toBe('DRAFT')
    })

    test('LESSON-15: should keep the description of a text lesson', async ({ lessons }) => {
        const text = 'This is the lesson body written by an automated test.'
        await lessons.chooseType('TEXT')
        await lessons.fillName(uniqueName('TC text with description'))
        await lessons.fillDescription(text)

        const created = await lessons.create()

        await lessons.open(created.id)
        await expect(lessons.descriptionText(text)).toBeVisible()
    })

    test('LESSON-16: should not create a lesson without a name', async ({ lessons }) => {
        await lessons.chooseType('TEXT')
        await lessons.createButton.click()

        await expect(lessons.nameRequiredError).toBeVisible()
    })
})
