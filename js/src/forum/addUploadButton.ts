import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import TextEditor from 'flarum/common/components/TextEditor';
import UploadButton from './components/UploadButton';
import FileDropTarget from '../common/utils/FileDropTarget';
import PasteClipboard from './components/PasteClipboard';
import Uploader from './handler/Uploader';
import FileManagerButton from './components/FileManagerButton';
import { bbcodesWithDisplayNames } from './utils/applyDisplayName';
import type File from '../common/models/File';

export default function addUploadButton(): void {
  extend(TextEditor.prototype, 'oninit', function (this: any) {
    this.uploader = new Uploader();
  });

  extend(TextEditor.prototype, 'controlItems', function (this: any, items) {
    if (!app.forum.attribute('fof-upload.canUpload')) return;

    const visibility = app.forum.attribute<string>('fof-upload.composerButtonVisiblity');
    const showMedia = visibility !== 'upload-btn';
    const showUpload = visibility !== 'media-btn';

    if (showMedia) {
      items.add(
        'fof-upload-media',
        FileManagerButton.component({
          composer: this.attrs.composer,
          disabled: this.disabled,
          loading: !showUpload && this.uploader.uploading,
        })
      );
    }

    if (showUpload) {
      items.add('fof-upload', UploadButton.component({ uploader: this.uploader, disabled: this.disabled }));
    }
  });

  extend(TextEditor.prototype, 'oncreate', function (this: any) {
    if (!app.forum.attribute('fof-upload.canUpload')) return;

    // A batch is inserted once it has finished, into this editor only, and only while it is still open.
    const pending: File[] = [];

    this.uploader.on('success', ({ file, addBBcode }: { file: File; addBBcode: boolean }) => {
      if (addBBcode) pending.push(file);
    });

    this.uploader.on('uploaded', () => {
      const files = pending.splice(0, pending.length);

      if (!files.length || !this.element?.isConnected) return;

      bbcodesWithDisplayNames(files).then((bbcodes) => {
        if (this.element?.isConnected) this.attrs.composer.editor?.insertAtCursor(bbcodes.join('\n') + '\n', false);
      });
    });

    const target = this.fofUploadDragAndDropTarget?.();

    if (target) {
      this.dragAndDrop = new FileDropTarget((files) => this.uploader.upload(files), target, { accepts: () => !this.disabled });
    }
  });

  // The textarea is created by the editor driver in onbuild, after oncreate.
  extend(TextEditor.prototype, 'onbuild', function (this: any) {
    if (!app.forum.attribute('fof-upload.canUpload')) return;

    const editorEl = this.$('.TextEditor-editor')[0];

    if (editorEl) {
      this.fofPasteClipboard = new PasteClipboard((files) => this.uploader.upload(files), editorEl);
    }
  });

  extend(TextEditor.prototype, 'onremove', function (this: any) {
    this.dragAndDrop?.unload();
    this.uploader?.dispose();
  });

  (TextEditor.prototype as any).fofUploadDragAndDropTarget = function (this: any) {
    return this.$().parents('.Composer')[0] as unknown as Element | undefined;
  };
}
