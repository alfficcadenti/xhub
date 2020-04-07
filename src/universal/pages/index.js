export default [
    {
        id: 'incident-trends',
        link: '/incident-trends',
        text: 'Defect & Incident Trends',
        component: require('./IncidentTrendsDashboard')
    },
    {
        id: 'psr',
        link: '/psr',
        text: 'Purchase Success Rate',
        component: require('./PSR')
    },
    {
        id: 'resiliency-questionnaire',
        link: '/resiliency-questionnaire',
        text: 'Resiliency Questionnaire',
        component: require('./ResiliencyQuestionnaire')
    },
    {
        id: 'availability',
        link: '/availability',
        text: 'Availability',
        component: require('./Availability')
    }
    // {
    //     id: 'prb',
    //     link: '/prb',
    //     text: 'Problem Management',
    //     component: require('./PRB')
    // }
];
