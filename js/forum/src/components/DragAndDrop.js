export default class DragAndDrop {

    constructor(textAreaObj, uploadButton) {

        if (this.initialized) return;

        this.textAreaObj = textAreaObj;
        this.uploadButton = uploadButton;


        this.textarea = this.textAreaObj.$('textarea');

        this.textarea.on('dragover', this.in);

        this.textarea.on('dragleave', this.out);
        this.textarea.on('dragend', this.out);

        this.textarea.on('drop', this.dropping);

        this.isDropping = this.over = false;
        this.initialized = true;
    }

    in(e) {
        if (!this.over) {
            this.textarea.toggleClass('flagrow-upload-dragging', true);
            this.over = true;
        }
    }

    out(e) {
        if (this.over) {
            this.textarea.toggleClass('flagrow-upload-dragging', false);
            this.over = false;
        }
    }

    dropping(e) {
        e.preventDefault();

        if (!this.isDropping) {

            this.isDropping = true;
            this.textarea.addClass('flagrow-dropping');

            m.redraw();

            this.uploadButton.uploadFiles(e.originalEvent.dataTransfer.files)
                .then(() => {
                    this.textarea.removeClass('flagrow-dropping');
                    this.isDropping = false;
                });
        }

    }
}
