import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import UploadButton from './UploadButton';
import UserFileList from '../../common/components/UserFileList';
import DragAndDrop from './DragAndDrop';
import UploadSharedFileModal from '../../common/components/UploadSharedFileModal';
import ItemList from 'flarum/common/utils/ItemList';
import SharedFileList from '../../common/components/SharedFileList';
import FileListState from '../../common/states/FileListState';

export default class FileManagerModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    // Initialize upload managers
    this.uploader = vnode.attrs.uploader;

    // Current selected files
    this.selectedFiles = [];

    // Allow multiselect
    this.multiSelect = vnode.attrs.multiSelect === undefined ? true : vnode.attrs.multiSelect;

    // Restrict file selection to specific types
    this.restrictFileType = vnode.attrs.restrictFileType || null;

    // Drag & drop
    this.dragDrop = null;

    this.selectedFilesLibrary = vnode.attrs.defaultFilesLibrary || 'user';

    this.sharedUploads = null;

    this.userFileState = new FileListState();
    this.sharedFileState = new FileListState(true);

    this.uploader.setState(this.userFileState);

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
    const { hideUser, hideShared } = this.attrs;

    return (
      <div className={`Modal modal-dialog ${this.className()}`}>
        <div className="Modal-content">
          <div className="fof-modal-buttons App-backControl">
            {!hideUser && this.selectedFilesLibrary === 'user' && (
              <UploadButton uploader={this.uploader} disabled={this.userFileState.isLoading()} isMediaUploadButton />
            )}
            {app.session.user && app.session.user.uploadSharedFiles() && !hideShared && this.selectedFilesLibrary === 'shared' && (
              <Button
                className="Button"
                icon="fas fa-file-upload"
                onclick={() => {
                  this.showUploadModal();
                }}
              >
                {app.translator.trans('fof-upload.forum.buttons.upload')}
              </Button>
            )}
          </div>

          <div className="fof-drag-and-drop">
            <div className="fof-drag-and-drop-release">
              <i className="fas fa-cloud-upload-alt" />

              {app.translator.trans('fof-upload.lib.file_list.release_to_upload')}
            </div>
          </div>

          <div className="Modal-header">
            <h3 className="App-titleControl App-titleControl--text">{app.translator.trans('fof-upload.forum.media_manager')}</h3>
            {app.session.user?.accessSharedFiles() && !hideUser && !hideShared && (
              <div className="LibrarySelection">{this.fileLibraryButtonItems().toArray()}</div>
            )}
          </div>

          {this.alertAttrs && (
            <div className="Modal-alert">
              <Alert {...this.alertAttrs} />
            </div>
          )}

          <div className="Modal-body">
            {this.selectedFilesLibrary === 'user' && this.userFilesContent()}
            {this.selectedFilesLibrary === 'shared' && this.sharedFilesContent()}
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
              {app.translator.trans('fof-upload.lib.file_list.confirm_selection_btn', { fileCount })}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  fileLibraryButtonItems() {
    const items = new ItemList();

    items.add(
      'user',
      <Button className={`Button Button--flat ${this.selectedFilesLibrary === 'user' ? 'active' : ''}`} onclick={() => this.setLibrary('user')}>
        {app.translator.trans('fof-upload.forum.buttons.media')}
      </Button>
    );

    items.add(
      'shared',
      <Button className={`Button Button--flat ${this.selectedFilesLibrary === 'shared' ? 'active' : ''}`} onclick={() => this.setLibrary('shared')}>
        {app.translator.trans('fof-upload.forum.buttons.shared_media')}
      </Button>
    );

    return items;
  }

  setLibrary(library) {
    this.selectedFilesLibrary = library;
    m.redraw();
  }

  userFilesContent() {
    return (
      <UserFileList
        user={this.attrs.user}
        selectable
        onFileSelect={this.onFileSelect.bind(this)}
        selectedFiles={this.selectedFiles}
        restrictFileType={this.restrictFileType}
        fileState={this.userFileState}
        onDelete={this.onDelete.bind(this)}
      />
    );
  }

  sharedFilesContent() {
    return (
      <SharedFileList
        selectable
        onFileSelect={this.onFileSelect.bind(this)}
        selectedFiles={this.selectedFiles}
        restrictFileType={this.restrictFileType}
        user={this.attrs.user}
        fileState={this.sharedFileState}
        onDelete={this.onDelete.bind(this)}
      />
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
      const file = app.store.getById('files', fileId) || app.store.getById('shared-files', fileId);

      app.composer.editor.insertAtCursor(file.bbcode() + '\n', false);
    });
  }

  showUploadModal() {
    app.modal.show(
      UploadSharedFileModal,
      {
        onUploadComplete: (files) => {
          this.sharedFileState.addToList(files);
        },
      },
      true
    );
  }

  onDelete(file) {
    this.sharedFileState.removeFromList(file);
    this.userFileState.removeFromList(file);
  }
}
