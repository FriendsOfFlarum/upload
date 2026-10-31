import { jest } from '@jest/globals';
import app from 'flarum/forum/app';
import mq from 'mithril-query';
import { bootstrapForum } from '../bootstrap';
import { image, makeFile, page } from '../factory';
import FileCard from '../../src/common/components/FileCard';
import DisplayFile from '../../src/common/components/DisplayFile';
import FileManagerModal from '../../src/forum/components/FileManagerModal';
import type File from '../../src/common/models/File';

beforeAll(() => bootstrapForum());

afterEach(() => jest.restoreAllMocks());

const flush = () => new Promise((resolve) => setTimeout(resolve));

function modal(attrs: Record<string, unknown> = {}) {
  const animateHide = jest.fn();
  const out = mq(FileManagerModal, { state: app.modal, animateShow: (ready: () => void) => ready(), animateHide, ...attrs });

  return { out, animateHide };
}

const check = (out: any, file: File) => {
  const input = out.rootEl.querySelector(`.FileCard[data-id="${file.id()}"] input`) as HTMLInputElement;
  input.checked = !input.checked;
  out.trigger(`.FileCard[data-id="${file.id()}"] input`, 'change');
  out.redraw();
};

describe('FileCard', () => {
  it('is chosen with a real checkbox inside its label', () => {
    const file = makeFile();
    const onToggle = jest.fn();
    const out = mq(FileCard, { file, onToggle });

    expect(out.rootEl.querySelector('label.FileCard-body > input[type="checkbox"]')).not.toBeNull();

    out.trigger('input', 'change');
    expect(onToggle).toHaveBeenCalledWith(file);
  });

  it('uses radios sharing one name when only one file may be chosen', () => {
    const out = mq(FileCard, { file: makeFile(), multiple: false, name: 'library-1' });
    const input = out.rootEl.querySelector('input') as HTMLInputElement;

    expect(input.type).toBe('radio');
    expect(input.name).toBe('library-1');
  });

  it('is disabled with a visible reason when its type is not allowed', () => {
    const out = mq(FileCard, { file: makeFile(), selectable: false });

    expect((out.rootEl.querySelector('input') as HTMLInputElement).disabled).toBe(true);
    expect(out.rootEl.querySelector('.FileCard-reason')!.textContent).toBe("Can't be used here");
  });

  it('opens the file in a new tab when browsing, with no script involved', () => {
    const file = makeFile();
    const link = mq(FileCard, { file, mode: 'browse' }).rootEl.querySelector('a.FileCard-body') as HTMLAnchorElement;

    expect(link.getAttribute('href')).toBe(file.url());
    expect(link.target).toBe('_blank');
  });

  it('stays selectable after its preview fails to load', () => {
    const out = mq(FileCard, { file: image({ url: 'https://example.com/missing.png' }) });

    out.trigger('img', 'error');
    out.redraw();

    expect(out.rootEl.querySelector('img')).toBeFalsy();
    expect(out.rootEl.querySelector('.FileCard-icon')).toBeTruthy();
    expect((out.rootEl.querySelector('input') as HTMLInputElement).disabled).toBe(false);
  });

  it('shows a private shared file as private', () => {
    const out = mq(FileCard, { file: makeFile({ shared: true, hidden: true, isPrivateShared: true }) });

    expect(out.rootEl.querySelector('.Badge--hidden')!.getAttribute('aria-label')).toBe('Private');
  });

  it('keeps the hide-file and delete-file action keys, each behind its permission', () => {
    const card = new FileCard();
    (card as any).attrs = { file: makeFile() };
    expect(card.actionItems().has('hide-file')).toBe(true);
    expect(card.actionItems().has('delete-file')).toBe(true);

    (card as any).attrs = { file: makeFile({ canHide: false, canDelete: false }) };
    expect(card.actionItems().isEmpty()).toBe(true);
  });

  it('stays usable when the hide confirmation is cancelled', async () => {
    const card = new FileCard();
    (card as any).attrs = { file: makeFile() };
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    const request = jest.spyOn(app, 'request');

    await card.toggleHidden();

    expect(request).not.toHaveBeenCalled();
    expect(card.busy).toBe(false);
  });

  it('deletes through the files endpoint and reports the removal once', async () => {
    const file = makeFile();
    const onRemoved = jest.fn();
    const card = new FileCard();
    (card as any).attrs = { file, onRemoved };
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    const request = jest.spyOn(app, 'request').mockResolvedValue(undefined as any);

    await card.delete();

    expect(request.mock.calls[0][0]).toMatchObject({ method: 'DELETE', url: `https://example.com/api/files/${file.id()}` });
    expect(file.exists).toBe(false);
    expect(onRemoved).toHaveBeenCalledWith(file, { deleted: true });
  });

  it('still answers to its old attribute names as DisplayFile', () => {
    const file = makeFile();
    const onFileClick = jest.fn();
    const out = mq(DisplayFile, { file, fileSelectable: true, isSelected: true, onFileClick });

    expect((out.rootEl.querySelector('input') as HTMLInputElement).checked).toBe(true);
    out.trigger('input', 'change');
    expect(onFileClick).toHaveBeenCalledWith(file);
  });
});

