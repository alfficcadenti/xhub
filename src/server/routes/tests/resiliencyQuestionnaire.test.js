const route = require('../api/resiliencyQuestionnaire.js');
const Hapi = require('hapi');
const payload = {'product': {'id': 1, 'name': 'Traffic Engineering'}, 'application': {'id': 933, 'name': 'ewe-mt-kafka'}, 'questions': [{'key': 'Deployed in Regions', 'value': ''}, {'key': '# Availability Zones Deployed to', 'value': ''}, {'key': '# Instances Deployed', 'value': ''}, {'key': 'Deployed to Segment?', 'value': ''}, {'key': 'Chaos Monkey Enabled?', 'value': ''}, {'key': 'Auto-Scaling Verified By', 'value': ''}, {'key': 'Single Points of Failure', 'value': ''}, {'key': 'Golden Indicator  - Latency', 'value': ''}, {'key': 'Golden Indicator  - Traffic', 'value': ''}, {'key': 'Golden Indicator  - Errors', 'value': ''}, {'key': 'Golden Indicator  - Saturation', 'value': ''}, {'key': '% Prod Traffic', 'value': ''}, {'key': '$ Revenue Loss (per minute)', 'value': ''}, {'key': '$ GBV Loss (per minute)', 'value': ''}, {'key': 'Multi-Region ETA', 'value': '2/6/2020'}, {'key': 'Resilient ETA', 'value': '2/6/2020'}, {'key': 'Pipeline Leadtime (mins)', 'value': ''}, {'key': 'Release Cadence (per week)', 'value': ''}, {'key': 'Release Confirmation Time', 'value': ''}, {'key': 'Rollback Time', 'value': ''}, {'key': 'Last Rollback Date', 'value': '2/6/2020'}, {'key': '% Release Success', 'value': ''}, {'key': 'Circuit Breakers', 'value': ''}, {'key': 'Throttling', 'value': ''}, {'key': 'Notes', 'value': ''}]};

describe('/api/v1/resiliency/questionnaire', () => {
    test('configuration', () => {
        expect.assertions(3);
        expect(route.resiliencyQuestionnaire.method).toEqual('POST');
        expect(route.resiliencyQuestionnaire.path).toEqual('/resiliency/questionnaire');
        expect(typeof route.resiliencyQuestionnaire.handler).toEqual('function');
    });

    test('handler is called once', async () => {
        route.resiliencyQuestionnaire.handler = jest.fn(() => '');
        const server = new Hapi.Server();
        server.route(route.resiliencyQuestionnaire);
        await server.inject({
            method: 'POST',
            url: '/resiliency/questionnaire',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            payload: JSON.stringify(payload)
        });
        expect(route.resiliencyQuestionnaire.handler.mock.calls.length).toEqual(1);
    });
});