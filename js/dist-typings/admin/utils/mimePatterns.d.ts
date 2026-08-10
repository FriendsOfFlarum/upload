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
export declare function parsePattern(pattern: string): ParsedPattern;
/** Rebuild a regex from a type and its subtypes. */
export declare function buildPattern(type: string, subtypes: string[]): string;
/** Whether a subtype can be safely represented as a chip. */
export declare function isValidSubtype(subtype: string): boolean;
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
export declare const MIME_PRESETS: MimePreset[];
/**
 * Subtypes offered when adding to an existing row, keyed by top-level type.
 * Suggestions only — the chip editor accepts anything valid.
 */
export declare const KNOWN_SUBTYPES: Record<string, string[]>;
/** Suggested subtypes for a type, excluding those already present. */
export declare function suggestedSubtypes(type: string, existing: string[]): string[];
/** Top-level types offered when creating a custom friendly row. */
export declare const MIME_TYPES: string[];
