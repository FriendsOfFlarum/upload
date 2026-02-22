import FlarumUploadImageButton from 'flarum/common/components/UploadImageButton';
import type { IUploadImageButtonAttrs } from 'flarum/common/components/UploadImageButton';
interface UploadImageButtonAttrs extends IUploadImageButtonAttrs {
    path?: string;
}
export default class UploadImageButton extends FlarumUploadImageButton {
    attrs: UploadImageButtonAttrs;
    resourceUrl(): string;
}
export {};
