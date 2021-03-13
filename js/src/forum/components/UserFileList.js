import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import mimeToIcon from '../../common/mimeToIcon';
import classList from 'flarum/common/utils/classList';

export default class UserFileList extends Component {
    oninit(vnode) {
        super.oninit(vnode);

        // Load file list
        app.fileListState.setUser(vnode.attrs.user || app.session.user);

        this.inModal = vnode.attrs.selectable;
        this.restrictFileType = vnode.attrs.restrictFileType || null;
        this.downloadOnClick = this.attrs.downloadOnClick || false;
    }

    view() {
        const state = app.fileListState;

        return (
            <div className={'fof-upload-file-list'}>
                {/* Loading */}
                {state.isLoading() && state.files.length === 0 && (
                    <div className={'fof-upload-loading'}>
                        {app.translator.trans('fof-upload.forum.file_list.loading')}

                        <LoadingIndicator />
                    </div>
                )}

                {/* Empty personal file list */}
                {this.inModal && state.empty() && (
                    <p className="fof-upload-empty">
                        <i className="fas fa-cloud-upload-alt fof-upload-empty-icon" />

                        {app.translator.trans(`fof-upload.forum.file_list.modal_empty_${app.screen() !== 'phone' ? 'desktop' : 'phone'}`)}
                    </p>
                )}

                {/* Empty file list */}
                {!this.inModal && state.empty() && <p className="fof-upload-empty">{app.translator.trans('fof-upload.forum.file_list.empty')}</p>}

                {/* File list */}
                <ul>
                    {state.files.map((file) => {
                        const fileIcon = mimeToIcon(file.type());
                        const fileSelectable = this.restrictFileType ? this.isSelectable(file) : true;

                        const fileClassNames = classList([
                            'fof-file',
                            // File is image
                            fileIcon === 'image' && 'fof-file-type-image',
                            // File is selected
                            this.attrs.selectedFiles && this.attrs.selectedFiles.indexOf(file.id()) >= 0 && 'fof-file-selected',
                        ]);

                        /**
                         * File's baseName (file name + extension)
                         * @type {string}
                         */
                        const fileName = file.baseName();

                        return (
                            <li>
                                <button
                                    className={fileClassNames}
                                    onclick={() => this.onFileClick(file)}
                                    disabled={!fileSelectable}
                                    aria-label={app.translator.trans('fof-upload.forum.file_list.select_file_a11y_label', {
                                        fileName,
                                    })}
                                >
                                    <figure>
                                        {fileIcon === 'image' ? (
                                            <img
                                                src={file.url()}
                                                className="fof-file-image-preview"
                                                draggable={false}
                                                // Images should always have an `alt`, even if empty!
                                                //
                                                // As we already state the file name as part of the
                                                // button alt label, there's no point in restating it.
                                                //
                                                // See: https://www.w3.org/WAI/tutorials/images/decorative#decorative-image-as-part-of-a-text-link
                                                alt=""
                                            />
                                        ) : (
                                            <span
                                                className="fof-file-icon"
                                                // Prevents a screen-reader from traversing this node.
                                                //
                                                // This is a placeholder for when no preview is available,
                                                // and a preview won't benefit a user using a screen
                                                // reader anyway, so there is no benefit to making them
                                                // aware of a lack of a preview.
                                                role="presentation"
                                            >
                                                <i className={`fa-fw ${fileIcon}`} />
                                            </span>
                                        )}

                                        <figcaption className="fof-file-name">{fileName}</figcaption>
                                    </figure>
                                </button>
                            </li>
                        );
                    })}
                </ul>

                {/* Load more files */}
                {state.hasMoreResults() && (
                    <div className={'fof-load-more-files'}>
                        <Button
                            className={'Button Button--primary'}
                            disabled={state.isLoading()}
                            loading={state.isLoading()}
                            onclick={() => state.loadMore()}
                        >
                            {app.translator.trans('fof-upload.forum.file_list.load_more_files_btn')}
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    /**
     * Execute function on file click
     *
     * @param {*} file
     */
    onFileClick(file) {
        // Custom functionality
        if (this.attrs.onFileSelect) {
            this.attrs.onFileSelect(file);
            return;
        }

        // Download on click
        if (this.attrs.downloadOnClick) {
            window.open(file.url());
            return;
        }
    }

    /**
     * Check if a file is selectable
     *
     * @param {File} file
     */
    isSelectable(file) {
        const fileType = file.type();

        // Custom defined file types
        if (Array.isArray(this.restrictFileType)) {
            return this.restrictFileType.indexOf(fileType) >= 0;
        }

        // Image
        else if (this.restrictFileType === 'image') {
            return fileType.includes('image/');
        }

        // Audio
        else if (this.restrictFileType === 'audio') {
            return fileType.includes('audio/');
        }

        // Video
        else if (this.restrictFileType === 'video') {
            return fileType.includes('video/');
        }

        return false;
    }
}
