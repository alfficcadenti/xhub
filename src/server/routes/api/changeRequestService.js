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

module.exports.annotations = {
    method: 'GET',
    path: '/annotations',
    config: getConfig('annotations-api-v1-get'),
    handler: getHandler(getHandlerParams('annotations'))
};

module.exports.productMapping = {
    method: 'GET',
    path: '/productMapping',
    config: getConfig('product-mapping-api-v1-get'),
    handler: getHandler(getHandlerParams('productMapping'))
};

module.exports.productMapping = {
    method: 'GET',
    path: '/abTests',
    config: getConfig('ab-tests-api-v1-get'),
    handler: getHandler(getHandlerParams('abTests'))
};
