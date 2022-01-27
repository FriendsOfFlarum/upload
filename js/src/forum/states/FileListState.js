import app from 'flarum/forum/app';

export default class FileListState {
  constructor() {
    this.user = null;

    this.files = [];

    this.moreResults = false;

    this.loading = false;
  }

  /**
   * Set user and load list
   *
   * @param user A user to populate the media manager
   */
  setUser(user) {
    // Keep previous state
    if (user === this.user) return;

    // Set user
    this.user = user;

    // Reset file list
    this.files = [];

    // Load user files
    this.loadResults();
  }

  /**
   * Load more user files
   *
   * @param offset The index to start the page at.
   */
  loadResults(offset = 0) {
    if (!this.user) return;

    this.loading = true;

    return app.store
      .find('fof/uploads', {
        filter: {
          user: this.user.id(),
        },
        page: {
          offset,
        },
      })
      .then(this.parseResults.bind(this));
  }

  /**
   * Load the next page of discussion results.
   */
  loadMore() {
    this.loading = true;

    this.loadResults(this.files.length).then(this.parseResults.bind(this));
  }

  /**
   * Parse results and append them to the file list.
   */
  parseResults(results) {
    this.files.push(...results);

    this.loading = false;
    this.moreResults = !!results.payload.links && !!results.payload.links.next;

    m.redraw();

    return results;
  }

  /**
   * Add files to the beginning of the list
   */
  addToList(files) {
    if (Array.isArray(files)) {
      this.files.unshift(...files);
    } else {
      this.files.unshift(files);
    }
  }

  /**
   * Are there any files in the list?
   */
  hasFiles() {
    return this.files.length > 0;
  }

  /**
   * Is the file list loading?
   */
  isLoading() {
    return this.loading;
  }

  /**
   * Does this user has more files?
   */
  hasMoreResults() {
    return this.moreResults;
  }

  /**
   * Does this user have any files?
   */
  empty() {
    return !this.hasFiles() && !this.isLoading();
  }
}
