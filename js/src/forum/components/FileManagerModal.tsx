import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Alert from 'flarum/common/components/Alert';
import UploadButton from './UploadButton';
import UserFileList from '../../common/components/UserFileList';
import DragAndDrop from './DragAndDrop';
import ItemList from 'flarum/common/utils/ItemList';
import SharedFileList from '../../common/components/SharedFileList';
import FileListState from '../../common/states/FileListState';
import type Uploader from '../handler/Uploader';
import type File from '../../common/models/File';
import type User from 'flarum/common/models/User';
import type Mithril from 'mithril';

type FilesLibrary = 'user' | 'shared';

interface FileManagerModalAttrs {
  uploader: Uploader;
  user?: User | null;
  hideUser?: boolean;
  hideShared?: boolean;
  multiSelect?: boolean;
  restrictFileType?: string | null;
  defaultFilesLibrary?: FilesLibrary;
  onSelect?: (selectedFileIds: string[]) => void;
}

export default class FileManagerModal extends (Modal as any)<FileManagerModalAttrs, undefined> {
  uploader!: Uploader;
  selectedFiles: string[] = [];
  multiSelect = true;
  restrictFileType: string | null = null;
  dragDrop: DragAndDrop | null = null;
  selectedFilesLibrary: FilesLibrary = 'user';
  userFileState!: FileListState;
  sharedFileState!: FileListState;

  oninit(vnode: Mithril.Vnode<FileManagerModalAttrs, this>) {
    super.oninit(vnode);

    this.uploader = vnode.attrs.uploader;
    this.selectedFiles = [];
    this.multiSelect = vnode.attrs.multiSelect === undefined ? true : vnode.attrs.multiSelect;
    this.restrictFileType = vnode.attrs.restrictFileType || null;
    this.dragDrop = null;
    this.selectedFilesLibrary = vnode.attrs.defaultFilesLibrary || 'user';

    this.userFileState = new FileListState();
    this.sharedFileState = new FileListState(true);

    this.uploader.setState(this.userFileState);

    this.onUpload();
  }

  className() {
    return 'Modal--large fof-file-manager-modal';
  }

  title() {
    return '';
  }

  content() {
    return null;
  }

  oncreate(vnode: Mithril.VnodeDOM<FileManagerModalAttrs, this>) {
    super.oncreate(vnode);

    this.dragDrop = new DragAndDrop((files) => this.uploader.upload(files, false), this.$().find('.Modal-content')[0]);
  }

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
            {app.session.user && (app.session.user as unknown as { uploadSharedFiles(): boolean }).uploadSharedFiles() && !hideShared && this.selectedFilesLibrary === 'shared' && (
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
            {app.session.user && (app.session.user as unknown as { accessSharedFiles(): boolean }).accessSharedFiles() && !hideUser && !hideShared && (
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
    const items = new ItemList<Mithril.Children>();

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

  setLibrary(library: FilesLibrary) {
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

  onFileSelect(file: File) {
    const fileId = file.id();
    if (!fileId) return;
    const itemPosition = this.selectedFiles.indexOf(fileId);

    if (itemPosition >= 0) {
      this.selectedFiles.splice(itemPosition, 1);
    } else {
      if (this.multiSelect) {
        this.selectedFiles.push(fileId);
      } else {
        this.selectedFiles = [fileId];
      }
    }
  }

  onUpload() {
    this.uploader.on('success', (response: unknown) => {
      const { file } = response as { file: File };
      const fileId = file.id();
      if (fileId) {
        if (this.multiSelect) {
          this.selectedFiles.push(fileId);
        } else {
          this.selectedFiles = [fileId];
        }
      }
    });
  }

  onSelect() {
    this.hide();

    if (this.attrs.onSelect) {
      this.attrs.onSelect(this.selectedFiles);
      return;
    }

    this.selectedFiles.forEach((fileId) => {
      const file = app.store.getById('files', fileId) || app.store.getById('shared-files', fileId) as File | undefined;
      if (file && typeof (file as File).bbcode === 'function' && app.composer.editor) {
        app.composer.editor.insertAtCursor((file as File).bbcode() + '\n', false);
      }
    });
  }

  showUploadModal() {
    app.modal.show(
      () => import('../../common/components/UploadSharedFileModal'),
      {
        onUploadComplete: (files: File[]) => {
          this.sharedFileState.addToList(files);
        },
      },
      true
    );
  }

  onDelete(file: File) {
    this.sharedFileState.removeFromList(file);
    this.userFileState.removeFromList(file);
  }
}
