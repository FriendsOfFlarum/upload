import app from 'flarum/admin/app';
import { default as extend } from '../common/extend';
import Extend from 'flarum/common/extenders';
import SharedUploadPage from './components/SharedUploadPage';
import UploadPage from './components/UploadPage';

export default [
  ...extend,

  new Extend.Routes() //
    .add('adminUploads', '/uploads', SharedUploadPage),

  new Extend.Admin()
    .permission(
      () => ({
        icon: 'far fa-file',
        label: app.translator.trans('fof-upload.admin.permissions.upload_label'),
        permission: 'fof-upload.upload',
      }),
      'start',
      50
    )
    .permission(
      () => ({
        icon: 'fas fa-download',
        label: app.translator.trans('fof-upload.admin.permissions.download_label'),
        permission: 'fof-upload.download',
        allowGuest: true,
        // Also offer this permission per-tag when flarum/tags is enabled, so
        // downloads can optionally be restricted within a tag.
        tagScoped: true,
      }),
      'view',
      50
    )
    .permission(
      () => ({
        icon: 'fas fa-eye',
        label: app.translator.trans('fof-upload.admin.permissions.view_user_uploads_label'),
        permission: 'fof-upload.viewUserUploads',
      }),
      'moderate',
      50
    )
    .permission(
      () => ({
        icon: 'fas fa-trash',
        label: app.translator.trans('fof-upload.admin.permissions.delete_uploads_of_others_label'),
        permission: 'fof-upload.deleteUserUploads',
      }),
      'moderate',
      50
    )
    .permission(
      () => ({
        icon: 'far fa-file-alt',
        label: app.translator.trans('fof-upload.admin.permissions.upload_shared_label'),
        permission: 'fof-upload.upload-shared-files',
      }),
      'start'
    )
    .permission(
      () => ({
        icon: 'far fa-file-alt',
        label: app.translator.trans('fof-upload.admin.permissions.access_shared_label'),
        permission: 'fof-upload.access-shared-files',
      }),
      'start'
    )
    .generalIndexItems('settings', () => {
      const t = (key: string, attrs?: Record<string, string>) => app.translator.trans(key, attrs ?? {}, true) as string;
      return [
        {
          id: 'preferences',
          tree: [t('fof-upload.admin.labels.preferences.title')],
          label: t('fof-upload.admin.labels.preferences.max_file_size'),
          help: t('fof-upload.admin.labels.preferences.php_ini_values', {
            post: app.data.settings?.['fof-upload.php_ini.post_max_size'] || '',
            upload: app.data.settings?.['fof-upload.php_ini.upload_max_filesize'] || '',
          }),
        },
        {
          id: 'mime-types',
          tree: [t('fof-upload.admin.labels.preferences.title')],
          label: t('fof-upload.admin.labels.preferences.mime_types'),
          help: t('fof-upload.admin.help_texts.mime_types'),
        },
        {
          id: 'composer-buttons',
          tree: [t('fof-upload.admin.labels.composer_buttons.title')],
          label: t('fof-upload.admin.labels.composer_buttons.title'),
          help: t('fof-upload.admin.help_texts.composer_buttons'),
        },
        {
          id: 'resize',
          tree: [t('fof-upload.admin.labels.resize.title')],
          label: t('fof-upload.admin.labels.resize.toggle'),
          help: t('fof-upload.admin.help_texts.resize'),
        },
        {
          id: 'resize-max-width',
          tree: [t('fof-upload.admin.labels.resize.title')],
          label: t('fof-upload.admin.labels.resize.max_width'),
          help: t('fof-upload.admin.help_texts.resize'),
        },
        {
          id: 'client-extension',
          tree: [t('fof-upload.admin.labels.client_extension.title')],
          label: t('fof-upload.admin.labels.client_extension.title'),
          help: t('fof-upload.admin.help_texts.client_extension'),
        },
        {
          id: 'watermark',
          tree: [t('fof-upload.admin.labels.watermark.title')],
          label: t('fof-upload.admin.labels.watermark.toggle'),
          help: t('fof-upload.admin.help_texts.watermark'),
        },
        {
          id: 'watermark-position',
          tree: [t('fof-upload.admin.labels.watermark.title')],
          label: t('fof-upload.admin.labels.watermark.position'),
          help: t('fof-upload.admin.help_texts.watermark'),
        },
        {
          id: 'svg-sanitizer',
          tree: [t('fof-upload.admin.labels.svg-sanitizer.title')],
          label: t('fof-upload.admin.labels.svg-sanitizer.title'),
          help: t('fof-upload.admin.labels.svg-sanitizer.help'),
        },
        {
          id: 'hotlink-protection',
          tree: [t('fof-upload.admin.labels.disable-hotlink-protection.title')],
          label: t('fof-upload.admin.labels.disable-hotlink-protection.toggle'),
          help: t('fof-upload.admin.help_texts.disable-hotlink-protection'),
        },
        {
          id: 'download-logging',
          tree: [t('fof-upload.admin.labels.disable-download-logging.title')],
          label: t('fof-upload.admin.labels.disable-download-logging.toggle'),
          help: t('fof-upload.admin.help_texts.disable-download-logging'),
        },
        {
          id: 'local-cdn',
          tree: [t('fof-upload.admin.labels.local.title')],
          label: t('fof-upload.admin.labels.local.cdn_url'),
          help: t('fof-upload.admin.labels.local.title'),
          visible: () => !app.data.uploadLocalCdnSetByEnv,
        },
        {
          id: 'imgur',
          tree: [t('fof-upload.admin.labels.imgur.title')],
          label: t('fof-upload.admin.labels.imgur.client_id'),
          help: t('fof-upload.admin.labels.imgur.title'),
        },
        {
          id: 'qiniu',
          tree: [t('fof-upload.admin.labels.qiniu.title')],
          label: t('fof-upload.admin.labels.qiniu.title'),
          help: t('fof-upload.admin.labels.qiniu.title'),
        },
        {
          id: 'aws-s3',
          tree: [t('fof-upload.admin.labels.aws-s3.title')],
          label: t('fof-upload.admin.labels.aws-s3.title'),
          help: t('fof-upload.admin.help_texts.s3_instance_profile'),
        },
      ];
    })
    .page(UploadPage),
];
