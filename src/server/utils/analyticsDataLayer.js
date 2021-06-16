const environment = require('@homeaway/environment-resolver');

/**
 * Create the analytics data layer object
 */
function analyticsDataLayer(site) {
    let environmentName = environment.getDeployedEnv();

    // ADL is expecting "dev" for development
    if (environmentName === 'development') {
        environmentName = 'dev';
    }

    return {
        analyticsbrand: site.name,
        appenvironment: environmentName,
        appname: 'opxhub-ui',
        appversion: process.env.MPAAS_APPLICATION_VERSION || '1',
        monikerbrand: site.name,
        mpaasregion: process.env.MPAAS_REGION || '-1',
        pageflow: '-1',
        pagename: '/',
        pagetype: 'internal tools',
        publicuuid: '-1',
        sensitive: 'false',
        visitortype: 'internal'
    };
}

module.exports = analyticsDataLayer;
