export default class FileManagerModal extends Modal<import("flarum/common/components/Modal").IInternalModalAttrs, undefined> {
    constructor();
    uploader: any;
    selectedFiles: any[] | undefined;
    multiSelect: any;
    restrictFileType: any;
    dragDrop: DragAndDrop | null | undefined;
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
}
import Modal from "flarum/common/components/Modal";
import DragAndDrop from "./DragAndDrop";
