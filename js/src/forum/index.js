import { extend } from 'flarum/extend';
import app from 'flarum/app';
import UserPage from 'flarum/components/UserPage';
import LinkButton from 'flarum/components/LinkButton';

import File from '../common/models/File';
import FileListState from './states/FileListState';
import downloadButtonInteraction from './downloadButtonInteraction';
import addUploadButton from './addUploadButton';
import UploadsUserPage from './components/UploadsUserPage';

export * from './components';

app.initializers.add('fof-upload', () => {
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
        if (this.user !== app.session.user && !app.forum.attribute('fof-upload.canViewUserUploads')) return;

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
                this.user === app.session.user
                    ? app.translator.trans('fof-upload.forum.buttons.media')
                    : app.translator.trans('fof-upload.forum.buttons.user_uploads')
            ),
            80
        );
    });
});
