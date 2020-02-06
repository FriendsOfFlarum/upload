import {extend} from 'flarum/extend';
import app from 'flarum/app';
import PermissionGrid from 'flarum/components/PermissionGrid';
import addUploadPane from './addUploadPane';

app.initializers.add('fof-upload', app => {
    // add the admin pane
    addUploadPane();

    // add the permission option to the relative pane
    extend(PermissionGrid.prototype, 'startItems', items => {
        items.add('fof-upload', {
            icon: 'far fa-file',
            label: app.translator.trans('fof-upload.admin.permissions.upload_label'),
            permission: 'fof-upload.upload',
        });
    });

    // add the permission option to the relative pane
    extend(PermissionGrid.prototype, 'viewItems', items => {
        items.add('fof-download', {
            icon: 'fas fa-download',
            label: app.translator.trans('fof-upload.admin.permissions.download_label'),
            permission: 'fof-upload.download',
            allowGuest: true,
        });
    });
});
