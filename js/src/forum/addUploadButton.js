import app from 'flarum/app';
import {extend} from 'flarum/extend';
import TextEditor from 'flarum/components/TextEditor';
import UploadButton from './components/UploadButton';
import DragAndDrop from './components/DragAndDrop';
import PasteClipboard from './components/PasteClipboard';

export default function () {
    extend(TextEditor.prototype, 'init', function () {
        if (!app.forum.attribute('fof-upload.canUpload')) return;

        this.fofUploadButton = new UploadButton;
        this.fofUploadButton.textAreaObj = this;
    });

    extend(TextEditor.prototype, 'controlItems', function (items) {
        if (!app.forum.attribute('fof-upload.canUpload')) return;

        items.add('fof-upload', this.fofUploadButton.render());
    });

    extend(TextEditor.prototype, 'config', function (output, isInitialized, context) {
        if (isInitialized) return;

        if (!app.forum.attribute('fof-upload.canUpload')) return;

        const dragAndDrop = new DragAndDrop(this.fofUploadButton, this.$().parents('.Composer')[0]);

        const unloadHandler = () => {
            dragAndDrop.unload();
        };

        if (context.onunload) {
            extend(context, 'onunload', unloadHandler);
        } else {
            context.onunload = unloadHandler;
        }
    });

    extend(TextEditor.prototype, 'configTextarea', function (output, element, isInitialized) {
        if (isInitialized) return;

        if (!app.forum.attribute('fof-upload.canUpload')) return;

        new PasteClipboard(this.fofUploadButton, element);
    });
}
