export default class InspectMimeModal extends Modal<import("flarum/common/components/Modal").IInternalModalAttrs, undefined> {
    constructor();
    uploading: boolean | undefined;
    inspection: any;
    onupload(event: any): Promise<void>;
}
import Modal from "flarum/common/components/Modal";
