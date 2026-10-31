import FileCard, { type FileCardAttrs } from './FileCard';

// The card before FileCard, kept for code that still renders one with its attribute names.
export default class DisplayFile extends FileCard<FileCardAttrs & Record<string, any>> {
  static initAttrs(attrs: FileCardAttrs & Record<string, any>) {
    attrs.selectable ??= attrs.fileSelectable;
    attrs.selected ??= attrs.isSelected;
    attrs.onToggle ??= attrs.onFileClick;
    attrs.onRemoved ??= attrs.onDelete;
  }
}
