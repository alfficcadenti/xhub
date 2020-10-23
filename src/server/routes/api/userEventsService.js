import {getConfig, getHandler} from './utils';
import {getPageViewsTestData, getFunnelTestData} from './testData/userEventsTestService';

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

module.exports.pageViewsLoBUserEvents = {
    method: 'GET',
    path: '/v1/pageViewsLoB/{param*}',
    config: getConfig('page-views-lob-api-v1-get'),
    handler: getHandler(getHandlerParams('pageViewsLoB'), getPageViewsTestData)
};

module.exports.pageViewsUserEvents = {
    method: 'GET',
    path: '/v1/pageViews/{param*}',
    config: getConfig('page-views-api-v1-get'),
    handler: getHandler(getHandlerParams('pageViews'), getPageViewsTestData)
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
    path: '/v1/bookings/revenueLoss/{impact*}',
    config: getConfig('impulse-revloss-api-v1-get'),
    handler: getHandler(Object.assign(getHandlerParams('bookingsImpulseRevloss'), {pathParam: 'impact'}))
};

module.exports.funnelViewUserEvents = {
    method: 'GET',
    path: '/user-events-api/v1/funnelView/{param*}',
    config: getConfig('funnel-view-api-v1-get'),
    handler: getHandler(getHandlerParams('funnelView'), getFunnelTestData)
};

module.exports.csrUserEvents = {
    method: 'GET',
    path: '/user-events-api/v1/checkoutSuccessRate',
    config: getConfig('user-events-csr-api-v1-get'),
    handler: getHandler(getHandlerParams('checkoutSuccessRate'))
};
