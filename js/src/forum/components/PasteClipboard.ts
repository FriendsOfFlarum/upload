export default class PasteClipboard {
  private upload: (files: File[]) => void;

  constructor(upload: (files: globalThis.File[]) => void, element: Element) {
    this.upload = upload;
    element.addEventListener('paste', this.paste.bind(this) as EventListener);
  }

  paste(e: ClipboardEvent): void {
    if (e.clipboardData?.items) {
      const items = e.clipboardData.items;
      const files: globalThis.File[] = [];

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            files.push(file);
          }
        }
      }

      if (files.length > 0) {
        e.preventDefault();
        this.upload(files);
      }
    }
  }
}
