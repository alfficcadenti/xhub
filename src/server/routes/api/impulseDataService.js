import {getConfig, getHandler} from './utils';

const getHandlerParams = (routeKey) => ({
    routeKey,
    configKey: 'apiImpulseDataServiceConfig',
    serviceName: 'api-v1-impulse-data-service'
});

module.exports.impulseHealth = {
    method: 'GET',
    path: '/v1/impulse/health',
    config: getConfig('impulse-health-get'),
    handler: getHandler(Object.assign(getHandlerParams('impulseHealth')))
};

module.exports.impulseAnomalies = {
    method: 'GET',
    path: '/v1/impulse/anomalies',
    config: getConfig('impulse-anomalies-get'),
    handler: getHandler(Object.assign(getHandlerParams('impulseAnomalies')))
};
