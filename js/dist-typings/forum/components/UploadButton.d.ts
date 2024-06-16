export default class UploadButton extends Component<any, undefined> {
    constructor();
    oninit(vnode: any): void;
    isMediaUploadButton: any;
    view(): JSX.Element;
    /**
     * Process the upload event.
     *
     * @param e
     */
    process(e: any): void;
    /**
     * Event handler for upload button being clicked
     *
     * @param {PointerEvent} e
     */
    uploadButtonClicked(e: PointerEvent): void;
}
import Component from "flarum/common/Component";
