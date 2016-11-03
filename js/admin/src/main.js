import {extend} from "flarum/extend";
import app from "flarum/app";
import PermissionGrid from "flarum/components/PermissionGrid";
import addUploadPane from "flagrow/upload/addUploadPane";

app.initializers.add('flagrow-upload', app => {
    // add the admin pane
    addUploadPane();

    // add the permission option to the relative pane
    extend(PermissionGrid.prototype, 'startItems', items => {
        items.add('upload', {
            icon: 'file-o',
            label: app.translator.trans('flagrow-upload.admin.permissions.upload_label'),
            permission: 'flagrow.upload'
        });
    });
});