import app from 'flarum/admin/app';
import { extend } from 'flarum/common/extend';
import FormGroup, { type IFormGroupAttrs } from 'flarum/common/components/FormGroup';
import extendAdminNav from './extendAdminNav';
import FileSizeField from './components/FileSizeField';
import MimeTypesField from './components/MimeTypesField';
import { registerMimePermissions } from './mimePermissions';
import './compat';

export { default as extend } from './extend';
export { registerMimePermissions };

app.initializers.add('fof-upload', () => {
  extendAdminNav();

  // Core's patched m() nulls a `bidi` attribute, so the setting is passed on as settingValue, as flarum/tags does.
  extend(FormGroup.prototype, 'customFieldComponents', function (items) {
    items.add('fof-upload.mime-types', ({ bidi, ...attrs }: IFormGroupAttrs & { bidi: any }) => (
      <MimeTypesField {...(attrs as any)} settingValue={bidi} />
    ));
    items.add('fof-upload.file-size', ({ bidi, ...attrs }: IFormGroupAttrs & { bidi: any }) => (
      <FileSizeField {...(attrs as any)} settingValue={bidi} />
    ));
  });

  const raw = app.data.settings?.['fof-upload.mimePermissions'];
  const perms = Array.isArray(raw) ? raw : typeof raw === 'string' ? JSON.parse(raw || '[]') : [];

  registerMimePermissions(perms);
});
