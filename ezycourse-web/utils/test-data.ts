/**
 * A name that is different on every run, so tests that create data never collide with each other
 * or with leftovers of an older run. Example: uniqueName('TC TEXT lesson') -> "TC TEXT lesson 1791538404277".
 */
export const uniqueName = (prefix: string): string => `${prefix} ${Date.now()}`
