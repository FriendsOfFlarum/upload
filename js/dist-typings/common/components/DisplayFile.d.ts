import Component, { ComponentAttrs } from 'flarum/common/Component';
import File from '../models/File';
import User from 'flarum/common/models/User';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
interface CustomAttrs extends ComponentAttrs {
    file: File;
    fileSelectable: boolean;
    isSelected: boolean;
    fileClassNames: string;
    isFileHiding: boolean;
    onHide: (file: File) => void | undefined;
    onFileClick: (file: File) => void | undefined;
    onDelete: (file: File) => void | undefined;
    user: User;
}
export default class DisplayFile extends Component<CustomAttrs> {
    isFileHiding: boolean;
    imageLoaded: boolean;
    file: File;
    fileIcon: string;
    isSelected: boolean;
    isSelectable: boolean;
    oninit(vnode: Mithril.Vnode<CustomAttrs, this>): void;
    onbeforeupdate(vnode: Mithril.VnodeDOM<CustomAttrs, this>): void;
    view(): JSX.Element;
    displayIcon(fileIcon: string): Mithril.Children;
    actionItems(file: File): ItemList<Mithril.Children>;
    handleImageError: () => void;
    handleImageLoad: () => void;
    viewFileInfo(): void;
    hide(e: Event): void;
    confirmDelete(e: MouseEvent): Promise<void>;
}
export {};
