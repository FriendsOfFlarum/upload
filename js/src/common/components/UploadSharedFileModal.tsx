import app from 'flarum/common/app';
import Modal from 'flarum/common/components/Modal';
import Switch from 'flarum/common/components/Switch';
import mimeToIcon from '../mimeToIcon'; // Adjust the path as needed
import Button from 'flarum/common/components/Button';

export default class UploadSharedFileModal extends Modal {
  files = [];
  fileInput = null;
  options = {
    gallery: true,
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

  addFiles(newFiles) {
    this.files.push(...newFiles);
    m.redraw();
  }

  content() {
    return (
      <div className="Modal-body">
        <div className="UploadSharedFileModal-files">
          <input type="file" multiple onchange={this.onFileChange.bind(this)} />
          {this.files.map((file) => {
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
          <Switch state={this.options.gallery} onchange={(value) => (this.options.gallery = value)}>
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
    // TODO: handle and display errors
    app
      .request({
        method: 'POST',
        url: app.forum.attribute('apiUrl') + '/fof/upload',
        body: {
          files: this.files,
          options: this.options,
        },
      })
      .then(() => {
        this.files = [];
        this.hide();
      });
  }
}
