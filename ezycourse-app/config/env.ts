import 'dotenv/config'

function required(name: string, hint = 'Copy .env.example to .env and fill it in.'): string {
    const value = process.env[name]?.trim()
    if (!value) {
        throw new Error(`${name} is missing or empty in ezycourse-app/.env. ${hint}`)
    }
    return value
}

/** The first of these names that is set. The newer names (STUDENT_1_*, WEB_ADMIN_*) are used in .env now; the TEST_* names still work. */
function firstSet(label: string, ...names: string[]): string {
    for (const name of names) {
        const value = process.env[name]?.trim()
        if (value) return value
    }
    return required(names[0], `Also accepted: ${names.slice(1).join(', ')} (${label}).`)
}

export const env = {
    studentEmail: firstSet('student email', 'TEST_STUDENT_EMAIL', 'STUDENT_1_EMAIL'),
    studentPassword: firstSet('student password', 'TEST_STUDENT_PASSWORD', 'STUDENT_1_PASSWORD'),
    /** Student account 1 to 4 (STUDENT_<n>_EMAIL / STUDENT_<n>_PASSWORD). Never print the values. */
    student(slot: 1 | 2 | 3 | 4) {
        return { email: required(`STUDENT_${slot}_EMAIL`), password: required(`STUDENT_${slot}_PASSWORD`) }
    },
    // The admin / site owner account is only needed by owner tests, so it is read when first used.
    get adminEmail() {
        return firstSet('admin email', 'TEST_ADMIN_EMAIL', 'WEB_ADMIN_EMAIL')
    },
    get adminPassword() {
        return firstSet('admin password', 'TEST_ADMIN_PASSWORD', 'WEB_ADMIN_PASSWORD')
    },
    get webUrl() {
        return required('WEB_URL')
    },
    // Course names for the course tests. Read when first used, so the login tests do not need them.
    // Never print these values in logs or error messages.
    /** A course the test student is enrolled in. */
    get courseName() {
        return required('COURSE_NAME', 'Set it to the name of a course the test student is enrolled in.')
    },
    /** A bundle the test student owns (the name shown on the Bundle courses tab). */
    get bundleCourseName() {
        return required('BUNDLE_COURSE_NAME', 'Set it to the name of a bundle the test student owns.')
    },
}
