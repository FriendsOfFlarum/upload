import DragAndDrop from './DragAndDrop';
import ItemList from 'flarum/common/utils/ItemList';
import FileListState from '../../common/states/FileListState';
import type Uploader from '../handler/Uploader';
import type File from '../../common/models/File';
import type User from 'flarum/common/models/User';
import type Mithril from 'mithril';
type FilesLibrary = 'user' | 'shared';
interface FileManagerModalAttrs {
    uploader: Uploader;
    user?: User | null;
    hideUser?: boolean;
    hideShared?: boolean;
    multiSelect?: boolean;
    restrictFileType?: string | null;
    defaultFilesLibrary?: FilesLibrary;
    onSelect?: (selectedFileIds: string[]) => void;
}
declare const FileManagerModal_base: any;
export default class FileManagerModal extends FileManagerModal_base<FileManagerModalAttrs, undefined> {
    uploader: Uploader;
    selectedFiles: string[];
    multiSelect: boolean;
    restrictFileType: string | null;
    dragDrop: DragAndDrop | null;
    selectedFilesLibrary: FilesLibrary;
    userFileState: FileListState;
    sharedFileState: FileListState;
    oninit(vnode: Mithril.Vnode<FileManagerModalAttrs, this>): void;
    className(): string;
    title(): string;
    content(): null;
    oncreate(vnode: Mithril.VnodeDOM<FileManagerModalAttrs, this>): void;
    onremove(): void;
    view(): JSX.Element;
    fileLibraryButtonItems(): ItemList<Mithril.Children>;
    setLibrary(library: FilesLibrary): void;
    userFilesContent(): JSX.Element;
    sharedFilesContent(): JSX.Element;
    onFileSelect(file: File): void;
    onUpload(): void;
    onSelect(): void;
    showUploadModal(): void;
    onDelete(file: File): void;
}
export {};
