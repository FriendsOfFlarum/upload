import app from 'flarum/app';
import {extend} from 'flarum/extend';
import TextEditor from 'flarum/components/TextEditor';
import UploadButton from './components/UploadButton';
import DragAndDrop from './components/DragAndDrop';
import PasteClipboard from './components/PasteClipboard';
import Uploader from "./handler/Uploader";

export default function () {
    extend(TextEditor.prototype, 'oninit', function () {
        this.uploader = new Uploader();
    })
    extend(TextEditor.prototype, 'controlItems', function (items) {
        if (!app.forum.attribute('fof-upload.canUpload')) return;

        let button = UploadButton.component({
            upload: files => this.uploader.upload(files)
        });

        this.uploader.on('uploaded', () => button.success());

        items.add('fof-upload', button);
    });

    extend(TextEditor.prototype, 'oncreate', function (f_, vnode) {
        if (!app.forum.attribute('fof-upload.canUpload')) return;

        this.uploader.on('success', image => this.attrs.composer.editor.insertAtCursor(image + '\n'));

        const dragAndDrop = new DragAndDrop(
            files => this.uploader.upload(files),
            this.$().parents('.Composer')[0]
        );

        const unloadHandler = () => {
            dragAndDrop.unload();
        };

        this.$('textarea').bind('onunload', unloadHandler);

        new PasteClipboard(
            files => this.uploader.upload(files),
            this.$('textarea')[0]
        );
    });
}
