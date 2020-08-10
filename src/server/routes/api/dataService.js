import ServiceClient from '@vrbo/service-client';

const getConfig = (id) => ({
    id,
    log: {collect: true}
});

const getHandler = (route) => async (req) => {
    try {
        const serverConfig = req.server.app.config.get('apiDataServiceConfig');
        const {method, operation} = serverConfig.routes[route];
        const client = ServiceClient.create('api-v1-data-service-get', {
            hostname: serverConfig.hostname,
            protocol: serverConfig.protocol,
        });
        const {payload} = await client.request({
            method: 'GET',
            path: req.path,
            operation,
            queryParams: req.url.query ? req.url.query : {}
        });
        req.log('[API-REQUEST-DETAILS]', method, operation);
        return payload;
    } catch (e) {
        req.log('[ERROR]', e);
        return e;
    }
};


module.exports.defects = {
    method: 'GET',
    path: '/v1/defects/{param*}',
    config: getConfig('defects-get'),
    handler: getHandler('defects')
};

module.exports.incidents = {
    method: 'GET',
    path: '/v1/incidents/{param*}',
    config: getConfig('incidents-get'),
    handler: getHandler('incidents')
};

module.exports.prbs = {
    method: 'GET',
    path: '/v1/prbs/{param*}',
    config: getConfig('prbs-get'),
    handler: getHandler('prbs')
};
