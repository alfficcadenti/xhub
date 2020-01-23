const questions = [
    {id: 1, question: 'Deployed in Regions', type: 'category', values: ['us-west-1', 'us-east-1', 'eu-west-1', 'ap-northeast-1', 'ap-southeast-1', 'ap-southeast-2', 'other']},
    {id: 2, question: '# Availability Zones Deployed to', type: 'integer'},
    {id: 3, question: '# Instances Deployed', type: 'integer'},
    {id: 4, question: 'Deployed to Segment?', type: 'category', values: ['True', 'False']},
    {id: 5, question: 'Chaos Monkey Enabled?', type: 'category', values: ['True', 'False']},
    {id: 6, question: 'Auto-Scaling Verified By', type: 'category', values: ['Not Validated', 'Production Observation', 'AWS Console', 'Chaos Monkey', 'Gremlin', 'Other']},
    {id: 7, question: 'Single Points of Failure', type: 'text'},
    {id: 8, question: 'Golden Indicator  - Latency', type: 'text'},
    {id: 9, question: 'Golden Indicator  - Traffic', type: 'text'},
    {id: 10, question: 'Golden Indicator  - Errors', type: 'text'},
    {id: 11, question: 'Golden Indicator  - Saturation', type: 'text'},
    {id: 12, question: '% Prod Traffic', type: 'integer', values: {min: '0', max: '100'}},
    {id: 13, question: '$ Revenue Loss (per minute)', type: 'integer', values: {min: '0', max: ''}},
    {id: 14, question: '$ GBV Loss (per minute)', type: 'integer', values: {min: '0', max: ''}},
    {id: 15, question: 'Multi-Region ETA', type: 'date'},
    {id: 16, question: 'Resilient ETA', type: 'date'},
    {id: 17, question: 'Pipeline Leadtime (mins)', type: 'integer', values: {min: '1', max: ''}},
    {id: 18, question: 'Release Cadence (per week)', type: 'number'},
    {id: 19, question: 'Release Confirmation Time', type: 'integer', values: {min: '1', max: ''}},
    {id: 20, question: 'Rollback Time', type: 'integer', values: {min: '1', max: ''}},
    {id: 21, question: 'Last Rollback Date', type: 'date'},
    {id: 22, question: '% Release Success', type: 'number', values: {min: '0', max: '100'}},
    {id: 23, question: 'Circuit Breakers', type: 'text'},
    {id: 24, question: 'Throttling', type: 'text'},
    {id: 25, question: 'Notes', type: 'text'}
];

module.exports = {
    method: 'GET',
    path: '/api/resiliency-questions',
    options: {
        log: {
            collect: true
        },
        id: 'resiliencyQuestions',
        handler: () => (questions)
    }
};