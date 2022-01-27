import app from 'flarum/admin/app';
import UploadPage from './components/UploadPage';

export * from './components';

app.initializers.add('fof-upload', (app) => {
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
        icon: 'fas fa-trash',
        label: app.translator.trans('fof-upload.admin.permissions.delete_uploads_of_others_label'),
        permission: 'fof-upload.deleteUserUploads',
      },
      'moderate',
      50
    );
});
