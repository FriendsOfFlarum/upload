import { jest } from '@jest/globals';
import bootstrapForum from '@flarum/jest-config/src/bootstrap/forum';
import app from 'flarum/forum/app';
import FileManagerButton from '../../../src/forum/components/FileManagerButton';
import FileManagerModal from '../../../src/forum/components/FileManagerModal';
import { insertWithDisplayNames, insertsAtSelection } from '../../../src/forum/utils/applyDisplayName';

beforeAll(() => {
  bootstrapForum();
  app.boot();
});

/** A file as FoF Upload's model exposes it, with the given template. */
function file(id: string, tag: string): any {
  return {
    id: () => id,
    tag: () => tag,
    baseName: () => `file-${id}.pdf`,
    bbcode: () => `[upl-${tag} uuid=${id}]file-${id}.pdf[/upl-${tag}]`,
  };
}

/** An editor driver whose cursor sits at `cursor`. */
function editor(cursor = 0): any {
  return { getSelectionRange: () => [cursor, cursor], insertAt: jest.fn(), insertAtCursor: jest.fn() };
}

/** Another extension's text editor, inside a modal of its own. */
function editorHost(cursor = 0) {
  return { editor: editor(cursor) };
}

let show: any;

beforeEach(() => {
  show = jest.spyOn(app.modal, 'show').mockResolvedValue(undefined);
  app.composer.editor = editor();
});

afterEach(() => {
  show.mockRestore();
  jest.restoreAllMocks();
  app.composer.editor = null;
});

function openModal(open: boolean) {
  jest.spyOn(app.modal, 'isModalOpen').mockReturnValue(open);
}

describe('Media manager button', () => {
  function click(composer: any, inDialog: boolean) {
    const button = Object.create(FileManagerButton.prototype);
    button.attrs = { uploader: {}, composer };
    button.element = { closest: (selector: string) => (inDialog && selector === '.ModalManager' ? {} : null) };
    button.fileManagerButtonClicked({ preventDefault() {} } as any);
  }

  it('replaces nothing in the forum composer, as before', () => {
    click(app.composer, false);

    expect(show).toHaveBeenCalledWith(FileManagerModal, expect.objectContaining({ composer: app.composer }), false);
  });

  it('stacks on top of a modal the editor sits in, instead of closing it', () => {
    const host = editorHost();
    click(host, true);

    expect(show).toHaveBeenCalledWith(FileManagerModal, expect.objectContaining({ composer: host }), true);
  });
});

describe('Inserting from the media manager', () => {
  function select(files: any[], composer?: any) {
    jest.spyOn(app.store, 'getById').mockImplementation(((type: string, id: string) => files.find((f) => f.id() === id)) as any);

    const attrs = { uploader: { setState() {}, on() {} }, composer, animateHide: (closed: () => void) => closed() };
    const modal = Object.create(FileManagerModal.prototype);
    modal.oninit({ attrs });
    modal.selectedFiles = files.map((f) => f.id());
    modal.onSelect();
  }

  it('inserts into the editor it was opened from, not the forum composer', () => {
    const host = editorHost();
    openModal(true);
    select([file('1', 'image-preview')], host);

    expect(host.editor.insertAt).toHaveBeenCalledWith(0, '[upl-image-preview uuid=1]file-1.pdf[/upl-image-preview]\n', false);
    expect(app.composer.editor!.insertAt).not.toHaveBeenCalled();
  });

  it('still inserts into the forum composer when opened without an editor host', () => {
    openModal(false);
    select([file('1', 'image-preview'), file('2', 'image-preview')]);

    // Both files go in as one insert, so an editor that inserts asynchronously can't reorder them.
    expect(app.composer.editor!.insertAt).toHaveBeenCalledWith(
      0,
      '[upl-image-preview uuid=1]file-1.pdf[/upl-image-preview]\n[upl-image-preview uuid=2]file-2.pdf[/upl-image-preview]\n',
      false
    );
    expect(app.composer.editor!.insertAtCursor).not.toHaveBeenCalled();
  });

  it('asks for the display name on top of the form, then inserts into its editor', () => {
    const host = editorHost(12);
    openModal(true);
    select([file('1', 'file')], host);

    expect(show).toHaveBeenCalledTimes(1);
    const [, attrs, stacked] = show.mock.calls[0];
    expect(stacked).toBe(true);

    attrs.onsubmit({ '1': 'Rules' });

    expect(host.editor.insertAt).toHaveBeenCalledWith(12, '[upl-file uuid=1]Rules[/upl-file]\n', false);
    expect(app.composer.editor!.insertAt).not.toHaveBeenCalled();
  });
});

describe('Display name prompt after a direct upload', () => {
  it('stacks on top of an open modal instead of replacing it', () => {
    openModal(true);
    insertWithDisplayNames([file('1', 'text-preview')], jest.fn());

    expect(show.mock.calls[0][2]).toBe(true);
  });

  it('opens on its own when nothing else is open, as before', () => {
    openModal(false);
    insertWithDisplayNames([file('1', 'image')], jest.fn());

    expect(show.mock.calls[0][2]).toBe(false);
  });

  it('replaces an unrelated modal when the editor is not inside one, as before', () => {
    openModal(true);
    insertWithDisplayNames([file('1', 'file')], jest.fn(), false);

    expect(show.mock.calls[0][2]).toBe(false);
  });

  it('is not shown for templates without a label', () => {
    const insert = jest.fn();
    openModal(true);
    insertWithDisplayNames([file('1', 'image-preview')], insert);

    expect(show).not.toHaveBeenCalled();
    expect(insert).toHaveBeenCalledTimes(1);
  });
});

describe('Where the file goes', () => {
  it('goes where the cursor was before the prompt took focus', () => {
    const driver = editor(7);
    const insert = insertsAtSelection(driver);

    // The prompt has focus now: the driver would report (and insert at) the start.
    driver.getSelectionRange = () => [0, 0];
    insert('a');
    insert('b');

    expect(driver.insertAt).toHaveBeenCalledWith(7, 'a', false);
    expect(driver.insertAtCursor).toHaveBeenCalledWith('b', false);
  });

  it('goes before selected text and keeps it, like insertAtCursor', () => {
    const driver = editor();
    driver.getSelectionRange = () => [3, 9];

    insertsAtSelection(driver)('x');

    expect(driver.insertAt).toHaveBeenCalledWith(3, 'x', false);
  });
});
