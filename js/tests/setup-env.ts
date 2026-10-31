import mixin from 'flarum/common/utils/mixin';
import patchMithril from 'flarum/common/utils/patchMithril';
import ExportRegistry from 'flarum/common/ExportRegistry';
import jquery from 'jquery';
import m from 'mithril';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import '@flarum/jest-config/test-matchers';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

global.dayjs = dayjs;
global.requestAnimationFrame = (callback) => callback();
global.$ = jquery;
global.m = m;

window.$ = jquery;
window.m = m;
window.dayjs = dayjs;
window.testing = true;
window.$.fn.tooltip = () => {};
window.matchMedia = () => ({ matches: false, addListener: () => {}, removeListener: () => {} });
window.scrollTo = () => {};

// Core installs this from common/index.ts, which tests never load. Without it the `bidi` attr is inert.
patchMithril(window);
global.m = window.m;

global.flarum = {
  extensions: {},
  reg: new (mixin(ExportRegistry, { checkModule: () => true }))(),
};

document.body.innerHTML = `
<div id="app">
  <main class="App-content">
    <div id="notices"></div>
    <div id="content"></div>
  </main>
</div>
`;
