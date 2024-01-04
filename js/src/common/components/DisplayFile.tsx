import app from 'flarum/common/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import File from '../models/File';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Button from 'flarum/common/components/Button';
import icon from 'flarum/common/helpers/icon';
import mimeToIcon from '../mimeToIcon';
import User from 'flarum/common/models/User';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import Tooltip from 'flarum/common/components/Tooltip';
import extractText from 'flarum/common/utils/extractText';

interface CustomAttrs extends ComponentAttrs {
  file: File;
  fileSelectable: boolean;
  isSelected: boolean;
  fileClassNames: string;
  isFileHiding: boolean;
  onHide: (file: File) => void | undefined;
  onFileClick: (file: File) => void | undefined;
  onDelete: (file: File) => void | undefined;
  user: User;
}

export default class DisplayFile extends Component<CustomAttrs> {
  isFileHiding!: boolean;
  imageLoaded: boolean = true;
  file!: File;
  fileIcon!: string;
  isSelected!: boolean;
  isSelectable!: boolean;

  oninit(vnode: Mithril.Vnode<CustomAttrs, this>) {
    super.oninit(vnode);

    this.file = this.attrs.file;
    this.isFileHiding = this.attrs.isFileHiding === undefined ? false : this.attrs.isFileHiding;
    this.fileIcon = mimeToIcon(this.file.type());
    this.isSelected = this.attrs.isSelected === undefined ? false : this.attrs.isSelected;
    this.isSelectable = this.attrs.fileSelectable === undefined ? true : this.attrs.fileSelectable;
  }

  onbeforeupdate(vnode: Mithril.VnodeDOM<CustomAttrs, this>): void {
    super.onbeforeupdate(vnode);

    // Make sure the isSelected property is updated
    this.isSelected = this.attrs.isSelected === undefined ? false : this.attrs.isSelected;
  }

  view() {
    const isImage = this.file.type().startsWith('image/');

    const fileSelectedClass = this.isSelected ? 'selected' : '';

    return (
      <div
        className={`UploadedFile ${fileSelectedClass}`}
        key={this.file.uuid()}
        onclick={() => {
          if (this.isSelectable && !this.isFileHiding) {
            this.isSelected = !this.isSelected;
            this.attrs.onFileClick(this.file);
          }
        }}
        disabled={!this.isSelectable || this.isFileHiding}
      >
        {this.imageLoaded && isImage ? (
          <img
            src={this.file.url()}
            className="fof-file-image-preview"
            draggable={false}
            onerror={this.handleImageError}
            onload={this.handleImageLoad}
            alt={this.file.baseName()}
          />
        ) : (
          this.displayIcon(this.fileIcon)
        )}

        <div className="fof-file-actions">{this.actionItems(this.file).toArray()}</div>

        <div className="fof-file-name">
          <Tooltip text={this.file.baseName()}>
            <span>{this.file.baseName()}</span>
          </Tooltip>
        </div>

        {this.isFileHiding && (
          <div class="fof-file-loading" role="status" aria-label={app.translator.trans('fof-upload.lib.file_list.hide_file.loading')}>
            <LoadingIndicator />
          </div>
        )}
      </div>
    );
  }

  displayIcon(fileIcon: string): Mithril.Children {
    return (
      <span
        className="fof-file-icon"
        role="presentation"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%', // Ensure the container takes up the necessary space
        }}
      >
        {icon(`fa-fw ${fileIcon}`)}
      </span>
    );
  }

  actionItems(file: File): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    file.canViewInfo() &&
      items.add(
        'view-info',
        <Button className="Button Button--icon fof-file-action" icon="fas fa-info-circle" aria-label="info" onclick={() => this.viewFileInfo()} />,
        100
      );

    const transPrefix = file.isShared() ? 'fof-upload.lib.file_list.hide_shared_file' : 'fof-upload.lib.file_list.hide_file';
    const hideTranslation = app.translator.trans(this.file.hidden() ? `${transPrefix}.btn_a11y_label_show` : `${transPrefix}.btn_a11y_label_hide`, {
      fileName: file.baseName(),
    });

    file.canHide() &&
      items.add(
        'hide-file',
        <Tooltip text={hideTranslation} position="bottom">
          <Button
            className="Button Button--icon fof-file-action"
            icon={this.file.hidden() ? 'fas fa-eye' : 'fas fa-eye-slash'}
            aria-label={hideTranslation}
            disabled={this.isFileHiding}
            onclick={(e: Event) => this.hide(e)}
          />
        </Tooltip>,
        80
      );

    const deleteTranslation = app.translator.trans('fof-upload.lib.file_list.delete_file_a11y_label', { fileName: file.baseName() });

    file.canDelete() &&
      items.add(
        'delete-file',
        <Tooltip text={deleteTranslation} position="bottom">
          <Button
            className="Button Button--icon fof-file-action"
            icon="fas fa-trash"
            aria-label={deleteTranslation}
            disabled={this.isFileHiding}
            onclick={(e: MouseEvent) => this.confirmDelete(e)}
          />
        </Tooltip>,
        60
      );

    return items;
  }

  // Function to call when image fails to load
  handleImageError = () => {
    this.imageLoaded = false;
    this.fileIcon = 'fas fa-exclamation-triangle';
    this.isSelectable = false;
    m.redraw();
  };

  // Function to call when image loads successfully
  handleImageLoad = () => {
    this.imageLoaded = true;
    m.redraw();
  };

  viewFileInfo() {
    console.log('view file info');
  }

  hide(e: Event) {
    e.stopPropagation();

    // TODO: local logic, then:

    if (this.attrs.onHide) {
      this.attrs.onHide(this.file);
    }
  }

  async confirmDelete(e: MouseEvent) {
    e.stopPropagation();

    if (confirm(extractText(app.translator.trans('fof-upload.lib.file_list.delete_confirmation', { fileName: this.file.baseName() })))) {
      const uuid = this.file.uuid();
      await app.request({
        method: 'DELETE',
        url: app.forum.attribute('apiUrl') + '/fof/upload/delete/' + uuid,
      });

      if (this.attrs.onDelete) {
        this.attrs.onDelete(this.file);
      }
    }
  }
}
