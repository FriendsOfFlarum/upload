export default class PasteClipboard {
    private upload;
    constructor(upload: (files: globalThis.File[]) => void, element: Element);
    paste(e: ClipboardEvent): void;
}
