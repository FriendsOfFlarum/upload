import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import app from 'flarum/admin/app';
import Stream from 'flarum/common/utils/Stream';
import mq from 'mithril-query';
import { bootstrapAdmin } from '../bootstrap';
import UploadPage, { mimePermissionsOf, TAB_SETTINGS } from '../../src/admin/components/UploadPage';
import MimeTypesField from '../../src/admin/components/MimeTypesField';
import FileSizeField from '../../src/admin/components/FileSizeField';
import { syncMimePermissions } from '../../src/admin/mimePermissions';
import adminExtenders from '../../src/admin/extend';

// The defaults extend.php registers, as the admin payload carries them.
function serverDefaults(): Record<string, unknown> {
  const php = fs.readFileSync(path.resolve(process.cwd(), '../extend.php'), 'utf8');
  const constants: Record<string, number> = { 'Util::DEFAULT_MAX_FILE_SIZE': 2048, 'Util::DEFAULT_MAX_IMAGE_WIDTH': 100 };

  return Object.fromEntries(
    Array.from(php.matchAll(/->default\('([^']+)',\s*([^)]+)\)/g)).map(([, key, raw]) => {
      const value = raw.trim();

      if (value in constants) return [key, constants[value]];
      if (value === 'true' || value === 'false') return [key, value === 'true'];
      if (/^\d+$/.test(value)) return [key, Number(value)];

      return [key, value.replace(/^'|'$/g, '')];
    })
  );
}

beforeAll(() => bootstrapAdmin(serverDefaults()));

afterEach(() => jest.restoreAllMocks());

it('has a server default for every setting the page shows, so it never opens changed', () => {
  const defaults = serverDefaults();
  // The file type rules are filled in by AddAvailableOptionsInAdmin, which knows the installed adapters.
  const missing = Object.values(TAB_SETTINGS)
    .flat()
    .filter((key) => key !== 'mimeTypes' && !(`fof-upload.${key}` in defaults));

  expect(missing).toEqual([]);
});

function page(routePage?: string): UploadPage {
  jest.spyOn(m.route, 'param').mockImplementation(((key?: string) => (key === 'page' ? routePage : undefined)) as any);

  const instance = new UploadPage();
  instance.oninit({ attrs: { id: 'fof-upload' } } as any);

  return instance;
}

describe('UploadPage', () => {
  it('opens with nothing to save', () => {
    expect(page().isChanged()).toBe(0);
  });

  it('opens the tab named in the address, and Files otherwise', () => {
    expect(page('storage').activeTab).toBe('storage');
    expect(page('nonsense').activeTab).toBe('files');
  });

  it('keeps unsaved edits when switching tabs, and counts them on their own tab', () => {
    const instance = page();

    instance.setting('fof-upload.cdnUrl')('https://cdn.example.com');
    instance.setting('fof-upload.watermarkOpacity')('50');
    instance.activeTab = 'images';

    const dirty = Object.fromEntries(instance.tabs().map((tab) => [tab.key, tab.dirty]));

    expect(instance.setting('fof-upload.cdnUrl')()).toBe('https://cdn.example.com');
    expect(dirty).toEqual({ files: 0, storage: 1, images: 1, advanced: 0 });
  });

  it('does not count a missing watermark file as a change', () => {
    const instance = page('images');
    instance.setting('fof-upload.addsWatermarks')(true as any);
    app.data.settings['fof-upload.addsWatermarks'] = true;

    mq(m('div', instance.imagesTab()));

    expect(instance.isChanged()).toBe(0);
    expect(Object.keys(instance.settings)).not.toContain('fof-watermark_path');

    delete app.data.settings['fof-upload.addsWatermarks'];
  });

  it('lists every setting it owns for a reset, including tabs not opened yet', () => {
    const keys = Object.keys(page().settings);

    expect(keys).toEqual(
      expect.arrayContaining(['fof-upload.mimeTypes', 'fof-upload.awsS3Bucket', 'fof-upload.watermarkPadding', 'fof-upload.disableDownloadLogging'])
    );
  });

  it('warns that Imgur is deprecated where it is still configured', () => {
    const instance = page();
    instance.uploadMethodOptions = { imgur: 'Imgur', local: 'Local' };

    const sections = mq(m('div', instance.adaptorItems(new Set(['imgur'])).toArray()));

    expect(sections).toHaveElement('.UploadPage-adapter--imgur .UploadPage-deprecated');
    expect(sections).toContainRaw('Imgur no longer issues API client IDs');
  });

  it('does not offer Imgur where the backend has no Imgur', () => {
    const instance = page();
    instance.uploadMethodOptions = { local: 'Local' };

    expect(instance.adaptorItems(new Set(['imgur'])).has('imgur')).toBe(false);
  });

  it('only lets a provider fill in what it decides', () => {
    const instance = page();
    instance.setting('fof-upload.awsS3Key')('key');
    instance.setting('fof-upload.awsS3ACL')('public-read');

    instance.selectS3Provider('cloudflare-r2');

    expect(instance.setting('fof-upload.awsS3Key')()).toBe('key');
    expect(instance.setting('fof-upload.awsS3ACL')()).toBe('');
    expect(instance.setting('fof-upload.awsS3UsePathStyleEndpoint')()).toBe(true);
  });
});

