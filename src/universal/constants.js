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
export const ALL_BRAND_GROUP = 'All Brand Group';
export const FETCH_OPTION = {Accept: 'application/json', 'Content-Type': 'application/json'};
export const ALL_TYPES_OPTION = 'All Types';
export const ALL_ORGS_OPTION = 'All Owning Orgs';
export const ALL_RC_OWNERS_OPTION = 'All Root Cause Owners';
export const ALL_RC_CATEGORIES_OPTION = 'All Root Cause Categories';
export const EPIC_ISSUE_TYPE = 'Epic';
export const EXPEDIA_BRAND = 'Expedia';
export const VRBO_BRAND = 'Vrbo';
export const HOTELS_COM_BRAND = 'Hotels.com';
export const EXPEDIA_PARTNER_SERVICES_BRAND = 'Expedia Partner Services';
export const EGENCIA_BRAND = 'Egencia';
export const LOBS = ['Air', 'Activity', 'Car', 'Insurance', 'Lodging'];
export const BRAND_GROUPS = ['Brand Expedia Group', 'Expedia Business Services', 'Hotels.com', 'VRBO', 'Unknown'];
export const EG_BRAND = 'Expedia Group';
export const BRANDS_LIST = ['Brand Expedia', 'CheapTickets', 'Egencia', 'Expedia Partner Solutions', 'HomeAway', 'Hotels.com', 'Hotwire', 'Orbitz', 'Travelocity', 'Wotif', 'eBookers'];
export const TIME_INTERVAL = '15Min Interval';
export const TIME_INTERVALS_IMPULSE = ['15Min Interval', '30Min Interval', '60Min Interval'];
export const BRANDS = [
    {
        label: EG_BRAND,
        psrBrand: EG_BRAND,
        funnelBrand: EG_BRAND,
        landingBrand: '',
        incidentBrand: EG_BRAND,
        color: '#1B5CAF'
    },
    {
        label: EXPEDIA_BRAND,
        psrBrand: 'expedia',
        funnelBrand: 'expedia',
        landingBrand: EXPEDIA_BRAND,
        incidentBrand: 'BEX - Expedia Group',
        color: '#1B5CAF'
    },
    {
        label: EGENCIA_BRAND,
        psrBrand: 'egencia',
        funnelBrand: 'egencia',
        landingBrand: '',
        incidentBrand: EGENCIA_BRAND,
        color: '#1B5CAF'
    },
    {
        label: HOTELS_COM_BRAND,
        psrBrand: 'hcom',
        funnelBrand: 'hcom',
        landingBrand: HOTELS_COM_BRAND,
        incidentBrand: HOTELS_COM_BRAND,
        color: '#F71414'
    },
    {
        label: VRBO_BRAND,
        psrBrand: 'vrbo',
        funnelBrand: 'vrbo',
        landingBrand: VRBO_BRAND,
        incidentBrand: VRBO_BRAND,
        color: '#1478F7'
    },
    {
        label: EXPEDIA_PARTNER_SERVICES_BRAND,
        psrBrand: '',
        funnelBrand: '',
        landingBrand: EXPEDIA_PARTNER_SERVICES_BRAND,
        incidentBrand: '',
        color: '#FFC72C'
    }
];

export const getBrand = (brand) => BRANDS.find((b) => brand === b.label);
