/// <reference types="mithril" />
import Component, { ComponentAttrs } from 'flarum/common/Component';
interface FileManagerButtonAttrs extends ComponentAttrs {
    uploader: any;
}
export default class FileManagerButton extends Component<FileManagerButtonAttrs> {
    view(): JSX.Element;
    /**
     * Event handler for upload button being clicked
     */
    fileManagerButtonClicked(e: PointerEvent): void;
}
export {};
