import app from 'flarum/common/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import File from '../models/File';
import type Mithril from 'mithril';
import User from 'flarum/common/models/User';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import mimeToIcon from '../mimeToIcon';
import classList from 'flarum/common/utils/classList';
import Button from 'flarum/common/components/Button';
import DisplayFile from './DisplayFile';
import Alert from 'flarum/common/components/Alert';
import extractText from 'flarum/common/utils/extractText';
import FileListState from '../states/FileListState';
import { ApiPayloadSingle } from 'flarum/common/Store';
import icon from 'flarum/common/helpers/icon';

export interface FileListAttrs extends ComponentAttrs {
  user: User | null;
  selectable: boolean;
  restrictFileType: string | string[];
  selectedFiles: string[];
  downloadOnClick: boolean;
  onFileSelect: (file: File) => void | undefined;
  onDelete: (file: File) => void | undefined;
  fileState: FileListState;
}

export default abstract class AbstractFileList extends Component<FileListAttrs> {
  user: User | null = null;
  inModal!: boolean;
  restrictFileType!: string | string[] | null;
  downloadOnClick!: boolean;
  filesBeingHidden!: string[];
  fileState!: FileListState;

  public abstract loadFileList(): void;
  abstract hasMoreResults(): boolean;
  abstract loadMore(): void;
  abstract isLoading(): boolean;
  abstract fileCollection(): File[];

  oninit(vnode: Mithril.Vnode<FileListAttrs, this>) {
    super.oninit(vnode);

    this.inModal = this.attrs.selectable;
    this.restrictFileType = this.attrs.restrictFileType || null;
    this.downloadOnClick = this.attrs.downloadOnClick || false;
    this.filesBeingHidden = [];
    this.fileState = this.attrs.fileState;

    this.loadFileList();
  }

  view() {
    return (
      <div className="SharedFileList fof-upload-file-list" aria-live="polite">
        {/* Loading */}
        {this.isLoading() && this.fileCollection().length === 0 && (
          <div className={'fof-upload-loading'}>
            {app.translator.trans('fof-upload.lib.file_list.loading')}

            <LoadingIndicator />
          </div>
        )}
        {/* Empty file list */}
        {!this.isLoading() && this.fileCollection().length === 0 && (
          <div className="Placeholder">
            <p className="fof-upload-empty">{app.translator.trans('fof-upload.lib.file_list.empty')}</p>
          </div>
        )}
        {/* File list */}
        <ul>
          {this.fileCollection().map((file: File) => {
            const fileIcon = mimeToIcon(file.type());
            const fileSelectable = this.restrictFileType ? this.isSelectable(file) : true;

            const fileClassNames = classList([
              'fof-file',
              // File is image
              fileIcon === 'far fa-file-image' && 'fof-file-type-image',
              // File is selected
              this.attrs.selectedFiles && this.attrs.selectedFiles.indexOf(file.id() ?? '') >= 0 && 'fof-file-selected',
            ]);

            const isFileHiding = this.filesBeingHidden.includes(file.uuid());

            return (
              <li aria-busy={isFileHiding} key={file.uuid()}>
                <DisplayFile
                  file={file}
                  fileSelectable={fileSelectable}
                  isSelected={this.attrs.selectedFiles && this.attrs.selectedFiles.indexOf(file.id() ?? '') >= 0}
                  fileClassNames={fileClassNames}
                  isFileHiding={isFileHiding}
                  onHide={this.hideFile.bind(this)}
                  onFileClick={this.onFileClick.bind(this)}
                  user={this.attrs.user}
                  onDelete={this.onDelete.bind(this)}
                />
              </li>
            );
          })}
        </ul>
        {/* Load more files */}
        {this.hasMoreResults() && (
          <div className={'fof-load-more-files'}>
            <Button className={'Button Button--primary'} disabled={this.isLoading()} loading={this.isLoading()} onclick={() => this.loadMore()}>
              {app.translator.trans('fof-upload.lib.file_list.load_more_files_btn')}
            </Button>
          </div>
        )}
      </div>
    );
  }

  onDelete(file: File) {
    if (this.attrs.onDelete) {
      this.attrs.onDelete(file);
    }
  }

  // Common methods like onFileClick, isSelectable, hideFile...

  onFileClick(file: File) {
    // Custom functionality
    if (this.attrs.onFileSelect) {
      this.attrs.onFileSelect(file);
      return;
    }

    // Download on click
    if (this.attrs.downloadOnClick) {
      window.open(file.url());
      return;
    }
  }

  isSelectable(file: File) {
    const fileType = file.type();

    // Custom defined file types
    if (Array.isArray(this.restrictFileType)) {
      return this.restrictFileType.indexOf(fileType) >= 0;
    }

    // Image
    else if (this.restrictFileType === 'image') {
      return fileType.includes('image/');
    }

    // Audio
    else if (this.restrictFileType === 'audio') {
      return fileType.includes('audio/');
    }

    // Video
    else if (this.restrictFileType === 'video') {
      return fileType.includes('video/');
    }

    return false;
  }

  /**
   * Begins the hiding process for a file.
   *
   * - Shows a native confirmation dialog
   * - If confirmed, sends AJAX request to the hide file API
   */
  async hideFile(file: File) {
    const uuid = file.uuid();

    if (this.filesBeingHidden.includes(uuid)) return;

    this.filesBeingHidden.push(uuid);

    const transPrefix = file.isShared() ? 'fof-upload.lib.file_list.hide_shared_file' : 'fof-upload.lib.file_list.hide_file';

    const confirmToggleHide = confirm(
      extractText(
        app.translator.trans(file.hidden() ? `${transPrefix}.show_confirmation` : `${transPrefix}.hide_confirmation`, {
          fileName: file.baseName(),
        })
      )
    );

    if (confirmToggleHide) {
      try {
        const filePayload = await app.request<ApiPayloadSingle>({
          method: 'PATCH',
          url: `${app.forum.attribute('apiUrl')}/fof/upload/hide`,
          body: { uuid },
        });

        app.store.pushPayload(filePayload);
        m.redraw();

        app.alerts.show(Alert, { type: 'success' }, [
          icon(file.hidden() ? 'fas fa-eye-slash' : 'fas fa-eye'),
          ' ',
          app.translator.trans(file?.hidden() ? `${transPrefix}.hide_success` : `${transPrefix}.show_success`),
        ]);

        if (this.fileState.user) {
          const index = this.fileState.files.findIndex((file: File) => uuid === file.uuid());
          this.fileState.files.splice(index, 1);
        }
      } catch (error) {
        app.alerts.show(
          Alert,
          { type: 'error' },
          app.translator.trans(file?.hidden() ? `${transPrefix}.hide_fail` : `${transPrefix}.show_fail`, {
            fileName: file.baseName(),
          })
        );
      } finally {
        // Remove file from hiding list
        const i = this.filesBeingHidden.indexOf(uuid);
        this.filesBeingHidden.splice(i, 1);
      }
    }
  }
}
