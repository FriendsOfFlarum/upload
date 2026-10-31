import fs from 'fs';
import path from 'path';
import jsYaml from 'js-yaml';
import flatten from 'flat';
import Drawer from 'flarum/common/utils/Drawer';

export function readTranslations(relative: string): Record<string, string> {
  return flatten(jsYaml.load(fs.readFileSync(path.resolve(process.cwd(), relative), 'utf8')) as object) as Record<string, string>;
}

function forumResource(attributes: Record<string, unknown>) {
  return {
    type: 'forums',
    id: '1',
    attributes: {
      apiUrl: 'https://example.com/api',
      baseUrl: 'https://example.com',
      basePath: '',
      title: 'Example',
      'fof-upload.canUpload': true,
      'fof-upload.canDownload': true,
      'fof-upload.composerButtonVisiblity': 'both',
      ...attributes,
    },
  };
}

export function sessionUser(attributes: Record<string, unknown> = {}) {
  return {
    type: 'users',
    id: '1',
    attributes: {
      username: 'admin',
      displayName: 'Admin',
      'fof-upload-uploadCountCurrent': 3,
      'fof-upload-uploadCountAll': 4,
      'fof-upload-accessSharedFiles': true,
      'fof-upload-uploadSharedFiles': true,
      'fof-upload-viewOthersMediaLibrary': false,
      ...attributes,
    },
  };
}

interface BootOptions {
  forum?: Record<string, unknown>;
  user?: Record<string, unknown> | null;
}

export async function bootstrapForum({ forum = {}, user = {} }: BootOptions = {}) {
  const { default: app } = await import('flarum/forum/app');
  const { default: ForumApplication } = await import('flarum/forum/ForumApplication');
  const { extend: extenders } = await import('../src/forum');

  (ForumApplication.prototype as any).mount = () => {};

  app.load({
    apiDocument: null,
    locale: 'en',
    locales: {},
    resources: [forumResource(forum), ...(user ? [sessionUser(user)] : [])],
    session: { userId: user ? 1 : 0, csrfToken: 'token' },
  } as any);

  extenders.forEach((extender: any) => extender.extend(app, { name: 'fof/upload', id: 'fof-upload', extra: {} }));
  app.boot();

  app.translator.setLocale('en');
  app.translator.addTranslations(readTranslations('../vendor/flarum/core/locale/core.yml'));
  app.translator.addTranslations(readTranslations('../resources/locale/en.yml'));
  (app as any).drawer = new Drawer();
  m.route.prefix = '';

  return app;
}

export async function bootstrapAdmin(settings: Record<string, unknown> = {}) {
  const { default: app } = await import('flarum/admin/app');
  const { default: AdminApplication } = await import('flarum/admin/AdminApplication');
  const { extend: extenders } = await import('../src/admin');

  (AdminApplication.prototype as any).mount = () => {};

  app.load({
    apiDocument: null,
    locale: 'en',
    locales: {},
    resources: [forumResource({}), sessionUser()],
    session: { userId: 1, csrfToken: 'token' },
    settings: {
      'fof-upload.availableUploadMethods': { local: 'Local', 'aws-s3': 'S3 or Compatible' },
      'fof-upload.availableTemplates': {
        file: { name: 'File', description: 'A download button' },
        'image-preview': { name: 'Image preview', description: 'The image' },
      },
      'fof-upload.mimeTypes': '{"^image\\\\/(jpeg|png)$":{"adapter":"local","template":"image-preview"}}',
      'fof-upload.maxFileSize': 2048,
      ...settings,
    },
    extensions: {
      'fof-upload': {
        id: 'fof-upload',
        name: 'fof/upload',
        version: '2.x',
        extra: { 'flarum-extension': { title: 'FoF Upload' } },
        icon: {},
        links: {},
      },
    },
    permissions: {},
    displayNameDrivers: [],
    avatarDrivers: [],
    slugDrivers: {},
    searchDrivers: {},
    modelStatistics: { users: 1 },
  } as any);

  extenders.forEach((extender: any) => extender.extend(app, { name: 'fof/upload', id: 'fof-upload', extra: {} }));
  app.boot();

  app.translator.setLocale('en');
  app.translator.addTranslations(readTranslations('../vendor/flarum/core/locale/core.yml'));
  app.translator.addTranslations(readTranslations('../resources/locale/en.yml'));
  (app as any).drawer = new Drawer();
  m.route.prefix = '';

  return app;
}
