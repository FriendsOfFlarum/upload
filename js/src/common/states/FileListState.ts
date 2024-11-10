import app from 'flarum/common/app';
import User from 'flarum/common/models/User';
import File from '../models/File';
import { ApiQueryParamsPlural, ApiResponsePlural } from 'flarum/common/Store';

export default class FileListState {
  public user: User | null;
  public files: File[];
  private moreResults: boolean;
  private loading: boolean;
  private sharedFiles: boolean;

  constructor(sharedFiles: boolean = false) {
    this.user = null;
    this.files = [];
    this.moreResults = false;
    this.loading = false;
    this.sharedFiles = sharedFiles;
  }

  /**
   * Set the user and load their file list.
   * @param user The user whose files to load.
   */
  public setUser(user: User): void {
    if (user === this.user) return;

    this.user = user;
    this.files = [];
    this.loadResults();
  }

  public refresh(): void {
    this.files = [];
    this.loadResults();
    m.redraw();
  }

  /**
   * Load more files for the current user, starting from the given offset.
   * @param offset The starting index for loading more files.
   * @returns A promise resolving to the loaded files.
   */
  public async loadResults(offset: number = 0): Promise<ApiResponsePlural<File>> {
    if (!this.sharedFiles && !this.user) return Promise.reject('User not set');

    this.loading = true;

    let route: string = 'fof/uploads';
    let params: ApiQueryParamsPlural = {};

    if (!this.sharedFiles && this.user) {
      params = {
        filter: { user: this.user.id() },
        page: { offset },
      } as ApiQueryParamsPlural;
    } else {
      route = 'fof/upload/shared-files';
      params = {
        page: { offset },
      } as ApiQueryParamsPlural;
    }

    const results = await app.store.find<File[]>(route, params);

    return this.parseResults(results);
  }

  /**
   * Load the next set of results.
   */
  public async loadMore(): Promise<ApiResponsePlural<File>> {
    this.loading = true;
    return this.loadResults(this.files.length);
  }

  private parseResults(results: ApiResponsePlural<File>): ApiResponsePlural<File> {
    this.files = this.files.concat(results);
    this.loading = false;
    this.moreResults = !!results.payload?.links?.next;
    m.redraw();
    return results;
  }

  /**
   * Add files to the beginning of the list.
   * @param files The files to be added.
   */
  public addToList(files: File | File[]): void {
    if (Array.isArray(files)) {
      this.files.unshift(...files);
    } else {
      this.files.unshift(files);
    }
    m.redraw();
  }

  /**
   * Remove files from the list.
   * @param files The files to be removed.
   */
  public removeFromList(files: File | File[]): void {
    if (Array.isArray(files)) {
      this.files = this.files.filter((file) => !files.includes(file));
    } else {
      this.files = this.files.filter((file) => file !== files);
    }

    m.redraw();
  }

  /**
   * Check if there are files in the list.
   * @returns True if there are files, false otherwise.
   */
  public hasFiles(): boolean {
    return this.files.length > 0;
  }

  /**
   * Check if the file list is currently loading.
   * @returns True if loading, false otherwise.
   */
  public isLoading(): boolean {
    return this.loading;
  }

  /**
   * Check if there are more files to load.
   * @returns True if there are more files, false otherwise.
   */
  public hasMoreResults(): boolean {
    return this.moreResults;
  }

  /**
   * Check if the user has no files and the list is not loading.
   * @returns True if the list is empty and not loading, false otherwise.
   */
  public empty(): boolean {
    return !this.hasFiles() && !this.isLoading();
  }
}
