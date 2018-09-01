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
        this.loading = false;
    }

    /**
     * Show the actual Upload Button.
     *
     * @returns {*}
     */
    view() {
        return m('div', {className: 'Button hasIcon flagrow-upload-button Button--icon'}, [
            this.loading ? LoadingIndicator.component({className: 'Button-icon'}) : icon('far fa-file', {className: 'Button-icon'}),
            m('span', {className: 'Button-label'}, this.loading ? app.translator.trans('flagrow-upload.forum.states.loading') : app.translator.trans('flagrow-upload.forum.buttons.attach')),
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

        var files = $(e.target)[0].files;

        // set the button in the loading state (and redraw the element!)
        this.loading = true;
        m.redraw();

        this.uploadFiles(files, this.success, this.failure);
    }

    uploadFiles(files, successCallback, failureCallback) {
        const data = new FormData;

        for (var i = 0; i < files.length; i++) {
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
            this.loading = false;
        }, 1000);
    }
}
