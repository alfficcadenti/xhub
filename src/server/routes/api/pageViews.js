import ServiceClient from '@vrbo/service-client';

module.exports.pageViewsUserEvents = {
    method: 'GET',
    path: '/v1/pageViews/{param*}',
    config: {
        id: 'page-views-api-v1-get',
        log: {
            collect: true
        },
    },
    handler: async (req) => {
        try {
            const serverConfig = req.server.app.config.get('userEventsApiServiceConfig');
            const client = ServiceClient.create('user-events-pageviews-api-v1-get', {
                hostname: serverConfig.hostname,
                protocol: serverConfig.protocol,
            });
            const {payload} = await client.request({
                method: serverConfig.routes.pageViews.method,
                path: serverConfig.routes.pageViews.path,
                operation: serverConfig.routes.pageViews.operation,
                queryParams: req.url.query ? req.url.query : {}
            });
            req.log('[API-REQUEST-DETAILS]', serverConfig.routes.pageViews.method, serverConfig.routes.pageViews.operation);
            req.log('[PAGEVIEWS-DATA]', payload);
            return payload;
        } catch (e) {
            req.log('[ERROR]', e);
            return e;
        }
    }
};
