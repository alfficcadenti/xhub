const ReactDOMServer = require('react-dom/server');
const React = require('react');

// this is context for this route on every request.
const routeInfo = {'pageTitle': 'OpXHub'};

module.exports = {
    method: 'GET',
    path: '/resiliency-questionnaire/{path*}',
    options: {
        id: 'resiliency-questionnaire',
        async handler(request, h) {
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
            // eslint-disable-next-line new-cap
            return h.view(template, {body, ...context});
        }
    }
};
