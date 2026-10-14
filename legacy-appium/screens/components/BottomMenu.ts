import { $ } from '@wdio/globals'

/** The five tabs at the bottom of the app. Each tab's id is its name twice ("Home\nHome"), so match the start. */
class BottomMenu {
    private tab(name: string) {
        return $(`android=new UiSelector().descriptionStartsWith("${name}")`)
    }

    get home() {
        return this.tab('Home')
    }

    get courses() {
        return this.tab('Courses')
    }

    async openCourses() {
        await this.courses.click()
    }
}

export default new BottomMenu()
