import { expect, type Locator, type Page } from '@playwright/test'
import { env } from '../config/env'
import { Toast } from './components/Toast'

/** The lesson the API returns after a successful create (only the fields the tests check). */
export interface CreatedLesson {
    id: number
    title: string
    lesson_type: string
    course_id: number
    chapter_id: number
    is_published: string
}

/** The lesson type cards on the "Please Select New Lesson Type" screen. */
export type LessonTypeLabel =
    | 'VIDEO'
    | 'TEXT'
    | 'PPT'
    | 'PDF'
    | 'AUDIO'
    | 'QUIZ'
    | 'SURVEY'
    | 'ASSIGNMENT'
    | 'DOWNLOAD'
    | 'LIVE'
    | 'EMBEDDED'
    | 'SCORM/HTML'
    | 'MULTIPLE'

const API = '/api/teacher'

export class LessonPage {
    readonly nameInput: Locator
    readonly createButton: Locator
    readonly draftCheckbox: Locator
    readonly typePrompt: Locator
    /** Shown when Create is pressed without a lesson name. */
    readonly nameRequiredError: Locator

    private readonly toast: Toast
    private readonly courseId = env.qa.courseId
    private readonly chapterId = env.qa.chapterId
    /** Ids of the lessons this page object created, so deleteCreatedLessons() can remove them again. */
    private readonly createdIds: number[] = []

    constructor(private readonly page: Page) {
        this.toast = new Toast(page)
        this.nameInput = page.locator('#title') // "Lesson Name" (or "Assignment title")
        this.createButton = page.getByRole('button', { name: 'Create' })
        this.draftCheckbox = page.getByLabel('Draft')
        this.typePrompt = page.getByText('Please Select New Lesson Type')
        this.nameRequiredError = this.toast.withText('Lesson name is required!')
    }

    createUrl = () => `/dashboard/courses/${this.courseId}/chapter/${this.chapterId}/lesson/create/`
    editUrl = (lessonId: number) => `/dashboard/courses/${this.courseId}/chapter/${this.chapterId}/lesson/${lessonId}/`

    /** A message (toast) with this text, for example "A video is required for this lesson". */
    message(text: string): Locator {
        return this.toast.withText(text)
    }

    /** Text inside the lesson description (the rich-text editor on the edit screen). */
    descriptionText(text: string): Locator {
        return this.page.getByText(text)
    }

    /**
     * Opens the "create lesson" screen and waits until the course and chapter data have loaded.
     * The app fills in the course id from that data, so clicking Create earlier fails with
     * "Course is required" (HTTP 422).
     */
    async gotoCreate() {
        const courseLoaded = this.waitForGet(`${API}/course/getSingleCourse/${this.courseId}`)
        const lessonsLoaded = this.waitForGet(`${API}/lesson/getLessonByChapterId/${this.chapterId}`)
        await this.page.goto(this.createUrl())
        await Promise.all([courseLoaded, lessonsLoaded])
        await expect(this.typePrompt).toBeVisible()
    }

    async chooseType(label: LessonTypeLabel) {
        await this.page.getByText(label, { exact: true }).first().click()
        await expect(this.nameInput).toBeVisible()
    }

    async fillName(name: string) {
        await this.nameInput.fill(name)
    }

    /** Types into the first rich-text editor on the page. */
    async fillDescription(text: string) {
        const editor = this.page.locator('[contenteditable="true"]').first()
        await editor.click()
        await this.page.keyboard.type(text)
    }

    /**
     * Starts watching for "create lesson" requests. Call the returned function later to ask whether one was sent.
     * Used to prove that the app refused to even try (for example when a required file is missing).
     */
    watchCreateRequests(): () => boolean {
        let sent = false
        this.page.on('request', (request) => {
            if (request.url().includes(`${API}/lesson/createLesson`)) sent = true
        })
        return () => sent
    }

    /**
     * Clicks Create and returns the lesson the server saved. Fails if the server did not answer 200.
     * The new lesson is remembered, so deleteCreatedLessons() can clean it up.
     */
    async create(): Promise<CreatedLesson> {
        const [response] = await Promise.all([
            this.page.waitForResponse(
                (r) => r.request().method() === 'POST' && r.url().includes(`${API}/lesson/createLesson`)
            ),
            this.createButton.click(),
        ])
        expect(response.status(), `createLesson answered: ${await response.text()}`).toBe(200)
        const lesson = (await response.json()) as CreatedLesson
        this.createdIds.push(lesson.id)
        return lesson
    }

    /** Clicks Create when the server is expected to refuse; returns what it answered. */
    async createExpectingFailure(): Promise<{ status: number; body: string }> {
        const [response] = await Promise.all([
            this.page.waitForResponse(
                (r) => r.request().method() === 'POST' && r.url().includes(`${API}/lesson/createLesson`)
            ),
            this.createButton.click(),
        ])
        return { status: response.status(), body: await response.text() }
    }

    /**
     * Opens an existing lesson's edit screen and waits for it to load.
     * A MULTIPLE lesson first shows a summary card; its pencil icon opens the normal edit form.
     */
    async open(lessonId: number) {
        const courseLoaded = this.waitForGet(`${API}/course/getSingleCourse/${this.courseId}`)
        await this.page.goto(this.editUrl(lessonId))
        await courseLoaded
        const multipleSummaryPencil = this.page.locator('span._multi_edit')
        await expect(this.nameInput.or(multipleSummaryPencil)).toBeVisible()
        if (await multipleSummaryPencil.isVisible()) await multipleSummaryPencil.click()
        await expect(this.nameInput).toBeVisible()
    }

    /** Deletes the lesson that is open: Delete Lesson, then OK in the confirmation. */
    async deleteOpenLesson() {
        await this.page.getByRole('button', { name: 'Delete Lesson' }).click()
        const [response] = await Promise.all([
            this.page.waitForResponse(
                (r) => r.request().method() === 'POST' && r.url().includes(`${API}/lesson/deleteLesson`)
            ),
            this.page.getByRole('button', { name: 'OK' }).click(),
        ])
        expect(response.status(), 'deleteLesson status').toBe(200)
    }

    /** Deletes every lesson this page object created, so a test run leaves nothing behind. */
    async deleteCreatedLessons() {
        for (const id of this.createdIds.splice(0)) {
            await this.open(id)
            await this.deleteOpenLesson()
        }
    }

    private waitForGet(pathPart: string) {
        return this.page.waitForResponse((r) => r.request().method() === 'GET' && r.url().includes(pathPart))
    }
}
