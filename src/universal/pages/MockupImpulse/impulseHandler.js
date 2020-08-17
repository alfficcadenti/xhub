import {ALL_BRAND_GROUP, EGENCIA_BRAND} from '../../constants';

export const getFilters = (data = [], typeOfFilter) => data.filter((item) => item.tag === typeOfFilter).map((item) => item.values);

export const getBrandFromImpulseMapping = (IMPULSE_MAPPING, globalBrand) =>
    IMPULSE_MAPPING.find((brandNames) => brandNames.globalFilter === globalBrand);

export const getQueryParam = (key, value, condition, defaultValue = '') => condition ? `&${key}=${value}` : defaultValue;

export const getBrandQueryParam = (globalBrandName, IMPULSE_MAPPING) => {
    if (getBrandFromImpulseMapping(IMPULSE_MAPPING, globalBrandName).impulseFilter !== ALL_BRAND_GROUP) {
        return getBrandFromImpulseMapping(IMPULSE_MAPPING, globalBrandName).impulseFilter === EGENCIA_BRAND ? `&brand=${encodeURI(getBrandFromImpulseMapping(IMPULSE_MAPPING, globalBrandName).impulseFilter)}` : `&brandGroupName=${encodeURI(getBrandFromImpulseMapping(IMPULSE_MAPPING, globalBrandName).impulseFilter)}`;
    }
    return '';
};
