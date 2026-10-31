import app from 'flarum/forum/app';
import type File from '../../common/models/File';
import type FileListState from '../../common/states/FileListState';
import { adjustUploadCount } from '../../common/utils/uploadCount';
import uploadFile from '../../common/utils/uploadFile';

type NativeFile = globalThis.File;

export type UploaderEvent = 'success' | 'failure' | 'uploading' | 'uploaded';

export interface UploadJob {
  file: NativeFile;
  status: 'queued' | 'uploading' | 'done' | 'failed';
  result?: File;
  error?: unknown;
}

export interface UploadOptions {
  shared?: boolean;
  hidden?: boolean;
}

export default class Uploader {
  jobs: UploadJob[] = [];
  fileState?: FileListState;

  private callbacks: Record<UploaderEvent, Array<(payload?: any) => void>> = {
    success: [],
    failure: [],
    uploading: [],
    uploaded: [],
  };

  get uploading(): boolean {
    return this.jobs.some((job) => job.status === 'queued' || job.status === 'uploading');
  }

  // Derived from the jobs now; older code that assigned it must not throw.
  set uploading(_value: boolean) {}

  setState(fileState: FileListState): void {
    this.fileState = fileState;
  }

  on(type: UploaderEvent, callback: (payload?: any) => void): void {
    this.callbacks[type].push(callback);
  }

  off(type: UploaderEvent, callback: (payload?: any) => void): void {
    this.callbacks[type] = this.callbacks[type].filter((registered) => registered !== callback);
  }

  // Uploads already under way still finish and stay in the library; nobody is told.
  dispose(): void {
    (Object.keys(this.callbacks) as UploaderEvent[]).forEach((type) => (this.callbacks[type] = []));
    this.fileState = undefined;
  }

  // One request per file, so each failure can name its file and earlier files are never lost.
  async upload(files: FileList | NativeFile[], addBBcode = true, options: UploadOptions = {}): Promise<void> {
    const batch: UploadJob[] = Array.from(files as ArrayLike<NativeFile>).map((file) => ({ file, status: 'queued' }));

    if (!batch.length) return;

    this.jobs.push(...batch);
    this.dispatch('uploading', files);
    m.redraw();

    const uploaded: File[] = [];

    for (const job of batch) {
      job.status = 'uploading';
      m.redraw();

      try {
        const file = await this.send(job.file, options);

        job.status = 'done';
        job.result = file;
        uploaded.push(file);

        this.fileState?.addToList(file);

        if (!file.isShared() && app.session.user) adjustUploadCount(app.session.user, 1, 1);

        this.dispatch('success', { file, addBBcode });
      } catch (error) {
        job.status = 'failed';
        job.error = error;

        this.dispatch('failure', { file: job.file, error });
      }
    }

    this.jobs = this.jobs.filter((job) => !batch.includes(job));
    this.dispatch('uploaded', { files: uploaded });
    m.redraw();
  }

  protected send(file: NativeFile, options: UploadOptions): Promise<File> {
    return uploadFile(file, options);
  }

  private dispatch(type: UploaderEvent, payload?: unknown): void {
    this.callbacks[type].forEach((callback) => callback(payload));
  }
}
