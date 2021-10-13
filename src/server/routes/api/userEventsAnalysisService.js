import {getConfig, getHandler} from './utils';

const getHandlerParams = (routeKey) => ({
    routeKey,
    configKey: 'userEventsAnalysisServiceConfig',
    serviceName: 'api-v2-user-events-analysis-service'
});


module.exports.postFciComment = {
    method: 'POST',
    path: '/v2/comment/{param*}',
    config: getConfig('fci-comment-api-v2-post'),
    handler: getHandler(Object.assign(getHandlerParams('postFciComment'), {timeout: 120000, connectionTimeout: 120000}))
};
