import {EXPEDIA_BRAND, HOTELS_COM_BRAND, VRBO_BRAND} from '../constants';
const AAT = 'Availability & Trends';
const PHAR = 'Platform Health & Resiliency';

export default [
    {
        category: '',
        id: 'home',
        link: '/home',
        text: 'Home',
        component: require('./Home'),
        hidden: true,
        hiddenFromSearch: true
    },
    {
        category: '',
        id: 'landing-page',
        link: '/landing-page',
        text: 'Landing Page',
        component: require('./LandingPage'),
        hidden: true,
        hiddenFromSearch: true
    },
    // AAT Dashboards
    {
        category: AAT,
        id: 'checkout-fci',
        link: '/checkout-fci',
        text: 'Checkout FCI',
        component: require('./CheckoutFCI'),
        brands: [EXPEDIA_BRAND],
        hidden: true
    },
    {
        category: AAT,
        id: 'impulse',
        link: '/impulse',
        text: 'Impulse Dashboard',
        component: require('./Impulse'),
        hidden: true,
        hiddenFromSearch: true
    },
    {
        category: AAT,
        id: 'funnel-view',
        link: '/funnel-view',
        text: 'Page Views',
        component: require('./FunnelView'),
        brands: [EXPEDIA_BRAND, VRBO_BRAND, HOTELS_COM_BRAND]
    },
    {
        category: AAT,
        id: 'success-rates',
        link: '/success-rates',
        text: 'Success Rates',
        component: require('./SuccessRates'),
        brands: [EXPEDIA_BRAND, VRBO_BRAND],
        hidden: true
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
        brands: [HOTELS_COM_BRAND]
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
