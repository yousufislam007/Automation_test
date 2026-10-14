import { $, browser } from '@wdio/globals'
import { TIMEOUT } from '../config/timeouts'
import BottomMenu from './components/BottomMenu'
import CoursesScreen from './CoursesScreen'

/**
 * The lesson page that opens when a course is tapped. What Appium can see depends on the lesson type
 * (see docs/app-feature.md, sections 5a, 6 and 7a), so "open" is decided from signs that exist in every case.
 */
class LessonPlayerScreen {
    // Video player: the time label "0:04 / 1:28:46".
    get videoTime() {
        return $('android=new UiSelector().descriptionContains(" / ")')
    }

    // Lesson pages that are not video/audio: a Back button, the "Go to lesson" button or the Lessons tab.
    get backButton() {
        return $('~Back')
    }

    get goToLessonButton() {
        return $('~Go to lesson')
    }

    get lessonsTab() {
        return $('android=new UiSelector().descriptionStartsWith("Lessons")')
    }

    // The first time the player opens on a fresh install, a 3-step tutorial covers it ("STEP 1 OF 3").
    get tutorial() {
        return $('android=new UiSelector().descriptionContains("OF 3")')
    }

    private async showsLessonContent() {
        for (const sign of [this.videoTime, this.backButton, this.goToLessonButton, this.lessonsTab, this.tutorial]) {
            if (await sign.isDisplayed()) return true
        }
        return false
    }

    /** The player is open: the course list and the bottom menu are gone and lesson content is on screen. */
    async expectOpen() {
        await browser.waitUntil(
            async () =>
                !(await CoursesScreen.heading.isDisplayed()) &&
                !(await BottomMenu.home.isDisplayed()) &&
                (await this.showsLessonContent()),
            { timeout: TIMEOUT * 2, timeoutMsg: 'The lesson player did not open after tapping the course card' }
        )
    }
}

export default new LessonPlayerScreen()
