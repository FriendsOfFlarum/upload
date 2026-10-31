import app from 'flarum/forum/app';
import FormModal, { type IFormModalAttrs } from 'flarum/common/components/FormModal';
import Button from 'flarum/common/components/Button';
import InfoTile from 'flarum/common/components/InfoTile';
import Icon from 'flarum/common/components/Icon';
import classList from 'flarum/common/utils/classList';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import type User from 'flarum/common/models/User';
import type EditorDriverInterface from 'flarum/common/utils/EditorDriverInterface';
import FileLibrary from '../../common/components/FileLibrary';
import FileLibraryState, { type FileLibrary as Library } from '../../common/states/FileLibraryState';
import { fileMatchesRestriction, type FileRestriction } from '../../common/utils/fileRestriction';
import type File from '../../common/models/File';
import Uploader from '../handler/Uploader';
import FileDropTarget from '../../common/utils/FileDropTarget';
import UploadButton from './UploadButton';
import { bbcodesWithDisplayNames } from '../utils/applyDisplayName';

type NativeFile = globalThis.File;

export interface FileManagerModalAttrs extends IFormModalAttrs {
  uploader?: Uploader;
  user?: User | null;
  hideUser?: boolean;
  hideShared?: boolean;
  multiSelect?: boolean;
  restrictFileType?: FileRestriction;
  defaultFilesLibrary?: Library;
  // Ids first, as callers have always read them; the modal is already closing.
  onSelect?: (selectedFileIds: string[], files: File[]) => void;
  // Where Insert goes when there is no onSelect; app.composer's editor otherwise.
  composer?: { editor: EditorDriverInterface | null };
}

interface SessionUser extends User {
  accessSharedFiles(): boolean;
  uploadSharedFiles(): boolean;
}

export default class FileManagerModal<CustomAttrs extends FileManagerModalAttrs = FileManagerModalAttrs> extends FormModal<CustomAttrs> {
  uploader!: Uploader;
  library!: Library;
  states: Partial<Record<Library, FileLibraryState>> = {};
  selection: File[] = [];
  dragDrop: FileDropTarget | null = null;

  private readonly uploadSucceeded = ({ file }: { file: File }) => {
    this.libraryState('user').added([file]);
    this.autoSelect([file]);
  };

  oninit(vnode: Mithril.Vnode<CustomAttrs, this>) {
    super.oninit(vnode);

    this.uploader = this.attrs.uploader ?? new Uploader();
    this.uploader.on('success', this.uploadSucceeded);

    const available = this.libraries();
    const preferred = this.attrs.defaultFilesLibrary;

    this.library = preferred && available.includes(preferred) ? preferred : available[0];
  }

  oncreate(vnode: Mithril.VnodeDOM<CustomAttrs, this>) {
    super.oncreate(vnode);

    // The whole modal, so a file dropped on the title or footer never navigates away from a draft.
    const content = this.element.querySelector('.Modal-content');

    if (content) {
      this.dragDrop = new FileDropTarget((files) => this.dropped(Array.from(files)), content, { accepts: () => this.canUpload() });
    }
  }

  onremove(vnode: Mithril.VnodeDOM<CustomAttrs, this>) {
    super.onremove(vnode);

    this.dragDrop?.unload();
    this.uploader.off('success', this.uploadSucceeded);
  }

  className(): string {
    return 'FileManagerModal fof-file-manager-modal Modal--large Modal--flat';
  }

  title(): Mithril.Children {
    return app.translator.trans('fof-upload.forum.media_manager');
  }

  content(): Mithril.Children {
    const tabs = this.fileLibraryButtonItems();

    return [
      tabs.toArray().length > 1 ? (
        <div className="Tabs FileManagerModal-tabs">
          <div className="Tabs-nav" role="tablist" onkeydown={(e: KeyboardEvent) => this.tabKeydown(e)}>
            {tabs.toArray()}
          </div>
        </div>
      ) : null,
      <div className="Modal-body FileManagerModal-body" role={tabs.toArray().length > 1 ? 'tabpanel' : undefined} id="fof-upload-library-panel">
        {/* Keyed in a fragment of its own, so switching library starts a fresh list beside the unkeyed overlay. */}
        {this.library
          ? [
              <FileLibrary
                key={this.library}
                state={this.libraryState(this.library)}
                mode="pick"
                multiple={this.multiple()}
                selection={this.validSelection()}
                restrictFileType={this.attrs.restrictFileType}
                onToggle={(file: File) => this.toggle(file)}
                actions={this.actionItems()}
                empty={() => this.empty()}
              />,
            ]
          : []}
        <div className="FileManagerModal-drop" aria-hidden="true">
          <Icon name="fas fa-cloud-upload-alt" />
          <span>{app.translator.trans('fof-upload.lib.file_list.release_to_upload')}</span>
        </div>
      </div>,
      <div className="Modal-footer FileManagerModal-footer">{this.footerItems().toArray()}</div>,
    ];
  }

  fileLibraryButtonItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const labels: Record<Library, string> = { user: 'fof-upload.forum.buttons.media', shared: 'fof-upload.forum.buttons.shared_media' };

    this.libraries().forEach((library, index) => {
      const active = library === this.library;

      items.add(
        library,
        <Button
          className="Button Button--link"
          role="tab"
          aria-selected={active ? 'true' : 'false'}
          aria-controls="fof-upload-library-panel"
          tabindex={active ? 0 : -1}
          active={active}
          data-library={library}
          onclick={() => this.setLibrary(library)}
        >
          {app.translator.trans(labels[library])}
        </Button>,
        100 - index * 10
      );
    });

