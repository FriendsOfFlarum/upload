import app from 'flarum/app';
import Component from 'flarum/Component';
import icon from 'flarum/helpers/icon';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import ReplyComposer from 'flarum/components/ReplyComposer';
import EditPostComposer from 'flarum/components/EditPostComposer';
import Stream from 'flarum/utils/Stream'

export default class UploadButton extends Component {
    oninit(vnode) {
        super.oninit(vnode);
        // initial state of the button
        this.uploading = Stream(false);
    }

    view() {
        const buttonText = this.uploading() ? app.translator.trans('fof-upload.forum.states.loading') : app.translator.trans('fof-upload.forum.buttons.attach');

        return m('.Button.hasIcon.fof-upload-button.Button--icon', {
            className: this.uploading() ? 'uploading' : '',
        }, [
            this.uploading() ? LoadingIndicator.component({
                size: 'tiny',
                className: 'LoadingIndicator--inline Button-icon',
            }) : icon('fas fa-file-upload', {className: 'Button-icon'}),
            m('span.Button-label', buttonText),
            m('form', [
                m('input', {
                    type: 'file',
                    multiple: true,
                    onchange: this.process.bind(this),
                }),
            ]),
        ]);
    }

    /**
     * Process the upload event.
     *
     * @param e
     */
    process(e) {
        // get the file from the input field
        const files = this.$('input').prop('files');

        const upload = this.attrs.upload;

        upload(files);
    }

    /**
     * Appends the file's link to the body of the composer.
     */
    success() {
        console.log('success hit')
        // Scroll the preview into view
        // We don't call this.textAreaObj.props.preview() because that would close the composer on mobile
        // Instead we just directly perform the same scrolling and skip the part about minimizing the composer
        if (app.composer.component instanceof ReplyComposer) {
            m.route.set(app.route.discussion(app.composer.component.props.discussion, 'reply'));
        }

        if (app.composer.component instanceof EditPostComposer) {
            m.route.set(app.route.post(app.composer.component.props.post));
        }

        // reset the button for a new upload
        setTimeout(() => {
            this.$('form')[0].reset();
            this.uploading(false);
            m.redraw();
        }, 1000);
    }
}
