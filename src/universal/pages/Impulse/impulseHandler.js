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
const PREDICTION_COUNT = 'Prediction Counts';
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

export const getQueryString = (start, end, IMPULSE_MAPPING, globalBrandName, selectedSiteURLMulti, selectedLobMulti, selectedBrandMulti, selectedDeviceTypeMulti) => {
    let query = `?startDate=${start.format('YYYY-MM-DDTHH:mm:ss')}Z&endDate=${end.format('YYYY-MM-DDTHH:mm:ss')}Z`;
    query += getQueryParamMulti('egSiteUrl', selectedSiteURLMulti, selectedSiteURLMulti.length !== 0);
    query += getQueryParamMulti('lob', selectedLobMulti, selectedLobMulti.length !== 0);
    query += getQueryParamMulti('brand', selectedBrandMulti, selectedBrandMulti.length !== 0);
    query += getQueryParamMulti('deviceType', selectedDeviceTypeMulti, selectedDeviceTypeMulti.length !== 0);
    query += getBrandQueryParam(IMPULSE_MAPPING, globalBrandName);
    return query;
};

export const getQueryStringPrediction = (start, end, IMPULSE_MAPPING, globalBrandName, selectedSiteURLMulti, selectedLobMulti, selectedBrandMulti, selectedDeviceTypeMulti) => {
    let query = `?start_time=${start.format('YYYY-MM-DDTHH:mm:ss')}Z&end_time=${end.format('YYYY-MM-DDTHH:mm:ss')}Z`;
    query += getQueryParamMulti('egSiteUrl', selectedSiteURLMulti, selectedSiteURLMulti.length !== 0);
    query += getQueryParamMulti('lob', selectedLobMulti, selectedLobMulti.length !== 0);
    query += getQueryParamMulti('brand', selectedBrandMulti, selectedBrandMulti.length !== 0);
    query += getQueryParamMulti('device_type', selectedDeviceTypeMulti, selectedDeviceTypeMulti.length !== 0);
    query += getBrandQueryParam(IMPULSE_MAPPING, globalBrandName);
    return query;
};

export const simplifyBookingsData = (bookingsData) => {
    let simplifiedData = bookingsData.map((item) => {
        return {
            time: moment.utc(item.time).valueOf(),
            [BOOKING_COUNT]: item.count,
            [THREE_WEEK_AVG_COUNT]: item.prediction.weightedCount,
            [PREDICTION_COUNT]: 0
        };
    });
    return simplifiedData;
};

export const simplifyPredictionData = (predictionData) => {
    let simplifiedData = predictionData.map((item) => {
        return {
            time: moment.utc(item.time).valueOf(),
            count: item.prediction
        };
    });
    return simplifiedData;
};
export const startTime = () => moment().utc().subtract(3, 'days').startOf('minute');
export const endTime = () => moment().utc().endOf('minute');
