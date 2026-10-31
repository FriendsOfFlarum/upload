import app from 'flarum/admin/app';
import Component, { type ComponentAttrs } from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import type Mithril from 'mithril';

export interface SettingsTab {
  key: string;
  label: Mithril.Children;
  icon: string;
  content: () => Mithril.Children;
  // How many of this tab's settings are changed but not saved.
  dirty?: number;
}

export interface SettingsTabsAttrs extends ComponentAttrs {
  tabs: SettingsTab[];
  active: string;
  onchange: (key: string) => void;
}

// The active tab is held by the page, not the route: a route change remounts the page and drops unsaved edits.
export default class SettingsTabs extends Component<SettingsTabsAttrs> {
  view() {
    const { tabs } = this.attrs;
    const active = tabs.find((tab) => tab.key === this.attrs.active) ?? tabs[0];

    return (
      <div className="Tabs SettingsTabs">
        <div className="Tabs-nav" role="tablist" onkeydown={(e: KeyboardEvent) => this.keydown(e)}>
          {tabs.map((tab) => {
            const selected = tab.key === active.key;

            return (
              <Button
                key={tab.key}
                className="Button Button--link"
                role="tab"
                id={`fof-upload-tab-${tab.key}`}
                aria-selected={selected ? 'true' : 'false'}
                aria-controls={`fof-upload-tabpanel-${tab.key}`}
                tabindex={selected ? 0 : -1}
                active={selected}
                icon={tab.icon}
                data-tab={tab.key}
                onclick={() => this.attrs.onchange(tab.key)}
              >
                {tab.label}
                {tab.dirty ? (
                  <span className="Button-badge">
                    {tab.dirty}
                    <span className="visually-hidden">{app.translator.trans('fof-upload.admin.tabs.unsaved_changes')}</span>
                  </span>
                ) : null}
              </Button>
            );
          })}
        </div>

        <div className="Tabs-content" role="tabpanel" id={`fof-upload-tabpanel-${active.key}`} aria-labelledby={`fof-upload-tab-${active.key}`}>
          {active.content()}
        </div>
      </div>
    );
  }

  keydown(e: KeyboardEvent): void {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

    const keys = this.attrs.tabs.map((tab) => tab.key);
    const next = keys[(keys.indexOf(this.attrs.active) + (e.key === 'ArrowRight' ? 1 : -1) + keys.length) % keys.length];

    e.preventDefault();
    this.attrs.onchange(next);
    m.redraw.sync();
    this.element.querySelector<HTMLElement>(`[data-tab="${next}"]`)?.focus();
  }
}
