/**
 * Helpers for the "maximum file size" admin setting.
 *
 * The setting is stored in kilobytes because Laravel's `max:` validation rule
 * (used by UploadValidator) operates in kilobytes. These helpers let the admin
 * UI present that value in a friendlier unit and compare it against the PHP
 * runtime limits.
 */
export type SizeUnit = 'KB' | 'MB' | 'GB';
/** Multiplier from each unit to kilobytes (1 KB = 1024 bytes, base-2 throughout). */
export declare const UNIT_TO_KB: Record<SizeUnit, number>;
/**
 * Pick the largest unit that represents `kb` as a whole number, so the value
 * round-trips exactly (e.g. 51200 KB → 50 MB, but 51201 KB stays in KB).
 */
export declare function bestUnitForKb(kb: number): SizeUnit;
/** Convert a value expressed in `unit` to kilobytes. */
export declare function toKb(value: number, unit: SizeUnit): number;
/** Convert kilobytes to the given unit (not rounded — for display). */
export declare function fromKb(kb: number, unit: SizeUnit): number;
/**
 * Human-readable rendering of a kilobyte value, e.g. 2048000 → "1.95 GB".
 * Uses at most two decimal places and trims trailing zeros.
 */
export declare function humanizeKb(kb: number): string;
/**
 * Parse a PHP shorthand byte value (e.g. "50M", "2G", "512K", "1048576") into
 * kilobytes. Mirrors PHP's ini size parsing: a trailing K/M/G is base-2, a bare
 * number is bytes. Returns null when the input can't be parsed.
 */
export declare function phpIniToKb(value: string | undefined | null): number | null;
/**
 * The effective PHP upload ceiling in kilobytes: the smaller of post_max_size
 * and upload_max_filesize. A value of "0" for post_max_size means unlimited in
 * PHP, so it is ignored. Returns null when neither limit can be parsed.
 */
export declare function effectivePhpLimitKb(postMaxSize: string | undefined, uploadMaxFilesize: string | undefined): number | null;
