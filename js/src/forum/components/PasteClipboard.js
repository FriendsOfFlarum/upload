export default class PasteClipboard {
    constructor(upload, textAreaElement) {
        this.upload = upload;

        // We don't need to remove the events listeners, because they are bound to the textarea when it's created,
        // and need to stay as long as the textarea exists in the DOM
        textAreaElement.addEventListener('paste', this.paste.bind(this));
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
