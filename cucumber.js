const fs = require('fs');
const arguments = {
    testType: 'acceptance',
    environment: 'AWS_TEST',
    breakpoint: 'desktop',
    browser: 'chrome',
    device: 'iPhoneXS',
    retry: 0,
    pr: 0,
    parallel: 1,
    debugMode: false,
    isBrowserstack: false,
    browserstack: {
        key: '',
        localIdentifier: '',
        user: ''
    }
};
process.env.frameworkPath = './__tests__/automation/';
const reportsPath = './reports';

if (!fs.existsSync(reportsPath)) {
    fs.mkdirSync(reportsPath);
}

process.argv.forEach(val => {
    if (val.includes('type:')) {
        const argument = val.split(':');
        process.env.TEST_TYPE = arguments.testType = argument[1];
    }

    if (val.includes('env:')) {
        const argument = val.split(':');
        arguments.environment = argument[1];
    }

    if (val.includes('breakpoint:')) {
        const argument = val.split(':');
        process.env.DEVICE_TYPE = arguments.breakpoint = argument[1];
    }

    if (val.includes('browser:')) {
        const argument = val.split(':');
        arguments.browser = argument[1];
    }

    if (val.includes('device:')) {
        const argument = val.split(':');
        arguments.device = argument[1];
    }

    if (val.includes('retry:')) {
        const argument = val.split(':');
        arguments.retry = argument[1];
    }

    if (val.includes('parallel:')) {
        const argument = val.split(':');
        arguments.parallel = argument[1];
    }

    if (val.includes('debug')) {
        arguments.debugMode = true;
    }

    if (val.includes('bsExecution')) {
        arguments.isBrowserstack = true;
    }

    if (val.includes('key:')) {
        const argument = val.split(':');
        arguments.browserstack.key = argument[1];
    }

    if (val.includes('id:')) {
        const argument = val.split(':');
        arguments.browserstack.localIdentifier = argument[1];
    }

    if (val.includes('user:')) {
        const argument = val.split(':');
        arguments.browserstack.user = argument[1];
    }

    if (val.includes('pr:')) {
        const argument = val.split(':');
        arguments.pr = argument[1];
    }
});

let defaultRequirements = [
    '--require-module @babel/register',
    `--require ${process.env.frameworkPath}configs/cucumber.startup.js`,
    `--require ${process.env.frameworkPath}definitions/`,
    `--require ${process.env.frameworkPath}methods/`,
    `--require ${process.env.frameworkPath}utils/hooks.js`,
    `--format json:reports/cucumber.json`,
    '--format node_modules/cucumber-pretty',
    `--tags '@${arguments.testType} and @${arguments.breakpoint}'`,
    `--parallel ${arguments.parallel}`,
    `--retry ${arguments.retry}`
];

if (arguments.debugMode) {
    process.env.DEBUG_MODE = true;
}

if (arguments.isBrowserstack) {
    process.env.IS_BS_EXECUTION = 'true'
    defaultRequirements.push('--tags "not @accessibility"');
}

defaultRequirements = defaultRequirements.join(' ');

console.info('|--------------------------------------------|');
console.info(`| Test Type:  ${arguments.testType}`);
console.info(`| Breakpoint:  ${arguments.breakpoint}`);

if (arguments.breakpoint === 'mobile' && arguments.isBrowserstack) {
    console.info(`| Device Type:  ${arguments.device}`);
    process.env.TEST_BROWSER = arguments.device;
} else {
    console.info(`| Test Browser:  ${arguments.browser}`);
    process.env.TEST_BROWSER = arguments.browser;
}

console.info(`| Tagging: @${arguments.testType} and @${arguments.breakpoint}`);
console.info(`| Parallel:  ${arguments.parallel}`);
console.info(`| Retry:  ${arguments.retry}`);

console.info(`| BrowserStack?:  ${arguments.isBrowserstack}`);
if (arguments.isBrowserstack) {
    console.info('| BS Key: ', arguments.browserstack.key);
    console.info('| Local Identifier: ', arguments.browserstack.localIdentifier);
    process.env.BROWSERSTACK_ACCESS_KEY = arguments.browserstack.key;
    process.env.BROWSERSTACK_USERNAME = arguments.browserstack.user;
    process.env.BROWSERSTACK_LOCAL_IDENTIFIER = arguments.browserstack.localIdentifier;
}

console.info('|--------------------------------------------|\n\n');

process.env.breakpoint = arguments.breakpoint;
process.env.usePWAendPoint = true; //change use appEndpoint? some reference in common-nightwatch as well
process.env.appName = 'opxhub-ui'; //fill in the appname
process.env.appSegment = 'opxhub-Segment'; //fill in the segment info
process.env.testEndpoint = arguments.environment;
process.env.isRealDevice = false;

if (arguments.environment === 'stockyard') {
    process.env.ghprbPullId = arguments.pr;
}

if (arguments.isBrowserstack) {
    process.env.isBrowserstack = true;
}

if (process.env.isBrowserstack) {
    const browserstack = require('browserstack-local');
    const bsLocal = new browserstack.Local();

    if (!bsLocal.isRunning()) {
        const bsConfigs = {
            key: arguments.browserstack.key,
            user: arguments.browserstack.user,
            localIdentifier: arguments.browserstack.localIdentifier
        };

        bsLocal.start(bsConfigs, res => {
            if (res && res.message) {
                console.error('ERROR BS LOCAL: ', res.message);
                return;
            }

            console.info('[info:Cucumber] Started BrowserStackLocal');
        });
    }
}

module.exports = {
    default: defaultRequirements
};
