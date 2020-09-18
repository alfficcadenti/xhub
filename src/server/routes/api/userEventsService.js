import {getConfig, getHandler} from './utils';

const getHandlerParams = (routeKey) => ({
    routeKey,
    configKey: 'userEventsApiServiceConfig',
    serviceName: 'api-v1-user-events-service'
});

module.exports.bookingsUserEvents = {
    method: 'GET',
    path: '/user-events-api/v1/bookings',
    config: getConfig('user-events-bookings-api-v1-get'),
    handler: getHandler(getHandlerParams('bookings'))
};

module.exports.pageViewsUserEvents = {
    method: 'GET',
    path: '/v1/pageViews/{param*}',
    config: getConfig('page-views-api-v1-get'),
    handler: getHandler(getHandlerParams('pageViews'))
};

module.exports.impulseBookingDataService = {
    method: 'GET',
    path: '/v1/bookings/count/{param*}',
    config: getConfig('impulse-bookings-data-api-v1-get'),
    handler: getHandler(getHandlerParams('bookingsImpulseCount'))
};

module.exports.impulseBrandsService = {
    method: 'GET',
    path: '/v1/bookings/filters/brands',
    config: getConfig('impulse-brands-data-api-v1-get'),
    handler: getHandler(getHandlerParams('bookingsImpulseBrands'))
};

module.exports.impulseFiltersService = {
    method: 'GET',
    path: '/v1/bookings/filters',
    config: getConfig('impulse-filters-data-api-v1-get'),
    handler: getHandler(getHandlerParams('bookingsImpulseFilters'))
};

module.exports.impulseRevloss = {
    method: 'GET',
    path: '/v1/bookings/revenueLoss',
    config: getConfig('impulse-revloss-api-v1-get'),
    handler: getHandler(getHandlerParams('bookingsImpulseRevloss'))
};

module.exports.impulseRevlossImpact = {
    method: 'GET',
    path: '/v1/bookings/revenueLoss/impact',
    config: getConfig('impulse-revloss-impact-api-v1-get'),
    handler: getHandler(getHandlerParams('bookingsImpulseRevlossImpact'))
};

module.exports.funnelViewUserEvents = {
    method: 'GET',
    path: '/user-events-api/v1/funnelView/{param*}',
    config: getConfig('funnel-view-api-v1-get'),
    handler: getHandler(getHandlerParams('funnelView'))
};

module.exports.csrUserEvents = {
    method: 'GET',
    path: '/user-events-api/v1/checkoutSuccessRate',
    config: getConfig('user-events-csr-api-v1-get'),
    handler: getHandler(getHandlerParams('checkoutSuccessRate'))
};
