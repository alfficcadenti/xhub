import {getConfig, getHandler} from './utils';
import {
    getFcisTestData,
    getFciErrorCountsTestData,
    getCommentTestData
} from './testData/fciTestService';

const getHandlerParams = (routeKey) => ({
    routeKey,
    configKey: 'userEventsAnalysisServiceConfig',
    serviceName: 'api-v2-user-events-analysis-service'
});

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
