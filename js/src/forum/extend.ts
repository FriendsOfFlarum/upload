import { default as extend } from '../common/extend';
import Extend from 'flarum/common/extenders';
import UserPageResolver from 'flarum/forum/resolvers/UserPageResolver';

export default [
  ...extend,

  new Extend.Routes() //
    .add('user.uploads', '/u/:username/uploads', () => import('./components/UploadsUserPage'), UserPageResolver),
];
