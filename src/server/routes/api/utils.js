import ServiceClient from '@vrbo/service-client';

const clients = {};

module.exports.getConfig = (id) => ({
    id,
    log: {collect: true}
});

// eslint-disable-next-line complexity
const makeRequest = async (option, testData, req, refreshClient) => {
    if (testData && process.env.EXPEDIA_ENVIRONMENT !== 'prod') {
        return await testData(req);
    }
    const {
        configKey,
        routeKey,
        serviceName,
        timeout = 20000,
        connectionTimeout = 20000,
        maxConnectRetry = 1,
        pathParam
    } = option;
    const {hostname, protocol, routes} = req.server.app.config.get(configKey);
    const clientKey = `${serviceName}${hostname}${protocol}`;
    if (!clients[clientKey] || refreshClient) {
        clients[clientKey] = ServiceClient.create(serviceName, {hostname, protocol});
    }
    const {method, path, operation} = routes[routeKey];
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

// eslint-disable-next-line complexity
module.exports.getHandler = (option, testData) => async (req) => {
    try {
        return makeRequest(option, testData, req, false);
    } catch (e1) {
        try {
            return makeRequest(option, testData, req, true);
        } catch (e2) {
            req.log('[ERROR]', e2);
            return e2;
        }
    }
};
