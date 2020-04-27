import ServiceClient from '@vrbo/service-client';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const serviceCall = async (hostname, path) => {
    try {
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
        return payload || [];
    } catch {
        return [];
    }
};

const checkConversationPlatformState = (inputArray = []) => {
    if (Array.isArray(inputArray) && inputArray.length) {
        const stateAlert = inputArray.find((elem) => elem.state && elem.state === 'alerting');
        const state = stateAlert ? 'alerting' : 'ok';
        return state;
    }
    return '';
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
            serviceCall('netperf.tools.expedia.com', '/api/alerts?dashboardId=2399'),
            serviceCall('grafana.sea.corp.expecn.com', '/api/alerts?dashboardId=2122')
        ])
            .then(([ICRS, ConversationPlatformHealth]) => {
                ConversationPlatformHealth.push({name: 'Conversations Platform Health', state: checkConversationPlatformState(ConversationPlatformHealth)});
                return [ICRS, ConversationPlatformHealth];
            })
            .then((results) => [].concat(...results))
            .catch((e) => {
                req.log('[ERROR]', e);
                return e;
            });
    }
};