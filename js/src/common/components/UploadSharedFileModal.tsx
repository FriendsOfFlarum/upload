import app from 'flarum/common/app';
import Modal from 'flarum/common/components/Modal';
import Switch from 'flarum/common/components/Switch';
import mimeToIcon from '../mimeToIcon'; // Adjust the path as needed
import Button from 'flarum/common/components/Button';

export default class UploadSharedFileModal extends Modal {
  files = [];
  fileInput = null;
  options = {
    shared: true,
    hidden: false,
  };

  className() {
    return 'UploadSharedFileModal Modal--medium';
  }

  title() {
    return app.translator.trans('fof-upload.lib.upload-shared-file-modal.title');
  }

  onFileChange(e) {
    this.addFiles(Array.from(e.target.files));
  }

  addFiles(newFiles: File[]) {
    (this.files as File[]).push(...newFiles);
    m.redraw();
  }

  content() {
    return (
      <div className="Modal-body">
        <div className="UploadSharedFileModal-files">
          <input type="file" multiple onchange={this.onFileChange.bind(this)} />
          {this.files.map((file: File) => {
            // Add type assertion here
            const isImage = file.type.startsWith('image/');
            return (
              <div className="UploadedFile">
                {isImage ? <img src={URL.createObjectURL(file)} alt={file.name} /> : <i className={mimeToIcon(file.type)}></i>}
                <div>{file.name}</div>
              </div>
            );
          })}
        </div>
        <div className="UploadSharedFileModal-options Form-group">
          <Switch state={!this.options.hidden} onchange={(value: boolean) => (this.options.hidden = !value)}>
            {app.translator.trans('fof-upload.lib.upload-shared-file-modal.in-media-gallery')}
          </Switch>
        </div>
        <div className="UploadSharedFileModal-submit App-primaryControl">
          <Button className="Button Button--primary" onclick={this.upload.bind(this)} disabled={!this.files.length}>
            {app.translator.trans('fof-upload.lib.upload-shared-file-modal.upload')}
          </Button>
        </div>
      </div>
    );
  }

  upload() {
    const formData = new FormData();

    // Append each file to the form data
    this.files.forEach((file) => {
      formData.append('files[]', file);
    });

    Object.keys(this.options).forEach((key) => {
      formData.append(`options[${key}]`, this.options[key]);
    });

    app
      .request({
        method: 'POST',
        url: app.forum.attribute('apiUrl') + '/fof/upload',
        serialize: (raw) => raw, // Prevent mithril from trying to serialize FormData
        body: formData,
      })
      .then(() => {
        this.files = [];
        this.hide();
      })
      .catch((error) => {
        // TODO: Handle and display errors
        console.error(error);
      });
  }
}
