import ServiceClient from '@vrbo/service-client';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
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
        try {
            console.log('REACHED CODE HERE = ');
            const client = ServiceClient.create('garafana-alerts-api', {
                //hostname: 'grafana.sea.corp.expecn.com',
                hostname: 'netperf.tools.expedia.com',
                port: '443',
                protocol: 'https:',
            });
            const response = await client.request({
                method: 'GET',
                //path: '/api/alerts?dashboardId=2074',
                path: '/api/alerts?dashboardId=2399',
                operation: 'GET_grafana_alerts_data',
                connectTimeout: 30000
            });
            console.log('Grafana alerts data fetched successfully...');
            return response.statusCode;
        } catch (e) {
            req.log('error occurred while fetching grafana alerts data [ERROR]', e);
            return e;
        }
    }
};
