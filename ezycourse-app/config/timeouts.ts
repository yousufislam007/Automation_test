/** How long (in ms) a screen waits for something to appear before it gives up. */
export const TIMEOUT = 15000

/**
 * How long (in ms) to wait when checking whether something is on screen that may well NOT be there
 * (e.g. "is the login screen showing?"). Short, so a "no" answer does not cost the full TIMEOUT.
 */
export const SHORT_TIMEOUT = 3000
