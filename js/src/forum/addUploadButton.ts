import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import UploadButton from './components/UploadButton';
import DragAndDrop from './components/DragAndDrop';
import PasteClipboard from './components/PasteClipboard';
import Uploader from './handler/Uploader';
import FileManagerButton from './components/FileManagerButton';

import TextEditor from 'flarum/common/components/TextEditor';

export default function addUploadButton(): void {
  extend(TextEditor.prototype, 'oninit', function (this: any) {
    this.uploader = new Uploader();
  });

  extend(TextEditor.prototype, 'controlItems', function (this: any, items) {
    if (!app.forum.attribute('fof-upload.canUpload')) return;

    const composerButtonVisiblity = app.forum.attribute('fof-upload.composerButtonVisiblity');

    if (composerButtonVisiblity === 'both' || composerButtonVisiblity === 'media-btn') {
      items.add(
        'fof-upload-media',
        FileManagerButton.component({
          uploader: this.uploader,
        })
      );
    }

    if (composerButtonVisiblity === 'both' || composerButtonVisiblity === 'upload-btn') {
      items.add(
        'fof-upload',
        UploadButton.component({
          uploader: this.uploader,
        })
      );
    }
  });

  extend(TextEditor.prototype, 'oncreate', function (this: any) {
    if (!app.forum.attribute('fof-upload.canUpload')) return;

    this.uploader.on('success', (response: unknown) => {
      const { file, addBBcode } = response as { file: { bbcode: () => string }; addBBcode: boolean };
      if (!addBBcode) return;

      this.attrs.composer.editor!.insertAtCursor(file.bbcode() + '\n', false);

      if (typeof this.attrs.preview === 'function') {
        const originalIsFullScreen = app.composer.isFullScreen;
        app.composer.isFullScreen = () => false;
        this.attrs.preview!();
        app.composer.isFullScreen = originalIsFullScreen;
      }
    });

    const dragAndDropTarget = (this as any).fofUploadDragAndDropTarget?.();
    if (dragAndDropTarget) {
      this.dragAndDrop = new DragAndDrop((files) => this.uploader.upload(files), dragAndDropTarget);
    }
  });

  // PasteClipboard must be attached in onbuild, not oncreate.
  // The .TextEditor-editor element (the textarea) is created by BasicEditorDriver
  // inside onbuild() — it does not exist yet when oncreate runs.
  extend(TextEditor.prototype, 'onbuild', function (this: any) {
    if (!app.forum.attribute('fof-upload.canUpload')) return;

    const editorEl = this.$('.TextEditor-editor')[0];
    if (editorEl) {
      this.fofPasteClipboard = new PasteClipboard((files) => this.uploader.upload(files), editorEl);
    }
  });

  extend(TextEditor.prototype, 'onremove', function (this: any) {
    if (!app.forum.attribute('fof-upload.canUpload')) return;
    if (this.dragAndDrop) {
      this.dragAndDrop.unload();
    }
  });

  (TextEditor.prototype as any).fofUploadDragAndDropTarget = function (this: any) {
    return this.$().parents('.Composer')[0] as unknown as Element | undefined;
  };
}
