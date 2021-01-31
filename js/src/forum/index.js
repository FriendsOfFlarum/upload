import app from 'flarum/app';

import File from '../common/models/File';
import FileListState from './states/FileListState';
import downloadButtonInteraction from './downloadButtonInteraction';
import addUploadButton from './addUploadButton';

export * from './components';

app.initializers.add('fof-upload', () => {
    addUploadButton();
    downloadButtonInteraction();

    // File model
    app.store.models.files = File;

    // File list state
    app.fileListState = new FileListState();
});
