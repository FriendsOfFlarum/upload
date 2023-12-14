import Component, { ComponentAttrs } from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import mimeToIcon from '../mimeToIcon';
import File from '../models/File';
import icon from 'flarum/common/helpers/icon';
import app from 'flarum/common/app';
import classList from 'flarum/common/utils/classList';

interface CustomAttrs extends ComponentAttrs {
  file: File;
  selectable: boolean;
  fileClassNames: string;
  onDelete: (file: File) => void | undefined;
  onFileSelect: (file: File) => void | undefined;
}

export default class UploadedFile extends Component<CustomAttrs> {
  file!: File;
  callback!: () => void | undefined;
  imageLoaded: boolean = true;

  oninit(vnode: Mithril.Vnode<CustomAttrs, this>) {
    super.oninit(vnode);

    this.file = this.attrs.file;
  }

  view() {
    const isImage = this.file.type().startsWith('image/');
    const fileIcon = mimeToIcon(this.file.type());
    const errorIcon = 'fas fa-exclamation-triangle';
    const statusIcon = this.file.isPrivateShared() ? 'fas fa-lock' : 'fas fa-unlock';

    return (
      <div className="UploadedFile" key={this.file.uuid()}>
        <div className="UploadedFile--sharestatus">
          <span>
            {icon(statusIcon)}
            {this.file.baseName()}
          </span>
        </div>
        <div className="UploadedFile--preview" onclick={() => this.onFileClick(this.file)}>
          {isImage ? (
            this.imageLoaded ? (
              <img
                className={this.attrs.fileClassNames}
                src={this.file.url()}
                loading="lazy"
                onerror={this.handleImageError}
                onload={this.handleImageLoad}
                alt={this.file.baseName()}
              />
            ) : (
              icon(errorIcon, { className: 'icon-fallback' }) // Error icon for failed image load
            )
          ) : (
            icon(fileIcon, { className: 'icon-fallback' }) // Icon representing the file type
          )}
        </div>
        <div className="UploadedFile--actions">{this.actionItems().toArray()}</div>
      </div>
    );
  }

  actionItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    items.add(
      'view-info',
      <Button className="Button Button--icon" icon="fas fa-info-circle" onclick={() => this.viewFileInfo()} aria-label="info" />
    );

    items.add(
      'download',
      <Button className="Button Button--icon" icon="fas fa-download" onclick={() => window.open(this.file.url())} aria-label="download" />
    );

    const hideFileIcon = this.file.isPrivateShared() ? 'fas fa-lock' : this.file.hidden() ? 'fas fa-eye' : 'fas fa-eye-slash';
    items.add('hide-file', <Button className="Button Button--icon" icon={hideFileIcon} onclick={() => this.hideFile()} aria-label="hide" />);

    items.add('delete', <Button className="Button Button--icon" icon="fas fa-trash" onclick={() => this.confirmDelete()} aria-label="delete" />);

    return items;
  }

  async confirmDelete() {
    let result = confirm('Are you sure you want to delete this file?');

    if (result) {
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

  viewFileInfo() {
    // TODO:
    console.log('view file info');
  }

  hideFile() {
    // TODO:
    console.log('hide file');
  }

  // Function to call when image fails to load
  handleImageError = () => {
    this.imageLoaded = false;
    m.redraw();
  };

  // Function to call when image loads successfully
  handleImageLoad = () => {
    this.imageLoaded = true;
    m.redraw();
  };

  onFileClick(file: File) {
    if (this.attrs.onFileSelect) {
      this.attrs.onFileSelect(file);
      return;
    }
  }
}
