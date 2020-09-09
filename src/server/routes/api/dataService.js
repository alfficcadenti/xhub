import {getConfig, getHandler} from './utils';

const getHandlerParams = (routeKey) => ({
    routeKey,
    configKey: 'apiDataServiceConfig',
    serviceName: 'api-v1-data-service'
});

module.exports.defects = {
    method: 'GET',
    path: '/v1/defects/{param*}',
    config: getConfig('defects-get'),
    handler: getHandler(getHandlerParams('defects'))
};

module.exports.incidents = {
    method: 'GET',
    path: '/v1/incidents/{param*}',
    config: getConfig('incidents-get'),
    handler: getHandler(getHandlerParams('incidents'))
};

module.exports.incidentsV2 = {
    method: 'GET',
    path: '/v2/incidents/{param*}',
    config: getConfig('incidents-get-v2'),
    handler: getHandler(getHandlerParams('incidentsV2'))
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
    path: '/v1/portfolio/{param*}',
    config: getConfig('portfolio-get'),
    handler: getHandler(getHandlerParams('portfolio'))
};
