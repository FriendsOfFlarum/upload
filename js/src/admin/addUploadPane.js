import app from 'flarum/app';
import {extend} from 'flarum/extend';
import AdminNav from 'flarum/components/AdminNav';
import AdminLinkButton from 'flarum/components/AdminLinkButton';
import UploadPage from './components/UploadPage';

export default function () {
    app.routes['fof-upload'] = {path: '/fof/upload', component: UploadPage.component()};
    app.extensionSettings['fof-upload'] = () => m.route(app.route('fof-upload'));

    extend(AdminNav.prototype, 'items', items => {
        items.add('fof-upload', AdminLinkButton.component({
            href: app.route('fof-upload'),
            icon: 'far fa-file',
            children: 'File Upload',
            description: app.translator.trans('fof-upload.admin.help_texts.description'),
        }));
    });
}
