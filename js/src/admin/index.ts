import app from 'flarum/admin/app';
import extendAdminNav from './extendAdminNav';

export { default as extend } from './extend';

app.initializers.add('fof-upload', () => {
  extendAdminNav();
});