    return items;
  }

  actionItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();

    if (this.library === 'user' && app.forum.attribute('fof-upload.canUpload')) {
      items.add('upload', <UploadButton uploader={this.uploader} isMediaUploadButton />);
    }

    if (this.library === 'shared' && this.sessionUser()?.uploadSharedFiles()) {
      items.add(
        'upload-shared',
        <Button className="Button fof-upload-button" icon="fas fa-file-upload" onclick={() => this.uploadShared([])}>
          {app.translator.trans('fof-upload.forum.buttons.upload')}
        </Button>
      );
    }

    return items;
  }

  footerItems(): ItemList<Mithril.Children> {
    const items = new ItemList<Mithril.Children>();
    const count = this.validSelection().length;

    items.add(
      'count',
      <span className="FileManagerModal-count" aria-live="polite">
        {count ? app.translator.trans('fof-upload.lib.file_list.selected_count', { count }) : ''}
      </span>,
      100
    );

    if (count) {
      items.add(
        'clear',
        <Button className="Button Button--link" onclick={() => (this.selection = [])}>
          {app.translator.trans('fof-upload.lib.file_list.clear_selection')}
        </Button>,
        90
      );
    }

    items.add(
      'submit',
      <div className="FileManagerModal-submit App-primaryControl">
        <Button type="submit" className="Button Button--primary" icon="fas fa-check" disabled={!count}>
          {this.attrs.onSelect
            ? app.translator.trans('fof-upload.lib.file_list.confirm_selection_btn', { fileCount: count })
            : app.translator.trans('fof-upload.lib.file_list.insert_btn', { count })}
        </Button>
      </div>,
      80
    );

    return items;
  }

  empty(): Mithril.Children {
    const phone = window.matchMedia?.('(max-width: 767px)').matches;

    return (
      <InfoTile icon="fas fa-photo-video" className="FileManagerModal-empty">
        {this.canUpload()
          ? app.translator.trans(phone ? 'fof-upload.lib.file_list.modal_empty_phone' : 'fof-upload.lib.file_list.modal_empty_desktop')
          : app.translator.trans('fof-upload.lib.file_list.empty')}
      </InfoTile>
    );
  }

  libraries(): Library[] {
    const user = this.sessionUser();
    const libraries: Library[] = [];

    if (!this.attrs.hideUser) libraries.push('user');

    if (!this.attrs.hideShared && user && (user.accessSharedFiles() || user.uploadSharedFiles())) libraries.push('shared');

    return libraries;
  }

  libraryState(library: Library): FileLibraryState {
    return (this.states[library] ??= new FileLibraryState(library, library === 'user' ? (this.attrs.user ?? app.session.user) : null));
  }

  setLibrary(library: Library): void {
    this.library = library;
  }

  multiple(): boolean {
    return this.attrs.multiSelect ?? true;
  }

  // Files deleted, or hidden from My media, leave the selection without being unticked.
  validSelection(): File[] {
    return this.selection.filter((file) => file.exists && (file.isShared() || !file.hidden()));
  }

  toggle(file: File): void {
    if (this.selection.includes(file)) {
      this.selection = this.selection.filter((selected) => selected !== file);
    } else {
      this.selection = this.multiple() ? [...this.validSelection(), file] : [file];
    }
  }

  autoSelect(files: File[]): void {
    const allowed = files.filter((file) => fileMatchesRestriction(file, this.attrs.restrictFileType));

    if (!allowed.length) return;

    this.selection = this.multiple() ? [...this.validSelection(), ...allowed] : [allowed[allowed.length - 1]];
    m.redraw();
  }

  canUpload(): boolean {
    if (this.library === 'user') return !!app.forum.attribute('fof-upload.canUpload');

    return this.library === 'shared' && !!this.sessionUser()?.uploadSharedFiles();
  }

  dropped(files: NativeFile[]): void {
    if (this.library === 'shared') {
      this.uploadShared(files);
    } else {
      this.uploader.upload(files, false);
    }
  }

  uploadShared(files: NativeFile[]): void {
    app.modal.show(
      () => import('../../common/components/UploadSharedFileModal'),
      {
        files,
        onUploadComplete: (uploaded: File | File[]) => {
          const list = Array.isArray(uploaded) ? uploaded : [uploaded];

          this.libraryState('shared').added(list);
          this.autoSelect(list);
        },
      },
      true
    );
  }

  onsubmit(e: SubmitEvent): void {
    e.preventDefault();

    const files = this.validSelection();

    // A second submit would insert twice, or stack a second naming prompt.
    if (!files.length || this.loading) return;

    this.loading = true;

    const { onSelect, composer } = this.attrs;

    if (onSelect) {
      this.hide();
      onSelect(
        files.map((file) => file.id()!),
        files
      );

      return;
    }

    // The naming prompt opens on top of this modal; this one closes once the prompt has.
    bbcodesWithDisplayNames(files).then((bbcodes) => {
      this.hide();
      (composer?.editor ?? app.composer.editor)?.insertAtCursor(bbcodes.join('\n') + '\n', false);
    });
  }

  onready(): void {
    const tab = this.element.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');

    (tab ?? this.element.querySelector<HTMLElement>('.FileCard-control'))?.focus();
  }

  tabKeydown(e: KeyboardEvent): void {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

    const libraries = this.libraries();
    const next = libraries[(libraries.indexOf(this.library) + (e.key === 'ArrowRight' ? 1 : -1) + libraries.length) % libraries.length];

    e.preventDefault();
    this.setLibrary(next);
    m.redraw.sync();
    this.element.querySelector<HTMLElement>(`[role="tab"][data-library="${next}"]`)?.focus();
  }

  protected sessionUser(): SessionUser | null {
    return app.session.user as SessionUser | null;
  }
}
