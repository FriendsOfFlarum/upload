import app from 'flarum/common/app';
import File from '../models/File';
import AbstractFileList from './AbstractFIleList';

export default class SharedFileList extends AbstractFileList {
  public loadFileList(): void {
    // Mirror UserFileList's setUser guard: skip if already loaded or a fetch is in flight,
    // otherwise rapid tab toggling fires concurrent requests and parseResults concats duplicates.
    if (this.fileState.files.length > 0 || this.fileState.isLoading()) return;
    this.fileState.loadResults();
  }

  hasMoreResults() {
    return this.fileState.hasMoreResults();
  }

  loadMore() {
    this.fileState.loadMore();
  }

  isLoading(): boolean {
    return this.fileState.isLoading();
  }

  fileCollection(): File[] {
    return this.fileState.files;
  }
}
