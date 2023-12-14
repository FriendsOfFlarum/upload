import Component, { ComponentAttrs } from 'flarum/common/Component';
import File from '../models/File';
import type Mithril from 'mithril';
import User from 'flarum/common/models/User';
import FileListState from '../states/FileListState';
export interface FileListAttrs extends ComponentAttrs {
    user: User | null;
    selectable: boolean;
    restrictFileType: string | string[];
    selectedFiles: string[];
    downloadOnClick: boolean;
    onFileSelect: (file: File) => void | undefined;
    onDelete: (file: File) => void | undefined;
    fileState: FileListState;
}
export default abstract class AbstractFileList extends Component<FileListAttrs> {
    user: User | null;
    inModal: boolean;
    restrictFileType: string | string[] | null;
    downloadOnClick: boolean;
    filesBeingHidden: string[];
    fileState: FileListState;
    abstract loadFileList(): void;
    abstract hasMoreResults(): boolean;
    abstract loadMore(): void;
    abstract isLoading(): boolean;
    abstract fileCollection(): File[];
    oninit(vnode: Mithril.Vnode<FileListAttrs, this>): void;
    view(): JSX.Element;
    onDelete(file: File): void;
    onFileClick(file: File): void;
    isSelectable(file: File): boolean;
    /**
     * Begins the hiding process for a file.
     *
     * - Shows a native confirmation dialog
     * - If confirmed, sends AJAX request to the hide file API
     */
    hideFile(file: File): Promise<void>;
}
