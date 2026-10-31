import app from 'flarum/common/app';
import PaginatedListState, { type PaginatedListParams } from 'flarum/common/states/PaginatedListState';
import type { ApiQueryParamsPlural, ApiResponsePlural } from 'flarum/common/Store';
import type User from 'flarum/common/models/User';
import type File from '../models/File';
import { adjustUploadCount } from '../utils/uploadCount';

export type FileLibrary = 'user' | 'shared';

export interface FileLibraryParams extends PaginatedListParams {
  filter?: Record<string, unknown>;
  sort?: string;
}

export default class FileLibraryState extends PaginatedListState<File, FileLibraryParams> {
  static PAGE_SIZE = 20;

  readonly library: FileLibrary;
  readonly user: User | null;

  protected failed = false;
  protected started = false;
  protected early: File[] = [];

  constructor(library: FileLibrary, user: User | null = null) {
    super(library === 'shared' ? { filter: { shared: true } } : { filter: { user: user?.id() } }, 1, FileLibraryState.PAGE_SIZE);

    this.library = library;
    this.user = user;
  }

  get type(): string {
    return 'files';
  }

  // Derived from the models, so a file deleted or hidden anywhere leaves every list showing it.
  files(): File[] {
    const seen = new Set<string>();

    return this.getAllItems().filter((file) => {
      const id = file.id();

      if (!file.exists || !id || seen.has(id)) return false;
      if (this.library === 'user' && file.hidden()) return false;

      seen.add(id);

      return true;
    });
  }

  hasItems(): boolean {
    return this.files().length > 0;
  }

  hasError(): boolean {
    return this.failed;
  }

  hasStarted(): boolean {
    return this.started;
  }

  // Core already alerts on a failed request, so the rejection is settled here once.
  load(): Promise<void> {
    this.started = true;

    return this.refresh().catch(() => {});
  }

  loadMore(): Promise<void> {
    return this.loadNext().catch(() => {});
  }

  prepend(files: File[]): void {
    if (!files.length) return;

    // The first load clears the pages when it lands, so files added before then wait for it.
    if (this.isInitialLoading()) {
      this.early.unshift(...files);

      return;
    }

    const first = this.pages[0];

    if (first) {
      (first.items as File[]).unshift(...files);
    } else {
      this.pages.push({ number: 1, items: [...files], hasNext: false, hasPrev: false });
    }

    m.redraw();
  }

  replace(files: File[]): void {
    this.pages = [{ number: 1, items: [...files], hasNext: this.hasNext(), hasPrev: false }];

    m.redraw();
  }

  added(files: File[]): void {
    this.prepend(files.filter((file) => !this.files().includes(file)));
  }

  removed(file: File, { deleted }: { deleted: boolean }): void {
    if (this.library === 'user' && this.user) adjustUploadCount(this.user, -1, deleted ? -1 : 0);

    m.redraw();
  }

  protected parseResults(pg: number, results: ApiResponsePlural<File>): void {
    super.parseResults(pg, results);

    if (pg === 1 && this.early.length) {
      (this.pages[0].items as File[]).unshift(...this.early);
      this.early = [];
    }
  }

  // The next page starts after the files already held, which stays right after uploads and removals.
  protected loadPage(page = 1): Promise<ApiResponsePlural<File>> {
    const { include, ...requestParams } = this.requestParams();
    const params: ApiQueryParamsPlural = {
      ...requestParams,
      page: { offset: page > 1 ? this.files().length : 0, limit: this.pageSize ?? FileLibraryState.PAGE_SIZE },
    };

    if (include) params.include = Array.isArray(include) ? include.join(',') : include;

    return app.store.find<File[]>(this.type, params).then(
      (results) => {
        this.failed = false;

        return results;
      },
      (error) => {
        this.failed = true;
        m.redraw();

        throw error;
      }
    );
  }
}
