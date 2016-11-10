import Component from "flarum/Component";

export default class DragAndDrop extends Component {
    init() {
        // the service type handling uploads
        this.textAreaObj = null;

        this.loading = false;
        this.over = false;
    }

    in(e) {
        $(this.textAreaObj).toggleClass('flagrow-upload-dragging', true);
    }

    out(e) {
        $(this.textAreaObj).toggleClass('flagrow-upload-dragging', false);
    }

    dropping(e) {
        // ..
    }

    view() {
        // .. nothing here
    }
}
