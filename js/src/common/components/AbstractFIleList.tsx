import Component, { type ComponentAttrs } from 'flarum/common/Component';
import type User from 'flarum/common/models/User';
import type File from '../models/File';
import type FileLibraryState from '../states/FileLibraryState';
import type FileListState from '../states/FileListState';
import FileLibrary from './FileLibrary';

export interface FileListAttrs extends ComponentAttrs {
  user: User | null;
  selectable: boolean;
  restrictFileType: string | string[];
  selectedFiles: string[];
  downloadOnClick: boolean;
  onFileSelect: (file: File) => void | undefined;
  onDelete: (file: File) => void | undefined;
  fileState: FileListState;
}

// The list component before FileLibrary, kept for code that still renders one.
export default abstract class AbstractFileList extends Component<FileListAttrs> {
  public abstract loadFileList(): void;

  oninit(vnode: any) {
    super.oninit(vnode);

    this.loadFileList();
  }

  library(): FileLibraryState | null {
    return this.attrs.fileState.library;
  }

  view() {
    const library = this.library();

    if (!library) return null;

    const ids = this.attrs.selectedFiles ?? [];

    return (
      <FileLibrary
        state={library}
        mode={this.attrs.selectable ? 'pick' : 'browse'}
        selection={library.files().filter((file) => ids.includes(file.id()!))}
        restrictFileType={this.attrs.restrictFileType}
        onToggle={(file: File) => this.attrs.onFileSelect?.(file)}
        onRemoved={(file: File) => this.attrs.onDelete?.(file)}
      />
    );
  }

  hasMoreResults(): boolean {
    return !!this.library()?.hasNext();
  }

  loadMore(): void {
    this.library()?.loadMore();
  }

  isLoading(): boolean {
    return !!this.library()?.isLoading();
  }

  fileCollection(): File[] {
    return this.library()?.files() ?? [];
  }
}
