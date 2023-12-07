import Component, { ComponentAttrs } from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import mimeToIcon from '../mimeToIcon';
import File from '../models/File';
import icon from 'flarum/common/helpers/icon';

interface CustomAttrs extends ComponentAttrs {
  file: File;
}

export default class UploadedFile extends Component<CustomAttrs> {
  file!: File;
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
      <div className="UploadedFile">
        <div className="UploadedFile--sharestatus">
          <span>{icon(statusIcon)}</span>
        </div>
        <div className="UploadedFile--preview">
          {isImage ? (
            this.imageLoaded ? (
              <img src={this.file.url()} loading="lazy" onerror={this.handleImageError} onload={this.handleImageLoad} />
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

    items.add('hide-file', <Button className="Button Button--icon" icon="fas fa-eye-slash" onclick={() => this.hideFile()} aria-label="hide" />);

    items.add('delete', <Button className="Button Button--icon" icon="fas fa-trash" onclick={() => this.confirmDelete()} aria-label="delete" />);

    return items;
  }

  confirmDelete() {
    let result = confirm('Are you sure you want to delete this file?');

    if (result) {
      this.file.delete();
      //TODO: setup callback to remove file from list
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
}
