import ServiceClient from '@vrbo/service-client';

module.exports.csrUserEvents = {
    method: 'GET',
    path: '/user-events-api/v1/checkoutSuccessRate',
    config: {
        id: 'user-events-csr-api-v1-get',
        log: {
            collect: true
        },
    },
    handler: async (req) => {
        try {
            const serverConfig = req.server.app.config.get('userEventsApiServiceConfig');
            const client = ServiceClient.create('user-events-csr-api-v1-get', {
                hostname: serverConfig.hostname,
                protocol: serverConfig.protocol,
            });
            const {payload} = await client.request({
                method: serverConfig.routes.checkoutSuccessRate.method,
                path: serverConfig.routes.checkoutSuccessRate.path,
                operation: serverConfig.routes.checkoutSuccessRate.operation,
                queryParams: req.url.query ? req.url.query : {}
            });
            req.log('[API-REQUEST-DETAILS]', serverConfig.routes.checkoutSuccessRate.method, serverConfig.routes.checkoutSuccessRate.operation);
            return payload;
        } catch (e) {
            req.log('[ERROR]', e);
            return e;
        }
    }
};
