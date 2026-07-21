import app from 'flarum/admin/app';
import Stream from 'flarum/common/utils/Stream';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import ItemList from 'flarum/common/utils/ItemList';
import type { ExtensionPageAttrs } from 'flarum/admin/components/ExtensionPage';
import type Mithril from 'mithril';
import { type SizeUnit } from '../utils/fileSize';
type MimeConfig = {
    adapter: string;
    template: string;
    permission_label?: string;
    permission_slug?: string;
};
type Values = Record<string, Stream<any>>;
export default class UploadPage extends ExtensionPage<ExtensionPageAttrs> {
    loading: boolean;
    successAlert: ReturnType<typeof app.alerts.show> | null;
    uploadS3SetByEnv: boolean;
    uploadLocalCdnSetByEnv: boolean;
    settingsPrefix: string;
    fields: string[];
    checkboxes: string[];
    objects: string[];
    uploadMethodOptions: Record<string, string>;
    templateOptions: Record<string, {
        name: string;
        description: string;
    }>;
    values: Values;
    defaultAdap: string;
    watermarkPositions: Record<string, string>;
    composerButtonVisiblityOptions: Record<string, string>;
    maxFileSizeUnit: Stream<SizeUnit>;
    newMimeType: {
        regex: Stream<string>;
        adapter: Stream<string>;
        template: Stream<string>;
        permission_label: Stream<string>;
    };
    oninit(vnode: Mithril.Vnode<ExtensionPageAttrs, this>): void;
    content(vnode: Mithril.VnodeDOM<ExtensionPageAttrs, this>): JSX.Element;
    adaptorItems(): ItemList<Mithril.Children>;
    getTemplateOptionsForInput(): Record<string, string>;
    updateMimeTypeKey(mime: string, value: string): void;
    updateMimeTypeAdapter(mime: string, config: MimeConfig, value: string): void;
    updateMimeTypeTemplate(mime: string, config: MimeConfig, value: string): void;
    updateMimeTypePermissionLabel(mime: string, config: MimeConfig, value: string): void;
    deleteMimeType(mime: string): void;
    templateOptionsDescriptions(): JSX.Element;
    addMimeType(): void;
    changed(): boolean;
    onsubmit(e: Event): void;
    addPrefix(key: string): string;
    isValidRegex(pattern: string): boolean;
    sanitizeMimeRegex(pattern: string): string;
}
export {};
