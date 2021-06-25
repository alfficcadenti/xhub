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
import qs from 'query-string';
import {validDateRange} from '../utils';
import {useHistory, useLocation} from 'react-router-dom';
import {useEffect} from 'react';
import {ANOMALY_SELECTOR, BRANDS, DEVICES, EG_SITE_URLS, INCIDENT_SELECTOR, LOBS} from './constants';

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


export const getActiveIndex = (pathname = '') => {
    if (pathname.includes('impulse/booking-trends')) {
        return 0;
    }
    if (pathname.includes('impulse/by-brands')) {
        return 1;
    }
    if (pathname.includes('impulse/by-lobs')) {
        return 2;
    }
    if (pathname.includes('impulse/by-siteUrl')) {
        return 3;
    }
    return 0;
};


// eslint-disable-next-line complexity
export const getQueryValues = (search) => {
    const {from, to, brands, lobs, siteUrls, devices, incidents, anomalies} = qs.parse(search);
    const isValidDateRange = validDateRange(from, to);

    return {
        initialStart: isValidDateRange ? moment(from).utc() : startTime,
        initialEnd: isValidDateRange ? moment(to).utc() : endTime,
        initialBrands: brands ? brands.split(',').filter((item) => BRANDS.includes(item)) : [],
        initialLobs: lobs ? lobs.split(',').filter((item) => LOBS.includes(item)) : [],
        initialEgSiteUrls: siteUrls ? siteUrls.split(',').filter((item) => EG_SITE_URLS.includes(item)) : [],
        initialDevices: devices ? devices.split(',').filter((item) => DEVICES.includes(item)) : [],
        initialIncidents: incidents ? incidents.split(',').filter((item) => INCIDENT_SELECTOR.includes(item)) : [],
        initialAnomalies: anomalies ? anomalies.split(',').filter((item) => ANOMALY_SELECTOR.includes(item)) : ['Anomaly Detected']
    };
};
export const mapActiveIndexToTabName = (idx) => {
    if (idx === 1) {
        return 'by-brands';
    }
    if (idx === 2) {
        return 'by-lobs';
    }
    if (idx === 3) {
        return 'by-siteUrl';
    }
    return 'booking-trends';
};
export const useAddToUrl = (
    selectedBrands,
    start,
    end,
    lobs,
    brands,
    egSiteUrls,
    devices,
    incidents,
    anomalies,
    activeIndex
) => {
    const history = useHistory();
    const {pathname} = useLocation();

    // eslint-disable-next-line complexity
    useEffect(() => {
        history.push(`${`/impulse/${mapActiveIndexToTabName(activeIndex)}?selectedBrand=${selectedBrands}`
                + `&from=${start.format()}`
                + `&to=${end.format()}`
        }${brands.length === 0 ? '' : `&brands=${brands.join(',')}`
        }${lobs.length === 0 ? '' : `&lobs=${lobs.join(',')}`
        }${egSiteUrls.length === 0 ? '' : `&siteUrls=${egSiteUrls.join(',')}`
        }${devices.length === 0 ? '' : `&devices=${devices.join(',')}`
        }${incidents.length === 0 ? '' : `&incidents=${incidents.join(',')}`
        }${anomalies.length === 0 ? '' : `&anomalies=${anomalies.join(',')}`}`
        );
    }, [selectedBrands, start, end, lobs, brands, egSiteUrls, devices, incidents, anomalies, history, pathname, activeIndex]);
};
