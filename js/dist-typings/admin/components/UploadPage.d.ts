import app from 'flarum/admin/app';
import { type SettingsTab } from './SettingsTabs';
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
    /**
     * Selected S3 provider preset. Display-only: it drives placeholders and which
     * fields are relevant, and is derived from the saved endpoint on load rather
     * than being persisted as its own setting.
     */
    s3Provider: Stream<string>;
    /**
     * Reveal storage services that are installed but neither configured nor used
     * by any file type, so a new one can be set up. They are hidden by default
     * because an installed adapter package is not the same thing as an adapter
     * the forum has anything to do with.
     */
    showAllAdapters: boolean;
    oninit(vnode: Mithril.Vnode<ExtensionPageAttrs, this>): void;
    content(vnode: Mithril.VnodeDOM<ExtensionPageAttrs, this>): JSX.Element;
    tabs(): SettingsTab[];
    filesTab(): JSX.Element;
    /**
     * Adapters whose section should be shown by default.
     *
     * Two reasons qualify an adapter: a file type routes to it, or it already has
     * credentials saved. The second matters because configuring storage before
     * pointing a file type at it is a perfectly normal order to work in — an admin
     * part-way through setting up S3 must not have the section disappear on them.
     */
    adaptersInUse(): Set<string>;
    private hasAnyValue;
    storageTab(): JSX.Element;
    /**
     * Pointer to the docs when a storage service is available but not installed.
     *
     * The adapters list is built from `class_exists()` checks on the backend, so a
     * service whose composer package is absent never appears anywhere on this page
     * — an admin had no way to discover S3 or Qiniu were even options. A single
     * link is enough to make that discoverable; the install commands belong in the
     * docs rather than permanently on screen.
     */
    uninstalledAdapters(): JSX.Element | null;
    /** How many installed adapters are currently hidden because nothing uses them. */
    hiddenAdapterCount(inUse: Set<string>): number;
    /**
     * Storage adapter credential sections.
     *
     * Only adapters a mime type actually routes to are shown. Previously every
     * installed adapter package rendered its credentials permanently, so a forum
     * with the S3 package installed but unused still had eight S3 fields on screen.
     */
    adaptorItems(inUse: Set<string>): ItemList<Mithril.Children>;
    /**
     * S3 and S3-compatible storage.
     *
     * Previously split across "AWS S3 storage settings" and "Advanced S3 storage
     * settings", with nothing indicating that a non-AWS provider needs fields from
     * both. Now a single section led by a provider preset, which supplies the
     * endpoint format, path-style requirement and ACL support that an admin
     * otherwise had to know from the provider's own documentation.
     */
    s3Section(): JSX.Element;
    /**
     * Apply a provider preset.
     *
     * Only fields the preset can meaningfully determine are touched — path-style
     * addressing, and clearing an ACL the provider would reject. Credentials,
     * bucket and endpoint stay as the admin entered them.
     */
    selectS3Provider(key: string): void;
    imagesTab(): JSX.Element;
    advancedTab(): JSX.Element;
    /** Column heading with a tooltip explaining what the column controls. */
    columnHeader(column: string): JSX.Element;
    /** Options for the "add file types" picker: a prompt, the presets, then custom. */
    presetOptions(): Record<string, string>;
    /**
     * Add a row from a named preset.
     *
     * Authoring a regex from nothing is where a non-technical admin gets stuck, so
     * the presets cover the groupings forums actually ask for. "Custom" inserts an
     * empty row that opens straight into raw editing.
     */
    addPreset(key: string): void;
    /**
     * Move a row up or down.
     *
     * Order is significant: the backend matches with `->first()`, so the first
     * pattern that matches a file's mime type wins. Object key order survives the
     * JSON round trip on both sides, so rebuilding the object in a new order is
     * enough to change precedence.
     */
    moveMimeType(mime: string, direction: -1 | 1): void;
    getTemplateOptionsForInput(): Record<string, string>;
    templateOptionsDescriptions(): JSX.Element;
    updateMimeTypeKey(mime: string, value: string): void;
    updateMimeTypeAdapter(mime: string, config: MimeConfig, value: string): void;
    updateMimeTypeTemplate(mime: string, config: MimeConfig, value: string): void;
    updateMimeTypePermissionLabel(mime: string, config: MimeConfig, value: string): void;
    deleteMimeType(mime: string): void;
    /** Whether any setting belonging to the given tab differs from what is saved. */
    tabChanged(tab: string): boolean;
    fieldChanged(key: string): boolean;
    changed(): boolean;
    onsubmit(e: Event): void;
    addPrefix(key: string): string;
    isValidRegex(pattern: string): boolean;
    sanitizeMimeRegex(pattern: string): string;
}
export {};
