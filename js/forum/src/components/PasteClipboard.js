export default class PasteClipboard {
    constructor(uploadButton) {
        if (this.initialized) return;

        this.uploadButton = uploadButton;

        document.addEventListener('paste', this.paste.bind(this));
    }

    paste(e) {
        if (e.clipboardData && e.clipboardData.items) {
            var items = e.clipboardData.items;

            var files = [];

            for (var i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    files.push(items[i].getAsFile());
                }
            }

            if (files.length > 0) {
                m.redraw();

                this.uploadButton.uploadFiles(files);
            }
        }
    }
}
