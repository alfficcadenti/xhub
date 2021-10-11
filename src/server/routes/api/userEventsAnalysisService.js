import {getConfig, getHandler} from './utils';
import {
    getFciTestData,
    getFcisTestData,
    getFciErrorCountsTestData,
    getFciErrorCategoryTestData,
    getCommentTestData
} from './testData/fciTestService';

const getHandlerParams = (routeKey) => ({
    routeKey,
    configKey: 'userEventsAnalysisServiceConfig',
    serviceName: 'api-v2-user-events-analysis-service'
});

module.exports.fciUserEvent = {
    method: 'GET',
    path: '/v2/checkout-failure/{param*}',
    config: getConfig('fci-search-api-v2-get'),
    handler: getHandler(Object.assign(getHandlerParams('fci'), {timeout: 120000, connectionTimeout: 120000}), getFciTestData)
};

module.exports.fciUserEvents = {
    method: 'GET',
    path: '/v2/checkout-failures/{param*}',
    config: getConfig('fci-api-v2-get'),
    handler: getHandler(Object.assign(getHandlerParams('fcis'), {timeout: 120000, connectionTimeout: 120000}), getFcisTestData)
};

module.exports.fciErrorCounts = {
    method: 'GET',
    path: '/v2/checkout-failure-error-counts/{param*}',
    config: getConfig('fci-error-counts-v2-get'),
    handler: getHandler(Object.assign(getHandlerParams('fciErrorCounts'), {timeout: 120000, connectionTimeout: 120000}), getFciErrorCountsTestData)
};

module.exports.fciCategoryCounts = {
    method: 'GET',
    path: '/v2/checkout-failure-category-counts/{param*}',
    config: getConfig('fci-category-counts-v2-get'),
    handler: getHandler(Object.assign(getHandlerParams('fciCategoryCounts'), {timeout: 120000, connectionTimeout: 120000}), getFciErrorCategoryTestData)
};

module.exports.getFciComments = {
    method: 'GET',
    path: '/v2/comments/{param*}',
    config: getConfig('fci-comment-api-v2-get'),
    handler: getHandler(Object.assign(getHandlerParams('getFciComments'), {timeout: 120000, connectionTimeout: 120000}), getCommentTestData)
};

module.exports.postFciComment = {
    method: 'POST',
    path: '/v2/comment/{param*}',
    config: getConfig('fci-comment-api-v2-post'),
    handler: getHandler(Object.assign(getHandlerParams('postFciComment'), {timeout: 120000, connectionTimeout: 120000}))
};
