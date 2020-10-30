import {
    ALL_BRAND_GROUP,
    EGENCIA_BRAND,
    SUPPRESSED_BRANDS,
    SUPPRESSED_LOBS
} from '../../constants';


export const getFilters = (data = [], typeOfFilter) =>
    data.filter((item) => item.tag === typeOfFilter).map((item) => item.values)[0].map((a) => ({
        value: a,
        label: a
    })).filter((item) => (!SUPPRESSED_BRANDS.includes(item.value) && !SUPPRESSED_LOBS.includes(item.value))).sort((A, B) => A.value.localeCompare(B.value));

export const getFiltersForMultiKeys = (keys = [], data = {}, typeOfFilter) => keys
    .flatMap((key) => data[key]
        .filter((obj) => obj.tag === typeOfFilter)
        .map((item) => item.values)[0]
        .map((a) => ({
            value: a,
            label: a
        }))
        .sort((A, B) => A.value.localeCompare(B.value)))
    .filter((v, i, a) => a.findIndex((t) => (t.label === v.label && t.value === v.value)) === i);

export const getQueryParamMulti = (key, value, condition, defaultValue = '') => condition ? `&${key}=${value.join(',')}` : defaultValue;
export const getBrandQueryParam = (IMPULSE_MAPPING, globalBrandName) => {
    let globalBrand = IMPULSE_MAPPING.find((brandNames) => brandNames.globalFilter === globalBrandName)?.impulseFilter;
    if (globalBrand !== ALL_BRAND_GROUP) {
        return globalBrand === EGENCIA_BRAND ? `&brand=${encodeURI(globalBrand)}` : `&brandGroupName=${encodeURI(globalBrand)}`;
    }
    return '';
};
export const getRevLoss = (incident) => {
    if (incident.estimatedImpact === null) {
        return 'NA';
    }
    return incident.estimatedImpact.map((impacts) => impacts.lobs.map((losses) => losses.revenueLoss !== 'NA' ? parseFloat(losses.revenueLoss) : 'NA')).flat().reduce((a, b) => a + b, 0);
};

export const getQueryString = (start, end, IMPULSE_MAPPING, globalBrandName, selectedSiteURLMulti, selectedLobMulti, selectedBrandMulti, selectedDeviceTypeMulti, selectedBookingTypeMulti) => {
    let query = `?startDate=${start.format('YYYY-MM-DDTHH:mm:ss')}Z&endDate=${end.format('YYYY-MM-DDTHH:mm:ss')}Z`;
    query += getQueryParamMulti('egSiteUrl', selectedSiteURLMulti, selectedSiteURLMulti.length !== 0);
    query += getQueryParamMulti('lob', selectedLobMulti, selectedLobMulti.length !== 0);
    query += getQueryParamMulti('brand', selectedBrandMulti, selectedBrandMulti.length !== 0);
    query += getQueryParamMulti('deviceType', selectedDeviceTypeMulti, selectedDeviceTypeMulti.length !== 0);
    query += getQueryParamMulti('bookingType', selectedBookingTypeMulti, selectedBookingTypeMulti.length !== 0);
    query += getBrandQueryParam(IMPULSE_MAPPING, globalBrandName);
    return query;
};
