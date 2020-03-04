import ServiceClient from '@vrbo/service-client';

module.exports.resiliencyQuestionnaire = {
    method: 'POST',
    path: '/resiliency/questionnaire',
    config: {
        id: 'resiliency-questionnaire-post',
        log: {
            collect: true
        },
        payload: {
            parse: true,
            allow: ['application/json', 'multipart/form-data']
        }
    },
    handler: async (req) => {
        try {
            const formData = JSON.stringify(req.payload);
            const serverConfig = req.server.app.config.get('apiServiceConfig');
            const client = ServiceClient.create('backend-service', {
                hostname: serverConfig.hostname,
                port: serverConfig.port,
                protocol: serverConfig.protocol,
            });
            const {statusCode} = await client.request({
                method: serverConfig.routes.resiliencyQuestionnaire.method,
                path: serverConfig.routes.resiliencyQuestionnaire.path,
                operation: serverConfig.routes.resiliencyQuestionnaire.operation,
                payload: formData
            });
            return statusCode;
        } catch (e) {
            req.log('[ERROR]', e);
            return e;
        }
    }
};