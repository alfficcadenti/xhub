import ServiceClient from '@vrbo/service-client';

const getConfig = (id) => {
    return {
        id,
        log: {
            collect: true
        }
    };
};
const getHandler = ({method, operation}) => async (req) => {
    try {
        const {hostname, protocol} = req.server.app.config.get('userEventsApiServiceConfig');
        const client = ServiceClient.create('impulse-booking-data-api-v1-get', {hostname, protocol});
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

module.exports.impulseFiltersService = {
    method: 'GET',
    path: '/v1/bookings/filters/{param*}',
    config: getConfig('impulse-bookings-data-api-v1-get'),
    handler: getHandler({method: 'GET', operation: 'filtersImpulse'})
};

module.exports.impulseBookingDataService = {
    method: 'GET',
    path: '/v1/bookings/count/{param*}',
    config: getConfig('impulse-filters-data-api-v1-get'),
    handler: getHandler({method: 'GET', operation: 'bookingsImpulse'})
};

