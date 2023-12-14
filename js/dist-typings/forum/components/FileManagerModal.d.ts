export default class FileManagerModal extends Modal<import("flarum/common/components/Modal").IInternalModalAttrs, undefined> {
    constructor();
    uploader: any;
    selectedFiles: any[] | undefined;
    multiSelect: any;
    restrictFileType: any;
    dragDrop: DragAndDrop | null | undefined;
    selectedFilesLibrary: any;
    sharedUploads: any;
    userFileState: FileListState | undefined;
    sharedFileState: FileListState | undefined;
    fileLibraryButtonItems(): ItemList<any>;
    setLibrary(library: any): void;
    userFilesContent(): JSX.Element;
    sharedFilesContent(): JSX.Element;
    /**
     * Add or remove file from selected files
     *
     * @param {File} file
     */
    onFileSelect(file: File): void;
    /**
     * Add files to file list after upload
     */
    onUpload(): void;
    /**
     * Add selected files to the composer
     */
    onSelect(): void;
    showUploadModal(): void;
    onDelete(file: any): void;
}
import Modal from "flarum/common/components/Modal";
import DragAndDrop from "./DragAndDrop";
import FileListState from "../../common/states/FileListState";
import ItemList from "flarum/common/utils/ItemList";
