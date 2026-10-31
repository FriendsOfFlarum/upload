import app from 'flarum/common/app';
import AbstractFileList from './AbstractFIleList';

export default class UserFileList extends AbstractFileList {
  public loadFileList(): void {
    this.attrs.fileState.setUser(this.attrs.user ?? app.session.user!);
  }
}
