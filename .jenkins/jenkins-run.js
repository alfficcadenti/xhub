const runAll = require('npm-run-all');
const processResults = require('../__tests__/automation/utils/process-results.js');
const jenkinsArguments = require('minimist')(process.argv.slice(2));
const parallelConfig = {
  continueOnError: true,
  parallel: true,
  printName: true,
  stderr: process.stdout,
  stdout: process.stdout
};
const script = jenkinsArguments.type;
const reportScript = jenkinsArguments.reporter;
const daReports = jenkinsArguments.report || 'da-reporter';

console.info(`Script Type: ${script}`);
console.info(`DA Report: ${daReports}`);

runAll()
    .then(() => {
      console.info('cleaned directory');
      return runAll(script, parallelConfig);
    })
    .catch(err => {
      console.error(`test job failed with ${err.message}`);
    })
    .then(() => {
      console.info('Creating html report');
      return runAll(reportScript, parallelConfig);
    })
    .catch(error => {
      console.error('Error creating the html report from test results');
    })
    .then(processResults)
    .catch(err => {
      console.error(`test result process failed with ${err.message}`);
    })
    .then(() => {
      let deployedVersion;
      let browserVersion;
      const versionFile = './reports/version.txt';
      const browserVersionFile = './reports/browserVersion.txt';
      const fs = require('fs');

      console.info('Start to store results into MongoDB');
      if (fs.existsSync(versionFile)) {
        deployedVersion = fs.readFileSync(versionFile, 'utf8');
      } else {
        deployedVersion = 'UNKNOWN';
      }
      if (fs.existsSync(browserVersionFile)) {
        browserVersion = fs.readFileSync(browserVersionFile, 'utf8');
      } else {
        browserVersion = 'UNKNOWN';
      }
      if (process.env.shelvedCL !== null && process.env.devId != null) {
        deployedVersion = `shelved_${process.env.shelvedCL}_${process.env.devId}`;
      }
      process.env.WAR_FILE_VERSION = deployedVersion;
      process.env.BROWSER_VERSION = browserVersion;
      console.info(
          `'store results into MongoDB with build version: ${deployedVersion} and browser version: ${browserVersion}`
      );
      runAll([`${daReports}`], parallelConfig);
      console.info(`[info] Project name of ${daReports} was recorded into the DA Database`);
    })
    .catch(err => {
      console.error(`Report Generation Failed: ${err.message}`);
    });
