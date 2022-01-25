export default class PasteClipboard {
  constructor(upload, element) {
    this.upload = upload;

    // We don't need to remove the events listeners, because they'll get removed when the DOM does.
    element.addEventListener('paste', this.paste.bind(this));
  }

  paste(e) {
    if (e.clipboardData && e.clipboardData.items) {
      const items = e.clipboardData.items;

      const files = [];

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          files.push(items[i].getAsFile());
        }
      }

      if (files.length > 0) {
        e.preventDefault();

        this.upload(files);
      }
    }
  }
}
