/**
 * Follows the same shape as the bundled extensions (tags, mentions, embed):
 * @flarum/jest-config with a moduleNameMapper for `flarum/*`.
 *
 * The difference is the mapper target. Bundled extensions resolve core through a
 * monorepo-relative path (`../../../framework/core/js/src`); a standalone
 * extension only has the Composer-vendored copy, so it maps there instead.
 *
 * See https://github.com/flarum/framework/issues/4689 — @flarum/jest-config's
 * setup-env.js imports from `@flarum/core`, which is not published to npm, so
 * component tests that rely on the bootstrapped app are still out of reach here.
 * Pure-logic tests (modules importing nothing from `flarum/*`) do work, which is
 * what testMatch is scoped to.
 */
module.exports = require('@flarum/jest-config')({
  moduleNameMapper: {
    '^flarum/(.*)$': '<rootDir>/../vendor/flarum/core/js/src/$1',
    // jest-config's own setup-env.js imports from `@flarum/core`, which only
    // resolves inside the monorepo. Point it at the Composer-vendored copy so
    // the shared setup can load standalone.
    '^@flarum/core/src/(.*)$': '<rootDir>/../vendor/flarum/core/js/src/$1',
    // Core's compiled sources deep-import babel's ESM helpers, but @babel/runtime's
    // `exports` map does not expose those paths, so Jest refuses to resolve them.
    // Mapping straight to the files sidesteps the exports map.
    '^@babel/runtime/helpers/esm/(.*)$': '<rootDir>/node_modules/@babel/runtime/helpers/esm/$1.js',
  },
  // @flarum/jest-config's setup chain loads `test-matchers.ts` — a TypeScript
  // file inside node_modules. Jest ignores node_modules for transforms by
  // default, so standalone it reaches the runtime untransformed and throws
  // `SyntaxError: Unexpected token ':'`. The monorepo does not hit this because
  // its hoisted babel-jest already covers the package. Allowing the transform
  // into just this package is what makes the shared setup usable here.
  transformIgnorePatterns: ['/node_modules/(?!@flarum/jest-config)'],

  // Scoped to pure-logic utilities until the upstream blocker is resolved.
  // Widen this when component tests become possible standalone.
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
});
