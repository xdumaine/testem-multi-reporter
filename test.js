/* global describe, it */

const PassThrough = require('stream').PassThrough;
const MultiReporter = require('./index');
const TimeReporter = require('testem-time-reporter');
const XunitReporter = require('testem/lib/reporters/xunit_reporter');
const assert = require('chai').assert;

function MetaDataReporter (opts) {
  this.out = opts.out;
}

MetaDataReporter.prototype = {
  reportMetadata(tag, data) {
    if (tag === 'metadata-tag') {
      this.out.write(data.testMetadata);
    }
  }
}

describe('MultiReporter reporter', function () {
  it('Throws if no reporters are provided', function () {
    assert.throws(() => new MultiReporter({}));
  });

  it('Can run multiple reporters', function () {
    const timeReporterStream = new PassThrough();
    const xunitReporterStream = new PassThrough();
    const reporters = [{
      ReporterClass: TimeReporter,
      args: [{ out: timeReporterStream }]
    }, {
      ReporterClass: XunitReporter,
      args: [false, xunitReporterStream, { get: () => false }]
    }];
    const multiReporter = new MultiReporter({ reporters });
    multiReporter.report('phantomjs', {
      name: 'A test is run',
      passed: true,
      runDuration: 300,
      logs: []
    });
    multiReporter.report('phantomjs', {
      name: 'A test fails',
      failed: true,
      runDuration: 300,
      error: new Error('Test Error')
    });
    multiReporter.finish();

    const timeReporterOutput = timeReporterStream.read().toString();
    const xunitReporterOutput = xunitReporterStream.read().toString();
    assert.equal(timeReporterOutput.indexOf('Test Failure -') > -1, true);
    assert.equal(xunitReporterOutput.indexOf('<testsuite name="Testem Tests"'), 0);
  });

  it('Can pass metadata to reporters', function () {
    const metaDataReporterStream = new PassThrough();
    const xunitReporterStream = new PassThrough();
    const reporters = [{
      ReporterClass: MetaDataReporter,
      args: [{ out: metaDataReporterStream }]
    }, {
      ReporterClass: XunitReporter,
      args: [false, xunitReporterStream, { get: () => false }]
    }];
    const multiReporter = new MultiReporter({ reporters });
    multiReporter.reportMetadata('metadata-tag', {
      testMetadata: 'some test metadata'
    });

    const metaDataReporterOutput = metaDataReporterStream.read().toString();
    assert.equal(metaDataReporterOutput, 'some test metadata');
  });
});
