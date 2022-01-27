import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import UserPage from 'flarum/forum/components/UserPage';
import LinkButton from 'flarum/common/components/LinkButton';

import File from '../common/models/File';
import FileListState from './states/FileListState';
import downloadButtonInteraction from './downloadButtonInteraction';
import addUploadButton from './addUploadButton';
import UploadsUserPage from './components/UploadsUserPage';
import User from 'flarum/common/models/User';
import Model from 'flarum/common/Model';

export * from './components';

app.initializers.add('fof-upload', () => {
  User.prototype.viewOthersMediaLibrary = Model.attribute('fof-upload-viewOthersMediaLibrary');
  User.prototype.deleteOthersMediaLibrary = Model.attribute('fof-upload-deleteOthersMediaLibrary');
  User.prototype.uploadCountCurrent = Model.attribute('fof-upload-uploadCountCurrent');
  User.prototype.uploadCountAll = Model.attribute('fof-upload-uploadCountAll');

  addUploadButton();
  downloadButtonInteraction();

  // File model
  app.store.models.files = File;

  // File list state
  app.fileListState = new FileListState();

  // Add user uploads to the user profile
  app.routes['user.uploads'] = {
    path: '/u/:username/uploads',
    component: UploadsUserPage,
  };

  // Add uploads to user page menu items
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
              username: this.user.username(),
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
});
