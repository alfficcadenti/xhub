const ReactDOMServer = require('react-dom/server');
const React = require('react');

// this is context for this route on every request.
const routeInfo = {'pageTitle': 'OpXHub'};

module.exports = {
    method: 'GET',
    path: '/home/{path*}',
    options: {
        id: 'home',
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

            if (process.env.NODE_ENV === 'development') {
                return h.view(template, {body, ...context});
            }
            if ('code' in request.query) {
                return request.oauthClient.login(request).then((id) => {
                    const ttl = id.exp - id.iat;
                    return h
                        .view(template, {body, ...context})
                        .header('Set-Cookie', `access_token=${id.tokenDecoded.token};Path=/;HttpOnly;Max-Age=${ttl};`)
                        .header('Set-Cookie', `email=${id.email};Path=/;Max-Age=${ttl};`, {'append': true});
                }).catch((e) => {
                    request.log('Login error', e); // eslint-disable-line no-console
                    return h.redirect(request.oauthClient.authorizeUrl(request));
                });
            }
            if ('access_token' in request.state) {
                return request.oauthClient.verify(request.state.access_token)
                    .then(() => h.view(template, {body, ...context}))
                    .catch(() => h.redirect(request.oauthClient.authorizeUrl(request)));
            }
            return h.redirect(request.oauthClient.authorizeUrl(request));
        }
    }
};
