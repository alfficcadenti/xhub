const AAT = 'Availability & Trends';
const PHAR = 'Platform Health & Resiliency';

export default [
    // AAT Dashboards
    {
        category: AAT,
        id: 'funnel-view',
        link: '/funnel-view',
        text: 'Page Views',
        component: require('./FunnelView')
    },
    {
        category: AAT,
        id: 'success-rates',
        link: '/success-rates',
        text: 'Success Rates',
        component: require('./SuccessRates')
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
        id: 'prb',
        link: '/prb',
        text: 'Problem Management',
        component: require('./PRB')
    },
    {
        category: PHAR,
        id: 'finder',
        link: '/finder',
        text: 'Change Finder',
        component: require('./Finder')
    }
];
