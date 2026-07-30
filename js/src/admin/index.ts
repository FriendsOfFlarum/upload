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

/**
 * Register the per-tag download permission.
 *
 * `tagScoped: true` makes flarum/tags render a dropdown for this permission in
 * each restricted tag's column (see addTagsPermissionScope). The backend gate
 * only enforces it on tags flagged as restricted, so the permission is
 * meaningless outside that scope and is not shown in the global column.
 */
function registerTagScopedDownloadPermission(): void {
  app.registry.for('fof-upload');
  app.registry.registerPermission(
    {
      icon: 'fas fa-download',
      label: app.translator.trans('fof-upload.admin.permissions.download_files_in_tag_label'),
      permission: 'fof-upload.download-files',
      tagScoped: true,
    },
    'start',
    46
  );
}

app.initializers.add('fof-upload', () => {
  extendAdminNav();

  // Only meaningful when flarum/tags is present to render the tag columns.
  if ('flarum-tags' in (app.data.extensions ?? {})) {
    registerTagScopedDownloadPermission();
  }

  // Dynamically register per-mime-type upload permissions in the permission grid.
  // This runs after app.data is fully loaded, so settings are available here.
  const raw = app.data.settings?.['fof-upload.mimePermissions'];
  const perms: Array<{ slug: string; label: string }> = Array.isArray(raw) ? raw : typeof raw === 'string' ? JSON.parse(raw || '[]') : [];

  registerMimePermissions(perms);
});
