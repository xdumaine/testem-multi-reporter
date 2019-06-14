# Testem Multi Reporter

Helpful in running multiple reporters for the same test run. For example,
in CI, you can output a failure only, dot, or time reporter to the console, and
an xunit report to a file.

## Installation

    npm install --save-dev testem-multi-reporter

## Usage

Create a `testem.js` config file that sets reporter to `testem-multi-reporter`,
and pass it the other reporters you want to use.

```js
const MultiReporter = require('testem-multi-reporter');
const TimeReporter = require('testem-time-reporter');
const XunitReporter = require('testem/lib/reporters/xunit_reporter');

const reporters = [{
  ReporterClass: TimeReporter,
  args: [{ out: process.stdout }]
}, {
  ReporterClass: XunitReporter,
  args: [false, 'tests/xunit.xml', { get: () => false }]
}];
const multiReporter = new MultiReporter({ reporters });

module.exports = {
  framework: 'qunit',
  test_page: 'tests/index.html?hidepassed&coverage',
  disable_watching: true,
  launch_in_ci: [
    'PhantomJS'
  ],
  reporter: multiReporter
};
```

Run tests in an Ember CLI project, reporting only failures:

    ember test --config-file ~/work/project/testem.js

## Notes

This currently doesn't work with `ember test --module some-module` because Ember CLI
rewrites the `testem.json` file to accomplish this, and doesn't support the
`testem.js` file.

See [Ember CLI config rewriting](https://github.com/ember-cli/ember-cli/blob/f4844e674d35a3651693954fc9baf0dbb03cc22f/lib/commands/test.js#L51)
and [testem.js parsing](https://github.com/airportyh/testem/blob/aa6e9767ca81ae031095779c733882ba42184f42/lib/config.js#L86).
