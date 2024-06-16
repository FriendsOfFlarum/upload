/// <reference types="flarum/@types/translator-icu-rich" />
export default class InspectMimeModal extends Modal<import("flarum/common/components/Modal").IInternalModalAttrs, undefined> {
    constructor();
    oninit(vnode: any): void;
    uploading: boolean | undefined;
    inspection: any;
    title(): import("@askvortsov/rich-icu-message-formatter").NestedStringArray;
    content(): JSX.Element;
    onupload(event: any): Promise<void>;
}
import Modal from "flarum/common/components/Modal";
