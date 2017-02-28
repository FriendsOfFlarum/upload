export default class PasteClipboard {
    constructor(uploadButton) {
        if (this.initialized) return;

        this.uploadButton = uploadButton;

        document.addEventListener('paste', this.paste.bind(this));
    }

    paste(e) {
        if (e.clipboardData && e.clipboardData.items) {
            console.log(e);

            var items = e.clipboardData.items;

            var images = [];

            for (var i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    images.push(items[i].getAsFile());
                }
            }

            if (images.length > 0) {
                m.redraw();

                this.uploadButton.uploadFiles(images);
            }
            e.preventDefault();
        }
    }
}
