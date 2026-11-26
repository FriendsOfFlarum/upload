import User from 'flarum/common/models/User';
import Model from 'flarum/common/Model';

/**
 * The user attributes the media manager reads, on every frontend it opens on.
 */
export default function addUserAttributes(): void {
  (User.prototype as any).uploadSharedFiles = Model.attribute('fof-upload-uploadSharedFiles');
  (User.prototype as any).accessSharedFiles = Model.attribute('fof-upload-accessSharedFiles');
}
