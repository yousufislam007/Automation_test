/** A name that is unique per run, for anything a test creates: `uniqueName('TC post')` -> "TC post 1730646000123". */
export function uniqueName(prefix: string): string {
    return `${prefix} ${Date.now()}`
}
