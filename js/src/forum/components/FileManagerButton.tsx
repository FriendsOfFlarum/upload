import app from 'flarum/forum/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import FileManagerModal from './FileManagerModal';
import Tooltip from 'flarum/common/components/Tooltip';
import { insertWithDisplayName } from '../utils/applyDisplayName';
import type File from '../../common/models/File';

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

    // Note: FileManagerModal is imported synchronously to avoid chunk ID collision
    // with Flarum core's ReplyComposer (both would get webpack chunk ID 378).
    app.modal.show(FileManagerModal as any, {
      uploader: this.attrs.uploader,
      onSelect: this.insertFiles.bind(this),
    });
  }

  /**
   * Insert the files picked in the media manager into the composer.
   */
  insertFiles(fileIds: string[]) {
    const files = fileIds
      .map((fileId) => (app.store.getById('files', fileId) || app.store.getById('shared-files', fileId)) as File | undefined)
      .filter((file): file is File => !!file && typeof file.bbcode === 'function');

    if (!app.composer.editor) return;

    const insert = (bbcode: string) => app.composer.editor!.insertAtCursor(bbcode + '\n', false);

    // Prompting per file would mean a chain of modals, so the display name is
    // only offered when a single file is being inserted. Multi-select keeps the
    // file names, which the author can still edit in the composer afterwards.
    if (files.length === 1) {
      insertWithDisplayName(files[0], insert);

      return;
    }

    files.forEach((file) => insert(file.bbcode()));
  }
}
