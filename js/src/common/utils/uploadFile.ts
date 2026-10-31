import app from 'flarum/common/app';
import extractText from 'flarum/common/utils/extractText';
import type { ApiPayloadPlural } from 'flarum/common/Store';
import type File from '../models/File';

type NativeFile = globalThis.File;

export interface UploadFileOptions {
  shared?: boolean;
  hidden?: boolean;
}

// One file per request, so a failure names the file it belongs to.
export default async function uploadFile(file: NativeFile, options: UploadFileOptions = {}): Promise<File> {
  const body = new FormData();

  body.append('files[]', file);

  if (options.shared) {
    body.append('options[shared]', 'true');
    body.append('options[hidden]', options.hidden ? 'true' : 'false');
  }

  const payload = await app.request<ApiPayloadPlural>({
    method: 'POST',
    url: app.forum.attribute('apiUrl') + '/fof/upload',
    serialize: (raw: FormData) => raw,
    body,
    errorHandler: (error) => {
      // Core words every status but 422 generically; the extension's own errors say what went wrong.
      const own = error.response?.errors?.find((e: { code?: string }) => e.code?.startsWith('fof-upload.'))?.detail;

      app.alerts.show(
        { type: 'error', controls: error.alert?.controls },
        app.translator.trans('fof-upload.lib.upload_failed', { fileName: file.name, error: own || extractText(error.alert?.content ?? '') })
      );
    },
  });

  return (app.store.pushPayload<File[]>(payload) as unknown as File[])[0];
}
