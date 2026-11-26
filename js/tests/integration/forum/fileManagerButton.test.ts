import { jest } from '@jest/globals';
import bootstrapForum from '@flarum/jest-config/src/bootstrap/forum';
import app from 'flarum/forum/app';
import '../../../src/forum';
import FileManagerButton from '../../../src/forum/components/FileManagerButton';
import FileManagerModal from '../../../src/common/components/FileManagerModal';
import ForumFileManagerModal from '../../../src/forum/components/FileManagerModal';
import Uploader from '../../../src/common/handler/Uploader';
import ForumUploader from '../../../src/forum/handler/Uploader';
import UploadButton from '../../../src/common/components/UploadButton';
import ForumUploadButton from '../../../src/forum/components/UploadButton';
import DragAndDrop from '../../../src/common/components/DragAndDrop';
import ForumDragAndDrop from '../../../src/forum/components/DragAndDrop';
import File from '../../../src/common/models/File';

beforeAll(() => {
  bootstrapForum();
  app.boot();
  app.store.models.files = File;
});

function button() {
  const button = Object.create(FileManagerButton.prototype);

  button.attrs = { uploader: new Uploader() };

  return button;
}

function pushFile(id: string, bbcode: string) {
  app.store.pushObject({ type: 'files', id, attributes: { bbcode, tag: 'image-preview' } });
}

describe('Media manager button', () => {
  it('keeps the forum module paths pointing at the common modules', () => {
    expect(ForumFileManagerModal).toBe(FileManagerModal);
    expect(ForumUploader).toBe(Uploader);
    expect(ForumUploadButton).toBe(UploadButton);
    expect(ForumDragAndDrop).toBe(DragAndDrop);
  });

  it('opens the media manager with the composer insert as its onSelect', () => {
    const show = jest.spyOn(app.modal, 'show').mockResolvedValue(undefined);

    button().fileManagerButtonClicked({ preventDefault() {} } as PointerEvent);

    expect(show).toHaveBeenCalledWith(FileManagerModal, expect.objectContaining({ onSelect: expect.any(Function) }));

    show.mockRestore();
  });

  it('inserts the selected files into the composer', () => {
    const insertAtCursor = jest.fn();
    app.composer.editor = { insertAtCursor } as any;
    pushFile('1', '[upl-image-preview url=a]');
    pushFile('2', '[upl-image-preview url=b]');

    button().insertFiles(['1', '2']);

    expect(insertAtCursor).toHaveBeenNthCalledWith(1, '[upl-image-preview url=a]\n', false);
    expect(insertAtCursor).toHaveBeenNthCalledWith(2, '[upl-image-preview url=b]\n', false);
  });
});
