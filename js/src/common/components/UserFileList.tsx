import app from 'flarum/common/app';
import File from '../models/File';
import AbstractFileList from './AbstractFIleList';
import FileListState from '../states/FileListState';

export default class UserFileList extends AbstractFileList {
  public loadFileList(): void {
    //app.fileListState.setUser(this.attrs.user || app.session.user);
    this.fileState.setUser(this.attrs.user || app.session.user);
    /**
     * The user who's media we are dealing with
     */
    this.user = this.fileState.user; //app.fileListState.user;
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
