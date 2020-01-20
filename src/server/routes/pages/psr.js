const ReactDOMServer = require('react-dom/server');
const React = require('react');
const Serialize = require('serialize-javascript');
const ServiceClient = require('@vrbo/service-client');

// this is context for this route on every request.
const routeInfo = {'pageTitle': 'OpXHub'};

// create and maintain a cached service client instance
function getClient(name = 'example-service') {
    return getClient.client ? getClient.client : getClient.client = ServiceClient.create(name);
}

// a function to build the request context.
async function getRequestInfo(request) {
    const currentTime = new Date();
    const l10n = await request.server.getLocalization('en_us', {key: 'page'}); // babel prime
    const list = await getClient().request({ // service-client
        method: 'GET',
        path: '/todos',
        queryParams: {
            completed: true
        },
        operation: 'get_todos',
        context: request
    });
    return {
        description: l10n.description,
        pageTitle: l10n.title,
        currentTime,
        value: 'This is a value',
        list: list.payload.slice(0, 3)
    };
}

module.exports = {
    method: 'GET',
    path: '/psr',
    options: {
        id: 'psr',
        async handler(request, h) {
            // combine the context (server, route, request)
            const requestInfo = await getRequestInfo(request);
            const siteInfo = request.server.siteInfo();
            const context = {...siteInfo, ...routeInfo, ...requestInfo};

            // render react component and monitor timing
            const ServerApp = request.pre.component.default;
            const startRender = Date.now();
            const body = ReactDOMServer.renderToString(
                <ServerApp path={request.path}
                    location={request.url.pathname}
                    list={context.list}
                    value={context.value}
                />
            );
            const renderTime = Date.now() - startRender;

            const statsd = request.plugins['@homeaway/catalyst-monitoring-statsd'];
            statsd.timing('react_ssr_render_time', renderTime);

            // render the output with context and handlebars.
            const template = request.pre.template;
            return h.view(template, {body, properties: Serialize({value: context.value, list: context.list}), ...context});
        }
    }
};