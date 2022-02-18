import {getConfig, getHandler} from './utils';

const getHandlerParams = (routeKey) => ({
    routeKey,
    configKey: 'apiFciDataServiceConfig',
    serviceName: 'api-v1-fci-data-service'
});

module.exports.checkoutFailures = {
    method: 'GET',
    path: '/v1/checkout-failures/{pathParam*}',
    config: getConfig('checkout-failures-get'),
    handler: getHandler(Object.assign(getHandlerParams('checkoutFailures'), {pathParam: 'pathParam'}))
};

module.exports.loginFailures = {
    method: 'GET',
    path: '/v1/login-failures/{pathParam*}',
    config: getConfig('login-failures-get'),
    handler: getHandler(Object.assign(getHandlerParams('loginFailures'), {pathParam: 'pathParam'}))
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
