import {
    ALL_BOOKING_TYPES,
    ALL_BRAND_GROUP,
    ALL_BRANDS,
    ALL_DEVICE_TYPES, ALL_EG_SITE_URL,
    ALL_LOB,
    EGENCIA_BRAND
} from '../../constants';

export const getFilters = (data = [], typeOfFilter) => data.filter((item) => item.tag === typeOfFilter).map((item) => item.values);

export const getQueryParam = (key, value, condition, defaultValue = '') => condition ? `&${key}=${value}` : defaultValue;

export const getBrandQueryParam = (IMPULSE_MAPPING, globalBrandName) => {
    let globalBrand = IMPULSE_MAPPING.find((brandNames) => brandNames.globalFilter === globalBrandName);
    globalBrand = globalBrand.impulseFilter;
    if (globalBrand !== ALL_BRAND_GROUP) {
        return globalBrand === EGENCIA_BRAND ? `&brand=${encodeURI(globalBrand)}` : `&brandGroupName=${encodeURI(globalBrand)}`;
    }
    return '';
};

export const getQueryString = (lob, brand, deviceType, bookingType, newBrand, start, end, siteUrl, IMPULSE_MAPPING, globalBrandName) => {
    let query = `?startDate=${start.format('YYYY-MM-DDTHH:mm:ss')}Z&endDate=${end.format('YYYY-MM-DDTHH:mm:ss')}Z`;
    query += getQueryParam('lob', lob, lob !== ALL_LOB);
    query += getQueryParam('brand', brand, brand !== ALL_BRANDS);
    query += getQueryParam('deviceType', deviceType, deviceType !== ALL_DEVICE_TYPES);
    query += getQueryParam('bookingType', bookingType, bookingType !== ALL_BOOKING_TYPES);
    query += getQueryParam('egSiteUrl', siteUrl, siteUrl !== ALL_EG_SITE_URL);
    query += getBrandQueryParam(IMPULSE_MAPPING, globalBrandName);
    return query;
};
