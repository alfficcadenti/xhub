import ServiceClient from '@vrbo/service-client';

module.exports.getConfig = (id) => ({
    id,
    log: {collect: true}
});

module.exports.getHandler = ({configKey, routeKey, serviceName, timeout = 20000, connectionTimeout = 20000, maxConnectRetry = 1, pathParam}) => async (req) => {
    try {
        const {hostname, protocol, routes} = req.server.app.config.get(configKey);
        const {method, path, operation} = routes[routeKey];
        const client = ServiceClient.create(serviceName, {hostname, protocol});
        const {payload} = await client.request({
            method,
            path: pathParam ? `${path}/${req.params[pathParam] || ''}` : path,
            operation,
            queryParams: req.url.query ? req.url.query : {},
            timeout,
            connectionTimeout,
            maxConnectRetry
        });
        req.log('[API-REQUEST-DETAILS]', method, operation);
        return payload;
    } catch (e) {
        req.log('[ERROR]', e);
        return e;
    }
};
