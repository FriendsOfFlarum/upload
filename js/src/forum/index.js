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

    extend(TextEditor.prototype, 'toolbarItems', function (items) {
        // check whether the user can upload images, or has no markdown extension installed.
        if ((!app.forum.attribute('canUpload') || (!items.has('markdown')))) return;

        // scan markdown props via image icon identifier 
        let markdown = items.get('markdown'), markdownButtons, imageButton;
        markdownButtons = markdown.props.children; 

        markdownButtons.forEach(btn => {
            if ((typeof btn.props !== 'undefined') && (btn.props !== null) &&
                (typeof btn.props.icon !== 'undefined') && (btn.props.icon !== null) &&
                (btn.props.icon === 'fas fa-image')) {
                    imageButton = btn;
                }
        });

        let imageButtonIndex = markdownButtons.indexOf(imageButton); 
        if (imageButtonIndex > 0) {     
            // create the new button and pass this input to props
            uploadButton =  UploadButton.component({title: app.translator.trans('flagrow-upload.forum.buttons.attach'), textAreaObj: this }); 
            markdownButtons[imageButtonIndex] = uploadButton;
        }
    });

    downloadButtonInteraction();
});
