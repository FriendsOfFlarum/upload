export default class DragAndDrop {
    constructor(upload, composerElement) {
        this.upload = upload;
        this.composerElement = composerElement;

        // Keep references to the bound methods so we can remove the event listeners later
        this.handlers = {};

        if (!this.supportsFileDragging()) {
            return;
        }

        this.composerElement.addEventListener('dragover', (this.handlers.in = this.in.bind(this)));

        this.composerElement.addEventListener('dragleave', (this.handlers.out = this.out.bind(this)));
        this.composerElement.addEventListener('dragend', this.handlers.out);

        this.composerElement.addEventListener('drop', (this.handlers.dropping = this.dropping.bind(this)));

        this.isDropping = this.over = false;
    }

    supportsFileDragging() {
        // Based on https://css-tricks.com/drag-and-drop-file-uploading/
        const div = document.createElement('div');

        return ('draggable' in div || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }

    unload() {
        // If the handlers were not set (drag and drop not supported), we skip removing them
        if (!this.handlers.in) {
            return;
        }

        this.composerElement.removeEventListener('dragover', this.handlers.in);

        this.composerElement.removeEventListener('dragleave', this.handlers.out);
        this.composerElement.removeEventListener('dragend', this.handlers.out);

        this.composerElement.removeEventListener('drop', this.handlers.dropping);
    }

    isNotFile(event) {
        // Checking event.dataTransfer.files.length does not work on dragover event, it's always zero
        // So we use the dataTransfer.items property to check whether any file is being dragged
        if (event.dataTransfer.items) {
            for (let i = 0; i < event.dataTransfer.items.length; i++) {
                if (event.dataTransfer.items[i].kind !== 'file') {
                    return true;
                }
            }
        }

        return false;
    }

    in(event) {
        if (this.isNotFile(event)) {
            return;
        }

        event.preventDefault();

        if (!this.over) {
            this.composerElement.classList.add('fof-upload-dragging');
            this.over = true;
        }
    }

    out(event) {
        if (this.isNotFile(event)) {
            return;
        }

        event.preventDefault();

        if (this.over) {
            this.composerElement.classList.remove('fof-upload-dragging');
            this.over = false;
        }
    }

    dropping(event) {
        if (this.isNotFile(event)) {
            return;
        }

        event.preventDefault();

        if (!this.isDropping) {
            this.isDropping = true;
            this.composerElement.classList.add('fof-upload-dropping');

            this.upload(event.dataTransfer.files, () => {
                this.composerElement.classList.remove('fof-upload-dropping');
                this.isDropping = false;
            });
        }
    }
}
