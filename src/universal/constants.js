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
export const EXPEDIA_BUSINESS_SERVICES_BRAND = 'Expedia Business Services';
export const EGENCIA_BRAND = 'Egencia';

export const EG_BRAND = 'Expedia Group';
export const BRANDS = [
    {
        label: EG_BRAND,
        psrBrand: EG_BRAND,
        landingBrand: '',
        incidentBrand: EG_BRAND
    },
    {
        label: 'Expedia',
        psrBrand: 'expedia',
        landingBrand: 'Expedia',
        incidentBrand: 'BEX - Expedia Group'
    },
    {
        label: 'Egencia',
        psrBrand: 'egencia',
        landingBrand: '',
        incidentBrand: 'Egencia'
    },
    {
        label: 'Hotels.com',
        psrBrand: 'hcom',
        landingBrand: 'Hotels.com',
        incidentBrand: 'Hotels.com'
    },
    {
        label: 'Vrbo',
        psrBrand: 'vrbo',
        landingBrand: 'Vrbo',
        incidentBrand: 'Vrbo'
    },
    {
        label: 'Expedia Business Services',
        psrBrand: '',
        landingBrand: 'Expedia Business Services',
        incidentBrand: ''
    }
];

export const getBrand = (brand) => BRANDS.find((b) => brand === b.label);
