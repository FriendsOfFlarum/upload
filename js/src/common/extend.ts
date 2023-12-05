import Extend from 'flarum/common/extenders';
import File from './models/File';

export default [
  new Extend.Store() //
    .add('files', File)
    .add('shared-files', File),
];
