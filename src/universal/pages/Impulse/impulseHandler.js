import {
    ALL_BRAND_GROUP,
    EGENCIA_BRAND,
    SUPPRESSED_BRANDS,
    SUPPRESSED_LOBS,
    ANOMALY_DETECTED_COLOR,
    ANOMALY_RECOVERED_COLOR,
    UPSTREAM_UNHEALTHY_COLOR
} from '../../constants';
import moment from 'moment';

const THREE_WEEK_AVG_COUNT = '3 Week Avg Counts';
const BOOKING_COUNT = 'Booking Counts';

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

export const getQueryParamMulti = (key, value) => value && value.length ? `&${key}=${value.join(',')}` : '';
export const getBrandQueryParam = (IMPULSE_MAPPING, globalBrandName) => {
    let globalBrand = IMPULSE_MAPPING.find((brandNames) => brandNames.globalFilter === globalBrandName)?.impulseFilter;
    if (globalBrand !== ALL_BRAND_GROUP) {
        return globalBrand === EGENCIA_BRAND ? `&brands=${encodeURI(globalBrand)}` : `&brand_group_names=${encodeURI(globalBrand)}`;
    }
    return '';
};
export const getRevLoss = (incident) => {
    if (incident.estimatedImpact === null) {
        return 'NA';
    }
    return [].concat(...incident.estimatedImpact.map((impacts) => impacts.lobs.map((losses) => losses.revenueLoss !== 'NA' ? parseFloat(losses.revenueLoss) : 'NA'))).reduce((a, b) => a + b, 0);
};

export const getCategory = (anomaly) => {
    if (anomaly.state === 'IMPULSE_ALERT_DETECTED') {
        return anomaly.isLatencyHealthy ? 'Anomaly Detected' : 'Upstream Unhealthy';
    }
    return 'Anomaly Recovered';
};

export const getColor = (anomaly) => {
    if (anomaly.category === 'Anomaly Detected') {
        return ANOMALY_DETECTED_COLOR;
    } else if (anomaly.category === 'Anomaly Recovered') {
        return ANOMALY_RECOVERED_COLOR;
    }
    return UPSTREAM_UNHEALTHY_COLOR;
};

export const getQueryString = (start, end, IMPULSE_MAPPING, globalBrandName, selectedSiteURLMulti, selectedLobMulti, selectedBrandMulti, selectedDeviceTypeMulti) => (
    `?start_time=${start.format('YYYY-MM-DDTHH:mm:ss')}Z&end_time=${end.format('YYYY-MM-DDTHH:mm:ss')}Z`
    + `${getQueryParamMulti('point_of_sales', selectedSiteURLMulti)}`
    + `${getQueryParamMulti('lobs', selectedLobMulti)}`
    + `${getQueryParamMulti('brands', selectedBrandMulti)}`
    + `${getQueryParamMulti('device_types', selectedDeviceTypeMulti)}`
    + `${getBrandQueryParam(IMPULSE_MAPPING, globalBrandName)}`
);

export const getQueryStringPrediction = (start, end, IMPULSE_MAPPING, globalBrandName, selectedSiteURLMulti, selectedLobMulti, selectedBrandMulti, selectedDeviceTypeMulti) => (
    `?start_time=${start.format('YYYY-MM-DDTHH:mm:ss')}Z&end_time=${end.format('YYYY-MM-DDTHH:mm:ss')}Z`
    + `${getQueryParamMulti('egSiteUrl', selectedSiteURLMulti)}`
    + `${getQueryParamMulti('lob', selectedLobMulti)}`
    + `${getQueryParamMulti('brand', selectedBrandMulti)}`
    + `${getQueryParamMulti('device_type', selectedDeviceTypeMulti)}`
    + `${getBrandQueryParam(IMPULSE_MAPPING, globalBrandName)}`
);

export const simplifyBookingsData = (bookingsData) => (
    bookingsData.map(({time, count, prediction}) => ({
        time: moment.utc(time).valueOf(),
        [BOOKING_COUNT]: count,
        [THREE_WEEK_AVG_COUNT]: prediction.weighted_count
    }))
);

export const simplifyPredictionData = (predictionData) => (
    predictionData.map(({time, prediction}) => ({
        time: moment.utc(time).valueOf(),
        count: prediction
    }))
);
export const startTime = () => moment().utc().subtract(3, 'days').startOf('minute');
export const endTime = () => moment().utc().endOf('minute');
