import { IFormModalAttrs } from 'flarum/common/components/FormModal';
import FormModal from 'flarum/common/components/FormModal';
import type Mithril from 'mithril';
import type File from '../models/File';
type NativeFile = globalThis.File;
interface CustomAttrs extends IFormModalAttrs {
    onUploadComplete: (files: File | File[]) => void;
}
interface UploadOptions {
    shared: boolean;
    hidden: boolean;
}
export default class UploadSharedFileModal extends FormModal<CustomAttrs> {
    files: NativeFile[];
    fileInput: HTMLInputElement | null;
    options: UploadOptions;
    loading: boolean;
    oninit(vnode: Mithril.Vnode<CustomAttrs, this>): void;
    className(): string;
    title(): string | any[];
    onFileChange(e: Event): void;
    addFiles(newFiles: NativeFile[]): void;
    onDragOver(e: DragEvent): void;
    onDrop(e: DragEvent): void;
    onDropzoneClick(): void;
    content(): JSX.Element;
    upload(): Promise<void>;
}
export {};
