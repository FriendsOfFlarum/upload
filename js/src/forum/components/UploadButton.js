import Component from "flarum/Component";
import icon from "flarum/helpers/icon";
import LoadingIndicator from "flarum/components/LoadingIndicator";

export default class UploadButton extends Component {

    /**
     * Load the configured remote uploader service.
     */
    init() {
        // the service type handling uploads
        this.textAreaObj = null;

        // initial state of the button
        this.uploading = m.prop(false);
    }

    /**
     * Show the actual Upload Button.
     *
     * @returns {*}
     */
    view() {
        let button = m('span', {className: 'Button-label'}, app.translator.trans('flagrow-upload.forum.buttons.attach'));

        if (this.uploading()) {
            button = m('span', {className: 'Button-label uploading'}, app.translator.trans('flagrow-upload.forum.states.loading'));
        }

        return m('div', {className: 'Button hasIcon flagrow-upload-button Button--icon ' + (this.uploading() ? 'uploading' : '')}, [
            this.uploading() ? LoadingIndicator.component({className: 'Button-icon'}) : icon('fas fa-file-upload', {className: 'Button-icon'}),
            button,
            m('form#flagrow-upload-form', [
                m('input', {
                    type: 'file',
                    multiple: true,
                    onchange: this.process.bind(this)
                })
            ])
        ]);
    }

    /**
     * Process the upload event.
     *
     * @param e
     */
    process(e) {
        // get the file from the input field
        let files = $('form#flagrow-upload-form input').prop('files');

        // set the button in the loading state (and redraw the element!)
        this.uploading(true);

        this.uploadFiles(files);
    }

    uploadFiles(files) {
        const data = new FormData;

        for (let i = 0; i < files.length; i++) {
            data.append('files[]', files[i]);
        }

        // send a POST request to the api
        return app.request({
            method: 'POST',
            url: app.forum.attribute('apiUrl') + '/flagrow/upload',
            // prevent JSON.stringify'ing the form data in the XHR call
            serialize: raw => raw,
            data
        }).then(
            this.success.bind(this),
            this.failure.bind(this)
        );
    }

    /**
     * Handles errors.
     *
     * @param message
     */
    failure(message) {
        // todo show popup
    }

    /**
     * Appends the file's link to the body of the composer.
     *
     * @param file
     */
    success(response) {
        response.forEach((bbcode) => {
          this.textAreaObj.insertAtCursor(bbcode + '\n');
        })

        // if we are not starting a new discussion, the variable is defined
        if (typeof this.textAreaObj.props.preview !== 'undefined') {
            // show what we just uploaded
            this.textAreaObj.props.preview();
        }

        // reset the button for a new upload
        setTimeout(() => {
            document.getElementById("flagrow-upload-form").reset();
            this.uploading(false);
        }, 1000);
    }
}
