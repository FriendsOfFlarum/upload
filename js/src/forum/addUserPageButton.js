import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import UserPage from 'flarum/forum/components/UserPage';
import LinkButton from 'flarum/common/components/LinkButton';

export default function addUserPageButton() {
  extend(UserPage.prototype, 'navItems', function (items) {
    const canUpload = !!app.forum.attribute('fof-upload.canUpload');
    const hasUploads = !!this.user.uploadCountCurrent();

    if (app.session.user && (app.session.user.viewOthersMediaLibrary() || (this.user === app.session.user && (canUpload || hasUploads)))) {
      const uploadCount = this.user.uploadCountCurrent();

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
            this.user === app.session.user
              ? app.translator.trans('fof-upload.forum.buttons.media')
              : app.translator.trans('fof-upload.forum.buttons.user_uploads'),
            ' ',
            uploadCount > 0 ? <span className="Button-badge">{uploadCount}</span> : '',
          ]
        ),
        80
      );
    }
  });
}
