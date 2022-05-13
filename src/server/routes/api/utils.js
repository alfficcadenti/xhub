import ServiceClient from '@vrbo/service-client';

const clients = {};

module.exports.getConfig = (id) => ({
    id,
    log: {collect: true}
});

const formatPath = (req, path, pathParam) => pathParam ? `${path}/${req.params[pathParam] || ''}` : path;

const makeRequest = async (option, req, refreshClient) => {
    const {
        configKey,
        routeKey,
        serviceName,
        timeout = 20000,
        connectTimeout = 20000,
        maxConnectRetry = 1,
        pathParam
    } = option;
    const {hostname, protocol, routes} = req.server.app.config.get(configKey);
    const clientKey = `${serviceName}${hostname}${protocol}`;
    if (!clients[clientKey] || refreshClient) {
        clients[clientKey] = ServiceClient.create(serviceName, {hostname, protocol});
    }
    const {method, path, operation} = routes[routeKey];
    const request = {
        method,
        path: formatPath(req, path, pathParam),
        operation,
        queryParams: req.query || {},
        payload: req.payload,
        timeout,
        connectTimeout,
        maxConnectRetry
    };
    req.log('[API-REQUEST-DETAILS]', Object.assign(request, {hostname, protocol}));
    const {payload, statusCode} = await clients[clientKey].request(request);
    if (statusCode === 204) {
        return {};
    }
    return payload;
};

module.exports.getHandler = (option, testData) => async (req) => {
    try {
        if (testData && process.env.EXPEDIA_ENVIRONMENT !== 'prod') {
            return await testData(req);
        }
        return makeRequest(option, req, false);
    } catch (e1) {
        try {
            return makeRequest(option, req, true);
        } catch (e2) {
            req.log('[ERROR]', e2);
            return e2;
        }
    }
};
