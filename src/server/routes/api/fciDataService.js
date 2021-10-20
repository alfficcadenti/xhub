import {getConfig, getHandler} from './utils';

const getHandlerParams = (routeKey) => ({
    routeKey,
    configKey: 'apiFciDataServiceConfig',
    serviceName: 'api-v1-fci-data-service'
});

module.exports.checkoutFailures = {
    method: 'GET',
    path: '/v1/checkout-failures/{param*}',
    config: getConfig('checkout-failures-get'),
    handler: getHandler(Object.assign(getHandlerParams('checkoutFailures')))
};

module.exports.checkoutFailuresErrorCategories = {
    method: 'GET',
    path: '/v1/checkout-failures/error-categories/{param*}',
    config: getConfig('checkout-failures-error-categories-get'),
    handler: getHandler(Object.assign(getHandlerParams('checkoutFailuresErrorCategories')))
};

module.exports.checkoutFailuresErrorCodes = {
    method: 'GET',
    path: '/v1/checkout-failures/error-codes/{param*}',
    config: getConfig('checkout-failures-error-codes-get'),
    handler: getHandler(Object.assign(getHandlerParams('checkoutFailuresErrorCodes')))
};

module.exports.checkoutFailuresLobs = {
    method: 'GET',
    path: '/v1/checkout-failures/lob/{param*}',
    config: getConfig('checkout-failures-lobs-get'),
    handler: getHandler(Object.assign(getHandlerParams('checkoutFailuresLobs')))
};

module.exports.checkoutFailuresSearch = {
    method: 'GET',
    path: '/v1/checkout-failures/search/{param*}',
    config: getConfig('checkout-failures-search-get'),
    handler: getHandler(Object.assign(getHandlerParams('checkoutFailuresSearch')))
};

module.exports.checkoutFailuresSites = {
    method: 'GET',
    path: '/v1/checkout-failures/sites/{param*}',
    config: getConfig('checkout-failures-sites-get'),
    handler: getHandler(Object.assign(getHandlerParams('checkoutFailuresSites')))
};

module.exports.checkoutFailuresCategoryCounts = {
    method: 'GET',
    path: '/v1/checkout-failures/category-counts/{param*}',
    config: getConfig('checkout-failures-category-counts-get'),
    handler: getHandler(Object.assign(getHandlerParams('checkoutFailuresCategoryCounts')))
};

module.exports.checkoutFailuresComments = {
    method: 'GET',
    path: '/v1/checkout-failures/comments/{param*}',
    config: getConfig('checkout-failures-comments-get'),
    handler: getHandler(Object.assign(getHandlerParams('checkoutFailuresComments')))
};

module.exports.checkoutFailuresErrorCounts = {
    method: 'GET',
    path: '/v1/checkout-failures/error-counts/{param*}',
    config: getConfig('checkout-failures-error-counts-get'),
    handler: getHandler(Object.assign(getHandlerParams('checkoutFailuresErrorCounts')))
};

module.exports.deltaUser = {
    method: 'GET',
    path: '/v1/delta-users-counts-by-metrics',
    config: getConfig('delta-user-get'),
    handler: getHandler(Object.assign(getHandlerParams('deltaUser')))
};

module.exports.deltaUserDetails = {
    method: 'GET',
    path: '/v1/delta-users-details',
    config: getConfig('delta-user-details-get'),
    handler: getHandler(Object.assign(getHandlerParams('deltaUserDetails')))
};

module.exports.deltaUserBySessionId = {
    method: 'GET',
    path: '/v1/delta-user-by-session-id',
    config: getConfig('delta-user-by-session-id-get'),
    handler: getHandler(Object.assign(getHandlerParams('deltaUserBySessionId')))
};
