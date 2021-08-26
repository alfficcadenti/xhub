import {getConfig, getHandler} from './utils';

const getHandlerParams = (routeKey) => ({
    routeKey,
    configKey: 'apiDeltaUserConfig',
    serviceName: 'api-v1-delta-user'
});

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
