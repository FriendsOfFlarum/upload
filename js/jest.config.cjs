const path = require('path');

module.exports = require('@flarum/jest-config')({
  // The stock setup leaves Mithril unpatched, so `bidi` would bind nothing.
  setupFilesAfterEnv: [path.resolve(__dirname, 'tests/setup-env.ts')],
});
