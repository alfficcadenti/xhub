import {getConfig, getHandler} from './utils';
import {getPageViewsTestData, getFunnelTestData, getEPSFunnelTestData} from './testData/userEventsTestService';

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

module.exports.epsPageViewsLoBUserEvents = {
    method: 'GET',
    path: '/v1/pageViewsLoB/eps/{param*}',
    config: getConfig('eps-page-views-lob-api-v1-get'),
    handler: getHandler(getHandlerParams('epsPageViewsLoB'), getPageViewsTestData)
};

module.exports.epsPageViewsUserEvents = {
    method: 'GET',
    path: '/v1/pageViews/eps/{param*}',
    config: getConfig('eps-page-views-api-v1-get'),
    handler: getHandler(getHandlerParams('epsPageViews'), getPageViewsTestData)
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
    handler: getHandler(getHandlerParams('pageViews'))
};

module.exports.impulseBookingDataService = {
    method: 'GET',
    path: '/v1/bookings/count/{param*}',
    config: getConfig('impulse-bookings-data-api-v1-get'),
    handler: getHandler(getHandlerParams('bookingsImpulseCount'))
};

module.exports.impulseBookingDataGrouped = {
    method: 'GET',
    path: '/v1/bookings/count/group',
    config: getConfig('impulse-bookings-data-grouped-api-v1-get'),
    handler: getHandler(getHandlerParams('bookingsImpulseCountGrouped'))
};

module.exports.impulseBrandsService = {
    method: 'GET',
    path: '/v1/bookings/filters/brands',
    config: getConfig('impulse-brands-data-api-v1-get'),
    handler: getHandler(getHandlerParams('bookingsImpulseBrands'))
};

module.exports.impulseYOY = {
    method: 'GET',
    path: '/v1/bookings/count/YOY/{param*}',
    config: getConfig('impulse-YOY-api-v1-get'),
    handler: getHandler(getHandlerParams('bookingsImpulseYOY'))
};

module.exports.impulseChangePercentage = {
    method: 'GET',
    path: '/v1/bookings/change/percentage',
    config: getConfig('impulse-change-percentage-api-v1-get'),
    handler: getHandler(getHandlerParams('bookingsImpulseChangePercentage'))
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
// This proxy is for Impulse SNow API. We will remove this proxy once we get the endpoint accessible through
// Expedia Internet.
module.exports.impulseRevlossV2 = {
    method: 'GET',
    path: '/v2/bookings/revenueLoss/{impact*}',
    config: getConfig('impulse-revloss-api-v2-get'),
    handler: getHandler(Object.assign(getHandlerParams('bookingsImpulseRevlossV2'), {pathParam: 'impact'}))
};

// This proxy is for Impulse SNow API after API first. We will remove this proxy once we get the endpoint accessible through

module.exports.impulseRevlossApiFirst = {
    method: 'GET',
    path: '/v1/bookings/revenue-loss/{impact*}',
    config: getConfig('impulse-revloss-api-v1-get-api-first'),
    handler: getHandler(Object.assign(getHandlerParams('bookingsImpulseRevlossApiFirst'), {pathParam: 'impact'}))
};

module.exports.impulseRevlossV2ApiFirst = {
    method: 'GET',
    path: '/v2/bookings/revenue-loss/{impact*}',
    config: getConfig('impulse-revloss-api-v2-get-api-first'),
    handler: getHandler(Object.assign(getHandlerParams('bookingsImpulseRevlossV2ApiFirst'), {pathParam: 'impact'}))
};

module.exports.epsFunnelViewUserEvents = {
    method: 'GET',
    path: '/user-events-api/v1/funnelView/eps/{param*}',
    config: getConfig('eps-funnel-view-api-v1-get'),
    handler: getHandler(getHandlerParams('epsFunnelView'), getEPSFunnelTestData)
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
