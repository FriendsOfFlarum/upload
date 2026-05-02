import app from 'flarum/admin/app';
import { override } from 'flarum/common/extend';

export default function customizeGetRequiredPermissions() {
  override(app, 'getRequiredPermissions', (original, permission: string) => {
    const required = original(permission) || [];

    if (permission === 'fof-upload.hideSharedUploads') {
      if (!required.includes('fof-upload.download')) {
        required.push('fof-upload.download');
      }
    }

    return required;
  });
}
