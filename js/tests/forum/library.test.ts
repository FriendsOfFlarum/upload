import { jest } from '@jest/globals';
import app from 'flarum/forum/app';
import { bootstrapForum } from '../bootstrap';
import { image, makeFile, page } from '../factory';
import FileLibraryState from '../../src/common/states/FileLibraryState';
import FileListState from '../../src/common/states/FileListState';
import { matchesRestriction } from '../../src/common/utils/fileRestriction';
import { filePreview } from '../../src/common/utils/filePreview';

beforeAll(() => bootstrapForum());

afterEach(() => jest.restoreAllMocks());

const user = () => app.session.user!;

describe('FileLibraryState', () => {
  it('asks /api/files for one user, or for shared files', async () => {
    const find = jest.spyOn(app.store, 'find').mockResolvedValue(page([]) as any);

    await new FileLibraryState('user', user()).load();
    await new FileLibraryState('shared').load();

    expect(find.mock.calls[0][0]).toBe('files');
    expect(find.mock.calls[0][1]).toMatchObject({ filter: { user: '1' }, page: { offset: 0 } });
    expect(find.mock.calls[1][1]).toMatchObject({ filter: { shared: true }, page: { offset: 0 } });
  });

  it('starts the next page after the files it holds, so an upload never repeats one', async () => {
    const first = [makeFile(), makeFile(), makeFile()];
    const find = jest
      .spyOn(app.store, 'find')
      .mockResolvedValueOnce(page(first, true) as any)
      .mockResolvedValueOnce(page([makeFile()]) as any);
    const state = new FileLibraryState('user', user());

    await state.load();
    state.added([makeFile()]);
    await state.loadMore();

    expect(find.mock.calls[1][1]).toMatchObject({ page: { offset: 4 } });
    expect(state.files()).toHaveLength(5);
  });

  it('drops a deleted file from every list showing it', async () => {
    const [keep, gone] = [makeFile(), makeFile()];
    jest.spyOn(app.store, 'find').mockResolvedValue(page([keep, gone]) as any);
    const state = new FileLibraryState('user', user());

    await state.load();
    gone.exists = false;

    expect(state.files()).toEqual([keep]);
  });

  it('drops a hidden file from My media, but keeps a private one among shared files', async () => {
    const hidden = makeFile({ hidden: true });
    const privateShared = makeFile({ shared: true, hidden: true, isPrivateShared: true });
    jest
      .spyOn(app.store, 'find')
      .mockResolvedValueOnce(page([hidden]) as any)
      .mockResolvedValueOnce(page([privateShared]) as any);

    const mine = new FileLibraryState('user', user());
    const shared = new FileLibraryState('shared');
    await mine.load();
    await shared.load();

    expect(mine.files()).toEqual([]);
    expect(shared.files()).toEqual([privateShared]);
  });

  it('lists a file once when two pages both return it', async () => {
    const file = makeFile();
    jest
      .spyOn(app.store, 'find')
      .mockResolvedValueOnce(page([file], true) as any)
      .mockResolvedValueOnce(page([file]) as any);
    const state = new FileLibraryState('user', user());

    await state.load();
    await state.loadMore();

    expect(state.files()).toEqual([file]);
  });

  it('remembers a failed load until a retry succeeds', async () => {
    jest
      .spyOn(app.store, 'find')
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(page([makeFile()]) as any);
    const state = new FileLibraryState('user', user());

    await state.load();
    expect(state.hasError()).toBe(true);
    expect(state.isEmpty()).toBe(true);

    await state.load();
    expect(state.hasError()).toBe(false);
    expect(state.files()).toHaveLength(1);
  });

  it('keeps a file uploaded while the list is still loading', async () => {
    const [uploaded, listed] = [makeFile(), makeFile()];
    let respond!: (value: any) => void;
    jest.spyOn(app.store, 'find').mockReturnValue(new Promise((resolve) => (respond = resolve)) as any);
    const state = new FileLibraryState('user', user());

    const loading = state.load();
    state.added([uploaded]);
    respond(page([listed]));
    await loading;

    expect(state.files()).toEqual([uploaded, listed]);
  });

  it('takes the profile count down when a file leaves My media', () => {
    const owner = user();
    owner.pushAttributes({ 'fof-upload-uploadCountCurrent': 3, 'fof-upload-uploadCountAll': 4 });

    new FileLibraryState('user', owner).removed(makeFile(), { deleted: true });
    new FileLibraryState('user', owner).removed(makeFile(), { deleted: false });

    expect(owner.attribute('fof-upload-uploadCountCurrent')).toBe(1);
    expect(owner.attribute('fof-upload-uploadCountAll')).toBe(3);
  });
});

describe('FileListState, kept for code that still uses it', () => {
  it('loads a user, lists files and pages the same way as before', async () => {
    const files = [makeFile(), makeFile()];
    jest.spyOn(app.store, 'find').mockResolvedValue(page(files, true) as any);
    const state = new FileListState();

    await expect(state.loadResults()).rejects.toBe('User not set');

    state.setUser(user());
    await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve));

    expect(state.files).toEqual(files);
    expect(state.hasMoreResults()).toBe(true);

    const added = makeFile();
    state.addToList(added);
    expect(state.files[0]).toBe(added);

    state.removeFromList(added);
    expect(state.files).toEqual(files);
  });
});

describe('restricting file types', () => {
  it.each([
    ['image/png', 'image', true],
    ['application/pdf', 'image', false],
    ['audio/ogg', 'audio', true],
    ['video/mp4', 'video', true],
    ['application/pdf', ['application/pdf', 'text/plain'], true],
    ['application/zip', ['application/pdf'], false],
    ['application/pdf', 'application/pdf', true],
    ['application/pdf', null, true],
  ])('%s against %p is %p', (type, restriction, expected) => {
    expect(matchesRestriction(type, restriction as any)).toBe(expected);
  });
});

describe('file previews', () => {
  it('prefers the thumbnail, at its own size', () => {
    expect(
      filePreview(image({ thumbnailUrl: 'https://cdn/t.webp', thumbnailWidth: 300, thumbnailHeight: 200, url: 'https://cdn/full.png' }))
    ).toEqual({
      src: 'https://cdn/t.webp',
      width: 300,
      height: 200,
    });
  });

  it('falls back to the file itself when there is no thumbnail', () => {
    expect(filePreview(image({ url: 'https://cdn/full.png', imageWidth: 40, imageHeight: 30 }))).toEqual({
      src: 'https://cdn/full.png',
      width: 40,
      height: 30,
    });
  });

  it('never previews a private shared file, whose URL logs a download', () => {
    expect(filePreview(image({ isPrivateShared: true, shared: true, hidden: true, url: 'https://example.com/api/fof/download/x' }))).toBeNull();
  });

  it('has no preview for a file that is not an image', () => {
    expect(filePreview(makeFile())).toBeNull();
  });
});
