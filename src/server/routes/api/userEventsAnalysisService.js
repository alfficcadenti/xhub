import {getConfig, getHandler} from './utils';
import {
    getFciTestData,
    getFcisTestData,
    getFciErrorCountsTestData,
    getFciErrorCategoryTestData,
    getCommentTestData,
    getFciSites,
    getFciErrorCodes,
    getFciErrorCategories
} from './testData/fciTestService';

const getHandlerParams = (routeKey) => ({
    routeKey,
    configKey: 'userEventsAnalysisServiceConfig',
    serviceName: 'api-v1-user-events-analysis-service'
});

module.exports.fciUserEvent = {
    method: 'GET',
    path: '/getCheckoutFailure/{param*}',
    config: getConfig('fci-search-api-v1-get'),
    handler: getHandler(Object.assign(getHandlerParams('fci'), {timeout: 120000, connectionTimeout: 120000}), getFciTestData)
};

module.exports.fciUserEvents = {
    method: 'GET',
    path: '/getCheckoutFailures/{param*}',
    config: getConfig('fci-api-v1-get'),
    handler: getHandler(Object.assign(getHandlerParams('fcis'), {timeout: 120000, connectionTimeout: 120000}), getFcisTestData)
};

module.exports.fciErrorCounts = {
    method: 'GET',
    path: '/getCheckoutFailureErrorCounts/{param*}',
    config: getConfig('fci-error-counts-v1-get'),
    handler: getHandler(Object.assign(getHandlerParams('fciErrorCounts'), {timeout: 120000, connectionTimeout: 120000}), getFciErrorCountsTestData)
};

module.exports.fciCategoryCounts = {
    method: 'GET',
    path: '/getCheckoutFailureCategoryCounts/{param*}',
    config: getConfig('fci-category-counts-v1-get'),
    handler: getHandler(Object.assign(getHandlerParams('fciCategoryCounts'), {timeout: 120000, connectionTimeout: 120000}), getFciErrorCategoryTestData)
};

module.exports.fciSites = {
    method: 'GET',
    path: '/checkout-failure-sites/{param*}',
    config: getConfig('fci-sites-v1-get'),
    handler: getHandler(Object.assign(getHandlerParams('checkout-failure-sites'), {timeout: 120000, connectionTimeout: 120000}), getFciSites)
};

module.exports.fciErrorCodes = {
    method: 'GET',
    path: '/checkout-failure-error-codes/{param*}',
    config: getConfig('fci-error-codes-v1-get'),
    handler: getHandler(Object.assign(getHandlerParams('checkout-failure-error-codes'), {timeout: 120000, connectionTimeout: 120000}), getFciErrorCodes)
};

module.exports.fciErrorCategories = {
    method: 'GET',
    path: '/checkout-failure-error-categories/{param*}',
    config: getConfig('fci-error-categories-v1-get'),
    handler: getHandler(Object.assign(getHandlerParams('checkout-failure-error-categories'), {timeout: 120000, connectionTimeout: 120000}), getFciErrorCategories)
};

module.exports.getFciComments = {
    method: 'GET',
    path: '/getComments/{param*}',
    config: getConfig('fci-comment-api-v1-get'),
    handler: getHandler(Object.assign(getHandlerParams('getFciComments'), {timeout: 120000, connectionTimeout: 120000}), getCommentTestData)
};

module.exports.postFciComment = {
    method: 'POST',
    path: '/addComment/{param*}',
    config: getConfig('fci-comment-api-v1-post'),
    handler: getHandler(Object.assign(getHandlerParams('postFciComment'), {timeout: 120000, connectionTimeout: 120000}))
};
