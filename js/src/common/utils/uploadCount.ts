import type User from 'flarum/common/models/User';

export function adjustUploadCount(user: User, current: number, all: number): void {
  const read = (key: string) => Number(user.attribute(key) ?? 0);

  user.pushAttributes({
    'fof-upload-uploadCountCurrent': Math.max(0, read('fof-upload-uploadCountCurrent') + current),
    'fof-upload-uploadCountAll': Math.max(0, read('fof-upload-uploadCountAll') + all),
  });
}
