/* global m, $ */

export default class DragAndDrop {

    constructor(uploadButton) {

        if (this.initialized) return;

        this.uploadButton = uploadButton;

        this.textarea = $("#composer .Composer");

        this.textarea.on('dragover', this.in.bind(this));

        this.textarea.on('dragleave', this.out.bind(this));
        this.textarea.on('dragend', this.out.bind(this));

        this.textarea.on('drop', this.dropping.bind(this));

        this.isDropping = this.over = false;
        this.initialized = true;
    }

    in(event) {
        event.preventDefault();

        if (!this.over) {
            this.textarea.toggleClass('fof-upload-dragging', true);
            this.over = true;
        }
    }

    out(event) {
        event.preventDefault();

        if (this.over) {
            this.textarea.toggleClass('fof-upload-dragging', false);
            this.over = false;
        }
    }

    dropping(event) {
        event.preventDefault();

        if (!this.isDropping) {

            this.isDropping = true;
            this.textarea.addClass('fof-upload-dropping');

            m.redraw();

            this.uploadButton.uploadFiles(event.originalEvent.dataTransfer.files)
                .then(() => {
                    this.textarea.removeClass('fof-upload-dropping');
                    this.isDropping = false;
                });
        }

    }
}
