import type FileListState from '../../common/states/FileListState';
type NativeFile = globalThis.File;
export default class Uploader {
    private callbacks;
    uploading: boolean;
    fileState?: FileListState;
    setState(fileState: FileListState): void;
    on(type: 'success' | 'failure' | 'uploading' | 'uploaded', callback: (response?: unknown) => void): void;
    private dispatch;
    upload(files: FileList | NativeFile[], addBBcode?: boolean): Promise<void>;
    private uploaded;
}
export {};
