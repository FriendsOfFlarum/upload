import Component from "flarum/Component";

export default class DragAndDrop extends Component {
    init() {
        this.loading = false;
        this.over = false;

        this.textarea = $(this.props.textAreaObj.element).find('textarea').first();

        $(this.textarea).bind('dragover', this.in);

        $(this.textarea).bind('dragleave', this.out);
        $(this.textarea).bind('dragend', this.out);
        $(this.textarea).bind('blur', this.out);

        $(this.textarea).bind('drop', this.dropping);

        console.log(this.textarea);
        console.log(this.props);
    }

    in(e) {
        e.preventDefault();

        if (this.over) {
            return;
        }

        console.log('entering textarea');
        $(this.textarea).toggleClass('flagrow-upload-dragging', true);

        this.over = true;
    }

    out(e) {
        if (!this.over) {
            return;
        }

        console.log('leaving textarea');
        $(this.textarea).toggleClass('flagrow-upload-dragging', false);

        this.over = false;
    }

    dropping(e) {
        e.preventDefault();

        if (this.loading) {
            return
        }

        this.loading = true;

        console.log('dropping on textarea');
        console.log(e);
        // ..
    }

    view() {
        // .. nothing here
    }
}
