import app from 'flarum/admin/app';
import UploadPage from './components/UploadPage';
import extendAdminNav from './extendAdminNav';
import FileListState from '../common/states/FileListState';

export * from './components';

export { default as extend } from './extend';

app.initializers.add('fof-upload', () => {
  app.extensionData
    .for('fof-upload')
    .registerPage(UploadPage)
    .registerPermission(
      {
        icon: 'far fa-file',
        label: app.translator.trans('fof-upload.admin.permissions.upload_label'),
        permission: 'fof-upload.upload',
      },
      'start',
      50
    )
    .registerPermission(
      {
        icon: 'fas fa-download',
        label: app.translator.trans('fof-upload.admin.permissions.download_label'),
        permission: 'fof-upload.download',
        allowGuest: true,
      },
      'view',
      50
    )
    .registerPermission(
      {
        icon: 'fas fa-eye',
        label: app.translator.trans('fof-upload.admin.permissions.view_user_uploads_label'),
        permission: 'fof-upload.viewUserUploads',
      },
      'moderate',
      50
    )
    .registerPermission(
      {
        icon: 'fas fa-eye-slash',
        label: app.translator.trans('fof-upload.admin.permissions.hide_own_uploads_label'),
        permission: 'fof-upload.hideUserUploads',
      },
      'reply',
      42
    )
    .registerPermission(
      {
        icon: 'fas fa-eye-slash',
        label: app.translator.trans('fof-upload.admin.permissions.hide_uploads_of_others_label'),
        permission: 'fof-upload.hideOtherUsersUploads',
      },
      'moderate',
      41
    )
    .registerPermission(
      {
        icon: 'fas fa-eye-slash',
        label: app.translator.trans('fof-upload.admin.permissions.hide_shared_uploads_label'),
        permission: 'fof-upload.hideSharedUploads',
      },
      'moderate',
      40
    )
    .registerPermission(
      {
        icon: 'fas fa-trash',
        label: app.translator.trans('fof-upload.admin.permissions.delete_own_uploads_label'),
        permission: 'fof-upload.deleteUserUploads',
      },
      'reply',
      32
    )
    .registerPermission(
      {
        icon: 'fas fa-trash',
        label: app.translator.trans('fof-upload.admin.permissions.delete_uploads_of_others_label'),
        permission: 'fof-upload.deleteOtherUsersUploads',
      },
      'moderate',
      31
    )
    .registerPermission(
      {
        icon: 'fas fa-trash',
        label: app.translator.trans('fof-upload.admin.permissions.delete_shared_uploads_label'),
        permission: 'fof-upload.deleteSharedUploads',
      },
      'moderate',
      30
    )
    .registerPermission(
      {
        icon: 'far fa-file-alt',
        label: app.translator.trans('fof-upload.admin.permissions.upload_shared_label'),
        permission: 'fof-upload.upload-shared-files',
      },
      'start'
    )
    .registerPermission(
      {
        icon: 'far fa-file-alt',
        label: app.translator.trans('fof-upload.admin.permissions.access_shared_label'),
        permission: 'fof-upload.access-shared-files',
      },
      'start'
    );

  extendAdminNav();

  //app.fileListState = new FileListState();
});
