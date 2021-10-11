import {getConfig, getHandler} from './utils';

const getHandlerParams = (routeKey) => ({
    routeKey,
    configKey: 'apiFciDataServiceConfig',
    serviceName: 'api-v1-fci-data-service'
});

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

module.exports.checkoutFailuresSearch = {
    method: 'GET',
    path: '/v1/checkout-failures/search/{param*}',
    config: getConfig('checkout-failures-search-get'),
    handler: getHandler(Object.assign(getHandlerParams('checkoutFailuresSearch')))
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
