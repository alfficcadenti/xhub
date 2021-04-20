import {getConfig, getHandler} from './utils';

const getHandlerParams = (routeKey) => ({
    routeKey,
    configKey: 'apiAnomalyDetectorConfig',
    serviceName: 'api-v1-anomaly-detector'
});

module.exports.impulsePrediction = {
    method: 'GET',
    path: '/v1/impulse/prediction',
    config: getConfig('impulse-prediction-get'),
    handler: getHandler(Object.assign(getHandlerParams('impulsePrediction')))
};
