import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import FileManagerModal from './FileManagerModal';
import Tooltip from 'flarum/common/components/Tooltip';

export default class FileManagerButton extends Component {
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
   *
   * @param {PointerEvent} e
   */
  fileManagerButtonClicked(e) {
    e.preventDefault();

    // Open dialog
    app.modal.show(FileManagerModal, {
      uploader: this.attrs.uploader,
    });
  }
}
