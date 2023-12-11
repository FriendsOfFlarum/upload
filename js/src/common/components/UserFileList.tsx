import app from 'flarum/common/app';
import File from '../models/File';
import AbstractFileList from './AbstractFIleList';
import FileListState from '../states/FileListState';

export default class UserFileList extends AbstractFileList {
  fileState!: FileListState;

  loadFileList(): void {
    app.fileListState.setUser(this.attrs.user || app.session.user);
    /**
     * The user who's media we are dealing with
     */
    this.user = app.fileListState.user;
    this.fileState = app.fileListState;
  }

  hasMoreResults(): boolean {
    return this.fileState.hasMoreResults();
  }

  loadMore(): void {
    this.fileState.loadMore();
  }

  isLoading(): boolean {
    return this.fileState.isLoading();
  }

  fileCollection(): File[] {
    return this.fileState.files;
  }
}
