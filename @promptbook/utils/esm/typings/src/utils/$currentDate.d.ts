import type { string_date_iso8601 } from '../types/typeAliases';
/**
 * Simple wrapper `new Date().toISOString()`
 *
 * Note: `$` is used to indicate that this function is not a pure function - it is not deterministic because it depends on the current time
 *
 * @returns string_date branded type
 * @public exported from `@promptbook/utils`
 */
export declare function $currentDate(): string_date_iso8601;
