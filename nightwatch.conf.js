let nightWatchConfigs;

if (process.env.isBrowserstack === 'true') {
    nightWatchConfigs = require(`${process.env.frameworkPath}configs/browsers/browserstack.conf.js`);
} else {
    nightWatchConfigs = require(`${process.env.frameworkPath}configs/browsers/localBrowsers.conf.js`);
}

module.exports = nightWatchConfigs;
