import { default as extend } from '../common/extend';
import Extend from 'flarum/common/extenders';

export default [
  ...extend,

  new Extend.Routes() //
    .add('user.uploads', '/u/:username/uploads', () => import('./components/UploadsUserPage')),
];
