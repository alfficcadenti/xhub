import {
    ALL_BRAND_GROUP,
    EGENCIA_BRAND
} from '../../constants';

export const getFilters = (data = [], typeOfFilter) => data.filter((item) => item.tag === typeOfFilter).map((item) => item.values)[0].map((a) => ({value: a, label: a}));
export const getQueryParamMulti = (key, value, condition, defaultValue = '') => condition ? `&${key}=${value.join(',')}` : defaultValue;
export const getBrandQueryParam = (IMPULSE_MAPPING, globalBrandName) => {
    let globalBrand = IMPULSE_MAPPING.find((brandNames) => brandNames.globalFilter === globalBrandName)?.impulseFilter;
    if (globalBrand !== ALL_BRAND_GROUP) {
        return globalBrand === EGENCIA_BRAND ? `&brand=${encodeURI(globalBrand)}` : `&brandGroupName=${encodeURI(globalBrand)}`;
    }
    return '';
};

export const getQueryString = (start, end, IMPULSE_MAPPING, globalBrandName, selectedSiteURLMulti, selectedLobMulti, selectedBrandMulti, selectedDeviceTypeMulti, selectedBookingTypeMulti, selectedSiteId, selectedTPID) => {
    let query = `?startDate=${start.format('YYYY-MM-DDTHH:mm:ss')}Z&endDate=${end.format('YYYY-MM-DDTHH:mm:ss')}Z`;
    query += getQueryParamMulti('egSiteUrl', selectedSiteURLMulti, selectedSiteURLMulti.length !== 0);
    query += getQueryParamMulti('lob', selectedLobMulti, selectedLobMulti.length !== 0);
    query += getQueryParamMulti('brand', selectedBrandMulti, selectedBrandMulti.length !== 0);
    query += getQueryParamMulti('deviceType', selectedDeviceTypeMulti, selectedDeviceTypeMulti.length !== 0);
    query += getQueryParamMulti('bookingType', selectedBookingTypeMulti, selectedBookingTypeMulti.length !== 0);
    query += getQueryParamMulti('siteId', selectedSiteId, selectedSiteId.length !== 0);
    query += getQueryParamMulti('tpid', selectedTPID, selectedTPID.length !== 0);
    query += getBrandQueryParam(IMPULSE_MAPPING, globalBrandName);
    return query;
};
