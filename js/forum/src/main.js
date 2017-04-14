import {extend} from "flarum/extend";
import TextEditor from "flarum/components/TextEditor";
import UploadButton from "flagrow/upload/components/UploadButton";
import DownloadButton from "flagrow/upload/components/DownloadButton";
import DragAndDrop from "flagrow/upload/components/DragAndDrop";
import PasteClipboard from "flagrow/upload/components/PasteClipboard";
import CommentPost from 'flarum/components/CommentPost';

app.initializers.add('flagrow-upload', app => {
    var uploadButton,
        drag,
        clipboard;

    extend(CommentPost.prototype, 'config',function() {
        const contentHtml = this.props.post.contentHtml();
        // if (! this.isEditing()) return;

        const parentPost = this.props.post;
        const $parentPost = this.$();

        this.$('.flagrow-upload-button-preview').each(function () {
            console.log('one found');
            const $this = $(this);
            const uuid = $this.attr('data-uuid');
            const base_name = $this.attr('data-base-name');

            $this.replaceWith('foo');
        });
    });

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
});
