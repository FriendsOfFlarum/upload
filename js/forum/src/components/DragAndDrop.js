export default class DragAndDrop {

    constructor(uploadButton) {

        if (this.initialized) return;

        this.uploadButton = uploadButton;

        this.textarea = $("#composer .Composer");

        $(this.textarea).on('dragover', this.in.bind(this));

        $(this.textarea).on('dragleave', this.out.bind(this));
        $(this.textarea).on('dragend', this.out.bind(this));

        $(this.textarea).on('drop', this.dropping.bind(this));

        this.isDropping = this.over = false;
        this.initialized = true;
    }

    in(e) {
        e.preventDefault();

        if (!this.over) {
            this.textarea.toggleClass('flagrow-upload-dragging', true);
            this.over = true;
        }
    }

    out(e) {
        e.preventDefault();

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
