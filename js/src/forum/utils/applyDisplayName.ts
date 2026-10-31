import app from 'flarum/forum/app';
import type File from '../../common/models/File';

// Templates whose BBCode renders a label between its tags; the rest show the file itself.
const LABELLED_TEMPLATES = ['file', 'image', 'text-preview'];

export function supportsDisplayName(file: File): boolean {
  return LABELLED_TEMPLATES.includes(file.tag());
}

// Mirrors AbstractTextFormatterTemplate::sanitizeDisplayName().
export function sanitizeDisplayName(name: string): string {
  return name.replace(/\s+/g, ' ').replace(/[[\]]/g, '').trim();
}

// Rewrites the label of the server-rendered BBCode, so its attributes stay owned by the PHP template.
export function applyDisplayName(bbcode: string, displayName: string): string {
  const clean = sanitizeDisplayName(displayName);

  if (!clean) return bbcode;

  const labelled = /^(\[([a-z0-9-]+)\b[^\]]*\])([\s\S]*)(\[\/\2\])$/i;
  const match = bbcode.trim().match(labelled);

  if (!match) return bbcode;

  return `${match[1]}${clean}${match[4]}`;
}

// One prompt for the whole batch, in the order given; dismissing it keeps the file names.
export function bbcodesWithDisplayNames(files: File[]): Promise<string[]> {
  const labelled = files.filter(supportsDisplayName);

  if (!labelled.length) return Promise.resolve(files.map((file) => file.bbcode()));

  return new Promise((resolve) => {
    app.modal.show(
      () => import('../components/DisplayNameModal'),
      {
        files: labelled,
        onsubmit: (displayNames: Record<string, string>) =>
          resolve(files.map((file) => (supportsDisplayName(file) ? applyDisplayName(file.bbcode(), displayNames[file.id()!] ?? '') : file.bbcode()))),
      },
      true
    );
  });
}

export function insertWithDisplayNames(files: File[], insert: (bbcode: string) => void): void {
  bbcodesWithDisplayNames(files).then((bbcodes) => bbcodes.forEach(insert));
}

export function insertWithDisplayName(file: File, insert: (bbcode: string) => void): void {
  insertWithDisplayNames([file], insert);
}
