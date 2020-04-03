export default class DragAndDrop {
    constructor(uploadButton, composerElement) {
        this.uploadButton = uploadButton;
        this.composerElement = composerElement;

        // Keep references to the bound methods so we can remove the event listeners later
        this.handlers = {};

        this.composerElement.addEventListener('dragstart', this.handlers.start = this.start.bind(this));
        this.composerElement.addEventListener('dragover', this.handlers.in = this.in.bind(this));

        this.composerElement.addEventListener('dragleave', this.handlers.out = this.out.bind(this));
        this.composerElement.addEventListener('dragend', this.handlers.out);

        this.composerElement.addEventListener('drop', this.handlers.dropping = this.dropping.bind(this));

        this.isDropping = this.over = false;
        this.isChar = true;
    }

    start() {
        this.isChar = false;
    }

    unload() {
        this.composerElement.removeEventListener('dragstart', this.handlers.start);
        this.composerElement.removeEventListener('dragover', this.handlers.in);

        this.composerElement.removeEventListener('dragleave', this.handlers.out);
        this.composerElement.removeEventListener('dragend', this.handlers.out);

        this.composerElement.removeEventListener('drop', this.handlers.dropping);
    }

    in(event) {
        if (!this.isChar) return;
        console.log('over')
        event.preventDefault();

        if (!this.over) {
            this.composerElement.classList.add('fof-upload-dragging');
            this.over = true;
        }
    }

    out(event) {
        if (!this.isChar) return;
        event.preventDefault();

        if (this.over) {
            this.composerElement.classList.remove('fof-upload-dragging');
            this.over = false;
        }
    }

    dropping(event) {
        console.log('dropping');
        if (!this.isChar) {
            this.isChar = true;
            return;
        }
        event.preventDefault();

        if (!this.isDropping) {
            this.isDropping = true;
            this.composerElement.classList.add('fof-upload-dropping');

            this.uploadButton.uploadFiles(event.dataTransfer.files)
                .then(() => {
                    this.composerElement.classList.remove('fof-upload-dropping');
                    this.isDropping = false;
                });
        }
    }
}
