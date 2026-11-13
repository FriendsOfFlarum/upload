import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import UploadButton from './components/UploadButton';
import DragAndDrop from './components/DragAndDrop';
import PasteClipboard from './components/PasteClipboard';
import Uploader from './handler/Uploader';
import FileManagerButton from './components/FileManagerButton';
import { insertWithDisplayNames, insertsAtSelection } from './utils/applyDisplayName';
import type File from '../common/models/File';

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
          composer: this.attrs.composer,
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

    // 'success' fires once per file, but a modal cannot be shown per file: core's
    // ModalManager closes any open modal when a new one is shown, so prompting in
    // this handler would leave only the last file's modal alive and silently drop
    // the rest. Files are collected here and inserted together on 'uploaded',
    // which fires once after the whole batch.
    const pending: File[] = [];

    this.uploader.on('success', (response: unknown) => {
      const { file, addBBcode } = response as { file: File; addBBcode: boolean };
      if (!addBBcode) return;

      pending.push(file);
    });

    this.uploader.on('uploaded', () => {
      if (!pending.length) return;

      const files = pending.splice(0, pending.length);
      const editor = this.attrs.composer.editor;

      if (!editor) return;

      const insertText = insertsAtSelection(editor);

      const insert = (bbcode: string) => {
        insertText(bbcode + '\n');

        if (typeof this.attrs.preview === 'function') {
          const originalIsFullScreen = app.composer.isFullScreen;
          app.composer.isFullScreen = () => false;
          this.attrs.preview!();
          app.composer.isFullScreen = originalIsFullScreen;
        }
      };

      // A text editor can sit inside another extension's modal: the prompt then
      // stacks on that modal, or is skipped if it is closing, since a modal shown
      // now would be the one core removes once the closing animation ends.
      const dialog = this.element?.closest('.ModalManager .Modal');

      if (!this.element?.isConnected || dialog?.classList.contains('out')) {
        insert(files.map((file) => file.bbcode()).join('\n'));

        return;
      }

      insertWithDisplayNames(files, insert, !!dialog);
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
