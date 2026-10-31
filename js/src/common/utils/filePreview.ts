import type File from '../models/File';

export interface FilePreview {
  src: string;
  width?: number;
  height?: number;
}

export function filePreview(file: File): FilePreview | null {
  if (!(file.type() ?? '').startsWith('image/')) return null;

  // A private shared file's URL is the download route, which logs every view.
  if (file.isPrivateShared()) return null;

  const thumbnail = file.thumbnailUrl();

  if (thumbnail) {
    return { src: thumbnail, width: file.thumbnailWidth() ?? undefined, height: file.thumbnailHeight() ?? undefined };
  }

  const url = file.url();

  return url ? { src: url, width: file.imageWidth() ?? undefined, height: file.imageHeight() ?? undefined } : null;
}
