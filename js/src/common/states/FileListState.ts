import app from 'flarum/common/app';
import User from 'flarum/common/models/User';
import File from '../models/File';
import { ApiQueryParamsPlural, ApiResponsePlural } from 'flarum/common/Store';

export default class FileListState {
  private user: User | null;
  public files: File[];
  private moreResults: boolean;
  private loading: boolean;

  constructor() {
    this.user = null;
    this.files = [];
    this.moreResults = false;
    this.loading = false;
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

  /**
   * Load more files for the current user, starting from the given offset.
   * @param offset The starting index for loading more files.
   * @returns A promise resolving to the loaded files.
   */
  public async loadResults(offset: number = 0): Promise<ApiResponsePlural<File>> {
    if (!this.user) return Promise.reject('User not set');

    this.loading = true;
    const results = await app.store.find<File[]>('fof/uploads', {
      filter: { user: this.user.id() },
      page: { offset },
    } as ApiQueryParamsPlural);

    return this.parseResults(results);
  }

  /**
   * Load the next set of results.
   */
  public async loadMore(): Promise<ApiResponsePlural<File>> {
    this.loading = true;
    return this.loadResults(this.files.length);
  }

  /**
   * Parse results and append them to the file list.
   * @param results The files to be appended.
   * @returns The appended files.
   */
  private parseResults(results: ApiResponsePlural<File>): ApiResponsePlural<File> {
    this.files.push(...results);
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
