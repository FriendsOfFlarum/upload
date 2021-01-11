import app from 'flarum/app';
import Component from 'flarum/Component';
import icon from 'flarum/helpers/icon';
import LoadingIndicator from 'flarum/components/LoadingIndicator';

export default class UploadButton extends Component {
    oninit(vnode) {
        super.oninit(vnode);

        this.attrs.uploader.on('uploaded', () => {
            // reset the button for a new upload
            this.$('form')[0].reset();

            // redraw to reflect uploader.loading in the DOM
            m.redraw();
        });
    }

    view() {
        const buttonText = this.attrs.uploader.uploading
            ? app.translator.trans('fof-upload.forum.states.loading')
            : app.translator.trans('fof-upload.forum.buttons.attach');

        return m(
            'button.Button.hasIcon.fof-upload-button.Button--icon',
            {
                className: this.attrs.uploader.uploading ? 'uploading' : '',
                onclick: this.uploadButtonClicked.bind(this),
            },
            [
                this.attrs.uploader.uploading
                    ? LoadingIndicator.component({
                          size: 'tiny',
                          className: 'LoadingIndicator--inline Button-icon',
                      })
                    : icon('fas fa-file-upload', { className: 'Button-icon' }),
                m('span.Button-label', buttonText),
                m('form', [
                    m('input', {
                        type: 'file',
                        multiple: true,
                        onchange: this.process.bind(this),
                    }),
                ]),
            ]
        );
    }

    /**
     * Process the upload event.
     *
     * @param e
     */
    process(e) {
        // get the file from the input field
        const files = this.$('input').prop('files');

        if (files.length === 0) {
            // We've got no files to upload, so trying
            // to begin an upload will show an error
            // to the user.
            return;
        }

        this.attrs.uploader.upload(files);
    }

    /**
     * Event handler for upload button being clicked
     *
     * @param {PointerEvent} e
     */
    uploadButtonClicked(e) {
        // Trigger click on hidden input element
        // (Opens file dialog)
        this.$('input').click();
    }
}
