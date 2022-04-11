const ReactDOMServer = require('react-dom/server');
const React = require('react');

const authHandler = require('../authHandler');

module.exports = (id) => ({
    method: 'GET',
    path: `/${id}/{path*}`,
    options: {
        id,
        async handler(request, h) {
            try {
                const siteInfo = request.server.siteInfo();
                const context = {...siteInfo};

                // render react component and monitor timing
                const ServerApp = request.pre.component.default;
                const startRender = Date.now();
                const body = ReactDOMServer.renderToString(
                    <ServerApp path={request.path}
                        location={request.url.pathname}
                    />
                );
                const renderTime = Date.now() - startRender;

                const statsd = request.plugins['@catalyst/hapi-monitoring-statsd'];
                statsd.timing('react_ssr_render_time', renderTime);

                // render the output with context and handlebars.
                const template = request.pre.template;
                return authHandler(request, h, template, body, context, true);
            } catch (e) {
                request.log('[ERROR]', e);
                return e;
            }
        }
    }
});
