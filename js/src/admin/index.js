import {extend} from 'flarum/extend';
import app from 'flarum/app';
import PermissionGrid from 'flarum/components/PermissionGrid';
import UploadPage from "./components/UploadPage";

app.initializers.add('fof-upload', app => {
    // add the admin pane
    app.extensionData.for('fof-upload').registerPage(UploadPage);

    // add the permission option to the relative pane
    app.extensionData
        .for('fof-upload')
        .registerPermission({
            icon: 'far fa-file',
            label: app.translator.trans('fof-upload.admin.permissions.upload_label'),
            permission: 'fof-upload.upload',
        }, 'start', 50);

    app.extensionData
        .for('fof-upload')
        .registerPermission({
            icon: 'fas fa-download',
            label: app.translator.trans('fof-upload.admin.permissions.download_label'),
            permission: 'fof-upload.download',
            allowGuest: true,
        }, 'view', 50);
});
