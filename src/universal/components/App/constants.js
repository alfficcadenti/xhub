const EG_BRAND = 'Expedia Group';
const BRANDS_MAP = {
    [EG_BRAND]: {},
    'BEX - Expedia Group': {
        affectedBrand: 'Expedia',
        psrBrand: 'expedia',
        landingBrand: 'BEX'
    },
    'Egencia': {
        affectedBrand: 'Egencia',
        psrBrand: 'egencia',
        landingBrand: ''
    },
    'Hotels.com': {
        affectedBrand: 'Hotels',
        psrBrand: 'hcom',
        landingBrand: 'Hotels.com'
    },
    'Vrbo': {
        affectedBrand: 'Vrbo',
        psrBrand: 'vrbo',
        landingBrand: 'Vrbo'
    }
};
exports.EG_BRAND = EG_BRAND;
exports.BRANDS_MAP = BRANDS_MAP;
exports.BRANDS = Object.keys(BRANDS_MAP);
