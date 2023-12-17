import app from 'flarum/forum/app';

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

  setState(fileState) {
    this.fileState = fileState;
  }

  on(type, callback) {
    this.callbacks[type].push(callback);
  }

  dispatch(type, response) {
    this.callbacks[type].forEach((callback) => callback(response));
  }

  upload(files, addBBcode = true) {
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
      .then((result) => this.uploaded(result, addBBcode))
      .catch((error) => {
        this.uploading = false;
        m.redraw();

        const e = error.response.errors[0];

        if (!e.code.includes('fof-upload')) {
          throw error;
        }

        app.alerts.clear();
        app.alerts.show(
          {
            type: 'error',
          },
          e.detail
        );
      });
  }

  uploaded(result, addBBcode = false) {
    this.uploading = false;

    result.data.forEach((file) => {
      const fileObj = app.store.pushObject(file);

      // Add file to media manager
      this.fileState?.addToList(fileObj);

      // Dispatch
      this.dispatch('success', {
        file: fileObj,
        addBBcode,
      });
    });

    this.dispatch('uploaded');
  }
}
