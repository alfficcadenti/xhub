import ServiceClient from '@vrbo/service-client';

module.exports.changeRequests = {
    method: 'GET',
    path: '/change-requests-api/v1/changeDetails',
    config: {
        id: 'change-request-api-v1-get',
        log: {
            collect: true
        },
    },
    handler: async (req) => {
        try {
            const serverConfig = req.server.app.config.get('changeRequestsApiServiceConfig');
            const client = ServiceClient.create('change-request-api-v1-get', {
                hostname: serverConfig.hostname,
                protocol: serverConfig.protocol,
            });
            const {payload} = await client.request({
                method: serverConfig.routes.changeDetails.method,
                path: serverConfig.routes.changeDetails.path,
                operation: serverConfig.routes.changeDetails.operation,
                queryParams: req.url.query ? req.url.query : {}
            });
            req.log('[API-REQUEST-DETAILS]', serverConfig.routes.changeDetails.method, serverConfig.routes.changeDetails.operation);
            return payload;
        } catch (e) {
            req.log('[ERROR]', e);
            return e;
        }
    }
};
