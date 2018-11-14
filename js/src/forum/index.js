import {extend} from "flarum/extend";
import TextEditor from "flarum/components/TextEditor";
import UploadButton from "./components/UploadButton";
import DragAndDrop from "./components/DragAndDrop";
import PasteClipboard from "./components/PasteClipboard";

import downloadButtonInteraction from './downloadButtonInteraction';

app.initializers.add('flagrow-upload', app => {
    let uploadButton,
        drag,
        clipboard;

    extend(TextEditor.prototype, 'controlItems', function (items) {
        // check whether the user can upload images. If not, returns.
        if (!app.forum.attribute('canUpload')) return;

        // create and add the button
        uploadButton = new UploadButton;
        uploadButton.textAreaObj = this;
        items.add('flagrow-upload', uploadButton, 0);

        // animate the button on hover: shows the label
        $('.Button-label', '.item-flagrow-upload > div').hide();
        $('.item-flagrow-upload > div').hover(
            function () {
                $('.Button-label', this).show();
                $(this).removeClass('Button--icon')
            },
            function () {
                $('.Button-label', this).hide();
                $(this).addClass('Button--icon')
            }
        );
    });

    extend(TextEditor.prototype, 'configTextarea', function() {
        // check whether the user can upload images. If not, returns.
        if (!app.forum.attribute('canUpload')) return;

        if (!drag) {
            drag = new DragAndDrop(uploadButton);
        }
        if (!clipboard) {
            clipboard = new PasteClipboard(uploadButton);
        }
    });

    downloadButtonInteraction();
});
