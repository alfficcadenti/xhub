import SuccessRates from './SuccessRates';
import Fci from './Fci';
import Finder from './Finder';
import FunnelView from './FunnelView';
import Home from './Home';
import Impulse from './Impulse';
import LandingPage from './LandingPage';
import OutageReport from './OutageReport';
import PRB from './PRB';
import QualityMetrics from './QualityMetrics';
import IncidentTrendsDashboard from './TicketTrends/IncidentTrendsDashboard';
import DefectTrendsDashboard from './TicketTrends/DefectTrendsDashboard';
import Reservations from './Reservations';
import OperationalDashboard from './OperationalDashboard';
import {EXPEDIA_BRAND, HOTELS_COM_BRAND, VRBO_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND} from '../constants';


const AAT = 'Availability & Trends';
const PHAR = 'Platform Health & Resiliency';
const OR = 'Outage Report';

export default [
    {
        category: '',
        id: 'home',
        link: '/home',
        text: 'Home',
        component: Home,
        hidden: true
    },
    {
        category: '',
        id: 'landing-page',
        link: '/landing-page',
        text: 'Landing Page',
        component: LandingPage,
        hidden: true
    },
    // AAT Dashboards
    {
        category: AAT,
        id: 'impulse',
        link: '/impulse',
        text: 'Impulse Dashboard',
        component: Impulse,
        hidden: false
    },
    {
        category: AAT,
        id: 'fci',
        link: '/fci',
        text: 'FCI',
        component: Fci,
        brands: [EXPEDIA_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND],
        hidden: false
    },
    {
        category: AAT,
        id: 'funnel-view',
        link: '/funnel-view',
        text: 'Page Views',
        component: FunnelView,
        brands: [EXPEDIA_BRAND, VRBO_BRAND, HOTELS_COM_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND]
    },
    {
        category: AAT,
        id: 'operational-dashboard',
        link: '/operational-dashboard',
        text: 'Operational Dashboard',
        component: OperationalDashboard,
        brands: [HOTELS_COM_BRAND],
        hidden: false
    },
    {
        category: AAT,
        id: 'reservations',
        link: '/reservations',
        text: 'Reservations',
        component: Reservations,
        brands: [HOTELS_COM_BRAND],
        hidden: false
    },
    {
        category: AAT,
        id: 'success-rates',
        link: '/success-rates',
        text: 'Success Rates',
        component: SuccessRates,
        brands: [EXPEDIA_BRAND, HOTELS_COM_BRAND, VRBO_BRAND],
        hidden: false
    },
    // PHAR Dashboards
    {
        category: PHAR,
        id: 'incident-trends',
        link: '/incident-trends',
        text: 'Incident Trends',
        component: IncidentTrendsDashboard
    },
    {
        category: PHAR,
        id: 'defect-trends',
        link: '/defect-trends',
        text: 'Quality Trends',
        component: DefectTrendsDashboard
    },
    {
        category: PHAR,
        id: 'quality-metrics',
        link: '/quality-metrics',
        text: 'Quality Metrics',
        component: QualityMetrics,
        brands: [HOTELS_COM_BRAND]
    },
    {
        category: PHAR,
        id: 'prb',
        link: '/prb',
        text: 'Problem Management',
        component: PRB
    },
    {
        category: PHAR,
        id: 'finder',
        link: '/finder',
        text: 'Change Finder',
        component: Finder
    },
    // OR Dashboards
    {
        category: OR,
        id: 'outage-report',
        link: '/outage-report',
        text: 'Outage Report',
        component: OutageReport
    }
];
