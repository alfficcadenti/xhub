import ServiceClient from '@vrbo/service-client';

const getConfig = (id) => ({
    id,
    log: {collect: true}
});

const getHandler = ({method, operation}) => async (req) => {
    try {
        const {hostname, protocol} = req.server.app.config.get('apiDataServiceConfig');
        const client = ServiceClient.create('api-v1-data-service-get', {hostname, protocol});
        const {payload} = await client.request({
            method: 'GET',
            path: req.path,
            operation,
            queryParams: req.url.query ? req.url.query : {},
            timeout: 20000,
            connectionTimeout: 20000,
            maxConnectRetry: 1
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
    handler: getHandler({method: 'GET', operation: 'GET_DEFECTS'})
};

module.exports.incidents = {
    method: 'GET',
    path: '/v1/incidents/{param*}',
    config: getConfig('incidents-get'),
    handler: getHandler({method: 'GET', operation: 'GET_INCIDENTS'})
};

module.exports.prbs = {
    method: 'GET',
    path: '/v1/prbs/{param*}',
    config: getConfig('prbs-get'),
    handler: getHandler({method: 'GET', operation: 'GET_PRBS'})
};

module.exports.portfolio = {
    method: 'GET',
    path: '/v1/portfolio/{param*}',
    config: getConfig('portfolio-get'),
    handler: getHandler({method: 'GET', operation: 'GET_QUALITY_METRICS'})
};
