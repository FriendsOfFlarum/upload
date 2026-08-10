import Component, { ComponentAttrs } from 'flarum/common/Component';
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
    activeKey(): string;
    view(): JSX.Element;
}
