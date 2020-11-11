import ServiceClient from '@vrbo/service-client';

const clients = {};

module.exports.getConfig = (id) => ({
    id,
    log: {collect: true}
});

// eslint-disable-next-line complexity
module.exports.getHandler = ({configKey, routeKey, serviceName, timeout = 20000, connectionTimeout = 20000, maxConnectRetry = 1, pathParam}, testData) => async (req) => {
    if (testData && process.env.EXPEDIA_ENVIRONMENT !== 'prod') {
        return await testData(req);
    }
    const {hostname, protocol, routes} = req.server.app.config.get(configKey);
    const clientKey = `${serviceName}${hostname}${protocol}`;
    // eslint-disable-next-line complexity
    const makeRequest = async () => {
        const {method, path, operation} = routes[routeKey];
        if (!clients[clientKey]) {
            clients[clientKey] = ServiceClient.create(serviceName, {hostname, protocol});
        }
        const {payload, statusCode} = await clients[clientKey].request({
            method,
            path: pathParam ? `${path}/${req.params[pathParam] || ''}` : path,
            operation,
            queryParams: req.url.query ? req.url.query : {},
            timeout,
            connectionTimeout,
            maxConnectRetry
        });
        req.log('[API-REQUEST-DETAILS]', method, operation);
        if (statusCode === 204) {
            return {};
        }
        return payload;
    };
    try {
        return makeRequest();
    } catch (e1) {
        try {
            // retry
            clients[clientKey] = ServiceClient.create(serviceName, {hostname, protocol});
            return makeRequest();
        } catch (e2) {
            req.log('[ERROR]', e2);
            return e2;
        }
    }
};
