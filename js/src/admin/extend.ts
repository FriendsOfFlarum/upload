import { default as extend } from '../common/extend';
import Extend from 'flarum/common/extenders';
import SharedUploadPage from './components/SharedUploadPage';

export default [
  ...extend,

  new Extend.Routes() //
    .add('adminUploads', '/uploads', SharedUploadPage),
];
