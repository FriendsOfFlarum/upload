import Component from "flarum/Component";

export default class DragAndDrop extends Component {
    init() {
        this.loading = false;
        this.over = false;

        this.textarea = $(this.props.element);

        $(this.textarea).bind('dragover', this.in);

        $(this.textarea).bind('dragleave', this.out);
        $(this.textarea).bind('dragend', this.out);
        $(this.textarea).bind('blur', this.out);

        $(this.textarea).bind('drop', this.dropping);

        console.log(this.textarea);
        console.log(this.props);
    }

    in(e) {
        console.log('entering textarea');
        $(this.props.textAreaObj.element).toggleClass('flagrow-upload-dragging', true);
    }

    out(e) {
        console.log('leaving textarea');
        $(this.props.textAreaObj.element).toggleClass('flagrow-upload-dragging', false);
    }

    dropping(e) {
        console.log('dropping on textarea');
        // ..
    }

    view() {
        // .. nothing here
    }
}
