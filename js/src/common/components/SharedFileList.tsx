import AbstractFileList from './AbstractFIleList';

export default class SharedFileList extends AbstractFileList {
  public loadFileList(): void {
    this.attrs.fileState.loadResults();
  }
}
