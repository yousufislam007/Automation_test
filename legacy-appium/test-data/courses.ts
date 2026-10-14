/**
 * Course data the tests cannot get from `.env`. The enrolled course and the bundle come from `COURSE_NAME` and
 * `BUNDLE_COURSE_NAME` (see config/env.ts).
 *
 * The two below are NOT visible to a student in the app, so the owner has to provide them from the web admin.
 * Leave them undefined to skip the test that needs them. Do not print these names in logs.
 */
export const courses = {
    /** A published course the student is NOT enrolled in (CRS-02). */
    notEnrolled: undefined as string | undefined,
    /** A course in Draft status (CRS-03). */
    draft: undefined as string | undefined,
}
