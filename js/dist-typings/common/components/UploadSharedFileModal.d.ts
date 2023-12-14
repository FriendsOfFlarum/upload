/// <reference types="flarum/@types/translator-icu-rich" />
import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import type Mithril from 'mithril';
import File from '../models/File';
interface CustomAttrs extends IInternalModalAttrs {
    onUploadComplete: (files: File | File[]) => void;
}
export default class UploadSharedFileModal extends Modal<CustomAttrs> {
    files: never[];
    fileInput: null;
    options: {
        shared: boolean;
        hidden: boolean;
    };
    loading: boolean;
    oninit(vnode: Mithril.Vnode<CustomAttrs, this>): void;
    className(): string;
    title(): import("@askvortsov/rich-icu-message-formatter").NestedStringArray;
    onFileChange(e: any): void;
    addFiles(newFiles: File[]): void;
    onDragOver(e: any): void;
    onDrop(e: any): void;
    onDropzoneClick(): void;
    content(): JSX.Element;
    upload(): Promise<void>;
}
export {};
