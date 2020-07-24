export const RC_PORTFOLIOS = 'All RootCause Portfolios';
export const RC_PORTFOLIO_GROUPS = 'All RootCause Portfolio Groups';
export const IMPACTED_PORTFOLIOS = 'All Impacted Portfolios';
export const IMPACTED_PORTFOLIO_GROUPS = 'All Impacted Portfolio Groups';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const ALL_PRIORITIES_OPTION = 'All Priorities';
export const ALL_STATUSES_OPTION = 'All Statuses';
export const ALL_TAGS_OPTION = 'All Tags';
export const ALL_TAGS = ['cost-optimization', 'covid-19'];
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

export const CHART_COLORS = ['#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477', '#66aa00', '#b82e2e', '#316395', '#3366cc', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300', '#8b0707', '#651067', '#329262', '#5574a6', '#3b3eac', '#b77322', '#16d620', '#b91383', '#f4359e', '#9c5935', '#a9c413', '#2a778d', '#668d1c', '#bea413', '#0c5922', '#743411'];

export const EG_BRAND = 'Expedia Group';
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
