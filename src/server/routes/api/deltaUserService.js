import {getConfig, getHandler} from './utils';

const getHandlerParams = (routeKey) => ({
    routeKey,
    configKey: 'apiDeltaUserConfig',
    serviceName: 'api-v1-delta-user'
});

module.exports.deltaUser = {
    method: 'GET',
    path: '/v1/delta-users',
    config: getConfig('delta-user-get'),
    handler: getHandler(Object.assign(getHandlerParams('deltaUser')))
};
