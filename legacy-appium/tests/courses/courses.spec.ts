import { browser, driver, expect } from '@wdio/globals'
import LoginScreen from '../../screens/LoginScreen'
import DashboardScreen from '../../screens/DashboardScreen'
import CoursesScreen from '../../screens/CoursesScreen'
import LessonPlayerScreen from '../../screens/LessonPlayerScreen'
import { env } from '../../config/env'
import { courses } from '../../test-data/courses'

const APP_PACKAGE = process.env.APP_PACKAGE || 'com.ezycourse.ezycourse'

// Read when the file loads: if a name is missing the spec stops here with a clear message, before any login.
// The names come from .env and are never printed.
const COURSE_NAME = env.courseName
const BUNDLE_NAME = env.bundleCourseName

describe('EzyCourse Courses tab', () => {
    // ONE login for the whole file (the login API allows about 10 requests per window).
    // Each test then starts by opening the Courses tab in a known state (Enrolled, chip All, empty search).
    before(async () => {
        await browser.reloadSession()
        await LoginScreen.waitUntilLoaded()
        await LoginScreen.login(env.studentEmail, env.studentPassword)
        await expect(DashboardScreen.welcomeMessage).toBeDisplayed({ wait: 20000 })
    })

    beforeEach(async () => {
        await CoursesScreen.open()
    })

    after(async () => {
        // The last test opens a lesson that may autoplay: close the app so nothing keeps playing.
        await driver.terminateApp(APP_PACKAGE)
    })

    it('CRS-01: an enrolled course shows in Courses > Enrolled Courses', async () => {
        await CoursesScreen.expectCourseVisible(COURSE_NAME)
    })

    it('CRS-02: a course the student is not enrolled in is not in Enrolled Courses', async function () {
        if (!courses.notEnrolled) this.skip() // needs data: a published course this student is NOT enrolled in
        await CoursesScreen.expectCourseNotVisible(courses.notEnrolled)
    })

    it('CRS-03: a Draft course is hidden from the student', async function () {
        if (!courses.draft) this.skip() // needs data: the name of a Draft course
        await CoursesScreen.expectCourseNotVisible(courses.draft)
    })

    it('CRS-04: the Bundle tab shows the bundle and its courses', async () => {
        await CoursesScreen.openBundleTab()
        await CoursesScreen.expectCourseVisible(BUNDLE_NAME)
        await CoursesScreen.openCourse(BUNDLE_NAME)
        await CoursesScreen.expectAtLeastOneCourse()
    })

    it('CRS-05: searching a course name shows that course', async () => {
        await CoursesScreen.search(COURSE_NAME)
        await CoursesScreen.expectCourseVisible(COURSE_NAME)
    })

    it('CRS-06: each category chip shows only courses from the full list', async function () {
        const allCourses = await CoursesScreen.visibleCourseTitles()
        const chips = await CoursesScreen.categoryChipNames()
        if (chips.length === 0) this.skip() // needs data: this site has no course categories
        for (const chip of chips) {
            await CoursesScreen.selectChip(chip)
            await CoursesScreen.expectCoursesAreAmong(allCourses)
        }
    })

    // Keep this test last: it leaves the app inside a lesson.
    it('CRS-07: tapping a course card opens the lesson player', async () => {
        await CoursesScreen.openCourse(COURSE_NAME)
        await LessonPlayerScreen.expectOpen()
    })
})
