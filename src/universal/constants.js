import moment from 'moment';
import 'moment-timezone';

export const RC_PORTFOLIOS = 'All RootCause Portfolios';
export const RC_PORTFOLIO_GROUPS = 'All RootCause Portfolio Groups';
export const IMPACTED_PORTFOLIOS = 'All Impacted Portfolios';
export const IMPACTED_PORTFOLIO_GROUPS = 'All Impacted Portfolio Groups';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const ALL_PRIORITIES_OPTION = 'All Priorities';
export const ALL_PROJECTS_OPTION = 'All Projects';
export const ALL_STATUSES_OPTION = 'All Statuses';
export const ALL_LOB = 'All LOBs';
export const ALL_BRANDS = 'All Brands';
export const ALL_POS = 'All POS';
export const ALL_DEVICES = 'All Devices';
export const ALL_INCIDENTS = 'All Incidents';
export const ALL_ANOMALIES = 'All Anomalies';
export const ALL_BRAND_GROUP = 'All Brand Group';
export const ALL_TYPES_OPTION = 'All Types';
export const ALL_ORGS_OPTION = 'All Owning Orgs';
export const ALL_RC_OWNERS_OPTION = 'All Root Cause Owners';
export const ALL_RC_CATEGORIES_OPTION = 'All Root Cause Categories';
export const ALL_PARTNERS_OPTION = 'All Partners';
export const EPIC_ISSUE_TYPE = 'Epic';
export const EXPEDIA_BRAND = 'Expedia';
export const VRBO_BRAND = 'Vrbo';
export const HOTELS_COM_BRAND = 'Hotels.com';
export const EXPEDIA_PARTNER_SERVICES_BRAND = 'Expedia Partner Solutions';
export const EGENCIA_BRAND = 'Egencia';
export const CHART_COLORS = ['#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477', '#66aa00', '#b82e2e', '#316395', '#3366cc', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300', '#8b0707', '#651067', '#329262', '#5574a6', '#3b3eac', '#b77322', '#16d620', '#b91383', '#f4359e', '#9c5935', '#a9c413', '#2a778d', '#668d1c', '#bea413', '#0c5922', '#743411'];
export const EG_BRAND = 'Expedia Group';
export const DEPLOYMENT_ANNOTATION_CATEGORY = 'deployment';
export const INCIDENT_ANNOTATION_CATEGORY = 'incident';
export const AB_TESTS_ANNOTATION_CATEGORY = 'abTests';
export const SUPPRESSED_BRANDS = ['Hotwire', 'HomeAway'];
export const SUPPRESSED_LOBS = [];
export const ANOMALY_DETECTED_COLOR = '#CD5C5C';
export const ANOMALY_RECOVERED_COLOR = '#3CB371';
export const UPSTREAM_UNHEALTHY_COLOR = '#FFA500';
export const INCIDENT_TOOLTIP_COLOR = '#ff8281';
export const EPS_PARTNER_SITENAMES = [
    {label: 'axtraweb.poweredbygps.com', value: 'axtraweb.poweredbygps.com'},
    {label: 'barcelo.poweredbygps.co.uk', value: 'barcelo.poweredbygps.co.uk'},
    {label: 'barcelo.poweredbygps.com', value: 'barcelo.poweredbygps.com'},
    {label: 'd-travel.poweredbygps.co.jp', value: 'd-travel.poweredbygps.co.jp'},
    {label: 'expedia.virginaustralia.com', value: 'expedia.virginaustralia.com'},
    {label: 'flyswoop.poweredbygps.com', value: 'flyswoop.poweredbygps.com'},
    {label: 'hawaiian.poweredbygps.co.jp', value: 'hawaiian.poweredbygps.co.jp'},
    {label: 'hawaiian.poweredbygps.co.kr', value: 'hawaiian.poweredbygps.co.kr'},
    {label: 'hawaiian.poweredbygps.co.nz', value: 'hawaiian.poweredbygps.co.nz'},
    {label: 'hawaiian.poweredbygps.com', value: 'hawaiian.poweredbygps.com'},
    {label: 'hawaiian.poweredbygps.com.au', value: 'hawaiian.poweredbygps.com.au'},
    {label: 'hotels.airnewzealand.ca', value: 'hotels.airnewzealand.ca'},
    {label: 'hotels.airnewzealand.co.jp', value: 'hotels.airnewzealand.co.jp'},
    {label: 'hotels.airnewzealand.co.nz', value: 'hotels.airnewzealand.co.nz'},
    {label: 'hotels.airnewzealand.com', value: 'hotels.airnewzealand.com'},
    {label: 'hotels.airnewzealand.com.au', value: 'hotels.airnewzealand.com.au'},
    {label: 'hotels.airnewzealand.com.hk', value: 'hotels.airnewzealand.com.hk'},
    {label: 'hotels.airnewzealand.com.sg', value: 'hotels.airnewzealand.com.sg'},
    {label: 'iberostarvacations.poweredbygps.com', value: 'iberostarvacations.poweredbygps.com'},
    {label: 'lacoleccion.poweredbygps.com', value: 'lacoleccion.poweredbygps.com'},
    {label: 'marriottholidays.poweredbygps.co.uk', value: 'marriottholidays.poweredbygps.co.uk'},
    {label: 'marriottholidays.poweredbygps.de', value: 'marriottholidays.poweredbygps.de'},
    {label: 'meliapackages.poweredbygps.com', value: 'meliapackages.poweredbygps.com'},
    {label: 'riuvacations.poweredbygps.com', value: 'riuvacations.poweredbygps.com'},
    {label: 'travel.ca.hotels.com', value: 'travel.ca.hotels.com'},
    {label: 'travel.chase.com', value: 'travel.chase.com'},
    {label: 'travel.fr.hotels.com', value: 'travel.fr.hotels.com'},
    {label: 'travel.hotels.com', value: 'travel.hotels.com'},
    {label: 'travel.jp.hotels.com', value: 'travel.jp.hotels.com'},
    {label: 'travel.no.hotels.com', value: 'travel.no.hotels.com'},
    {label: 'travel.rbcrewards.com', value: 'travel.rbcrewards.com'},
    {label: 'travel.se.hotels.com', value: 'travel.se.hotels.com'},
    {label: 'travel.uk.hotels.com', value: 'travel.uk.hotels.com'},
    {label: 'vacationsbymgmresorts.poweredbygps.com', value: 'vacationsbymgmresorts.poweredbygps.com'},
    {label: 'www.expedia-aarp.com', value: 'www.expedia-aarp.com'},
    {label: 'www.expediafortd.com', value: 'www.expediafortd.com'}
];

export const LOB_LIST = [
    {value: 'C', label: 'Cars'},
    {value: 'CR', label: 'Cruise'},
    {value: 'F', label: 'Flights'},
    {value: 'H', label: 'Hotels'},
    {value: 'P', label: 'Package'},
    {value: '3PP', label: 'ThreePP'},
    {value: 'U', label: 'Unknown'},
];

export const PAGE_VIEWS_DATE_FORMAT = 'YYYY-MM-DD HH:mm';

export const PAGES_LIST = [
    {name: 'home', label: 'Home'},
    {name: 'searchresults', label: 'Search'},
    {name: 'property', label: 'Property'},
    {name: 'bookingform', label: 'Booking Form'},
    {name: 'bookingconfirmation', label: 'Booking Confirmation'},
];

export const SUCCESS_RATES_PAGES_LIST = [
    'Home To Search Page (SERP)',
    'Search (SERP) To Property Page (PDP)',
    'Property (PDP) To Checkout Page (CKO)',
    'Checkout (CKO) To Checkout Confirmation Page'
];

export const TIMEZONE_ABBR = moment().tz(moment.tz.guess()).format('z');

export const BRANDS = [
    {
        label: EG_BRAND,
        retailLabel: EG_BRAND,
        psrBrand: EG_BRAND,
        funnelBrand: EG_BRAND,
        landingBrand: '',
        changeRequests: '',
        color: '#1B5CAF'
    },
    {
        label: EXPEDIA_BRAND,
        retailLabel: EXPEDIA_BRAND,
        psrBrand: 'expedia',
        funnelBrand: 'expedia',
        changeRequests: 'Expedia',
        landingBrand: EXPEDIA_BRAND,
        color: '#1B5CAF'
    },
    {
        label: EGENCIA_BRAND,
        retailLabel: EGENCIA_BRAND,
        psrBrand: 'egencia',
        funnelBrand: 'egencia',
        changeRequests: 'Egencia EU,Egencia NA',
        landingBrand: '',
        color: '#1B5CAF'
    },
    {
        label: HOTELS_COM_BRAND,
        retailLabel: `${HOTELS_COM_BRAND} Retail`,
        psrBrand: 'hcom',
        funnelBrand: 'hcom',
        changeRequests: 'Hotels',
        landingBrand: HOTELS_COM_BRAND,
        color: '#F71414'
    },
    {
        label: VRBO_BRAND,
        retailLabel: `${VRBO_BRAND} Retail`,
        psrBrand: 'vrbo',
        funnelBrand: 'vrbo',
        changeRequests: 'HomeAway',
        landingBrand: VRBO_BRAND,
        color: '#1478F7'
    },
    {
        label: EXPEDIA_PARTNER_SERVICES_BRAND,
        retailLabel: EXPEDIA_PARTNER_SERVICES_BRAND,
        psrBrand: '',
        funnelBrand: 'eps',
        landingBrand: EXPEDIA_PARTNER_SERVICES_BRAND,
        color: '#FFC72C'
    }
];

export const OPXHUB_SUPPORT_CHANNEL = '#opxhub-support';
export const PAGE_VIEWS_PAGE_NAME = 'Page Views';

export const FETCH_FAILED_MSG = 'Failed to retrieve data. Try refreshing the page. '
    + `If the problem persists, please message ${OPXHUB_SUPPORT_CHANNEL} or fill out our Feedback form.`;

export const GRAFANA_DASHBOARDS = [
    {
        brand: EXPEDIA_BRAND,
        pageViewsUrl: 'https://opexhub-grafana.expedia.biz/d/DdypXxKLZ/bex-pageviews?orgId=1&var-eventType=pageview&var-brandGroup=bexg&var-lineOfBusiness=All&theme=light',
        successRateUrl: 'https://opex-grafana.expedia.biz/d/3-CbFic7z/expedia-success-rate?orgId=2&theme=light'
    },
    {
        brand: VRBO_BRAND,
        pageViewsUrl: 'https://opexhub-grafana.expedia.biz/d/aZXj08Fnz/vrbo-pageviews?orgId=1&theme=light',
        successRateUrl: 'https://opex-grafana.expedia.biz/d/m2a5Kmcnk/vrbo-success-rate?orgId=2&theme=light'
    },
    {
        brand: HOTELS_COM_BRAND,
        pageViewsUrl: 'https://opexhub-grafana.expedia.biz/d/0LmLA8F7z/hcom-pageview?orgId=1&theme=light',
        successRateUrl: 'https://opex-grafana.expedia.biz/d/qgdtFi57z/hcom-success-rate?orgId=2&theme=light'
    },
];