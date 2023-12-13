import app from 'flarum/forum/app';
import User from 'flarum/common/models/User';
import Model from 'flarum/common/Model';
import downloadButtonInteraction from './downloadButtonInteraction';
import addUploadButton from './addUploadButton';
import addUserPageButton from './addUserPageButton';

export { default as extend } from './extend';
export * from './components';

app.initializers.add('fof-upload', () => {
  // Leaving these here for now.
  // @see ./extend.ts
  User.prototype.viewOthersMediaLibrary = Model.attribute('fof-upload-viewOthersMediaLibrary');
  User.prototype.deleteOthersMediaLibrary = Model.attribute('fof-upload-deleteOthersMediaLibrary');
  User.prototype.uploadCountCurrent = Model.attribute('fof-upload-uploadCountCurrent');
  User.prototype.uploadCountAll = Model.attribute('fof-upload-uploadCountAll');
  User.prototype.uploadSharedFiles = Model.attribute('fof-upload-uploadSharedFiles');
  User.prototype.accessSharedFiles = Model.attribute('fof-upload-accessSharedFiles');

  //app.fileListState = new FileListState();

  addUploadButton();
  downloadButtonInteraction();
  addUserPageButton();
});
