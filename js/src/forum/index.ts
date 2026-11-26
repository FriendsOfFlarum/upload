import app from 'flarum/forum/app';
import User from 'flarum/common/models/User';
import Model from 'flarum/common/Model';
import downloadButtonInteraction from './downloadButtonInteraction';
import addUploadButton from './addUploadButton';
import addUserPageButton from './addUserPageButton';
import addUserAttributes from '../common/addUserAttributes';

export { default as extend } from './extend';

app.initializers.add('fof-upload', () => {
  (User.prototype as any).viewOthersMediaLibrary = Model.attribute('fof-upload-viewOthersMediaLibrary');
  (User.prototype as any).deleteOthersMediaLibrary = Model.attribute('fof-upload-deleteOthersMediaLibrary');
  (User.prototype as any).uploadCountCurrent = Model.attribute('fof-upload-uploadCountCurrent');
  (User.prototype as any).uploadCountAll = Model.attribute('fof-upload-uploadCountAll');

  addUserAttributes();
  addUploadButton();
  downloadButtonInteraction();
  addUserPageButton();
});
