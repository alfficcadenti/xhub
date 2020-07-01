const EG_BRAND = 'Expedia Group';
const BRANDS = [
    {
        label: EG_BRAND,
        psrBrand: EG_BRAND,
        landingBrand: '',
        incidentBrand: EG_BRAND
    },
    {
        label: 'Brand Expedia',
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

const getBrand = (brand) => BRANDS.find((b) => brand === b.label);

exports.EG_BRAND = EG_BRAND;
exports.BRANDS = BRANDS;
exports.getBrand = getBrand;
