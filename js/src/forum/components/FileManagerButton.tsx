import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import FileManagerModal from './FileManagerModal';
import Tooltip from 'flarum/common/components/Tooltip';
import type { EditorHost } from './FileManagerModal';

interface FileManagerButtonAttrs extends ComponentAttrs {
  uploader: any;
  /** The text editor's `composer` attr: files are inserted into its editor. */
  composer?: EditorHost;
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

    // Note: FileManagerModal is imported synchronously to avoid chunk ID collision
    // with Flarum core's ReplyComposer (both would get webpack chunk ID 378).
    // A text editor can sit inside a modal of its own (another extension's form).
    // Stack on top of it rather than replacing it, so what was written there survives.
    app.modal.show(
      FileManagerModal as any,
      {
        uploader: this.attrs.uploader,
        composer: this.attrs.composer,
      },
      !!this.element?.closest('.ModalManager')
    );
  }
}
