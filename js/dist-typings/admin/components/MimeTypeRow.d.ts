import Component, { ComponentAttrs } from 'flarum/common/Component';
import type Mithril from 'mithril';
export interface MimeTypeRowAttrs extends ComponentAttrs {
    pattern: string;
    adapter: string;
    template: string;
    permissionLabel: string;
    adapterOptions: Record<string, string>;
    templateOptions: Record<string, string>;
    /** Position in the list, used for the first-match-wins ordering controls. */
    index: number;
    total: number;
    onPatternChange: (next: string) => void;
    onAdapterChange: (next: string) => void;
    onTemplateChange: (next: string) => void;
    onPermissionLabelChange: (next: string) => void;
    onMove: (direction: -1 | 1) => void;
    onRemove: () => void;
}
/**
 * One file-type mapping.
 *
 * A stored pattern is a regex, which most admins should never have to read. When
 * it decomposes cleanly (see mimePatterns) the row shows the media type plus a
 * chip per subtype; when it does not, the raw pattern is shown in a text input
 * exactly as before, so nothing an admin wrote by hand is ever reinterpreted.
 *
 * "Edit pattern" switches any row to the raw input regardless, so a technical
 * admin is never boxed in by the friendly view.
 */
export default class MimeTypeRow extends Component<MimeTypeRowAttrs> {
    /** Raw-regex editing, either forced by the admin or because the pattern is advanced. */
    editingRaw: boolean;
    /** Open state of the "add subtype" control. */
    addingSubtype: boolean;
    newSubtype: string;
    view(vnode: Mithril.Vnode<MimeTypeRowAttrs, this>): JSX.Element;
    /**
     * Raw regex input, for advanced patterns and for anyone who prefers it.
     *
     * `canReturnToChips` is false when the pattern cannot be represented as chips,
     * in which case there is nothing to switch back to and the toggle is replaced
     * by an explanation.
     */
    rawPatternInput(canReturnToChips: boolean): JSX.Element;
    /** Media type plus one removable chip per subtype. */
    chipEditor(type: string, subtypes: string[]): JSX.Element;
    commitSubtype(type: string, subtypes: string[]): void;
}
