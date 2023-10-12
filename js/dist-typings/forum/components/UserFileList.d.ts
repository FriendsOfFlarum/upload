export default class UserFileList extends Component<any, undefined> {
    constructor();
    inModal: any;
    restrictFileType: any;
    downloadOnClick: any;
    /**
     * @type {string[]} List of file UUIDs currently being hidden.
     */
    filesBeingHidden: string[] | undefined;
    /**
     * The user who's media we are dealing with
     */
    user: any;
    /**
     * Execute function on file click
     *
     * @param {import('../../common/models/File').default} file
     */
    onFileClick(file: import('../../common/models/File').default): void;
    /**
     * Check if a file is selectable
     *
     * @param {import('../../common/models/File').default} file
     */
    isSelectable(file: import('../../common/models/File').default): any;
    /**
     * Begins the hiding process for a file.
     *
     * - Shows a native confirmation dialog
     * - If confirmed, sends AJAX request to the hide file API
     *
     * @param {import('../../common/models/File').default} file File to hide
     */
    hideFile(file: import('../../common/models/File').default): void;
}
import Component from "flarum/common/Component";
