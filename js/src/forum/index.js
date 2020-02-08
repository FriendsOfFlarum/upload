import app from 'flarum/app';

import downloadButtonInteraction from './downloadButtonInteraction';
import addUploadButton from './addUploadButton';

app.initializers.add('fof-upload', () => {
    addUploadButton();
    downloadButtonInteraction();
});
