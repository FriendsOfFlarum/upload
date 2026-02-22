import FormModal from 'flarum/common/components/FormModal';
import type Mithril from 'mithril';
interface InspectionResult {
    laravel_validation?: boolean;
    laravel_validation_error?: string;
    mime_detector?: string;
    php_mime?: string;
    guessed_extension?: string;
}
export default class InspectMimeModal extends FormModal {
    uploading: boolean;
    inspection: InspectionResult;
    oninit(vnode: Mithril.Vnode<Record<string, never>, this>): void;
    className(): string;
    title(): string;
    content(): Mithril.Children;
    onupload(event: Event): void;
}
export {};
