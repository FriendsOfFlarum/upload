import Component from 'flarum/Component';
import Button from 'flarum/components/Button';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import mimeToIcon from '../../common/mimeToIcon';

export default class UserFileList extends Component {
    oninit(vnode) {
        super.oninit(vnode);

        // Load file list
        app.fileListState.setUser(vnode.attrs.user || app.session.user);

        this.inModal = vnode.attrs.selectable;

        this.restrictFileType = vnode.attrs.restrictFileType || null;
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
                    <p className={'fof-upload-empty'}>
                        <i className={'fas fa-cloud-upload-alt fof-upload-empty-icon'}></i>

                        {app.translator.trans(`fof-upload.forum.file_list.modal_empty_${app.screen() !== 'phone' ? 'desktop' : 'phone'}`)}
                    </p>
                )}

                {/* Empty file list */}
                {!this.inModal && state.empty()(<p className={'fof-upload-empty'}>{app.translator.trans('fof-upload.forum.file_list.empty')}</p>)}

                {/* File list */}
                <ul>
                    {state.files.map((file) => {
                        let fileClassNames = 'fof-file';
                        const fileIcon = mimeToIcon(file.type());
                        const fileSelectable = this.restrictFileType ? this.isSelectable(file) : true;

                        // File is image
                        if (fileIcon === 'image') {
                            fileClassNames += ' fof-file-type-image';
                        }

                        // File is selected
                        if (this.attrs.selectedFiles && this.attrs.selectedFiles.indexOf(file.id()) >= 0) {
                            fileClassNames += ' fof-file-selected';
                        }

                        return (
                            <li>
                                <button
                                    className={fileClassNames}
                                    onclick={this.attrs.onFileSelect ? () => this.attrs.onFileSelect(file) : null}
                                    title={file.baseName()}
                                    disabled={!fileSelectable}
                                >
                                    <span className={'fof-file-icon'}>
                                        <i className={fileIcon !== 'image' ? fileIcon : 'far fa-file-image'} />
                                    </span>

                                    {fileIcon === 'image' && <img src={file.url()} className={'fof-file-image-preview'} draggable={false} />}

                                    <span className={'fof-file-name'}>{file.baseName()}</span>
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
                            {app.translator.trans('fof-upload.forum.buttons.load_more_files')}
                        </Button>
                    </div>
                )}
            </div>
        );
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
