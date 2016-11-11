import Component from "flarum/Component";

export default class DragAndDrop extends Component {
    init() {
        this.loading = false;
        this.over = false;

        this.textarea = $(this.props.textAreaObj.element).find('textarea').first();

        $(this.textarea).on('dragover', this.in.bind(this));

        $(this.textarea).on('dragleave', this.out.bind(this));
        $(this.textarea).on('dragend', this.out.bind(this));

        $(this.textarea).on('drop', this.dropping.bind(this));

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

        var self = this;

        this.props.uploadButton.uploadFiles(e.originalEvent.dataTransfer.files, this.success.bind(self), this.failure.bind(self));
    }

    success(response) {
        self.props.uploadButton.success(response);
        self.over = self.loading = false;
    }

    failure(response) {
        self.props.uploadButton.failure(response);
    }

    view() {
        // .. nothing here
    }
}
