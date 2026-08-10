import app from 'flarum/admin/app';
import Component, { ComponentAttrs } from 'flarum/common/Component';
import LinkButton from 'flarum/common/components/LinkButton';
import classList from 'flarum/common/utils/classList';
import type Mithril from 'mithril';

export interface SettingsTab {
  /** Stable key, also used as the `page` route parameter. */
  key: string;
  label: Mithril.Children;
  icon: string;
  /** Rendered only while this tab is active. */
  content: () => Mithril.Children;
  /** Shows an unsaved-changes marker on the tab button. */
  dirty?: boolean;
}

export interface SettingsTabsAttrs extends ComponentAttrs {
  tabs: SettingsTab[];
  /** Extension id, used to build the route for each tab. */
  extensionId: string;
}

/**
 * Tab strip for a long settings page.
 *
 * Only the active tab's content is rendered, which is the point — the page was
 * previously a single ~800 line scroll where everything competed for attention.
 *
 * The active tab lives in the `page` route parameter rather than component
 * state, following the same approach as fof/seo's admin pages. That matters
 * because the admin panel routes on the hash (`m.route.prefix = '#'`): writing a
 * tab key into `location.hash` directly replaces the route and bounces the admin
 * to the dashboard on reload. Using the route also makes each tab a real link —
 * middle-clickable, bookmarkable, and navigable with browser Back.
 */
export default class SettingsTabs extends Component<SettingsTabsAttrs> {
  activeKey(): string {
    const requested = m.route.param('page') as string | undefined;
    const known = requested && this.attrs.tabs.some((tab) => tab.key === requested);

    return known ? requested! : this.attrs.tabs[0]?.key;
  }

  view() {
    const { tabs, extensionId } = this.attrs;
    const activeKey = this.activeKey();
    const active = tabs.find((tab) => tab.key === activeKey) ?? tabs[0];

    return (
      <div className="SettingsTabs">
        <div className="SettingsTabs-nav">
          {tabs.map((tab, index) => (
            <LinkButton
              key={tab.key}
              className={classList('Button SettingsTabs-tab', tab.key === active.key && 'SettingsTabs-tab--active')}
              icon={tab.icon}
              // The first tab is the bare extension route, so the default view
              // has a clean URL rather than a redundant ?page= parameter.
              href={index === 0 ? app.route('extension', { id: extensionId }) : app.route('extension', { id: extensionId, page: tab.key })}
            >
              <span className="SettingsTabs-tabLabel">{tab.label}</span>
              {tab.dirty && (
                <span
                  className="SettingsTabs-tabDirty"
                  aria-label={app.translator.trans('fof-upload.admin.tabs.unsaved_changes', {}, true)}
                  title={app.translator.trans('fof-upload.admin.tabs.unsaved_changes', {}, true)}
                />
              )}
            </LinkButton>
          ))}
        </div>

        <div className="SettingsTabs-panel">{active.content()}</div>
      </div>
    );
  }
}
