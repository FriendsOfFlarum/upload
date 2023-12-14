import app from 'flarum/admin/app';
import { extend } from 'flarum/common/extend';
import AdminNav from 'flarum/admin/components/AdminNav';
import LinkButton from 'flarum/common/components/LinkButton';
import ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';

export default function extendAdminNav() {
  extend(AdminNav.prototype, 'items', function (items: ItemList<Mithril.Children>) {
    items.add(
      'shared-uploads',
      <LinkButton href={app.route('adminUploads')} icon="fas fa-file-upload" title={app.translator.trans('fof-upload.admin.shared-uploads.title')}>
        {app.translator.trans('fof-upload.admin.nav.shared-uploads-button')}
      </LinkButton>,
      49
    );
  });
}
