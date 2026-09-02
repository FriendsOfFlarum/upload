import app from 'flarum/common/app';
import User from 'flarum/common/models/User';
import File from '../models/File';
import { ApiQueryParamsPlural } from 'flarum/common/Store';

export default class FileListState {
  public user: User | null;
  public files: File[];
  private moreResults: boolean;
  private loading: boolean;
  private loadError: boolean;
  private sharedFiles: boolean;

  constructor(sharedFiles: boolean = false) {
    this.user = null;
    this.files = [];
    this.moreResults = false;
    this.loading = false;
    this.loadError = false;
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
    // Same reason as refresh(): a switch to a different user must not be
    // swallowed by the in-flight guard, or the new user's list never loads and
    // they are left looking at an empty one.
    this.loading = false;
    this.loadResults();
  }

  public refresh(): void {
    this.files = [];
    // Clear the in-flight flag so the guard in loadResults() does not turn a
    // deliberate refresh into a no-op. Any response still in flight lands in
    // parseResults, but files has just been emptied, so it cannot duplicate.
    this.loading = false;
    this.loadResults();
    m.redraw();
  }

  /**
   * Load more files for the current user, starting from the given offset.
   * @param offset The starting index for loading more files.
   * @returns A promise resolving to the loaded files.
   */
  public async loadResults(offset: number = 0): Promise<File[]> {
    if (!this.sharedFiles && !this.user) return Promise.reject('User not set');

    // A request is already in flight. Without this, switching between the media
    // tabs remounts the list component and fires a second fetch while the first
    // is still running — parseResults concats both responses, so the list is
    // duplicated on every switch. Guarding here rather than in the component
    // covers loadMore() and refresh() too, which call this directly.
    if (this.loading) return Promise.resolve(this.files);

    // Shared files are loaded once and kept; only paging asks for more.
    if (this.sharedFiles && this.files.length > 0 && offset === 0) {
      return Promise.resolve(this.files);
    }

    this.loading = true;
    this.loadError = false;

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

    try {
      const results = await app.store.find<File[]>(route, params);
      return this.parseResults(results as File[]);
    } catch (error) {
      // Reset loading so the in-flight guard above lets a retry through.
      this.loading = false;
      this.loadError = true;
      m.redraw();

      // Deliberately not rethrown: every caller ignores the returned promise,
      // so a rethrow would only produce an unhandled rejection. The error is
      // surfaced through loadError instead, which the list renders — otherwise
      // a failed request is indistinguishable from an empty library.
      return [];
    }
  }

  /**
   * Load the next set of results.
   */
  public async loadMore(): Promise<File[]> {
    return this.loadResults(this.files.length);
  }

  private parseResults(results: File[]): File[] {
    this.files = this.files.concat(results);
    this.loading = false;
    this.moreResults = !!(results as unknown as { payload?: { links?: { next?: string } } })?.payload?.links?.next;
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
   * Whether the last load failed. Lets the list distinguish a failed request
   * from a genuinely empty library.
   */
  public hasLoadError(): boolean {
    return this.loadError;
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
