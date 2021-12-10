import {getConfig, getHandler} from './utils';

const getHandlerParams = (routeKey) => ({
    routeKey,
    configKey: 'changeRequestsApiServiceConfig',
    serviceName: 'change-request-service'
});

module.exports.changeRequests = {
    method: 'GET',
    path: '/change-requests-api/v1/changeDetails',
    config: getConfig('change-request-api-v1-get'),
    handler: getHandler(getHandlerParams('changeDetails'))
};

module.exports.deployments = {
    method: 'GET',
    path: '/deployments',
    config: getConfig('deployments-api-v1-get'),
    handler: getHandler(getHandlerParams('deployments'))
};

module.exports.productMapping = {
    method: 'GET',
    path: '/productMapping',
    config: getConfig('product-mapping-api-v1-get'),
    handler: getHandler(getHandlerParams('productMapping'))
};

module.exports.abTests = {
    method: 'GET',
    path: '/abTests',
    config: getConfig('ab-tests-api-v1-get'),
    handler: getHandler(getHandlerParams('abTests'))
};
