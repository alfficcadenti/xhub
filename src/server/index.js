/* eslint-disable complexity */
require('source-map-support').install();
require('css-modules-require-hook')({}); // enable processing of css in external modules

// const customConfig = require('./config/config');
const Catalyst = require('@vrbo/catalyst-server');
const ServiceClient = require('@vrbo/service-client');
const Path = require('path');
const Error = require('./error');
const {routes} = require('./routes/index');
const H2o2 = require('@hapi/h2o2');

const ExpediaCACerts = require('@catalyst/ca-certs-expedia');
const SecretHandler = require('@homeaway/shortstop-secret-expedia-vault');

ExpediaCACerts.load(); // necessary to establish secure communication with Vault

async function start(options = {}) {
    const env = process.env.EXPEDIA_DEPLOYED_ENVIRONMENT || process.env.EXPEDIA_ENVIRONMENT || process.env.NODE_ENV;

    function getSecret() {
        if (!env || env === 'dev' || env === 'development') {
            return null;
        }
        return SecretHandler.init({appName: 'opxhub-ui'});
    }

    // builds, composes, and configures server via manifest.json
    const server = await Catalyst.init({
        userConfigPath: Path.resolve(__dirname, 'manifest.json'),
        shortstopHandlers: {
            secret: await getSecret()
        },
        onConfig(config) {
            ServiceClient.mergeConfig(config.get('server.app.services'));
            return config;
        },
        ...options
    });

    // set up errors.
    await Error(server);

    // set up redirect for root route
    server.route(routes);

    // set up production route for static assets
    const isProd = (process.env.NODE_ENV || 'development') === 'production';
    const hasCDN = !!process.env.CDN_URL;
    if (isProd && !hasCDN) {
        server.route({
            method: 'GET',
            path: '/{param*}',
            handler: {
                directory: {
                    path: Path.join(__dirname, '../static')
                }
            }
        });
    }

    // example of decorating the server context.
    // available via `server.siteInfo()` or `request.server.siteInfo()`
    server.decorate('server', 'siteInfo', () => ({siteName: 'OpXHub'}));

    // start the server
    await server.register(H2o2, {once: true});
    await server.start();
    server.log(['info'], `server running: ${server.info.uri}`);

    // return the server
    return server;
}

if (require.main === module) {
    // this is getting called from script, start the server.
    start();
} else {
    // export the function for testing.
    module.exports = start;
}
