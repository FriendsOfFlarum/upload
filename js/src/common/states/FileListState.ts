import type User from 'flarum/common/models/User';
import type File from '../models/File';
import FileLibraryState from './FileLibraryState';

// The list state before FileLibraryState, kept for code that still builds one.
export default class FileListState {
  public user: User | null = null;
  public library: FileLibraryState | null;

  private sharedFiles: boolean;

  constructor(sharedFiles: boolean = false) {
    this.sharedFiles = sharedFiles;
    this.library = sharedFiles ? new FileLibraryState('shared') : null;
  }

  get files(): File[] {
    return this.library?.files() ?? [];
  }

  set files(files: File[]) {
    this.library?.replace(files);
  }

  public setUser(user: User): void {
    if (user === this.user) return;

    this.user = user;
    this.library = new FileLibraryState('user', user);
    this.library.load();
  }

  public refresh(): void {
    this.library?.load();
  }

  public async loadResults(offset: number = 0): Promise<File[]> {
    const library = this.library;

    if (!library) return Promise.reject('User not set');

    if (offset > 0) {
      await library.loadMore();
    } else if (!library.hasStarted()) {
      await library.load();
    }

    return this.files;
  }

  public async loadMore(): Promise<File[]> {
    return this.loadResults(this.files.length);
  }

  public addToList(files: File | File[]): void {
    this.library?.added(Array.isArray(files) ? files : [files]);
  }

  public removeFromList(files: File | File[]): void {
    (Array.isArray(files) ? files : [files]).forEach((file) => this.library?.remove(file));

    m.redraw();
  }

  public hasFiles(): boolean {
    return this.files.length > 0;
  }

  public isLoading(): boolean {
    return !!this.library?.isLoading();
  }

  public hasLoadError(): boolean {
    return !!this.library?.hasError();
  }

  public hasMoreResults(): boolean {
    return !!this.library?.hasNext();
  }

  public empty(): boolean {
    return !this.hasFiles() && !this.isLoading();
  }
}
