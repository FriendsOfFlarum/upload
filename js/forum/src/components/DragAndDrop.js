import Component from "flarum/Component";

export default class DragAndDrop extends Component {
    init() {
        // the service type handling uploads
        this.textAreaObj = null;
        this.uploadButton = null;

        this.loading = false;
        this.over = false;

        $(this.element).bind('dragover', this.in);

        $(this.element).bind('dragleave', this.out);
        $(this.element).bind('dragend', this.out);
        $(this.element).bind('blur', this.out);

        $(this.element).bind('drop', this.dropping);

        console.log(this.textAreaObj);
        console.log(this.uploadButton);
        console.log(this.element);
        console.log(this.props);
    }

    in(e) {
        console.log('entering textarea');
        $(this.textAreaObj).toggleClass('flagrow-upload-dragging', true);
    }

    out(e) {
        console.log('leaving textarea');
        $(this.textAreaObj).toggleClass('flagrow-upload-dragging', false);
    }

    dropping(e) {
        console.log('dropping on textarea');
        // ..
    }

    view() {
        // .. nothing here
    }
}
