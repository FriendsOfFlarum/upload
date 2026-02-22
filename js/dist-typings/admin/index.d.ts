export { default as extend } from './extend';
/**
 * Register per-mime-type upload permissions in the Flarum permission grid.
 *
 * Called at boot (from app.initializers) and again after each settings save
 * in UploadPage so the grid updates without requiring a page reload.
 * Calling registerPermission with an existing key overwrites it, so this is
 * safe to call multiple times.
 */
export declare function registerMimePermissions(perms: Array<{
    slug: string;
    label: string;
}>): void;
