import app from 'flarum/forum/app';
import type File from '../../common/models/File';
import type FileListState from '../../common/states/FileListState';

type NativeFile = globalThis.File;

interface UploadResponse {
  file: File;
  addBBcode: boolean;
}

interface ApiUploadResponse {
  data: Array<{ type: string; id: string; attributes: Record<string, unknown> }>;
}

export default class Uploader {
  private callbacks: {
    success: Array<(response: UploadResponse) => void>;
    failure: Array<(response: unknown) => void>;
    uploading: Array<(files: FileList | NativeFile[]) => void>;
    uploaded: Array<() => void>;
  } = {
    success: [],
    failure: [],
    uploading: [],
    uploaded: [],
  };

  uploading = false;
  fileState?: FileListState;

  setState(fileState: FileListState): void {
    this.fileState = fileState;
  }

  on(type: 'success' | 'failure' | 'uploading' | 'uploaded', callback: (response?: unknown) => void): void {
    this.callbacks[type].push(callback as () => void);
  }

  private dispatch(type: keyof typeof this.callbacks, response?: unknown): void {
    this.callbacks[type].forEach((callback) => callback(response as never));
  }

  upload(files: FileList | NativeFile[], addBBcode = true): Promise<void> {
    this.uploading = true;
    this.dispatch('uploading', files);
    m.redraw();

    const body = new FormData();
    const fileArray = Array.from(files as Iterable<NativeFile>);
    for (let i = 0; i < fileArray.length; i++) {
      body.append('files[]', fileArray[i] as Blob);
    }

    return app
      .request({
        method: 'POST',
        url: app.forum.attribute('apiUrl') + '/fof/upload',
        serialize: (raw: FormData) => raw,
        body,
      })
      .then((result: unknown) => this.uploaded(result as ApiUploadResponse, addBBcode))
      .catch((error: { response?: { errors?: Array<{ code?: string; detail?: string }> } }) => {
        this.uploading = false;
        m.redraw();

        const e = error.response?.errors?.[0];
        if (!e?.code?.includes('fof-upload')) {
          throw error;
        }

        app.alerts.clear();
        app.alerts.show({ type: 'error' }, e.detail);
      });
  }

  private uploaded(result: ApiUploadResponse, addBBcode = false): void {
    this.uploading = false;

    result.data.forEach((file) => {
      const fileObj = app.store.pushObject(file) as File;
      this.fileState?.addToList(fileObj);
      this.dispatch('success', { file: fileObj, addBBcode });
    });

    this.dispatch('uploaded');
  }
}
