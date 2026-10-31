import { jest } from '@jest/globals';
import app from 'flarum/forum/app';
import extractText from 'flarum/common/utils/extractText';
import { bootstrapForum } from '../bootstrap';
import { fileData, makeFile } from '../factory';
import Uploader from '../../src/forum/handler/Uploader';
import FileDropTarget from '../../src/common/utils/FileDropTarget';
import DragAndDrop from '../../src/forum/components/DragAndDrop';
import DisplayNameModal from '../../src/forum/components/DisplayNameModal';
import UploadSharedFileModal from '../../src/common/components/UploadSharedFileModal';
import { applyDisplayName, bbcodesWithDisplayNames, sanitizeDisplayName } from '../../src/forum/utils/applyDisplayName';

beforeAll(() => bootstrapForum());

afterEach(() => jest.restoreAllMocks());

const native = (name: string, type = 'application/pdf') => new File(['x'], name, { type });

function respondTo(outcomes: Array<'ok' | 'fail'>) {
  let call = 0;

  return jest.spyOn(app, 'request').mockImplementation(async (options: any) => {
    const outcome = outcomes[call++];

    if (outcome === 'fail') {
      const error: any = { alert: { content: 'Uploading files of this type is not allowed.', controls: [] } };
      await options.errorHandler(error);
      throw error;
    }

    return { data: [fileData({}, `up-${call}`)] } as any;
  });
}

describe('Uploader', () => {
  it('sends each file on its own, so one failure names its file and the rest still upload', async () => {
    const request = respondTo(['ok', 'fail', 'ok']);
    const alerts = jest.spyOn(app.alerts, 'show').mockReturnValue(0 as any);
    const uploader = new Uploader();
    const success = jest.fn();
    const failure = jest.fn();
    const uploaded = jest.fn();

    uploader.on('success', success);
    uploader.on('failure', failure);
    uploader.on('uploaded', uploaded);

    await uploader.upload([native('a.pdf'), native('b.exe'), native('c.pdf')]);

    expect(request).toHaveBeenCalledTimes(3);
    expect(success).toHaveBeenCalledTimes(2);
    expect((failure.mock.calls[0][0] as any).file.name).toBe('b.exe');
    expect(uploaded).toHaveBeenCalledTimes(1);
    expect((uploaded.mock.calls[0][0] as any).files).toHaveLength(2);
    expect(extractText((alerts.mock.calls[0] as any)[1])).toBe('b.exe could not be uploaded. Uploading files of this type is not allowed.');
  });

  it('says what the server said about its own errors, not a generic message', async () => {
    jest.spyOn(app, 'request').mockImplementation(async (options: any) => {
      const error: any = {
        status: 400,
        alert: { content: 'Oops! Something went wrong.', controls: [] },
        response: { errors: [{ code: 'fof-upload.no_files_made_it_to_upload', detail: 'Please upload files no larger than 2048 kb.' }] },
      };
      await options.errorHandler(error);
      throw error;
    });
    const alerts = jest.spyOn(app.alerts, 'show').mockReturnValue(0 as any);

    await new Uploader().upload([native('huge.zip', 'application/zip')]);

    expect(extractText((alerts.mock.calls[0] as any)[1])).toBe('huge.zip could not be uploaded. Please upload files no larger than 2048 kb.');
  });

  it('can still be told it is not uploading, as older code did', () => {
    const uploader = new Uploader();

    expect(() => ((uploader as any).uploading = false)).not.toThrow();
  });

  it('is busy only while a batch is under way', async () => {
    respondTo(['ok']);
    const uploader = new Uploader();
    const pending = uploader.upload([native('a.pdf')]);

    expect(uploader.uploading).toBe(true);
    await pending;
    expect(uploader.uploading).toBe(false);
  });

  it('tells the success listener whether to insert, as before', async () => {
    respondTo(['ok']);
    const uploader = new Uploader();
    const success = jest.fn();
    uploader.on('success', success);

    await uploader.upload([native('a.pdf')], false);

    expect((success.mock.calls[0][0] as any).addBBcode).toBe(false);
  });

  it('stops calling a listener once it is removed or the uploader is disposed', async () => {
    respondTo(['ok', 'ok']);
    const uploader = new Uploader();
    const removed = jest.fn();
    const disposed = jest.fn();
    uploader.on('success', removed);
    uploader.off('success', removed);
    uploader.on('uploaded', disposed);
    uploader.dispose();

    await uploader.upload([native('a.pdf')]);

    expect(removed).not.toHaveBeenCalled();
    expect(disposed).not.toHaveBeenCalled();
  });

  it('counts an upload on the uploader’s profile', async () => {
    respondTo(['ok']);
    app.session.user!.pushAttributes({ 'fof-upload-uploadCountCurrent': 3, 'fof-upload-uploadCountAll': 4 });

    await new Uploader().upload([native('a.pdf')]);

    expect(app.session.user!.attribute('fof-upload-uploadCountCurrent')).toBe(4);
  });
});

