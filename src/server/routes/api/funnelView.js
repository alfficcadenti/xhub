import ServiceClient from '@vrbo/service-client';

module.exports.pageViewsUserEvents = {
    method: 'GET',
    path: '/user-events-api/v1/funnelView/{param*}',
    config: {
        id: 'funnel-view-api-v1-get',
        log: {
            collect: true
        },
    },
    handler: async (req) => {
        try {
            const serverConfig = req.server.app.config.get('userEventsApiServiceConfig');
            const client = ServiceClient.create('user-events-funnel-view-api-v1-get', {
                hostname: serverConfig.hostname,
                protocol: serverConfig.protocol,
            });
            const {payload} = await client.request({
                method: serverConfig.routes.funnelView.method,
                path: serverConfig.routes.funnelView.path,
                operation: serverConfig.routes.funnelView.operation,
                queryParams: req.url.query ? req.url.query : {}
            });
            req.log('[API-REQUEST-DETAILS]', serverConfig.routes.funnelView.method, serverConfig.routes.funnelView.operation);
            req.log('[PAGEVIEWS-DATA]', payload);
            return payload;
        } catch (e) {
            req.log('[ERROR]', e);
            return e;
        }
    }
};
