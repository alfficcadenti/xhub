import {getConfig, getHandler} from './utils';
import {getFciTestData} from './testData/fciTestService';

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
