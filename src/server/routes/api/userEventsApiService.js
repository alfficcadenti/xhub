import ServiceClient from '@vrbo/service-client';

module.exports.userEventsApiService = {
    method: 'GET',
    path: '/user-events-api/v1/bookings',
    config: {
        id: 'user-events-api-v1-get',
        log: {
            collect: true
        },
    },
    handler: async (req) => {
        try {
            const serverConfig = req.server.app.config.get('userEventsApiServiceConfig');
            const client = ServiceClient.create('user-events-api-v1-get', {
                hostname: serverConfig.hostname,
                protocol: serverConfig.protocol,
            });
            const {payload} = await client.request({
                method: serverConfig.routes.bookings.method,
                path: serverConfig.routes.bookings.path,
                operation: serverConfig.routes.bookings.operation,
                queryParams: req.url.query ? req.url.query : {}
            });
            req.log('[API-REQUEST-DETAILS]', serverConfig.routes.bookings.method, serverConfig.routes.bookings.operation);
            return payload;
        } catch (e) {
            req.log('[ERROR]', e);
            return e;
        }
    }
};