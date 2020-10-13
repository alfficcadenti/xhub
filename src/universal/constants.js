export const RC_PORTFOLIOS = 'All RootCause Portfolios';
export const RC_PORTFOLIO_GROUPS = 'All RootCause Portfolio Groups';
export const IMPACTED_PORTFOLIOS = 'All Impacted Portfolios';
export const IMPACTED_PORTFOLIO_GROUPS = 'All Impacted Portfolio Groups';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const ALL_PRIORITIES_OPTION = 'All Priorities';
export const ALL_STATUSES_OPTION = 'All Statuses';
export const ALL_TAGS_OPTION = 'All Tags';
export const ALL_TAGS = ['cost-optimization', 'covid-19'];
export const ALL_LOB = 'All LOBs';
export const ALL_BRANDS = 'All Brands';
export const ALL_POS = 'All POS';
export const ALL_DEVICES = 'All Devices';
export const ALL_BOOKING_TYPES = 'Booking Types';
export const ALL_INCIDENTS = 'All Incidents';
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

export const BRANDS = [
    {
        label: EG_BRAND,
        retailLabel: EG_BRAND,
        psrBrand: EG_BRAND,
        funnelBrand: EG_BRAND,
        landingBrand: '',
        changeRequests: '',
        portfolioBrand: '',
        color: '#1B5CAF'
    },
    {
        label: EXPEDIA_BRAND,
        retailLabel: EXPEDIA_BRAND,
        psrBrand: 'expedia',
        funnelBrand: 'expedia',
        changeRequests: 'Expedia',
        landingBrand: EXPEDIA_BRAND,
        portfolioBrand: 'BEX',
        color: '#1B5CAF'
    },
    {
        label: EGENCIA_BRAND,
        retailLabel: EGENCIA_BRAND,
        psrBrand: 'egencia',
        funnelBrand: 'egencia',
        changeRequests: 'Egencia EU,Egencia NA',
        landingBrand: '',
        portfolioBrand: '',
        color: '#1B5CAF'
    },
    {
        label: HOTELS_COM_BRAND,
        retailLabel: `${HOTELS_COM_BRAND} Retail`,
        psrBrand: 'hcom',
        funnelBrand: 'hcom',
        changeRequests: 'Hotels',
        landingBrand: HOTELS_COM_BRAND,
        portfolioBrand: 'HCOM',
        color: '#F71414'
    },
    {
        label: VRBO_BRAND,
        retailLabel: `${VRBO_BRAND} Retail`,
        psrBrand: 'vrbo',
        funnelBrand: 'vrbo',
        changeRequests: 'HomeAway',
        landingBrand: VRBO_BRAND,
        portfolioBrand: 'VRBO',
        color: '#1478F7'
    },
    {
        label: EXPEDIA_PARTNER_SERVICES_BRAND,
        retailLabel: EXPEDIA_PARTNER_SERVICES_BRAND,
        psrBrand: '',
        funnelBrand: '',
        landingBrand: EXPEDIA_PARTNER_SERVICES_BRAND,
        portfolioBrand: '',
        color: '#FFC72C'
    }
];
