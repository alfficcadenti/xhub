import ServiceClient from '@vrbo/service-client';

module.exports.apiService = {
    method: 'GET',
    path: '/api/v1/{param*}',
    config: {
        id: 'api-v1-get',
        log: {
            collect: true
        },
    },
    handler: async (req) => {
        try {
            const serverConfig = req.server.app.config.get('apiServiceConfig');
            const client = ServiceClient.create('api-v1-get', {
                hostname: serverConfig.hostname,
                protocol: serverConfig.protocol,
            });
            const {payload} = await client.request({
                method: serverConfig.routes.apiService.method,
                path: req.path,
                operation: serverConfig.routes.apiService.operation,
                queryParams: req.url.query ? req.url.query : {}
            });
            return payload;
        } catch (e) {
            req.log('[ERROR]', e);
            return e;
        }
    }
};