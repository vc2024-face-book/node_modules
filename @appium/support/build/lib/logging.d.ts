/**
 *
 * @param {AppiumLoggerPrefix?} [prefix=null]
 * @returns {AppiumLogger}
 */
export function getLogger(prefix?: import("@appium/types").AppiumLoggerPrefix | null | undefined): AppiumLogger;
/** @type {import('@appium/types').AppiumLoggerLevel[]} */
export const LEVELS: import("@appium/types").AppiumLoggerLevel[];
export const log: import("@appium/types").AppiumLogger;
export default log;
export type AppiumLoggerPrefix = import("@appium/types").AppiumLoggerPrefix;
export type AppiumLogger = import("@appium/types").AppiumLogger;
export type AppiumLoggerLevel = import("@appium/types").AppiumLoggerLevel;
//# sourceMappingURL=logging.d.ts.map