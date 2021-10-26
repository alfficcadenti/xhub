import {getConfig, getHandler} from './utils';

const getHandlerParams = (routeKey) => ({
    routeKey,
    configKey: 'statusPageServiceConfig',
    serviceName: 'api-v1-status-page'
});

module.exports.statusPage = {
    method: 'GET',
    path: '/v1/status-page',
    config: getConfig('status-page-get'),
    handler: getHandler(Object.assign(getHandlerParams('statusPage')))
};