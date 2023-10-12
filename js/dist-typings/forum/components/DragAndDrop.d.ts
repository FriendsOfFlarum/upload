export default class DragAndDrop {
    constructor(upload: any, composerElement: any);
    upload: any;
    composerElement: any;
    handlers: {};
    supportsFileDragging(): boolean;
    unload(): void;
    isNotFile(event: any): boolean;
    in(event: any): void;
    over: boolean | undefined;
    out(event: any): void;
    dropping(event: any): void;
}
