import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import UploadButton from './UploadButton';
import UserFileList from './UserFileList';
import DragAndDrop from './DragAndDrop';

export default class FileManagerModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    // Initialize upload managers
    this.uploader = vnode.attrs.uploader;

    // Current selected files
    this.selectedFiles = [];

    // Allow multiselect
    this.multiSelect = vnode.attrs.multiSelect || true;

    // Restrict file selection to specific types
    this.restrictFileType = vnode.attrs.restrictFileType || null;

    // Drag & drop
    this.dragDrop = null;

    // Initialize uploads
    this.onUpload();
  }

  className() {
    return 'Modal--large fof-file-manager-modal';
  }

  /**
   * Initialize drag & drop
   */
  oncreate(vnode) {
    super.oncreate(vnode);

    this.dragDrop = new DragAndDrop((files) => this.uploader.upload(files, false), this.$().find('.Modal-content')[0]);
  }

  /**
   * Remove events from modal content
   */
  onremove() {
    if (this.dragDrop) {
      this.dragDrop.unload();
    }
  }

  view() {
    const fileCount = this.selectedFiles.length;

    return (
      <div className={`Modal modal-dialog ${this.className()}`}>
        <div className="Modal-content">
          <div className="fof-modal-buttons App-backControl">
            <UploadButton uploader={this.uploader} disabled={app.fileListState.isLoading()} isMediaUploadButton />
          </div>

          <div className="fof-drag-and-drop">
            <div className="fof-drag-and-drop-release">
              <i className="fas fa-cloud-upload-alt" />

              {app.translator.trans('fof-upload.forum.file_list.release_to_upload')}
            </div>
          </div>

          <div className="Modal-header">
            <h3 className="App-titleControl App-titleControl--text">{app.translator.trans('fof-upload.forum.media_manager')}</h3>
          </div>

          {this.alertAttrs && (
            <div className="Modal-alert">
              <Alert {...this.alertAttrs} />
            </div>
          )}

          <div className="Modal-body">
            <UserFileList
              user={this.attrs.user}
              selectable
              onFileSelect={this.onFileSelect.bind(this)}
              selectedFiles={this.selectedFiles}
              restrictFileType={this.restrictFileType}
            />
          </div>

          <div className="Modal-footer">
            <Button onclick={this.hide.bind(this)} className="Button">
              {app.translator.trans('fof-upload.forum.buttons.cancel')}
            </Button>

            <Button
              onclick={this.onSelect.bind(this)}
              disabled={this.selectedFiles.length === 0 || (!this.multiSelect && this.selectedFiles.length > 1)}
              className="Button Button--primary"
            >
              {app.translator.trans('fof-upload.forum.file_list.confirm_selection_btn', { fileCount })}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Add or remove file from selected files
   *
   * @param {File} file
   */
  onFileSelect(file) {
    const itemPosition = this.selectedFiles.indexOf(file.id());

    if (itemPosition >= 0) {
      this.selectedFiles.splice(itemPosition, 1);
    } else {
      if (this.multiSelect) {
        this.selectedFiles.push(file.id());
      } else {
        this.selectedFiles = [file.id()];
      }
    }
  }

  /**
   * Add files to file list after upload
   */
  onUpload() {
    this.uploader.on('success', ({ file }) => {
      if (this.multiSelect) {
        this.selectedFiles.push(file.id());
      } else {
        this.selectedFiles = [file.id()];
      }
    });
  }

  /**
   * Add selected files to the composer
   */
  onSelect() {
    this.hide();

    // Custom callback
    if (this.attrs.onSelect) {
      this.attrs.onSelect(this.selectedFiles);

      return;
    }

    // Add selected files to composer
    this.selectedFiles.map((fileId) => {
      const file = app.store.getById('files', fileId);

      app.composer.editor.insertAtCursor(file.bbcode() + '\n', false);
    });
  }
}
