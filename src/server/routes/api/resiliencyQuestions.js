const questions = [
    {id: 1, question: 'Deployed in Regions', type: 'category', values: ['us-west-1', 'us-east-1', 'eu-west-1', 'ap-northeast-1', 'ap-southeast-1', 'ap-southeast-2', 'other'], definition: 'Names of AWS regions are taking active traffic. Normally there will only be one listed'},
    {id: 2, question: '# Availability Zones Deployed to', type: 'integer', values: {min: '1', max: ''}, definition: 'For each Region, how many Availability Zones are being deployed to.'},
    {id: 3, question: '# Instances Deployed', type: 'integer', values: {min: '0', max: ''}, definition: 'Total number of instances configured to be running (Minimum)'},
    {id: 4, question: 'Deployed to Segment?', type: 'category', values: ['True', 'False'], definition: 'Is the application serving production traffic from a segmented account (rather than the shared accounts) - Y/N'},
    {id: 5, question: 'Chaos Monkey Enabled?', type: 'category', values: ['True', 'False'], definition: 'Is the application configured to be a part of the Chaos Monkey attacks.'},
    {id: 6, question: 'Auto-Scaling Verified By', type: 'category', values: ['Not Validated', 'Production Observation', 'AWS Console', 'Chaos Monkey', 'Gremlin', 'Other'], definition: "How has autoscaling for the application been exercised and seen to operate as expected within the past month? 'No' - Indicates no evidence in past month. Survival of Chaos Monkey attack / production logs showing autoscaling activity / chaos experiment using Gremlin, Napoleon or other tool are all valid methods of verification. So valid values are similar to ' No | Chaos Monkey | Prod Logs | Gremlin | Other'"},
    {id: 7, question: 'Single Points of Failure', type: 'text', definition: "Single Points of Failure - List any dependencies which are single points of failure. 'None' indicates no single points of failure. These could potentially be data stores, other infrastructure or other services."},
    {id: 8, question: 'Golden Indicator  - Latency', type: 'text', definition: "List the  '4 Golden Indicators' identified for monitoring. Measures of Latency, Traffic, Errors & Saturation for this application. Include a link to dashboard where they are measured if possible."},
    {id: 9, question: 'Golden Indicator  - Traffic', type: 'text', definition: "List the  '4 Golden Indicators' identified for monitoring. Measures of Latency, Traffic, Errors & Saturation for this application. Include a link to dashboard where they are measured if possible."},
    {id: 10, question: 'Golden Indicator  - Errors', type: 'text', definition: "List the  '4 Golden Indicators' identified for monitoring. Measures of Latency, Traffic, Errors & Saturation for this application. Include a link to dashboard where they are measured if possible."},
    {id: 11, question: 'Golden Indicator  - Saturation', type: 'text', definition: "List the  '4 Golden Indicators' identified for monitoring. Measures of Latency, Traffic, Errors & Saturation for this application. Include a link to dashboard where they are measured if possible."},
    {id: 12, question: '% Prod Traffic', type: 'integer', values: {min: '0', max: '100'}, definition: '% of Production traffic currently supported by this application in this region/account. E.g. This would be 100% if all the production traffic is running through this region/account but could be less if traffic is split between shared and segmented accounts in AWS or CH and AWS. This would be 0% if no production traffic is supported currently.'},
    {id: 13, question: '$ Revenue Loss (per minute)', type: 'integer', values: {min: '0', max: ''}, definition: 'Estimate of Dollar revenue lost per minute of complete unavailability for this application. Revenue loss helps to prioritize application based on the potential impact of an outage'},
    {id: 14, question: '$ GBV Loss (per minute)', type: 'integer', values: {min: '0', max: ''}, definition: 'Estimate of Dollar Gross Booking Value lost per minute of complete unavailability for this application. GBV is a more comparable to new feature work for prioritization of remediation work.'},
    {id: 15, question: 'Multi-Region ETA', type: 'date', definition: 'Date this application is expected to become multi-region. (Taking traffic in multiple regions)'},
    {id: 16, question: 'Resilient ETA', type: 'date', definition: 'Date this application is expected to reach the definition of done for Tier 1 Resilience'},
    {id: 17, question: 'Pipeline Leadtime (minutes)', type: 'integer', values: {min: '1', max: ''}, definition: 'Average time in minutes from checkin to production release'},
    {id: 18, question: 'Release Cadence (per week)', type: 'number', definition: 'Average number of releases per week. Deployments to all Regions counts as a single release'},
    {id: 19, question: 'Release Confirmation Time (minutes)', type: 'integer', values: {min: '1', max: ''}, definition: 'Average time in minutes to confirm a successful release after production deploy'},
    {id: 20, question: 'Rollback Time (minutes)', type: 'integer', values: {min: '1', max: ''}, definition: 'Average time in minutes to rollback a change in AWS region.'},
    {id: 21, question: 'Last Rollback Date', type: 'date', definition: 'Date of last rollback for this application (in production due to bad release or a planned exercise)'},
    {id: 22, question: '% Release Success', type: 'number', values: {min: '0', max: '100'}, definition: 'Percentage of releases which result in an acceptable customer outcome (i.e. no rollback or incident due to release). Estimate'},
    {id: 23, question: 'Circuit Breakers', type: 'text', definition: "What circuit breaker technology is in use and what is the coverage in terms of dependencies with circuit breakers implemented. 'None' if none in place."},
    {id: 24, question: 'Throttling', type: 'text', definition: "What mechanism is in place to throttle the number of requests the application can retrieve from clients at a given time. 'None' if none in place."},
    {id: 25, question: 'Notes', type: 'text', definition: 'Any comments related to this application to provide context. Particularly necessary if the application is taking most prod traffic in other accounts or is being deprecated'}
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