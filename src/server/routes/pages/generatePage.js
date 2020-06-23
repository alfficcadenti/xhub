const ReactDOMServer = require('react-dom/server');
const React = require('react');

const authHandler = require('../authHandler');

// this is context for this route on every request.
const routeInfo = {'pageTitle': 'OpXHub'};

module.exports = (id) => ({
    method: 'GET',
    path: `/${id}/{path*}`,
    options: {
        id,
        async handler(request, h) {
            try {
                const siteInfo = request.server.siteInfo();
                const context = {...siteInfo, ...routeInfo};

                // render react component and monitor timing
                const ServerApp = request.pre.component.default;
                const startRender = Date.now();
                const body = ReactDOMServer.renderToString(
                    <ServerApp path={request.path}
                        location={request.url.pathname}
                    />
                );
                const renderTime = Date.now() - startRender;

                const statsd = request.plugins['@homeaway/catalyst-monitoring-statsd'];
                statsd.timing('react_ssr_render_time', renderTime);

                // render the output with context and handlebars.
                const template = request.pre.template;
                const requireDevAuth = (process.env.EXPEDIA_ENVIRONMENT === 'test' || process.env.EXPEDIA_ENVIRONMENT === 'int' || process.env.EXPEDIA_ENVIRONMENT === 'prod');
                return authHandler(request, h, template, body, context, requireDevAuth);
            } catch (e) {
                request.log('[ERROR]', e);
                return e;
            }
        }
    }
});
