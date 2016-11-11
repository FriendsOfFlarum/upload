import Component from "flarum/Component";

export default class DragAndDrop extends Component {
    init() {
        this.loading = false;
        this.over = false;

        this.textarea = this.props.textAreaObj.element;

        this.textarea.addEventListener('dragover', this.in);

        this.textarea.addEventListener('dragleave', this.out);
        this.textarea.addEventListener('dragend', this.out);
        window.addEventListener('blur', this.out);

        this.textarea.addEventListener('drop', this.dropping);

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

        this.props.uploadButton.uploadFiles(e.originalEvent.dataTransfer.files);

        this.over = this.loading = false;
    }

    view() {
        // .. nothing here
    }
}
