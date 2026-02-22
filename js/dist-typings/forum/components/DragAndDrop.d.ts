export default class DragAndDrop {
    private upload;
    private composerElement;
    private over;
    private handlers;
    constructor(upload: (files: FileList) => void, composerElement: Element);
    supportsFileDragging(): boolean;
    unload(): void;
    isNotFile(event: DragEvent): boolean;
    in(event: DragEvent): void;
    out(event: DragEvent): void;
    dropping(event: DragEvent): void;
}
