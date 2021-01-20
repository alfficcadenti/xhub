import {getConfig, getHandler} from './utils';
import {getFciTestData, getCommentTestData} from './testData/fciTestService';

const getHandlerParams = (routeKey) => ({
    routeKey,
    configKey: 'userEventsAnalysisServiceConfig',
    serviceName: 'api-v1-user-events-analysis-service'
});

module.exports.fciUserEvents = {
    method: 'GET',
    path: '/getCheckoutFailures/{param*}',
    config: getConfig('fci-api-v1-get'),
    handler: getHandler(Object.assign(getHandlerParams('fcis'), {timeout: 120000, connectionTimeout: 120000}), getFciTestData)
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