describe('FileDropTarget', () => {
  const drag = (type: string, types: string[] = ['Files'], files: File[] = []) => {
    const event = new Event(type, { bubbles: true, cancelable: true }) as any;
    event.dataTransfer = { types, files: Object.assign(files, { item: (i: number) => files[i] }), dropEffect: 'none' };

    return event;
  };

  it('is still exported as DragAndDrop', () => {
    expect(DragAndDrop).toBe(FileDropTarget);
  });

  it('stays highlighted while a file is dragged across its children', () => {
    const element = document.createElement('div');
    new FileDropTarget(() => {}, element);

    element.dispatchEvent(drag('dragenter'));
    element.dispatchEvent(drag('dragenter'));
    element.dispatchEvent(drag('dragleave'));
    expect(element.classList.contains('fof-upload-dragging')).toBe(true);

    element.dispatchEvent(drag('dragleave'));
    expect(element.classList.contains('fof-upload-dragging')).toBe(false);
  });

  it('ignores dragged text and links', () => {
    const element = document.createElement('div');
    new FileDropTarget(() => {}, element);

    const event = drag('dragenter', ['text/plain']);
    element.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(element.classList.contains('fof-upload-dragging')).toBe(false);
  });

  it('keeps a refused drop from the browser without uploading it', () => {
    const element = document.createElement('div');
    const upload = jest.fn();
    new FileDropTarget(upload, element, { accepts: () => false });

    const event = drag('drop', ['Files'], [native('a.pdf')]);
    element.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(upload).not.toHaveBeenCalled();
  });

  it('uploads dropped files and stops listening when unloaded', () => {
    const element = document.createElement('div');
    const upload = jest.fn();
    const target = new FileDropTarget(upload, element);

    element.dispatchEvent(drag('drop', ['Files'], [native('a.pdf')]));
    expect(upload).toHaveBeenCalledTimes(1);

    target.unload();
    element.dispatchEvent(drag('drop', ['Files'], [native('b.pdf')]));
    expect(upload).toHaveBeenCalledTimes(1);
  });
});

describe('UploadSharedFileModal', () => {
  it('does not close another modal when it was itself closed during the upload', async () => {
    let respond!: () => void;
    jest
      .spyOn(app, 'request')
      .mockImplementation(() => new Promise((resolve) => (respond = () => resolve({ data: [fileData({ shared: true })] }))) as any);
    const animateHide = jest.fn();
    const onUploadComplete = jest.fn();
    const modal = new UploadSharedFileModal();
    (modal as any).attrs = { animateHide, onUploadComplete, files: [native('a.pdf')] };
    modal.oninit({ attrs: (modal as any).attrs } as any);

    const uploading = modal.onsubmit({ preventDefault() {} } as any);
    modal.onremove({ dom: document.createElement('div') } as any);
    respond();
    await uploading;

    expect(onUploadComplete).toHaveBeenCalledTimes(1);
    expect(animateHide).not.toHaveBeenCalled();
  });
});

describe('naming downloads', () => {
  it('cannot break out of its tag', () => {
    expect(sanitizeDisplayName(' A [b]\nreport ')).toBe('A b report');
    expect(applyDisplayName('[upl-file uuid=1 size=1kB]a.pdf[/upl-file]', 'Spec [/upl-file] sheet')).toBe(
      '[upl-file uuid=1 size=1kB]Spec /upl-file sheet[/upl-file]'
    );
  });

  it('inserts files without a label straight away', async () => {
    const show = jest.spyOn(app.modal, 'show');
    const picture = makeFile({ tag: 'image-preview', bbcode: '[upl-image-preview uuid=1 url=u]' });

    await expect(bbcodesWithDisplayNames([picture])).resolves.toEqual(['[upl-image-preview uuid=1 url=u]']);
    expect(show).not.toHaveBeenCalled();
  });

  it('asks once for the batch, on top of any open modal, and keeps the order', async () => {
    const show = jest.spyOn(app.modal, 'show').mockResolvedValue(undefined);
    const picture = makeFile({ tag: 'image-preview', bbcode: '[upl-image-preview uuid=1 url=u]' });
    const pdf = makeFile();

    const result = bbcodesWithDisplayNames([pdf, picture]);
    const [, attrs, stacked] = show.mock.calls[0] as any;

    expect(stacked).toBe(true);
    expect(attrs.files).toEqual([pdf]);

    attrs.onsubmit({ [pdf.id()!]: 'Spec sheet' });

    await expect(result).resolves.toEqual([applyDisplayName(pdf.bbcode(), 'Spec sheet'), picture.bbcode()]);
  });

  it('keeps the file names when the prompt is dismissed', async () => {
    const show = jest.spyOn(app.modal, 'show').mockResolvedValue(undefined);
    const pdf = makeFile();

    const result = bbcodesWithDisplayNames([pdf]);
    (show.mock.calls[0] as any)[1].onsubmit({});

    await expect(result).resolves.toEqual([pdf.bbcode()]);
  });

  it('reports its names exactly once, after it has closed, however it was closed', () => {
    const onsubmit = jest.fn();
    const modal = new DisplayNameModal();
    (modal as any).attrs = { files: [makeFile()], onsubmit, animateHide: () => {} };
    modal.oninit({ attrs: (modal as any).attrs } as any);

    (modal as any).onremove({ dom: document.createElement('div') });

    expect(onsubmit).toHaveBeenCalledTimes(1);
    expect(onsubmit).toHaveBeenCalledWith({});
  });
});
