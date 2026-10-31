import app from 'flarum/forum/app';
import Component, { type ComponentAttrs } from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import TextEditorButton from 'flarum/common/components/TextEditorButton';
import extractText from 'flarum/common/utils/extractText';
import type Mithril from 'mithril';
import type Uploader from '../handler/Uploader';

export interface UploadButtonAttrs extends ComponentAttrs {
  uploader: Uploader;
  disabled?: boolean;
  // A labelled toolbar button rather than the composer's icon button; its uploads are not inserted.
  isMediaUploadButton?: boolean;
}

export default class UploadButton extends Component<UploadButtonAttrs> {
  input: HTMLInputElement | null = null;

  view(): Mithril.Children {
    const { uploader, disabled, isMediaUploadButton } = this.attrs;
    const label = app.translator.trans('fof-upload.forum.buttons.upload');

    const button = isMediaUploadButton ? (
      <Button
        className="Button fof-upload-button"
        icon="fas fa-file-upload"
        loading={uploader.uploading}
        disabled={disabled}
        onclick={() => this.choose()}
      >
        {label}
      </Button>
    ) : (
      <TextEditorButton
        className="Button Button--icon Button--link fof-upload-button"
        icon="fas fa-file-upload"
        loading={uploader.uploading}
        disabled={disabled}
        onclick={() => this.choose()}
        title={extractText(label)}
      />
    );

    return [
      button,
      <input
        className="fof-upload-input"
        type="file"
        multiple
        hidden
        tabindex="-1"
        aria-hidden="true"
        oncreate={(vnode: Mithril.VnodeDOM) => (this.input = vnode.dom as HTMLInputElement)}
        onchange={() => this.chosen()}
      />,
    ];
  }

  choose(): void {
    this.input?.click();
  }

  chosen(): void {
    const input = this.input;
    const files = Array.from(input?.files ?? []);

    if (!input || !files.length) return;

    // Cleared whatever the outcome, so the same file can be chosen again.
    this.attrs.uploader.upload(files, !this.attrs.isMediaUploadButton).finally(() => (input.value = ''));
  }
}
