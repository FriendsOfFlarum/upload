import Component from "flarum/Component";

export default class DragAndDrop extends Component {
    init() {
        this.loading = false;
        this.over = false;

        this.textarea = $(this.props.textAreaObj.element).find('textarea').first();

        $(this.textarea).on('dragover', this.in);

        $(this.textarea).on('dragleave', this.out);

        $(this.textarea).on('drop', {
            uploadButton: this.props.uploadButton
        }, this.dropping);

    }

    in(e) {
        e.preventDefault();

        if (this.over || this.loading) {
            return;
        }

        $(this.textarea).toggleClass('flagrow-upload-dragging', true);

        this.over = true;
    }

    out(e) {
        e.preventDefault();

        if (!this.over || this.loading) {
            return;
        }

        $(this.textarea).toggleClass('flagrow-upload-dragging', false);

        this.over = false;
    }

    dropping(e) {
        e.preventDefault();
        e.stopPropagation();

        if (this.loading) {
            return;
        }

        this.over = this.loading = true;

        m.redraw();

        e.data.uploadButton.uploadFiles(e.originalEvent.dataTransfer.files);

        this.over = this.loading = false;
    }

    view() {
        // .. nothing here
    }
}
