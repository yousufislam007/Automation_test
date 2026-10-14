import { $, $$, browser, driver } from '@wdio/globals'
import { TIMEOUT } from '../config/timeouts'
import BaseScreen from './BaseScreen'
import BottomMenu from './components/BottomMenu'

const ENTER_KEY = 66
const RETRY_EVERY_MS = 3000
const SETTLE_CHECK_EVERY_MS = 1000

/** Escapes a text for use inside a UiSelector string. */
const q = (text: string) => text.replace(/\\/g, '\\\\').replace(/"/g, '\\"')

// Course names come from .env and must not appear in logs, so no message below contains a course name.

/** The "Courses" bottom tab: Enrolled / Bundle sub-tabs, category chips, search box and course cards. */
class CoursesScreen extends BaseScreen {
    get heading() {
        return $('android=new UiSelector().descriptionStartsWith("My Courses")')
    }

    get enrolledTab() {
        return $('android=new UiSelector().descriptionStartsWith("Enrolled Courses")')
    }

    get bundleTab() {
        return $('android=new UiSelector().descriptionStartsWith("Bundle courses")')
    }

    get backButton() {
        return $('~Back')
    }

    get loadError() {
        return $('~Oops! Something went wrong')
    }

    get retryButton() {
        return $('~Retry')
    }

    get noCoursesMessage() {
        return $('~No courses found')
    }

    // The search box has no id (Flutter only gives it a hint) and is the only text box on this tab.
    get searchField() {
        return $('android=new UiSelector().className("android.widget.EditText")')
    }

    chip(name: string) {
        return $(`~${name}`)
    }

    courseCard(title: string) {
        return $(`android=new UiSelector().descriptionStartsWith("${q(title)}")`)
    }

    /** Titles of the course cards that are on screen now (the first line of each card's description). */
    async visibleCourseTitles() {
        const cards = await $$('android=new UiSelector().descriptionContains(" lessons")')
        const titles: string[] = []
        for (const card of cards) {
            const description = (await card.getAttribute('content-desc')) ?? ''
            titles.push(description.split('\n')[0])
        }
        return titles
    }

    /** Names of the category chips on screen, without "All". On this tab the chips are the only buttons (besides Retry). */
    async categoryChipNames() {
        const buttons = await $$('android=new UiSelector().className("android.widget.Button")')
        const names: string[] = []
        for (const button of buttons) {
            const name = (await button.getAttribute('content-desc')) ?? ''
            if (name && name !== 'All' && name !== 'Retry' && name !== 'Back') names.push(name)
        }
        return names
    }

    /**
     * Opens the Courses tab and puts it in a known state: Enrolled sub-tab, chip "All", empty search.
     * Right after a login the first tap on the tab can be ignored while the Dashboard is still loading,
     * so the tap is repeated until the Courses page shows. A bundle detail page has Back instead of the menu.
     */
    async open() {
        await browser.waitUntil(
            async () => {
                if (await this.heading.isDisplayed()) return true
                if (await this.backButton.isDisplayed()) {
                    await this.backButton.click()
                } else {
                    await BottomMenu.openCourses()
                }
                return false
            },
            {
                timeout: TIMEOUT * 2,
                interval: RETRY_EVERY_MS,
                timeoutMsg: 'The Courses page did not open after tapping the Courses tab',
            }
        )
        if ((await this.enrolledTab.getAttribute('selected')) !== 'true') {
            await this.enrolledTab.click()
        }
        await this.waitUntilListLoaded()
        await this.resetFilters()
    }

    private async resetFilters() {
        if ((await this.chip('All').getAttribute('selected')) !== 'true') {
            await this.chip('All').click()
        }
        if ((await this.searchField.getText()) !== '') {
            await this.search('')
        }
    }

    /** Waits for the first list of this tab. If the app shows its load error, taps Retry like a student would. */
    async waitUntilListLoaded() {
        await browser.waitUntil(
            async () => {
                if (await this.loadError.isDisplayed()) {
                    await this.retryButton.click()
                    return false
                }
                return (await this.noCoursesMessage.isDisplayed()) || (await this.visibleCourseTitles()).length > 0
            },
            {
                timeout: TIMEOUT * 2,
                interval: RETRY_EVERY_MS,
                timeoutMsg: 'The course list did not load (the app may show "Oops! Something went wrong")',
            }
        )
    }

    /** Waits until the list stops changing (two reads, one second apart, give the same result). */
    async waitUntilListSettled() {
        let previous = ''
        await browser.waitUntil(
            async () => {
                const now = `${(await this.visibleCourseTitles()).join('|')}#${await this.noCoursesMessage.isDisplayed()}`
                const settled = now === previous
                previous = now
                return settled
            },
            { timeout: TIMEOUT, interval: SETTLE_CHECK_EVERY_MS, timeoutMsg: 'The course list kept changing' }
        )
    }

    async openBundleTab() {
        await this.bundleTab.click()
        await this.waitUntilListLoaded()
    }

    async selectChip(name: string) {
        await this.chip(name).click()
        await browser.waitUntil(async () => (await this.chip(name).getAttribute('selected')) === 'true', {
            timeout: TIMEOUT,
            timeoutMsg: 'A category chip did not become selected after tapping it',
        })
        await this.waitUntilListSettled()
    }

    /** The search only filters after the Enter key (typing alone does not filter, see docs/app-feature.md). */
    async search(text: string) {
        if (text === '') {
            await this.tapInput(() => this.searchField)
            await this.clearField(() => this.searchField)
        } else {
            await this.typeInto(() => this.searchField, text)
        }
        await driver.execute('mobile: pressKey', { keycode: ENTER_KEY })
    }

    async openCourse(title: string) {
        await this.expectCourseVisible(title)
        await this.courseCard(title).click()
    }

    async expectCourseVisible(title: string) {
        await browser.waitUntil(async () => this.courseCard(title).isDisplayed(), {
            timeout: TIMEOUT,
            timeoutMsg: 'A course card that should be on the screen is not shown',
        })
    }

    async expectCourseNotVisible(title: string) {
        if (await this.courseCard(title).isDisplayed()) {
            throw new Error('A course card that must be hidden is shown on the screen')
        }
    }

    /** At least one course card is on screen (for example inside a bundle). */
    async expectAtLeastOneCourse() {
        await browser.waitUntil(async () => (await this.visibleCourseTitles()).length > 0, {
            timeout: TIMEOUT,
            timeoutMsg: 'No course card is shown',
        })
    }

    /** Every course card on screen is one of `allowed` (a filter must never show a course that is not in the full list). */
    async expectCoursesAreAmong(allowed: string[]) {
        const unexpected = (await this.visibleCourseTitles()).filter((title) => !allowed.includes(title))
        if (unexpected.length > 0) {
            throw new Error(`The filter shows ${unexpected.length} course(s) that are not in the full list`)
        }
    }
}

export default new CoursesScreen()
