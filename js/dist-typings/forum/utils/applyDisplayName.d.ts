import type File from '../../common/models/File';
/**
 * Whether a display name can be applied to this file's template.
 */
export declare function supportsDisplayName(file: File): boolean;
/**
 * Strip anything that would break the label out of its BBCode tag.
 *
 * Mirrors AbstractTextFormatterTemplate::sanitizeDisplayName() on the backend.
 * Square brackets are what form a BBCode tag, so removing them means the label
 * cannot open or close one; newlines would terminate the body and orphan the
 * closing tag.
 */
export declare function sanitizeDisplayName(name: string): string;
/**
 * Replace the label body of a BBCode string with the given display name.
 *
 * Works on the server-rendered bbcode rather than rebuilding it here, so the
 * attribute list stays owned by the PHP template and this does not have to be
 * kept in sync with it.
 *
 * Returns the bbcode unchanged when the name is empty or the bbcode has no
 * label body (a self-closing tag such as upl-image-preview).
 */
export declare function applyDisplayName(bbcode: string, displayName: string): string;
/**
 * Insert a file into the composer, prompting for a display name first when the
 * file's template renders a label.
 *
 * Files whose template has no label (images rendered inline, plain URLs) are
 * inserted straight away, so the prompt only appears where it means something.
 */
export declare function insertWithDisplayName(file: File, insert: (bbcode: string) => void): void;
/**
 * Insert one or more files into the composer, prompting for display names for
 * those whose template renders a label.
 *
 * A modal cannot be shown per file — core's ModalManager closes any open modal
 * when a new one is shown, so a chain of show() calls would leave only the last
 * one alive and silently drop the rest. A single modal therefore collects a name
 * for every labelled file in the batch.
 *
 * Files whose template has no label (images rendered inline, plain URLs) are
 * inserted straight away, so the prompt only covers what it can actually change.
 */
export declare function insertWithDisplayNames(files: File[], insert: (bbcode: string) => void): void;
