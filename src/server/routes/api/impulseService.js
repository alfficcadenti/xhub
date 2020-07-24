import ServiceClient from '@vrbo/service-client';

module.exports.impulseBookingDataService = {
    method: 'GET',
    path: '/user-events-api/v1/bookings/count/{param*}',
    config: {
        id: 'impulse-booking-data-api-v1-get',
        log: {
            collect: true
        },
    },
    handler: async (req) => {
        try {
            const serverConfig = req.server.app.config.get('userEventsApiServiceConfig');
            const client = ServiceClient.create('impulse-booking-data-api-v1-get', {
                hostname: serverConfig.hostname,
                protocol: serverConfig.protocol,
            });
            const {payload} = await client.request({
                method: serverConfig.routes.bookingsImpulse.method,
                path: serverConfig.routes.bookingsImpulse.path,
                operation: serverConfig.routes.bookingsImpulse.operation,
                queryParams: req.url.query ? req.url.query : {}
            });
            req.log('[API-REQUEST-DETAILS]', serverConfig.routes.bookings.method, serverConfig.routes.bookings.operation);
            req.log('[BOOKING-DATA]', payload);
            return payload;
        } catch (e) {
            req.log('[ERROR]', e);
            return e;
        }
    }
};
