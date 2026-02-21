import app from 'flarum/admin/app';
import FlarumUploadImageButton from 'flarum/common/components/UploadImageButton';

export default class UploadImageButton extends FlarumUploadImageButton {
  resourceUrl() {
    return app.forum.attribute('apiUrl') + '/' + this.attrs.path;
  }
}