describe('the admin search', () => {
  const item = (id: string) => {
    const admin = adminExtenders.find((e: any) => e.generalIndexes?.settings) as any;

    return admin.generalIndexes.settings().find((entry: any) => entry.id === id);
  };

  afterEach(() => delete app.data.settings['fof-upload.imgurClientId']);

  it('offers Imgur only where a client ID is configured', () => {
    expect(item('imgur').visible()).toBe(false);

    app.data.settings['fof-upload.imgurClientId'] = 'abc123';
    expect(item('imgur').visible()).toBe(true);
  });

  it('places each setting under its tab', () => {
    expect(item('watermark').tree[0]).toBe('Images');
    expect(item('hotlink-protection').tree).toEqual(['Advanced', 'Downloads']);
  });

  it('offers a storage service only where its package is installed', () => {
    expect(item('aws-s3').visible()).toBe(true);
    expect(item('qiniu').visible()).toBe(false);
  });
});

describe('upload permissions per file type', () => {
  it('are read from the labelled rules', () => {
    const rules = JSON.stringify({
      '^image\\/png$': { adapter: 'local', template: 'image-preview', permission_label: 'Images', permission_slug: 'images' },
      '^application\\/pdf$': { adapter: 'local', template: 'file' },
    });

    expect(mimePermissionsOf(rules)).toEqual([{ label: 'Images', slug: 'images' }]);
  });

  it('leave the permission grid when their rule does', () => {
    const remove = jest.spyOn(app.registry, 'removePermission');
    const register = jest.spyOn(app.registry, 'registerPermission');

    syncMimePermissions(
      [
        { label: 'Images', slug: 'images' },
        { label: 'Video', slug: 'video' },
      ],
      [{ label: 'Pictures', slug: 'images' }]
    );

    expect(remove).toHaveBeenCalledWith('fof-upload.upload-mime.video', 'start');
    expect(remove).not.toHaveBeenCalledWith('fof-upload.upload-mime.images', 'start');
    expect((register.mock.calls[0][0] as any).permission).toBe('fof-upload.upload-mime.images');
  });
});

describe('the file types table', () => {
  const RULES = JSON.stringify({
    '^image\\/(jpeg|png)$': { adapter: 'local', template: 'image-preview' },
    '^application\\/pdf$': { adapter: 'local', template: 'file' },
    '^text\\/plain$': { adapter: 'gone', template: 'file' },
  });

  function table(rules = RULES) {
    const setting = Stream(rules);
    let field!: MimeTypesField;

    class Captured extends MimeTypesField {
      oninit(vnode: any) {
        super.oninit(vnode);
        field = this;
      }
    }

    const out = mq(Captured, {
      settingValue: setting,
      adapters: { local: 'Local' },
      templates: { file: { name: 'File', description: '' }, 'image-preview': { name: 'Image preview', description: '' } },
      defaultAdapter: 'local',
    });

    return { out, setting, field: () => field };
  }

  it('leaves the setting alone until something changes', () => {
    const { setting } = table();

    expect(setting()).toBe(RULES);
  });

  it('keeps a rule in place while its pattern is edited, so the first match does not change', () => {
    const { field, setting } = table();
    const [first] = field().rows;

    field().update(first, () => (first.pattern = '^image\\/(jpeg|png|gif)$'));

    expect(Object.keys(JSON.parse(setting()))).toEqual(['^image\\/(jpeg|png|gif)$', '^application\\/pdf$', '^text\\/plain$']);
  });

  it('flags a pattern with an unescaped slash, which the server would read as its end', () => {
    const { field } = table();
    const [first] = field().rows;
    first.pattern = '^image/png$';

    expect(field().error(first)).toBeTruthy();
  });

  it('flags a duplicate pattern and saves the rule above it only once', () => {
    const { field, setting } = table();
    const [, second, third] = field().rows;

    field().update(third, () => (third.pattern = second.pattern));

    expect(field().error(third)).toBeTruthy();
    expect(Object.keys(JSON.parse(setting()))).toEqual(['^image\\/(jpeg|png)$', '^application\\/pdf$']);
  });

  it('keeps a permission’s slug when its label is renamed, so granted groups keep it', () => {
    const { field } = table();
    const [first] = field().rows;

    field().setPermission(first, 'Images');
    field().setPermission(first, 'Pictures');

    expect(first.config).toMatchObject({ permission_label: 'Pictures', permission_slug: 'images' });
  });

  it('gives a label in another script a slug that still works', () => {
    const { field } = table();
    const [first] = field().rows;

    field().setPermission(first, 'Изображения');

    expect(first.config.permission_slug).toBe('image-jpeg-png');
  });

  it('shows a storage service that is no longer installed, rather than a blank choice', () => {
    const { field } = table();

    expect(field().options({ local: 'Local' }, 'gone')).toMatchObject({ gone: { disabled: true } });
  });

  it('moves rules up and down, which is what decides the first match', () => {
    const { field, setting } = table();

    field().move(2, -1);

    expect(Object.keys(JSON.parse(setting()))).toEqual(['^image\\/(jpeg|png)$', '^text\\/plain$', '^application\\/pdf$']);
  });
});

describe('the maximum file size', () => {
  function field(kb = '2048') {
    const setting = Stream(kb);
    const out = mq(FileSizeField, { settingValue: setting });

    return { out, setting };
  }

  it('shows the stored kilobytes in the largest whole unit', () => {
    const { out } = field('51200');

    expect((out.rootEl.querySelector('input') as HTMLInputElement).value).toBe('50');
    expect((out.rootEl.querySelector('select') as HTMLSelectElement).value).toBe('MB');
  });

  it('stores what is typed in kilobytes', () => {
    const { out, setting } = field();
    const input = out.rootEl.querySelector('input') as HTMLInputElement;

    input.value = '1.5';
    out.trigger('input', 'input', { target: input });

    expect(setting()).toBe('1536');
  });

  it('stores nothing when cleared, so saving resets it to the default', () => {
    const { out, setting } = field();
    const input = out.rootEl.querySelector('input') as HTMLInputElement;

    input.value = '';
    out.trigger('input', 'input', { target: input });

    expect(setting()).toBe('');
  });
});
