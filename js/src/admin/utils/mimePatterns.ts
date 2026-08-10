/**
 * Friendly representation of the mime-type regexes stored in
 * `fof-upload.mimeTypes`.
 *
 * The saved format is unchanged — a regex string keying each mapping — so
 * everything here is presentation only: parse a regex into something a
 * non-technical admin can read, and write the same regex back out.
 *
 * Not every pattern fits that model. `text\/plain` has no anchors, and long
 * vendor types like
 * `application\/vnd.openxmlformats-officedocument.wordprocessingml.document`
 * are a single subtype with dots in it. Anything that does not decompose cleanly
 * is reported as `advanced` and left exactly as the admin wrote it, because
 * silently rewriting a working pattern is far worse than showing a regex.
 */

export interface ParsedPattern {
  /** True when the pattern round-trips through the friendly model. */
  friendly: boolean;
  /** Top-level mime type, e.g. "image". Empty when not friendly. */
  type: string;
  /** Subtypes, unescaped for display, e.g. ["jpeg", "svg+xml"]. */
  subtypes: string[];
}

/**
 * Matches `^type\/(a|b|c)$` and the single-subtype `^type\/a$`.
 *
 * Deliberately strict: both anchors and the escaped slash must be present. A
 * looser pattern would "successfully" parse things it cannot faithfully rebuild.
 */
const ANCHORED_GROUP = /^\^([a-z]+)\\\/\(([^()]+)\)\$$/;
const ANCHORED_SINGLE = /^\^([a-z]+)\\\/([^()|]+)\$$/;

/**
 * Regex metacharacters that make a subtype unrepresentable as a chip.
 *
 * `+` and `.` are deliberately absent: they occur in real subtypes (`svg+xml`,
 * `vnd.ms-excel`) and escapeSubtype handles them, so rejecting them here would
 * block valid input.
 */
const UNSAFE_IN_SUBTYPE = /[()|^$\[\]{}?*\\]/;

export function parsePattern(pattern: string): ParsedPattern {
  const notFriendly: ParsedPattern = { friendly: false, type: '', subtypes: [] };

  const grouped = pattern.match(ANCHORED_GROUP);
  const single = grouped ? null : pattern.match(ANCHORED_SINGLE);
  const match = grouped ?? single;

  if (!match) return notFriendly;

  const [, type, body] = match;
  const rawSubtypes = body.split('|');

  // An empty alternative (`a||b`) means the pattern is malformed; leave it alone
  // rather than silently dropping the empty branch on save.
  if (rawSubtypes.some((s) => s.trim() === '')) return notFriendly;

  const subtypes = rawSubtypes.map(unescapeSubtype);

  // Only claim it is friendly if rebuilding produces the original pattern.
  // This is the guard that makes the whole feature safe: anything that does not
  // survive the round trip is treated as advanced.
  if (buildPattern(type, subtypes) !== pattern) return notFriendly;

  return { friendly: true, type, subtypes };
}

/** Rebuild a regex from a type and its subtypes. */
export function buildPattern(type: string, subtypes: string[]): string {
  const cleaned = subtypes.map((s) => s.trim()).filter(Boolean);

  if (!type || cleaned.length === 0) return '';

  const escaped = cleaned.map(escapeSubtype);

  return escaped.length === 1 ? `^${type}\\/${escaped[0]}$` : `^${type}\\/(${escaped.join('|')})$`;
}

/**
 * Escape a subtype for inclusion in the pattern.
 *
 * Only `+` and `.` are escaped — the two characters that appear in real mime
 * subtypes (`svg+xml`, `vnd.ms-excel`) and mean something else in a regex.
 * Anything containing other regex metacharacters is rejected by the caller
 * rather than escaped here, so the friendly editor never produces a pattern
 * whose meaning it cannot predict.
 */
function escapeSubtype(subtype: string): string {
  return subtype.replace(/[+.]/g, (c) => `\\${c}`);
}

function unescapeSubtype(subtype: string): string {
  return subtype.trim().replace(/\\([+.])/g, '$1');
}

/** Whether a subtype can be safely represented as a chip. */
export function isValidSubtype(subtype: string): boolean {
  const value = subtype.trim();

  return value !== '' && !UNSAFE_IN_SUBTYPE.test(value);
}

/**
 * Named starting points for the "add file types" picker.
 *
 * These are the groupings forums actually ask for. The subtype lists are
 * deliberately conservative — an admin can add more with the chip editor, and a
 * shorter list is easier to reason about than an exhaustive one.
 */
export interface MimePreset {
  key: string;
  /** Translation key suffix under `admin.labels.mime_presets`. */
  labelKey: string;
  type: string;
  subtypes: string[];
  /** Download template that suits this group. */
  template: string;
}

export const MIME_PRESETS: MimePreset[] = [
  {
    key: 'images',
    labelKey: 'images',
    type: 'image',
    subtypes: ['jpeg', 'png', 'gif', 'webp', 'avif'],
    template: 'image-preview',
  },
  {
    key: 'pdf',
    labelKey: 'pdf',
    type: 'application',
    subtypes: ['pdf'],
    template: 'file',
  },
  {
    key: 'documents',
    labelKey: 'documents',
    type: 'application',
    subtypes: ['msword', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'vnd.oasis.opendocument.text'],
    template: 'file',
  },
  {
    key: 'spreadsheets',
    labelKey: 'spreadsheets',
    type: 'application',
    subtypes: ['vnd.ms-excel', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'vnd.oasis.opendocument.spreadsheet'],
    template: 'file',
  },
  {
    key: 'archives',
    labelKey: 'archives',
    type: 'application',
    subtypes: ['zip', 'x-zip-compressed', 'x-7z-compressed', 'x-tar', 'gzip'],
    template: 'file',
  },
  {
    key: 'audio',
    labelKey: 'audio',
    type: 'audio',
    subtypes: ['mpeg', 'ogg', 'wav', 'webm'],
    template: 'file',
  },
  {
    key: 'video',
    labelKey: 'video',
    type: 'video',
    subtypes: ['mp4', 'webm', 'ogg'],
    template: 'file',
  },
];

/**
 * Subtypes offered when adding to an existing row, keyed by top-level type.
 * Suggestions only — the chip editor accepts anything valid.
 */
export const KNOWN_SUBTYPES: Record<string, string[]> = {
  image: ['jpeg', 'png', 'gif', 'webp', 'avif', 'bmp', 'tiff', 'svg+xml', 'heic'],
  application: [
    'pdf',
    'msword',
    'zip',
    'x-zip-compressed',
    'x-7z-compressed',
    'x-tar',
    'gzip',
    'json',
    'vnd.ms-excel',
    'vnd.openxmlformats-officedocument.wordprocessingml.document',
    'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'vnd.oasis.opendocument.text',
    'vnd.android.package-archive',
    'epub+zip',
  ],
  audio: ['mpeg', 'ogg', 'wav', 'webm', 'aac', 'flac'],
  video: ['mp4', 'webm', 'ogg', 'quicktime', 'x-msvideo'],
  text: ['plain', 'csv', 'markdown', 'html'],
};

/** Suggested subtypes for a type, excluding those already present. */
export function suggestedSubtypes(type: string, existing: string[]): string[] {
  return (KNOWN_SUBTYPES[type] ?? []).filter((s) => !existing.includes(s));
}

/** Top-level types offered when creating a custom friendly row. */
export const MIME_TYPES = ['image', 'application', 'audio', 'video', 'text'];
