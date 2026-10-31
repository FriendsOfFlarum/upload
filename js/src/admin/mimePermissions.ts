import app from 'flarum/admin/app';

export interface MimePermission {
  slug: string;
  label: string;
}

const permissionKey = (slug: string) => `fof-upload.upload-mime.${slug}`;

// Registering an existing key replaces it, so this is safe to call again after a save.
export function registerMimePermissions(perms: MimePermission[]): void {
  if (!perms.length) return;

  app.registry.for('fof-upload');

  perms.forEach((perm) => {
    app.registry.registerPermission(
      {
        icon: 'far fa-file',
        label: app.translator.trans('fof-upload.admin.permissions.upload_mime_label', { label: perm.label }),
        permission: permissionKey(perm.slug),
      },
      'start',
      45
    );
  });
}

export function syncMimePermissions(previous: MimePermission[], next: MimePermission[]): void {
  app.registry.for('fof-upload');

  previous
    .filter((perm) => !next.some((kept) => kept.slug === perm.slug))
    .forEach((perm) => app.registry.removePermission(permissionKey(perm.slug), 'start'));

  registerMimePermissions(next);
  m.redraw();
}
