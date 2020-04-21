import ServiceClient from '@vrbo/service-client';

module.exports.prbs = {
    method: 'GET',
    path: '/prbs/{param*}',
    config: {
        id: 'prbs-get',
        log: {
            collect: true
        },
    },
    handler: async (req) => {
        try {
            const serverConfig = req.server.app.config.get('apiDataServiceConfig');
            const client = ServiceClient.create('api-v1-data-service-get', {
                hostname: serverConfig.hostname,
                protocol: serverConfig.protocol,
            });
            const {payload} = await client.request({
                method: 'GET',
                path: req.path,
                operation: serverConfig.routes.prbs.operation,
                queryParams: req.url.query ? req.url.query : {}
            });
            req.log('[API-REQUEST-DETAILS]', serverConfig.routes.prbs.method, serverConfig.routes.prbs.operation);
            return payload;
        } catch (e) {
            req.log('[ERROR]', e);
            return e;
        }
    }
};