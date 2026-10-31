import app from 'flarum/common/app';
import Component, { type ComponentAttrs } from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import InfoTile from 'flarum/common/components/InfoTile';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Placeholder from 'flarum/common/components/Placeholder';
import listItems from 'flarum/common/helpers/listItems';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import type File from '../models/File';
import type FileLibraryState from '../states/FileLibraryState';
import { fileMatchesRestriction, type FileRestriction } from '../utils/fileRestriction';
import FileCard from './FileCard';

export interface FileLibraryAttrs extends ComponentAttrs {
  state: FileLibraryState;
  mode?: 'pick' | 'browse';
  multiple?: boolean;
  selection?: File[];
  restrictFileType?: FileRestriction;
  onToggle?: (file: File) => void;
  actions?: ItemList<Mithril.Children>;
  empty?: () => Mithril.Children;
  onRemoved?: (file: File) => void;
}

let libraries = 0;

export default class FileLibrary<CustomAttrs extends FileLibraryAttrs = FileLibraryAttrs> extends Component<CustomAttrs> {
  protected radioName = `fof-upload-library-${++libraries}`;

  oninit(vnode: Mithril.Vnode<CustomAttrs, this>) {
    super.oninit(vnode);

    if (!this.attrs.state.hasStarted()) this.attrs.state.load();
  }

  view() {
    const { state } = this.attrs;

    return (
      <div className="FileLibrary fof-upload-file-list" aria-busy={state.isLoading() ? 'true' : 'false'}>
        {this.toolbar()}
        {this.content()}
      </div>
    );
  }

  toolbar(): Mithril.Children {
    const view = this.viewItems();
    const actions = this.actionItems();

    if (view.isEmpty() && actions.isEmpty()) return null;

    return (
      <div className="FileLibrary-toolbar">
        <ul className="FileLibrary-toolbar-view">{listItems(view.toArray())}</ul>
        <ul className="FileLibrary-toolbar-actions">{listItems(actions.toArray())}</ul>
      </div>
    );
  }

  // Filters, sorting and the hidden view land here.
  viewItems(): ItemList<Mithril.Children> {
    return new ItemList<Mithril.Children>();
  }

  actionItems(): ItemList<Mithril.Children> {
    return this.attrs.actions ?? new ItemList<Mithril.Children>();
  }

  content(): Mithril.Children {
    const { state } = this.attrs;
    const files = state.files();

    if (!files.length) {
      if (!state.hasStarted() || state.isInitialLoading()) {
        return <LoadingIndicator className="FileLibrary-loading" />;
      }

      if (state.hasError()) {
        return (
          <InfoTile icon="fas fa-exclamation-circle" className="FileLibrary-error">
            {app.translator.trans('fof-upload.lib.file_list.load_error')}
            <Button className="Button" onclick={() => state.load()}>
              {app.translator.trans('fof-upload.lib.file_list.retry')}
            </Button>
          </InfoTile>
        );
      }

      return (
        <div className="FileLibrary-empty">
          {this.attrs.empty?.() ?? <Placeholder text={app.translator.trans('fof-upload.lib.file_list.empty')} />}
        </div>
      );
    }

    return [
      <ul className="FileLibrary-grid">
        {files.map((file) => (
          <li key={file.id()} className="FileLibrary-item">
            {this.card(file)}
          </li>
        ))}
      </ul>,
      state.hasNext() ? (
        <div className="FileLibrary-more">
          <Button className="Button" loading={state.isLoadingNext()} onclick={() => state.loadMore()}>
            {app.translator.trans('fof-upload.lib.file_list.load_more_files_btn')}
          </Button>
        </div>
      ) : null,
    ];
  }

  card(file: File): Mithril.Children {
    const { mode = 'pick', multiple = true, selection = [], restrictFileType } = this.attrs;

    return (
      <FileCard
        file={file}
        mode={mode}
        multiple={multiple}
        name={this.radioName}
        selected={selection.includes(file)}
        selectable={fileMatchesRestriction(file, restrictFileType)}
        onToggle={this.attrs.onToggle}
        onRemoved={(removed: File, change: { deleted: boolean }) => this.removed(removed, change)}
      />
    );
  }

  removed(file: File, change: { deleted: boolean }): void {
    const before = this.attrs.state.files();
    const index = before.indexOf(file);

    this.attrs.state.removed(file, change);
    this.attrs.onRemoved?.(file);

    m.redraw.sync();

    // Focus the file that took its place, so the keyboard user is not dropped to the top of the page.
    const controls = this.element?.querySelectorAll<HTMLElement>('.FileCard-control');

    if (controls?.length) {
      controls[Math.min(Math.max(index, 0), controls.length - 1)]?.focus();
    }
  }
}
