import Component from "flarum/Component";

export default class DragAndDrop extends Component {
    init() {
        this.loading = false;
        this.over = false;

        this.textarea = $(this.props.textAreaObj.element).find('textarea').first();

        $(this.textarea).bind('dragover', this.in);

        $(this.textarea).bind('dragleave', this.out);
        $(this.textarea).bind('dragend', this.out);
        window.bind('blur', this.out);

        $(this.textarea).bind('drop', this.dropping);

    }

    in(e) {
        e.preventDefault();

        if (this.over) {
            return;
        }

        $(this.textarea).toggleClass('flagrow-upload-dragging', true);

        this.over = true;
    }

    out(e) {
        if (!this.over) {
            return;
        }

        $(this.textarea).toggleClass('flagrow-upload-dragging', false);

        this.over = false;
    }

    dropping(e) {
        e.preventDefault();

        if (this.loading) {
            return
        }

        this.loading = true;

        this.props.uploadButton.uploadFiles(e.originalEvent.dataTransfer.files);

        this.loading = false;
        this.over = false;
    }

    view() {
        // .. nothing here
    }
}
