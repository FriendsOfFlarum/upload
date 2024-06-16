/// <reference types="flarum/@types/translator-icu-rich" />
export default class UploadPage extends ExtensionPage<import("flarum/admin/components/ExtensionPage").ExtensionPageAttrs> {
    constructor();
    oninit(vnode: any): void;
    fields: string[] | undefined;
    checkboxes: string[] | undefined;
    objects: string[] | undefined;
    watermarkPositions: {
        'top-left': string;
        'top-right': string;
        'bottom-left': string;
        'bottom-right': string;
        center: string;
        left: string;
        top: string;
        right: string;
        bottom: string;
    } | undefined;
    composerButtonVisiblityOptions: {
        both: import("@askvortsov/rich-icu-message-formatter").NestedStringArray;
        'upload-btn': import("@askvortsov/rich-icu-message-formatter").NestedStringArray;
        'media-btn': import("@askvortsov/rich-icu-message-formatter").NestedStringArray;
    } | undefined;
    settingsPrefix: string | undefined;
    uploadMethodOptions: {} | undefined;
    templateOptions: {} | undefined;
    values: {} | undefined;
    defaultAdap: string | undefined;
    newMimeType: {
        regex: any;
        adapter: any;
        template: any;
    } | undefined;
    /**
     * Show the actual ImageUploadPage.
     *
     * @returns {*}
     */
    content(): any;
    adaptorItems(): ItemList<any>;
    getTemplateOptionsForInput(): {};
    updateMimeTypeKey(mime: any, value: any): void;
    updateMimeTypeAdapter(mime: any, config: any, value: any): void;
    updateMimeTypeTemplate(mime: any, config: any, value: any): void;
    deleteMimeType(mime: any): void;
    templateOptionsDescriptions(): any;
    addMimeType(): void;
    /**
     * Checks if the values of the fields and checkboxes are different from
     * the ones stored in the database
     *
     * @returns boolean
     */
    changed(): boolean;
    /**
     * Saves the settings to the database and redraw the page
     *
     * @param e
     */
    onsubmit(e: any): void;
    successAlert: number | undefined;
    /**
     * Adds the prefix `this.settingsPrefix` at the beginning of `key`
     *
     * @returns string
     */
    addPrefix(key: any): string;
}
import ExtensionPage from "flarum/admin/components/ExtensionPage";
import ItemList from "flarum/common/utils/ItemList";
