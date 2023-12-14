import User from 'flarum/common/models/User';
import File from '../models/File';
import { ApiResponsePlural } from 'flarum/common/Store';
export default class FileListState {
    user: User | null;
    files: File[];
    private moreResults;
    private loading;
    private sharedFiles;
    constructor(sharedFiles?: boolean);
    /**
     * Set the user and load their file list.
     * @param user The user whose files to load.
     */
    setUser(user: User): void;
    refresh(): void;
    /**
     * Load more files for the current user, starting from the given offset.
     * @param offset The starting index for loading more files.
     * @returns A promise resolving to the loaded files.
     */
    loadResults(offset?: number): Promise<ApiResponsePlural<File>>;
    /**
     * Load the next set of results.
     */
    loadMore(): Promise<ApiResponsePlural<File>>;
    private parseResults;
    /**
     * Add files to the beginning of the list.
     * @param files The files to be added.
     */
    addToList(files: File | File[]): void;
    /**
     * Remove files from the list.
     * @param files The files to be removed.
     */
    removeFromList(files: File | File[]): void;
    /**
     * Check if there are files in the list.
     * @returns True if there are files, false otherwise.
     */
    hasFiles(): boolean;
    /**
     * Check if the file list is currently loading.
     * @returns True if loading, false otherwise.
     */
    isLoading(): boolean;
    /**
     * Check if there are more files to load.
     * @returns True if there are more files, false otherwise.
     */
    hasMoreResults(): boolean;
    /**
     * Check if the user has no files and the list is not loading.
     * @returns True if the list is empty and not loading, false otherwise.
     */
    empty(): boolean;
}
