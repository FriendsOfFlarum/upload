import app from 'flarum/forum/app';
import type File from '../../common/models/File';

/**
 * Templates whose BBCode renders a visible label between the opening and
 * closing tags, and which therefore support a custom display name.
 *
 * The image-preview and markdown/bbcode-image templates render the image
 * itself with no label, so prompting for a name there would be meaningless.
 */
const LABELLED_TEMPLATES = ['file', 'image', 'text-preview'];

/**
 * Whether a display name can be applied to this file's template.
 */
export function supportsDisplayName(file: File): boolean {
  return LABELLED_TEMPLATES.includes(file.tag());
}

/**
 * Strip anything that would break the label out of its BBCode tag.
 *
 * Mirrors AbstractTextFormatterTemplate::sanitizeDisplayName() on the backend.
 * Square brackets are what form a BBCode tag, so removing them means the label
 * cannot open or close one; newlines would terminate the body and orphan the
 * closing tag.
 */
export function sanitizeDisplayName(name: string): string {
  return name.replace(/\s+/g, ' ').replace(/[[\]]/g, '').trim();
}

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
export function applyDisplayName(bbcode: string, displayName: string): string {
  const clean = sanitizeDisplayName(displayName);

  if (!clean) return bbcode;

  // The label sits between the opening tag's closing bracket and the matching
  // closing tag: '[upl-file …]<label>[/upl-file]'. Anchoring on the tag name
  // keeps this from matching brackets inside the attribute list.
  const labelled = /^(\[([a-z0-9-]+)\b[^\]]*\])([\s\S]*)(\[\/\2\])$/i;
  const match = bbcode.trim().match(labelled);

  if (!match) return bbcode;

  return `${match[1]}${clean}${match[4]}`;
}

/**
 * Insert a file into the composer, prompting for a display name first when the
 * file's template renders a label.
 *
 * Files whose template has no label (images rendered inline, plain URLs) are
 * inserted straight away, so the prompt only appears where it means something.
 */
export function insertWithDisplayName(file: File, insert: (bbcode: string) => void): void {
  const bbcode = file.bbcode();

  if (!supportsDisplayName(file)) {
    insert(bbcode);

    return;
  }

  app.modal.show(() => import('../components/DisplayNameModal'), {
    file,
    onsubmit: (displayName: string) => insert(applyDisplayName(bbcode, displayName)),
  });
}
