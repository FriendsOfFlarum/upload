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
export const UNIT_TO_KB: Record<SizeUnit, number> = {
  KB: 1,
  MB: 1024,
  GB: 1024 * 1024,
};

/**
 * Pick the largest unit that represents `kb` as a whole number, so the value
 * round-trips exactly (e.g. 51200 KB → 50 MB, but 51201 KB stays in KB).
 */
export function bestUnitForKb(kb: number): SizeUnit {
  if (kb > 0 && kb % UNIT_TO_KB.GB === 0) return 'GB';
  if (kb > 0 && kb % UNIT_TO_KB.MB === 0) return 'MB';
  return 'KB';
}

/** Convert a value expressed in `unit` to kilobytes. */
export function toKb(value: number, unit: SizeUnit): number {
  return Math.round(value * UNIT_TO_KB[unit]);
}

/** Convert kilobytes to the given unit (not rounded — for display). */
export function fromKb(kb: number, unit: SizeUnit): number {
  return kb / UNIT_TO_KB[unit];
}

/**
 * Human-readable rendering of a kilobyte value, e.g. 2048000 → "1.95 GB".
 * Uses at most two decimal places and trims trailing zeros.
 */
export function humanizeKb(kb: number): string {
  if (!Number.isFinite(kb) || kb <= 0) return '0 KB';

  const unit = kb >= UNIT_TO_KB.GB ? 'GB' : kb >= UNIT_TO_KB.MB ? 'MB' : 'KB';
  const value = fromKb(kb, unit);
  const rounded = Math.round(value * 100) / 100;

  return `${rounded} ${unit}`;
}

/**
 * Parse a PHP shorthand byte value (e.g. "50M", "2G", "512K", "1048576") into
 * kilobytes. Mirrors PHP's ini size parsing: a trailing K/M/G is base-2, a bare
 * number is bytes. Returns null when the input can't be parsed.
 */
export function phpIniToKb(value: string | undefined | null): number | null {
  if (value == null) return null;

  const match = String(value)
    .trim()
    .match(/^(\d+(?:\.\d+)?)\s*([KMG])?$/i);

  if (!match) return null;

  const amount = parseFloat(match[1]);
  const suffix = (match[2] || '').toUpperCase();

  switch (suffix) {
    case 'G':
      return amount * UNIT_TO_KB.GB;
    case 'M':
      return amount * UNIT_TO_KB.MB;
    case 'K':
      return amount;
    default:
      // Bare number is bytes; convert to KB.
      return amount / 1024;
  }
}

/**
 * The effective PHP upload ceiling in kilobytes: the smaller of post_max_size
 * and upload_max_filesize. A value of "0" for post_max_size means unlimited in
 * PHP, so it is ignored. Returns null when neither limit can be parsed.
 */
export function effectivePhpLimitKb(postMaxSize: string | undefined, uploadMaxFilesize: string | undefined): number | null {
  const post = phpIniToKb(postMaxSize);
  const upload = phpIniToKb(uploadMaxFilesize);

  const limits: number[] = [];
  // post_max_size = 0 means "no limit" in PHP.
  if (post != null && post > 0) limits.push(post);
  if (upload != null) limits.push(upload);

  if (limits.length === 0) return null;

  return Math.min(...limits);
}
