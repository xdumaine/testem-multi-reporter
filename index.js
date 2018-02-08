/* eslint-env node */
function MultiReporter (opts) {
  if (!opts || !opts.reporters || !opts.reporters.length) {
    throw new Error('Cannot run a multireporter without providing reports to run');
  }
  this.reporters = [];
  opts.reporters.forEach(r => {
    if (!r.ReporterClass) {
      throw new Error('Each reporter must provide the reporter class');
    }
    // if (!r.opts) {
    //   process.stdout(chalk.yellow(`Reporter ${r.reporterClass.name} did not provide any options.`));
    // }
    this.reporters.push(new r.ReporterClass(...r.args));
  });
}

MultiReporter.prototype = {
  report: function (prefix, data) {
    const args = arguments;
    // do some helpful coersion of messages from assertions without a message
    if (data.error && !data.error.message) {
      if (data.error.hasOwnProperty('actual') && data.error.hasOwnProperty('expected')) {
        data.error.message = `Assertion failure without message - Actual: ${data.error.actual} Expected: ${data.error.expected}`;
        data.error.stack = '[stack hidden - error is assertion error]';
      }
    }
    this.reporters.forEach(r => r.report(...args));
  },
  finish: function () {
    const args = arguments;
    this.reporters.forEach(r => r.finish(...args));
  }
};

module.exports = MultiReporter;
