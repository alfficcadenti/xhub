import ServiceClient from '@vrbo/service-client';

module.exports.annotations = {
    method: 'GET',
    path: '/annotations',
    config: {
        id: 'annotations-api-v1-get',
        log: {
            collect: true
        },
    },
    handler: async (req) => {
        try {
            const serverConfig = req.server.app.config.get('changeRequestsApiServiceConfig');
            const client = ServiceClient.create('annotations-api-v1-get', {
                hostname: serverConfig.hostname,
                protocol: serverConfig.protocol,
            });
            const {payload} = await client.request({
                method: serverConfig.routes.annotations.method,
                path: serverConfig.routes.annotations.path,
                operation: serverConfig.routes.annotations.operation,
                queryParams: req.url.query ? req.url.query : {}
            });
            req.log('[API-REQUEST-DETAILS]', serverConfig.routes.annotations.method, serverConfig.routes.annotations.operation);
            req.log('[ANNOTATIONS-DATA]', payload);
            return payload;
        } catch (e) {
            req.log('[ERROR]', e);
            return e;
        }
    }
};
