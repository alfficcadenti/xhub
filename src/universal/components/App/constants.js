const EG_BRAND = 'Expedia Group';
const BRANDS = [
    {
        label: EG_BRAND
    },
    {
        label: 'Brand Expedia',
        affectedBrand: 'Expedia',
        psrBrand: 'expedia',
        landingBrand: 'BEX'
    },
    {
        label: 'Egencia',
        affectedBrand: 'Egencia',
        psrBrand: 'egencia',
        landingBrand: ''
    },
    {
        label: 'Hotels.com',
        affectedBrand: 'Hotels',
        psrBrand: 'hcom',
        landingBrand: 'Hotels.com'
    },
    {
        label: 'Vrbo',
        affectedBrand: 'Vrbo',
        psrBrand: 'vrbo',
        landingBrand: 'Vrbo'
    }
];

const getBrand = (brand) => BRANDS.find((b) => brand === b.label);

exports.EG_BRAND = EG_BRAND;
exports.BRANDS = BRANDS;
exports.getBrand = getBrand;
