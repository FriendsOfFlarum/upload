import { jest } from '@jest/globals';
import bootstrapAdmin from '@flarum/jest-config/src/bootstrap/admin';
import app from 'flarum/admin/app';
import m from 'mithril';
import mq from 'mithril-query';
import '../../../src/admin';
import FileManagerModal from '../../../src/common/components/FileManagerModal';
import Uploader from '../../../src/common/handler/Uploader';

beforeAll(() => {
  bootstrapAdmin();
  app.boot();
});

function modal(attrs: Record<string, unknown>) {
  const modal = Object.create(FileManagerModal.prototype);

  modal.attrs = attrs;
  modal.hide = jest.fn();

  return modal;
}

describe('Media manager on admin', () => {
  it('registers the user attributes it reads', () => {
    const user = app.session.user as any;

    expect(typeof user.uploadSharedFiles).toBe('function');
    expect(typeof user.accessSharedFiles).toBe('function');
  });

  it('renders with its upload button and lib strings', () => {
    jest.spyOn(app.store, 'find').mockResolvedValue([] as any);

    const rendered = mq(m(FileManagerModal as any, { uploader: new Uploader(), state: { key: 1 }, animateShow: () => {}, animateHide: () => {} }));

    expect(rendered).toHaveElement('.fof-file-manager-modal .fof-upload-button');
    expect(rendered).toContainRaw('fof-upload.lib.media_manager');
    expect(rendered).not.toContainRaw('fof-upload.forum.');
  });

  it('closes and hands the selected files to onSelect', () => {
    const onSelect = jest.fn();
    const fileManager = modal({ onSelect });
    fileManager.selectedFiles = ['1', '2'];

    fileManager.onSelect();

    expect(fileManager.hide).toHaveBeenCalled();
    expect(onSelect).toHaveBeenCalledWith(['1', '2']);
  });

  it('only closes without an onSelect callback', () => {
    const fileManager = modal({});
    fileManager.selectedFiles = ['1'];

    expect(() => fileManager.onSelect()).not.toThrow();
    expect(fileManager.hide).toHaveBeenCalled();
  });
});
