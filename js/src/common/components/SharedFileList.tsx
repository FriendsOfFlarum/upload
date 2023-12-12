import app from 'flarum/common/app';
import File from '../models/File';
import AbstractFileList from './AbstractFIleList';

export default class SharedFileList extends AbstractFileList {
  public loadFileList(): void {
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
