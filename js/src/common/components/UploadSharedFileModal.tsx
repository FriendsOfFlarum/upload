import app from 'flarum/common/app';
import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import Switch from 'flarum/common/components/Switch';
import mimeToIcon from '../mimeToIcon';
import Button from 'flarum/common/components/Button';
import type Mithril from 'mithril';
import { ApiResponsePlural } from 'flarum/common/Store';
import File from '../models/File';

interface CustomAttrs extends IInternalModalAttrs {
  onUploadComplete: (files: File | File[]) => void;
}

export default class UploadSharedFileModal extends Modal<CustomAttrs> {
  files = [];
  fileInput = null;
  options = {
    shared: true,
    hidden: false,
  };
  loading: boolean = false;

  oninit(vnode: Mithril.Vnode<CustomAttrs, this>) {
    super.oninit(vnode);
  }

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

  onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer && e.dataTransfer.files) {
      this.addFiles(Array.from(e.dataTransfer.files));
    }
  }

  onDropzoneClick() {
    if (this.fileInput) {
      this.fileInput.click();
    }
  }

  content() {
    return (
      <div className="Modal-body">
        <div
          className="UploadSharedFileModal-dropzone"
          onclick={() => this.onDropzoneClick()}
          ondragover={this.onDragOver.bind(this)}
          ondrop={this.onDrop.bind(this)}
        >
          {app.translator.trans('fof-upload.lib.upload-shared-file-modal.dropzone')}
          <input
            type="file"
            multiple
            onchange={this.onFileChange.bind(this)}
            style={{ opacity: 0, position: 'absolute', left: '-9999px' }}
            oncreate={(vnode) => {
              this.fileInput = vnode.dom;
            }}
          />
        </div>
        <div className="UploadSharedFileModal-files">
          {this.files.map((file: File) => {
            const isImage = file.type.startsWith('image/');
            return (
              <div className="UploadedFile">
                {isImage ? <img src={URL.createObjectURL(file)} alt={file.name} /> : <i className={mimeToIcon(file.type)}></i>}
                <div className="UploadedFile-name">{file.name}</div>
                {/* Remove button */}
                <Button
                  className="Button Button--icon Button--link UploadedFile-remove"
                  icon="fas fa-times"
                  onclick={() => {
                    this.files = this.files.filter((f) => f !== file);
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="UploadSharedFileModal-options Form-group">
          <Switch state={this.options.hidden} onchange={(value: boolean) => (this.options.hidden = value)}>
            {app.translator.trans('fof-upload.lib.upload-shared-file-modal.hide-from-media-gallery')}
          </Switch>
        </div>
        <div className="UploadSharedFileModal-submit App-primaryControl">
          <Button
            className="Button Button--primary"
            loading={this.loading}
            onclick={this.upload.bind(this)}
            disabled={!this.files.length || this.loading}
          >
            {app.translator.trans('fof-upload.lib.upload-shared-file-modal.upload')}
          </Button>
        </div>
      </div>
    );
  }

  async upload() {
    this.loading = true;
    m.redraw();

    const formData = new FormData();

    // Append each file to the form data
    this.files.forEach((file) => {
      formData.append('files[]', file);
    });

    Object.keys(this.options).forEach((key) => {
      formData.append(`options[${key}]`, this.options[key]);
    });

    const results = await app.request<ApiResponsePlural<File>>({
      method: 'POST',
      url: app.forum.attribute('apiUrl') + '/fof/upload',
      serialize: (raw: FormData) => raw, // Prevent mithril from trying to serialize FormData
      body: formData,
    });

    const uploadedFiles = app.store.pushPayload(results);

    this.attrs.onUploadComplete(uploadedFiles);
    this.files = [];
    this.hide();

    this.loading = false;
    m.redraw();
  }
}
