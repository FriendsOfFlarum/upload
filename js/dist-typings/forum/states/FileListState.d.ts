export default class FileListState {
    user: any;
    files: any[];
    moreResults: boolean;
    loading: boolean;
    /**
     * Set user and load list
     *
     * @param user A user to populate the media manager
     */
    setUser(user: any): void;
    /**
     * Load more user files
     *
     * @param offset The index to start the page at.
     */
    loadResults(offset?: number): Promise<any> | undefined;
    /**
     * Load the next page of discussion results.
     */
    loadMore(): void;
    /**
     * Parse results and append them to the file list.
     */
    parseResults(results: any): any;
    /**
     * Add files to the beginning of the list
     */
    addToList(files: any): void;
    /**
     * Are there any files in the list?
     */
    hasFiles(): boolean;
    /**
     * Is the file list loading?
     */
    isLoading(): boolean;
    /**
     * Does this user has more files?
     */
    hasMoreResults(): boolean;
    /**
     * Does this user have any files?
     */
    empty(): boolean;
}
