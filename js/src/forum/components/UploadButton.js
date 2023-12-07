import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import classList from 'flarum/common/utils/classList';

export default class UploadButton extends Component {
  oninit(vnode) {
    super.oninit(vnode);

    this.attrs.uploader.on('uploaded', () => {
      // reset the button for a new upload
      this.$('form')[0].reset();

      // redraw to reflect uploader.loading in the DOM
      m.redraw();
    });

    this.isMediaUploadButton = vnode.attrs.isMediaUploadButton || false;
  }

  view() {
    const buttonText = this.attrs.uploader.uploading
      ? app.translator.trans('fof-upload.forum.states.loading')
      : app.translator.trans('fof-upload.forum.buttons.upload');

    return (
      <Button
        className={classList([
          'Button',
          'hasIcon',
          'fof-upload-button',
          !this.isMediaUploadButton && !this.attrs.uploader.uploading && 'Button--icon',
          !this.isMediaUploadButton && !this.attrs.uploader.uploading && 'Button--link',
          this.attrs.uploader.uploading && 'uploading',
        ])}
        icon={!this.attrs.uploader.uploading && 'fas fa-file-upload'}
        onclick={this.uploadButtonClicked.bind(this)}
        disabled={this.attrs.disabled}
      >
        {this.attrs.uploader.uploading && <LoadingIndicator size="small" display="inline" className="Button-icon" />}
        {(this.isMediaUploadButton || this.attrs.uploader.uploading) && <span className="Button-label">{buttonText}</span>}
        <form>
          <input type="file" multiple={true} onchange={this.process.bind(this)} />
        </form>
      </Button>
    );
  }

  /**
   * Process the upload event.
   *
   * @param e
   */
  process(e) {
    // get the file from the input field
    const files = this.$('input').prop('files');

    if (files.length === 0) {
      // We've got no files to upload, so trying
      // to begin an upload will show an error
      // to the user.
      return;
    }

    this.attrs.uploader.upload(files, !this.isMediaUploadButton);
  }

  /**
   * Event handler for upload button being clicked
   *
   * @param {PointerEvent} e
   */
  uploadButtonClicked(e) {
    // Trigger click on hidden input element
    // (Opens file dialog)
    this.$('input').click();
  }
}
