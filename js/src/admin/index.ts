import app from 'flarum/admin/app';
import extendAdminNav from './extendAdminNav';

export { default as extend } from './extend';

/**
 * Register per-mime-type upload permissions in the Flarum permission grid.
 *
 * Called at boot (from app.initializers) and again after each settings save
 * in UploadPage so the grid updates without requiring a page reload.
 * Calling registerPermission with an existing key overwrites it, so this is
 * safe to call multiple times.
 */
export function registerMimePermissions(perms: Array<{ slug: string; label: string }>): void {
  if (perms.length === 0) return;

  app.registry.for('fof-upload');
  perms.forEach((p) => {
    app.registry.registerPermission(
      {
        icon: 'far fa-file',
        label: app.translator.trans('fof-upload.admin.permissions.upload_mime_label', { label: p.label }),
        permission: `fof-upload.upload-mime.${p.slug}`,
      },
      'start',
      45
    );
  });
}

app.initializers.add('fof-upload', () => {
  extendAdminNav();

  // Dynamically register per-mime-type upload permissions in the permission grid.
  // This runs after app.data is fully loaded, so settings are available here.
  const raw = app.data.settings?.['fof-upload.mimePermissions'];
  const perms: Array<{ slug: string; label: string }> = Array.isArray(raw) ? raw : typeof raw === 'string' ? JSON.parse(raw || '[]') : [];

  registerMimePermissions(perms);
});
