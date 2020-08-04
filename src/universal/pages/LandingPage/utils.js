import {mapBrandNames} from '../utils';

export const formatCSRData = (data, selectedBrands) => {
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
