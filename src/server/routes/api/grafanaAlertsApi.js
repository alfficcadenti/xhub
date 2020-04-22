import ServiceClient from '@vrbo/service-client';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const getHostName = (monitoring) => {
    switch (monitoring) {
        case 'Grafana':
            return 'grafana.prod.expedia.com';
        case 'GrafanaSEA':
            return 'grafana.sea.corp.expecn.com';
        case 'Netperf':
            return 'netperf.tools.expedia.com';
        default:
            return null;
    }
};

module.exports = {
    method: 'GET',
    path: '/api/grafana/alerts',
    config: {
        id: 'garafana-alerts-get',
        log: {
            collect: true
        }
    },
    handler: async (req) => {
        console.log('TEST', req.query);
        try {
            const client = ServiceClient.create('garafana-alerts-api', {
                // hostname: 'grafana.sea.corp.expecn.com',
                hostname: getHostName(req.query.monitoring),
                port: '443',
                protocol: 'https:',
            });
            const {payload} = await client.request({
                method: 'GET',
                path: `/api/alerts?dashboardId=${req.query.dashboardId}`,
                operation: 'GET_grafana_alerts_data',
                connectTimeout: 30000,
                params: req.query.params
            });

            req.log('Grafana alerts data fetched successfully...');
            // req.log(payload);
            return payload;
        } catch (e) {
            req.log('error occurred while fetching grafana alerts data [ERROR]', e);
            return e;
        }
    }
};