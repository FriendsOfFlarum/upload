import Component, { ComponentAttrs } from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import File from '../models/File';
interface CustomAttrs extends ComponentAttrs {
    file: File;
    selectable: boolean;
    fileClassNames: string;
    onDelete: (file: File) => void | undefined;
    onFileSelect: (file: File) => void | undefined;
}
export default class UploadedFile extends Component<CustomAttrs> {
    file: File;
    callback: () => void | undefined;
    imageLoaded: boolean;
    oninit(vnode: Mithril.Vnode<CustomAttrs, this>): void;
    view(): JSX.Element;
    actionItems(): ItemList<Mithril.Children>;
    confirmDelete(): Promise<void>;
    viewFileInfo(): void;
    hideFile(): void;
    handleImageError: () => void;
    handleImageLoad: () => void;
    onFileClick(file: File): void;
}
export {};
