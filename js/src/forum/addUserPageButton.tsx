import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import UserPage from 'flarum/forum/components/UserPage';
import LinkButton from 'flarum/common/components/LinkButton';
import type User from 'flarum/common/models/User';

interface UserWithUpload extends User {
  viewOthersMediaLibrary(): boolean;
  uploadCountCurrent(): number;
}

export default function addUserPageButton(): void {
  extend(UserPage.prototype, 'navItems', function (this: InstanceType<typeof UserPage>, items) {
    const user = this.user as UserWithUpload | null;
    const viewer = app.session.user as UserWithUpload | null;

    if (!user || !viewer) return;

    const own = user === viewer;
    const count = user.uploadCountCurrent() ?? 0;

    if (!viewer.viewOthersMediaLibrary() && !(own && (app.forum.attribute('fof-upload.canUpload') || count > 0))) return;

    items.add(
      'uploads',
      <LinkButton href={app.route('user.uploads', { username: user.slug() })} name="uploads" icon="fas fa-file-upload">
        {app.translator.trans(own ? 'fof-upload.forum.buttons.media' : 'fof-upload.forum.buttons.user_uploads')}
        {count > 0 ? <span className="Button-badge">{count}</span> : null}
      </LinkButton>,
      80
    );
  });
}
