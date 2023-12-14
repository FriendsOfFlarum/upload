import File from '../models/File';
import AbstractFileList from './AbstractFIleList';
export default class UserFileList extends AbstractFileList {
    loadFileList(): void;
    hasMoreResults(): boolean;
    loadMore(): void;
    isLoading(): boolean;
    fileCollection(): File[];
}
