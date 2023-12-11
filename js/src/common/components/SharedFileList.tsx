import app from 'flarum/common/app';
import File from '../models/File';
import AbstractFileList from './AbstractFIleList';

export default class SharedFileList extends AbstractFileList {
  loading: boolean = false;
  sharedUploads: File[] = [];

  loadFileList(): void {
    this.loadSharedUploads();
  }

  loadSharedUploads(page = 1) {
    this.loading = true;
    m.redraw();

    app.store
      .find<File[]>('fof/upload/shared-files')
      .then((results) => {
        this.sharedUploads = results;
      })
      .catch(() => {})
      .then(() => {
        this.loading = false;
        m.redraw();
      });
  }

  hasMoreResults() {
    return false;
  }

  loadMore() {
    //
  }

  isLoading(): boolean {
    return this.loading;
  }

  fileCollection(): File[] {
    return this.sharedUploads;
  }
}
