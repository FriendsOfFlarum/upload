import Component from "flarum/Component";
import icon from "flarum/helpers/icon";
import LoadingIndicator from "flarum/components/LoadingIndicator";

export default class UploadButton extends Component {

    /**
     * Load the configured remote uploader service.
     */
    init() {
        // the service type handling uploads
        this.textAreaObj = this.props.textAreaObj;

        // initial state of the button
        this.loading = false;
    }

    // replaces button label
    title() {
        return this.loading ? app.translator.trans('flagrow-upload.forum.states.loading') : app.translator.trans('flagrow-upload.forum.buttons.attach');
    }

    /** 
     *  Tooltip shouldn't trigger on focus while open file dialog is open (hover only)
     */
    config(isInitialized) {
        if (isInitialized) return;
        this.$().tooltip({trigger: 'hover'}); // 
    }

    /**
     *  Button click fix also addresses tooltip issues with open dialog
     */
    clicked() {
        this.$().tooltip('hide');
    }

    /**
     * Show the actual Upload Button.
     *
     * @returns {*}
     */ 
    view() {
        return m('button', { className: 'Button Button--icon flagrow-upload-button Button--link', title: this.title()}, [
            this.loading ? LoadingIndicator.component({className: 'flagrow-small-loading'}) : icon('far fa-file'),
            m('form#flagrow-upload-form', [
                m('input', {
                    type: 'file',
                    multiple: true,
                    onchange: this.process.bind(this),
                    onclick: this.clicked.bind(this),
                    disabled: this.loading  // prevent users from interrupting upload
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
            m.redraw(); // stops loading icon getting stuck after upload
        }, 1000);
    }
}
