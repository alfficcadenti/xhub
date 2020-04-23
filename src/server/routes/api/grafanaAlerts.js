import ServiceClient from '@vrbo/service-client';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const dasboards = [
    {name: '', details: []},
    {},
    {}
];

const serviceCall = async (hostname, path) => {
    const client = ServiceClient.create('grafana-alerts-api', {
        hostname,
        port: '443',
        protocol: 'https:',
    });
    const {payload} = await client.request({
        method: 'GET',
        path,
        operation: 'GET_grafana_alerts_data',
        connectTimeout: 30000,
    });
    return payload;
};

const checkStateIsAlert = (array = []) => {
    const CGPHealthAlert = array.some((elem) => elem.state && elem.state === 'alerting');
    const state = CGPHealthAlert ? 'alerting' : 'ok';
    return state;
};

module.exports = {
    method: 'GET',
    path: '/grafana/alerts',
    config: {
        id: 'garafana-alerts',
        log: {
            collect: true
        }
    },
    handler: async (req) => {
        return Promise.all([
            serviceCall('grafana.prod.expedia.com', '/api/alerts?dashboardId=4411'),
            serviceCall('netperf.tools.expedia.com', '/api/alerts?dashboardId=2399'),
            serviceCall('grafana.sea.corp.expecn.com', '/api/alerts?dashboardId=2122')
        ])
            .then(([CGPHealth, ICRS, ConversationPlatformHealth]) => {
                CGPHealth.push({name: 'Conversation Platform App Health CGP', state: checkStateIsAlert(CGPHealth)});
                ConversationPlatformHealth.push({name: 'Conversations Platform Health', state: checkStateIsAlert(ConversationPlatformHealth)});
                return [CGPHealth, ICRS, ConversationPlatformHealth];
            })
            .then((results) => [].concat(...results))
            .catch((e) => {
                req.log('[ERROR]', e);
                return e;
            });
    }
};