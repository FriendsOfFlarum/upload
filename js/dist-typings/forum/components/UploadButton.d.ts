import Component from 'flarum/common/Component';
import type Uploader from '../handler/Uploader';
import type Mithril from 'mithril';
interface UploadButtonAttrs {
    uploader: Uploader;
    disabled?: boolean;
    isMediaUploadButton?: boolean;
}
export default class UploadButton extends Component<UploadButtonAttrs> {
    isMediaUploadButton: boolean;
    oninit(vnode: Mithril.Vnode<UploadButtonAttrs, this>): void;
    view(): JSX.Element;
    process(_e: Event): void;
    uploadButtonClicked(_e: PointerEvent): void;
}
export {};
