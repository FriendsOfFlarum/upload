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
    const canUpload = !!app.forum.attribute('fof-upload.canUpload');
    const user = this.user as UserWithUpload | null;
    const hasUploads = !!user?.uploadCountCurrent();

    const sessionUser = app.session.user as UserWithUpload | null;
    if (!this.user || !sessionUser) return;
    if (sessionUser.viewOthersMediaLibrary() || (this.user === sessionUser && (canUpload || hasUploads))) {
      const uploadCount = user?.uploadCountCurrent() ?? 0;

      items.add(
        'uploads',
        LinkButton.component(
          {
            href: app.route('user.uploads', {
              username: this.user.slug(),
            }),
            name: 'uploads',
            icon: 'fas fa-file-upload',
          },
          [
            this.user === sessionUser
              ? app.translator.trans('fof-upload.forum.buttons.media')
              : app.translator.trans('fof-upload.forum.buttons.user_uploads'),
            ' ',
            uploadCount > 0 ? <span className="Button-badge">{uploadCount}</span> : null,
          ]
        ),
        80
      );
    }
  });
}
