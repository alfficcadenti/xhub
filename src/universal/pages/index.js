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
import OperationalTV from './OperationalTV';
import OperationalDashboard from './OperationalDashboard';
import CheckoutSuccessRate from './CheckoutSuccessRate';
import OperationalIos from './OperationalIos';
import DataCenterTraffic from './DataCenterTraffic';
import PortfolioScoreCard from './PortfolioScoreCard';
import SalesForceCases from './SalesForceCases';
import {EXPEDIA_BRAND, HOTELS_COM_BRAND, VRBO_BRAND, EXPEDIA_PARTNER_SERVICES_BRAND} from '../constants';


const AAT = 'Availability & Trends';
const CEA = 'Customer Experience Analysis';
const MP = 'Mobile Performance';
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
        id: 'checkout-success-rate',
        link: '/checkout-success-rate',
        text: 'Checkout Success Rate',
        component: CheckoutSuccessRate,
        brands: [HOTELS_COM_BRAND],
        hidden: false
    },
    {
        category: AAT,
        id: 'data-center-traffic',
        link: '/data-center-traffic',
        text: 'Data Center Traffic',
        component: DataCenterTraffic,
        brands: [HOTELS_COM_BRAND],
        hidden: false
    },
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
        id: 'operational-tv',
        link: '/operational-tv',
        text: 'Operational TV',
        component: OperationalTV,
        brands: [HOTELS_COM_BRAND],
        hidden: false
    },
    {
        category: AAT,
        id: 'operational-ios',
        link: '/operational-ios',
        text: 'Operational iOS Dashboard',
        component: OperationalIos,
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
    // CEA Dashboards
    {
        category: CEA,
        id: 'sales-force-cases',
        link: '/sales-force-cases',
        text: 'SalesForce Cases',
        component: SalesForceCases,
        brands: [VRBO_BRAND],
        hidden: false
    },
    // MP Dashboards
    {
        category: MP,
        id: 'performance-android-traveller',
        link: 'https://console.firebase.google.com/project/homeaway.com:api-project-42464624060/performance/app/android:com.vrbo.android/trends',
        text: 'Performance - Android Traveller',
        brands: [VRBO_BRAND],
        hidden: false,
        external: true
    },
    {
        category: MP,
        id: 'performance-ios-traveller',
        link: 'https://console.firebase.google.com/project/homeaway.com:api-project-42464624060/performance/app/ios:com.vrbo.traveler/trends',
        text: 'Performance - iOS Traveller',
        brands: [VRBO_BRAND],
        hidden: false,
        external: true
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
    {
        category: PHAR,
        id: 'portfolio-score-card',
        link: '/portfolio-score-card',
        text: 'Portfolio ScoreCard',
        component: PortfolioScoreCard
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
