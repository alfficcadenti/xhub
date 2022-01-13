import {getConfig, getHandler} from './utils';
import {INCIDENTS_MOCK_DATA} from './testData/statusPage';

const getHandlerParams = (routeKey) => ({
    routeKey,
    configKey: 'apiDataServiceConfig',
    serviceName: 'api-v1-data-service'
});

module.exports.correctiveActionsDetails = {
    method: 'GET',
    path: '/v1/corrective-actions/{param*}',
    config: getConfig('corrective-actions-details'),
    handler: getHandler(Object.assign(getHandlerParams('correctiveActionsDetails')))
};

module.exports.correctiveActions = {
    method: 'GET',
    path: '/v1/corrective-actions/business-owner-type/{businessOwnerType*}',
    config: getConfig('corrective-actions-get'),
    handler: getHandler(Object.assign(getHandlerParams('correctiveActions'), {pathParam: 'businessOwnerType'}))
};

module.exports.defects = {
    method: 'GET',
    path: '/v1/defects/{param*}',
    config: getConfig('defects-get'),
    handler: getHandler(getHandlerParams('defects'))
};

module.exports.dogFood = {
    method: 'GET',
    path: '/v1/dog-food-data/{param*}',
    config: getConfig('dog-food-data-get'),
    handler: getHandler(getHandlerParams('dogFood'))
};

module.exports.incidents = {
    method: 'GET',
    path: '/v1/incidents/{impulse*}',
    config: getConfig('incidents-get'),
    handler: getHandler(Object.assign(getHandlerParams('incidents'), {pathParam: 'impulse'}), () => INCIDENTS_MOCK_DATA)
};

module.exports.incidentsV2 = {
    method: 'GET',
    path: '/v2/incidents/{param*}',
    config: getConfig('incidents-get-v2'),
    handler: getHandler(getHandlerParams('incidentsV2'))
};

module.exports.impulseIncidents = {
    method: 'GET',
    path: '/v1/incidents/impulse',
    config: getConfig('impulse-incidents-get'),
    handler: getHandler(getHandlerParams('impulseIncidents'))
};

module.exports.epsIncidents = {
    method: 'GET',
    path: '/v1/eps/incidents/{param*}',
    config: getConfig('eps-incidents-get'),
    handler: getHandler(getHandlerParams('epsIncidents'))
};

module.exports.prbs = {
    method: 'GET',
    path: '/v1/prbs/{param*}',
    config: getConfig('prbs-get'),
    handler: getHandler(getHandlerParams('prbs'))
};

module.exports.portfolio = {
    method: 'GET',
    path: '/v1/portfolio/{panel*}',
    config: getConfig('portfolio-get'),
    handler: getHandler(Object.assign(getHandlerParams('portfolio'), {pathParam: 'panel'}))
};

module.exports.orgMetrics = {
    method: 'GET',
    path: '/v1/org-metrics/business-owner-type/{businessOwnerType*}',
    config: getConfig('org-metrics-get'),
    handler: getHandler(Object.assign(getHandlerParams('orgMetrics'), {pathParam: 'businessOwnerType'}))
};

module.exports.robbie = {
    method: 'GET',
    path: '/v1/robbie/notification-logs/{param*}',
    config: getConfig('robbie-get'),
    handler: getHandler(Object.assign(getHandlerParams('robbie')))
};

module.exports.agileScoreCard = {
    method: 'GET',
    path: '/v1/score-card/{pathParam*}',
    config: getConfig('agile-score-card-get'),
    handler: getHandler(Object.assign(getHandlerParams('agileScoreCard'), {pathParam: 'pathParam'}))
};
