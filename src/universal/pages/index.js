const AAT = 'Availability & Trends';
const PHAR = 'Platform Health & Resiliency';

export default [
    {
        category: '',
        id: 'home',
        link: '/home',
        text: 'Home',
        component: require('./Home'),
        hidden: true
    },
    {
        category: '',
        id: 'landing-page',
        link: '/landing-page',
        text: 'Landing Page',
        component: require('./LandingPage'),
        hidden: true
    },
    // AAT Dashboards
    {
        category: AAT,
        id: 'impulse',
        link: '/impulse',
        text: 'Impulse Dashboard',
        component: require('./MockupImpulse'),
        hidden: true
    },
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
        id: 'quality-metrics',
        link: '/quality-metrics',
        text: 'Quality Metrics',
        component: require('./QualityMetrics'),
        main: 'Platform Health & Resiliency',
        hidden: true,
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