describe('FileManagerModal', () => {
  const sessionUser = () => app.session.user!;

  afterEach(() => sessionUser().pushAttributes({ 'fof-upload-accessSharedFiles': true, 'fof-upload-uploadSharedFiles': true }));

  it('shows My media and Shared media as tabs', () => {
    jest.spyOn(app.store, 'find').mockResolvedValue(page([]) as any);
    const tabs = modal().out.rootEl.querySelectorAll('[role="tab"]');

    expect(Array.from(tabs).map((tab) => tab.textContent)).toEqual(['My media', 'Shared media']);
  });

  it('offers the shared library to someone who may only upload shared files', () => {
    jest.spyOn(app.store, 'find').mockResolvedValue(page([]) as any);
    sessionUser().pushAttributes({ 'fof-upload-accessSharedFiles': false, 'fof-upload-uploadSharedFiles': true });

    expect(modal().out.rootEl.querySelector('[data-library="shared"]')).not.toBeNull();
  });

  it('shows only My media, with no tabs, without shared access', () => {
    jest.spyOn(app.store, 'find').mockResolvedValue(page([]) as any);
    sessionUser().pushAttributes({ 'fof-upload-accessSharedFiles': false, 'fof-upload-uploadSharedFiles': false });

    expect(modal().out.rootEl.querySelector('[role="tab"]')).toBeFalsy();
  });

  it('hides the shared library, tab and content, when asked to', async () => {
    const find = jest.spyOn(app.store, 'find').mockResolvedValue(page([]) as any);
    const { out } = modal({ hideShared: true, defaultFilesLibrary: 'shared' });
    await flush();

    expect(out.rootEl.querySelector('[role="tab"]')).toBeFalsy();
    expect(find.mock.calls.every((call) => !(call[1] as any).filter.shared)).toBe(true);
  });

  it('keeps picked files in the order they were picked', async () => {
    const [a, b, c] = [makeFile(), makeFile(), makeFile()];
    jest.spyOn(app.store, 'find').mockResolvedValue(page([a, b, c]) as any);
    const onSelect = jest.fn();
    const { out, animateHide } = modal({ onSelect });
    await flush();
    out.redraw();

    check(out, c);
    check(out, a);
    expect(out.rootEl.querySelector('.FileManagerModal-count')!.textContent).toBe('2 files selected');

    out.trigger('form', 'submit');

    expect(animateHide).toHaveBeenCalled();
    expect(onSelect).toHaveBeenCalledWith([c.id(), a.id()], [c, a]);
  });

  it('inserts once when Insert is pressed twice', async () => {
    const file = makeFile();
    jest.spyOn(app.store, 'find').mockResolvedValue(page([file]) as any);
    const onSelect = jest.fn();
    const { out } = modal({ onSelect });
    await flush();
    out.redraw();

    check(out, file);
    out.trigger('form', 'submit');
    out.trigger('form', 'submit');

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('replaces the pick when only one file may be chosen', async () => {
    const [a, b] = [image(), image()];
    jest.spyOn(app.store, 'find').mockResolvedValue(page([a, b]) as any);
    const onSelect = jest.fn();
    const { out } = modal({ multiSelect: false, onSelect });
    await flush();
    out.redraw();

    check(out, a);
    check(out, b);
    out.trigger('form', 'submit');

    expect(onSelect).toHaveBeenCalledWith([b.id()], [b]);
  });

  it('does not insert a file deleted after it was picked', async () => {
    const [kept, deleted] = [makeFile(), makeFile()];
    jest.spyOn(app.store, 'find').mockResolvedValue(page([kept, deleted]) as any);
    const onSelect = jest.fn();
    const { out } = modal({ onSelect });
    await flush();
    out.redraw();

    check(out, kept);
    check(out, deleted);
    deleted.exists = false;
    out.trigger('form', 'submit');

    expect(onSelect).toHaveBeenCalledWith([kept.id()], [kept]);
  });

  it('refuses files outside restrictFileType, and does not pick them after an upload either', async () => {
    const [pdf, png] = [makeFile(), image()];
    jest.spyOn(app.store, 'find').mockResolvedValue(page([pdf, png]) as any);
    const { out } = modal({ restrictFileType: 'image' });
    await flush();
    out.redraw();

    expect((out.rootEl.querySelector(`.FileCard[data-id="${pdf.id()}"] input`) as HTMLInputElement).disabled).toBe(true);

    let instance!: FileManagerModal;
    class Captured extends FileManagerModal {
      oninit(vnode: any) {
        super.oninit(vnode);
        instance = this;
      }
    }
    mq(Captured, { state: app.modal, animateShow: () => {}, animateHide: () => {}, restrictFileType: 'image' });

    instance.autoSelect([makeFile()]);
    expect(instance.validSelection()).toEqual([]);

    const allowed = image();
    instance.autoSelect([allowed]);
    expect(instance.validSelection()).toEqual([allowed]);
  });

  it('inserts every picked file into the editor it was opened from, in one go', async () => {
    const [a, b] = [image(), image()];
    jest.spyOn(app.store, 'find').mockResolvedValue(page([a, b]) as any);
    const insertAtCursor = jest.fn();
    const { out } = modal({ composer: { editor: { insertAtCursor } } });
    await flush();
    out.redraw();

    check(out, a);
    check(out, b);
    out.trigger('form', 'submit');
    await flush();

    expect(insertAtCursor).toHaveBeenCalledTimes(1);
    expect(insertAtCursor).toHaveBeenCalledWith(`${a.bbcode()}\n${b.bbcode()}\n`, false);
  });
});
