import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import TextEditorButton from 'flarum/common/components/TextEditorButton';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import classList from 'flarum/common/utils/classList';
import type Uploader from '../handler/Uploader';
import type Mithril from 'mithril';

interface UploadButtonAttrs {
  uploader: Uploader;
  disabled?: boolean;
  isMediaUploadButton?: boolean;
}

export default class UploadButton extends Component<UploadButtonAttrs> {
  isMediaUploadButton = false;

  oninit(vnode: Mithril.Vnode<UploadButtonAttrs, this>) {
    super.oninit(vnode);

    this.attrs.uploader.on('uploaded', () => {
      const form = this.$('form')[0] as HTMLFormElement | undefined;
      if (form) {
        form.reset();
      }
      m.redraw();
    });

    this.isMediaUploadButton = vnode.attrs.isMediaUploadButton ?? false;
  }

  view() {
    const buttonText = this.attrs.uploader.uploading
      ? app.translator.trans('fof-upload.forum.states.loading')
      : app.translator.trans('fof-upload.forum.buttons.upload');

    return (
      <TextEditorButton
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
        title={buttonText}
      >
        {this.attrs.uploader.uploading && <LoadingIndicator size="small" display="inline" className="Button-icon" />}
        {(this.isMediaUploadButton || this.attrs.uploader.uploading) && <span className="Button-label">{buttonText}</span>}
        <form>
          <input type="file" multiple={true} onchange={this.process.bind(this)} />
        </form>
      </TextEditorButton>
    );
  }

  process(_e: Event): void {
    const files = this.$('input').prop('files') as FileList | undefined;
    if (!files || files.length === 0) {
      return;
    }
    this.attrs.uploader.upload(files, !this.isMediaUploadButton);
  }

  uploadButtonClicked(_e: PointerEvent): void {
    this.$('input').click();
  }
}
