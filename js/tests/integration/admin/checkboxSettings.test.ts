import bootstrapAdmin from '@flarum/jest-config/src/bootstrap/admin';
import app from 'flarum/admin/app';
import '../../../src/admin';
import UploadPage from '../../../src/admin/components/UploadPage';

beforeAll(() => {
  bootstrapAdmin();
  app.boot();
});

/**
 * A saved toggle reaches the page as '1' or '', but one with only an
 * Extend\Settings default arrives as a boolean: generateThumbnails and
 * thumbnailWebp default to true.
 */
const TOGGLES = ['generateThumbnails', 'thumbnailWebp', 'mustResize'];

function initPage(settings: Record<string, unknown>) {
  app.data.extensions['fof-upload'] = { id: 'fof-upload', extra: { 'flarum-extension': { title: 'Upload' } } } as any;

  TOGGLES.forEach((key) => delete app.data.settings[`fof-upload.${key}`]);
  Object.assign(app.data.settings, {
    // A stored file-type rule, so oninit does not seed one and mark the page unsaved.
    'fof-upload.mimeTypes': JSON.stringify({ '^image\\/png$': { adapter: 'local', template: 'just-url' } }),
    ...settings,
  });

  const page = new (UploadPage as any)() as UploadPage;
  page.oninit({ attrs: { id: 'fof-upload' } } as any);

  return page;
}

async function submittedSettings(page: UploadPage): Promise<Record<string, unknown>> {
  const request = app.request;
  let body: Record<string, unknown> = {};

  app.request = ((options: { body: Record<string, unknown> }) => {
    body = options.body;
    return Promise.resolve({});
  }) as any;

  try {
    page.onsubmit(new Event('submit'));
    await Promise.resolve();
  } finally {
    app.request = request;
  }

  return body;
}

describe('Toggle settings', () => {
  it('shows toggles that only have a true default as on', () => {
    const page = initPage({ 'fof-upload.generateThumbnails': true, 'fof-upload.thumbnailWebp': true });

    expect(page.values.generateThumbnails()).toBe(true);
    expect(page.values.thumbnailWebp()).toBe(true);
    expect(page.changed()).toBe(false);
    expect(page.tabChanged('images')).toBe(false);
  });

  it('keeps them on when another setting is saved', async () => {
    const page = initPage({ 'fof-upload.generateThumbnails': true, 'fof-upload.thumbnailWebp': true });

    page.values.cdnUrl('https://cdn.example.com');
    const body = await submittedSettings(page);

    expect(body['fof-upload.generateThumbnails']).toBe(true);
    expect(body['fof-upload.thumbnailWebp']).toBe(true);
  });

  it.each([
    ['1', true],
    ['', false],
    ['0', false],
    [false, false],
    [undefined, false],
  ])('reads a stored %p as %p', (stored, expected) => {
    const page = initPage(stored === undefined ? {} : { 'fof-upload.mustResize': stored });

    expect(page.values.mustResize()).toBe(expected);
    expect(page.changed()).toBe(false);
  });

  it('is unsaved once switched away from the stored value', () => {
    const page = initPage({ 'fof-upload.generateThumbnails': true });

    page.values.generateThumbnails(false);

    expect(page.changed()).toBe(true);
    expect(page.tabChanged('images')).toBe(true);
  });
});
