import {extend} from "flarum/extend";
import AdminNav from "flarum/components/AdminNav";
import AdminLinkButton from "flarum/components/AdminLinkButton";
import UploadPage from "./components/UploadPage";

export default function () {
    // create the route
    app.routes['flagrow-upload'] = {path: '/flagrow/upload', component: UploadPage.component()};

    // bind the route we created to the three dots settings button
    app.extensionSettings['flagrow-upload'] = () => m.route(app.route('flagrow-upload'));

    extend(AdminNav.prototype, 'items', items => {
        // add the Image Upload tab to the admin navigation menu
        items.add('flagrow-upload', AdminLinkButton.component({
            href: app.route('flagrow-upload'),
            icon: 'far fa-file',
            children: 'File Upload',
            description: app.translator.trans('flagrow-upload.admin.help_texts.description')
        }));
    });
}