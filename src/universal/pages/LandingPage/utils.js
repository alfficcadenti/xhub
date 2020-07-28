import {EXPEDIA_BRAND, VRBO_BRAND} from '../../constants';

export const formatCSRData = (data, selectedBrands) => {
    const mapBrandNames = (brandName) => {
        switch (brandName) {
            case 'expedia':
                return EXPEDIA_BRAND;
            case 'vrbo':
                return VRBO_BRAND;
            default:
                return brandName;
        }
    };

    const CSRDataFormatted = selectedBrands.length && Array.isArray(selectedBrands) ? selectedBrands.map((brand) => {
        const csrData = data && data.map(
            (x) => {
                return x.successRatePercentagesData && x.successRatePercentagesData.find((item) => mapBrandNames(item.brand) === brand) ? x.successRatePercentagesData.find((item) => mapBrandNames(item.brand) === brand).rate : '';
            }).filter((n) => n && !isNaN(n));
        return {brandName: brand, CSRTrend: csrData};
    }) :
        [];
    return CSRDataFormatted;
};
