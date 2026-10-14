import 'dotenv/config'

function required(name: string, hint = 'Copy .env.example to .env and fill it in.'): string {
    const value = process.env[name]?.trim()
    if (!value) {
        throw new Error(`${name} is missing or empty in legacy-appium/.env. ${hint}`)
    }
    return value
}

export const env = {
    studentEmail: required('TEST_STUDENT_EMAIL'),
    studentPassword: required('TEST_STUDENT_PASSWORD'),
    // The admin / site owner account is only needed by owner tests, so it is read when first used.
    get adminEmail() {
        return required('TEST_ADMIN_EMAIL')
    },
    get adminPassword() {
        return required('TEST_ADMIN_PASSWORD')
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
