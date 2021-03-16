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

module.exports.impulseAnomaliesGrouped = {
    method: 'GET',
    path: '/v1/impulse/anomalies/grouped',
    config: getConfig('impulse-anomalies-grouped-get'),
    handler: getHandler(Object.assign(getHandlerParams('impulseAnomaliesGrouped')))
};

module.exports.alertSubscription = {
    method: 'POST',
    path: '/v1/alert/subscription',
    config: getConfig('alert-subscription-post'),
    handler: getHandler(Object.assign(getHandlerParams('alertSubscription')))
};

module.exports.alertSubscriptionUpdate = {
    method: 'PUT',
    path: '/v1/alert/subscription/update',
    config: getConfig('alert-subscription-update-put'),
    handler: getHandler(Object.assign(getHandlerParams('alertSubscriptionUpdate')))
};

module.exports.alertSubscriptionGet = {
    method: 'GET',
    path: '/v1/alert/subscription/{param*}',
    config: getConfig('alert-subscription-get'),
    handler: getHandler(Object.assign(getHandlerParams('alertSubscriptionGet')))
};

module.exports.alertSubscriptionsGet = {
    method: 'GET',
    path: '/v1/alert/subscriptions',
    config: getConfig('alert-subscriptions-get'),
    handler: getHandler(Object.assign(getHandlerParams('alertSubscriptionsGet')))
};
