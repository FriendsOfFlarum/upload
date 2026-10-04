import bootstrapAdmin from '@flarum/jest-config/src/bootstrap/admin';
import app from 'flarum/admin/app';
import Stream from 'flarum/common/utils/Stream';
import m from 'mithril';
import mq from 'mithril-query';
// Load the admin entry point first, as the bundle does: UploadPage imports from it,
// and importing UploadPage on its own hits that circular import.
import '../../../src/admin';
import UploadPage from '../../../src/admin/components/UploadPage';
import adminExtenders from '../../../src/admin/extend';

beforeAll(() => {
  bootstrapAdmin();
  app.boot();
});

/**
 * UploadPage reads its state from the settings payload in oninit; these tests only
 * need the adapter sections, so they build the page's state directly.
 */
function adapterSections(uploadMethodOptions: Record<string, string>) {
  const page = Object.create(UploadPage.prototype) as UploadPage;

  page.uploadMethodOptions = uploadMethodOptions;
  page.showAllAdapters = true;
  page.values = { imgurClientId: Stream('abc123') } as any;

  return mq(m('div', page.adaptorItems(new Set(['imgur'])).toArray()));
}

describe('Imgur adapter settings', () => {
  it('warns that the adapter is deprecated', () => {
    const sections = adapterSections({ imgur: 'Imgur', local: 'Local' });

    expect(sections).toHaveElement('.UploadPage-adapter--imgur .UploadPage-deprecated');
    expect(sections).toContainRaw('fof-upload.admin.labels.imgur.deprecated');
  });

  it('is not shown where the backend does not offer Imgur', () => {
    expect(adapterSections({ local: 'Local' })).not.toHaveElement('.UploadPage-adapter--imgur');
  });
});

describe('Imgur in the admin settings search', () => {
  // The search index is registered on the Admin extender and only read when the
  // admin searches, so it is checked straight from the extender.
  const imgurSearchItem = () => {
    const admin = adminExtenders.find((e: any) => e.generalIndexes?.settings) as any;

    return admin.generalIndexes.settings().find((item: any) => item.id === 'imgur');
  };

  afterEach(() => {
    delete app.data.settings['fof-upload.imgurClientId'];
  });

  it('is hidden without a client ID, since the section is not shown', () => {
    expect(imgurSearchItem().visible()).toBe(false);
  });

  it('is listed when a client ID is configured', () => {
    app.data.settings['fof-upload.imgurClientId'] = 'abc123';

    expect(imgurSearchItem().visible()).toBe(true);
  });
});
