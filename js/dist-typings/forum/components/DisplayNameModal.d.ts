import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import type Mithril from 'mithril';
import type File from '../../common/models/File';
export interface DisplayNameModalAttrs extends IInternalModalAttrs {
    files: File[];
    onsubmit: (displayNames: Record<string, string>) => void;
}
/**
 * Asks for optional display names before files are inserted into a post.
 *
 * Handles the whole batch in one modal: core's ModalManager closes any open
 * modal when a new one is shown, so prompting per file would drop all but the
 * last. Submitting without changing anything keeps the file names, so this stays
 * a no-op for anyone who does not care.
 */
export default class DisplayNameModal extends Modal<DisplayNameModalAttrs> {
    /** Keyed by file id, so order changes cannot mis-assign a name to a file. */
    displayNames: Record<string, string>;
    oninit(vnode: Mithril.Vnode<DisplayNameModalAttrs, this>): void;
    className(): string;
    title(): any[];
    content(): JSX.Element;
    oncreate(vnode: Mithril.VnodeDOM<DisplayNameModalAttrs, this>): void;
    onsubmit(): void;
    useFileNames(): void;
}
