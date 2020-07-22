const AAT = 'Availability & Trends';
const PHAR = 'Platform Health & Resiliency';

export default [
    // AAT Dashboards
    // {
    //     category: AAT,
    //     id: 'availability',
    //     link: '/availability',
    //     text: 'Availability',
    //     component: require('./Availability')
    // },
    {
        category: AAT,
        id: 'funnel-view',
        link: '/funnel-view',
        text: 'Page Views',
        component: require('./FunnelView')
    },
    // PHAR Dashboards
    {
        category: PHAR,
        id: 'incident-trends',
        link: '/incident-trends',
        text: 'Incident Trends',
        component: require('./TicketTrends/IncidentTrendsDashboard'),
        main: 'Platform Health & Resiliency'
    },
    {
        category: PHAR,
        id: 'defect-trends',
        link: '/defect-trends',
        text: 'Quality Trends',
        component: require('./TicketTrends/DefectTrendsDashboard'),
        main: 'Platform Health & Resiliency'
    },
    {
        category: PHAR,
        id: 'health-check-bot-results',
        link: '/health-check-bot-results',
        text: 'Health Check Bot Results',
        component: require('./HealthCheckBotResults')
    },
    {
        category: PHAR,
        id: 'prb',
        link: '/prb',
        text: 'Problem Management',
        component: require('./PRB')
    },
    {
        category: PHAR,
        id: 'psr',
        link: '/psr',
        text: 'Purchase Success Rate',
        component: require('./PSR'),
        main: 'Platform Health & Resiliency'
    },
    {
        category: PHAR,
        id: 'resiliency-questionnaire',
        link: '/resiliency-questionnaire',
        text: 'Resiliency Questionnaire',
        component: require('./ResiliencyQuestionnaire')
    },
    {
        category: AAT,
        id: 'impulse',
        link: '/impulsetool',
        text: 'Impulse Tool',
        component: require('./MockupImpulse')
    }
];
