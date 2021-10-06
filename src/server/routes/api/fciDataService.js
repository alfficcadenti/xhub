import {getConfig, getHandler} from './utils';

const getHandlerParams = (routeKey) => ({
    routeKey,
    configKey: 'apiFciDataServiceConfig',
    serviceName: 'api-v1-fci-data-service'
});

module.exports.checkoutFailureErrorCategories = {
    method: 'GET',
    path: '/v1/checkout-failures/error-categories/{param*}',
    config: getConfig('checkout-failure-error-categories-get'),
    handler: getHandler(Object.assign(getHandlerParams('checkoutFailureErrorCategories')))
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
