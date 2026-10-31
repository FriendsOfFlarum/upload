import app from 'flarum/common/app';
import type File from '../src/common/models/File';

let next = 100;

export function fileData(attributes: Record<string, unknown> = {}, id?: string) {
  const fileId = id ?? String(++next);

  return {
    type: 'files',
    id: fileId,
    attributes: {
      baseName: `file-${fileId}.pdf`,
      url: `https://example.com/assets/files/file-${fileId}.pdf`,
      type: 'application/pdf',
      size: 1000,
      humanSize: '1kB',
      uuid: `uuid-${fileId}`,
      tag: 'file',
      hidden: false,
      shared: false,
      isPrivateShared: false,
      bbcode: `[upl-file uuid=uuid-${fileId} size=1kB]file-${fileId}.pdf[/upl-file]`,
      thumbnailUrl: null,
      canHide: true,
      canDelete: true,
      ...attributes,
    },
  };
}

export function makeFile(attributes: Record<string, unknown> = {}, id?: string): File {
  return app.store.pushObject(fileData(attributes, id)) as unknown as File;
}

export function image(attributes: Record<string, unknown> = {}, id?: string): File {
  return makeFile(
    { type: 'image/png', tag: 'image-preview', baseName: 'picture.png', bbcode: '[upl-image-preview uuid=x url=y]', ...attributes },
    id
  );
}

// A plural API document, as app.store.find resolves it.
export function page(files: File[], hasNext = false) {
  const result: any = [...files];

  result.payload = { data: [], links: hasNext ? { next: 'next' } : {} };

  return result;
}
