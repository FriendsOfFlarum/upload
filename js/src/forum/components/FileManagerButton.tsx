import app from 'flarum/forum/app';
import Component, { type ComponentAttrs } from 'flarum/common/Component';
import TextEditorButton from 'flarum/common/components/TextEditorButton';
import extractText from 'flarum/common/utils/extractText';
import type EditorDriverInterface from 'flarum/common/utils/EditorDriverInterface';
import FileManagerModal from './FileManagerModal';
import type Uploader from '../handler/Uploader';

interface FileManagerButtonAttrs extends ComponentAttrs {
  uploader?: Uploader;
  composer?: { editor: EditorDriverInterface | null };
  disabled?: boolean;
  // Shows the composer's upload progress when this is its only upload control.
  loading?: boolean;
}

export default class FileManagerButton extends Component<FileManagerButtonAttrs> {
  view() {
    return (
      <TextEditorButton
        className="Button Button--icon Button--link fof-upload-button"
        icon="fas fa-photo-video"
        loading={this.attrs.loading}
        disabled={this.attrs.disabled}
        onclick={() => this.open()}
        title={extractText(app.translator.trans('fof-upload.forum.buttons.media'))}
      />
    );
  }

  // FileManagerModal is imported synchronously: a lazy chunk collides with core's ReplyComposer chunk id.
  open(): void {
    app.modal.show(FileManagerModal, { composer: this.attrs.composer });
  }
}
