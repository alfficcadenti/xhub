import {getConfig, getHandler} from './utils';

const getHandlerParams = (routeKey) => ({
    routeKey,
    configKey: 'egAvailDataServiceConfig',
    serviceName: 'api-v1-eg-avail-data-service'
});

module.exports.availability = {
    method: 'GET',
    path: '/v1/application-availability/{param*}',
    config: getConfig('availability-get'),
    handler: getHandler(Object.assign(getHandlerParams('egApplicationAvailability'), {pathParam: 'param'}))
};