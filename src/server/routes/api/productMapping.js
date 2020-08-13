import ServiceClient from '@vrbo/service-client';

module.exports.productMapping = {
    method: 'GET',
    path: '/productMapping',
    config: {
        id: 'product-mapping-api-v1-get',
        log: {
            collect: true
        },
    },
    handler: async (req) => {
        try {
            const serverConfig = req.server.app.config.get('changeRequestsApiServiceConfig');
            const client = ServiceClient.create('product-mapping-api-v1-get', {
                hostname: serverConfig.hostname,
                protocol: serverConfig.protocol,
            });
            const {payload} = await client.request({
                method: serverConfig.routes.productMapping.method,
                path: serverConfig.routes.productMapping.path,
                operation: serverConfig.routes.productMapping.operation,
                queryParams: req.url.query ? req.url.query : {}
            });
            req.log('[API-REQUEST-DETAILS]', serverConfig.routes.productMapping.method, serverConfig.routes.productMapping.operation);
            req.log('[PRODUCT-MAPPING-DATA]', payload);
            return payload;
        } catch (e) {
            req.log('[ERROR]', e);
            return e;
        }
    }
};
