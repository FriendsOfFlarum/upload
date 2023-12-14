import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import FileManagerModal from './FileManagerModal';
import Tooltip from 'flarum/common/components/Tooltip';

interface FileManagerButtonAttrs extends ComponentAttrs {
  uploader: any;
}

export default class FileManagerButton extends Component<FileManagerButtonAttrs> {
  view() {
    return (
      <Tooltip text={app.translator.trans('fof-upload.forum.buttons.media')}>
        {Button.component({
          className: 'Button fof-upload-button Button--icon',
          onclick: this.fileManagerButtonClicked.bind(this),
          icon: 'fas fa-photo-video',
        })}
      </Tooltip>
    );
  }

  /**
   * Event handler for upload button being clicked
   */
  fileManagerButtonClicked(e: PointerEvent) {
    e.preventDefault();

    // Open dialog
    app.modal.show(FileManagerModal, {
      uploader: this.attrs.uploader,
    });
  }
}
