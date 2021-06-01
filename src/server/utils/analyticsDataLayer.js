const environment = require('@homeaway/environment-resolver');
const pkg = require('../../../package.json');

const appName = pkg.name.replace('@homeaway/', '');

/**
 * Create the analytics data layer object
 */
function analyticsDataLayer({site}) {
    let environmentName = environment.getDeployedEnv();

    // ADL is expecting "dev" for development
    if (environmentName === 'development') {
        environmentName = 'dev';
    }

    return JSON.stringify({
        appversion: process.env.MPAAS_APPLICATION_VERSION,
        publicuuid: '-1',
        monikerbrand: site.name,
        analyticsbrand: site.name,
        appname: appName,
        appenvironment: environmentName,
        pagetype: 'internal tools',
        pagename: '/',
        pageflow: '-1',
        visitortype: 'internal',
        sensitive: 'false',
        mpaasregion: process.env.MPAAS_REGION || '-1'
    });
}

module.exports = analyticsDataLayer;
