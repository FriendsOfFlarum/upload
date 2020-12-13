export default class Uploader {
    constructor() {
        this.callbacks = {
            success: [],
            failure: [],
            uploading: [],
            uploaded: [],
        };
        this.uploading = false;
    }

    on(type, callback) {
        this.callbacks[type].push(callback);
    }

    dispatch(type, response) {
        this.callbacks[type].forEach((callback) => callback(response));
    }

    upload(files) {
        this.uploading = true;
        this.dispatch('uploading', files);

        m.redraw(); // Forcing a redraw so that the button also updates if uploadFiles() is called from DragAndDrop or PasteClipboard

        const body = new FormData();

        for (let i = 0; i < files.length; i++) {
            body.append('files[]', files[i]);
        }

        // send a POST request to the api
        return app
            .request({
                method: 'POST',
                url: app.forum.attribute('apiUrl') + '/fof/upload',
                // prevent JSON.stringify'ing the form data in the XHR call
                serialize: (raw) => raw,
                body,
            })
            .then(this.uploaded.bind(this))
            .catch((error) => {
                this.uploading = false;
                m.redraw();

                throw error;
            });
    }

    uploaded(files) {
        this.uploading = false;

        files.forEach((file) => this.dispatch('success', file));

        this.dispatch('uploaded');
    }
}
