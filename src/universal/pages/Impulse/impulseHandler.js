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

export const getGroupType = (groupType) => {
    return groupType.length > 0 ? `&group_by=${groupType}` : '';
};

export const getQueryString = (start, end, IMPULSE_MAPPING, globalBrandName, selectedSiteURLMulti, selectedLobMulti, selectedBrandMulti, selectedDeviceTypeMulti, interval, groupType) => (
    `?start_time=${start.format('YYYY-MM-DDTHH:mm:ss')}Z&end_time=${end.format('YYYY-MM-DDTHH:mm:ss')}Z`
    + `${getQueryParamMulti('point_of_sales', selectedSiteURLMulti)}`
    + `${getQueryParamMulti('lobs', selectedLobMulti)}`
    + `${getQueryParamMulti('brands', selectedBrandMulti)}`
    + `${getQueryParamMulti('device_types', selectedDeviceTypeMulti)}`
    + `${getBrandQueryParam(IMPULSE_MAPPING, globalBrandName)}`
    + `&time_interval=${interval}`
    + `${getGroupType(groupType)}`
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
    if (pathname.includes('impulse/bookings-data')) {
        return 3;
    }
    if (pathname.includes('impulse/by-siteUrl')) {
        return 4;
    }
    return 0;
};

export const getDefaultTimeInterval = (startDate, endDate) => {
    const diff = moment(endDate).diff(moment(startDate), 'days');
    if (diff < 1) {
        return '1m';
    } else if (diff >= 1 && diff < 7) {
        return '5m';
    } else if (diff >= 7 && diff < 31) {
        return '15m';
    } else if (diff >= 31 && diff < 120) {
        return '1h';
    } else if (diff >= 120 && diff < 365) {
        return '1d';
    }
    return '1w';
};


export const getTimeIntervals = (startDate, endDate, timeInterval) => {
    const filterCurrentInterval = (item) => item !== timeInterval;
    const diff = moment(endDate).diff(moment(startDate), 'days');
    if (diff < 1) {
        return ['1m', '5m', '15m', '30m', '1h'].filter(filterCurrentInterval);
    } else if (diff >= 1 && diff < 7) {
        return ['5m', '15m', '30m', '1h'].filter(filterCurrentInterval);
    } else if (diff >= 7 && diff < 31) {
        return ['15m', '30m', '1h', '1d'].filter(filterCurrentInterval);
    } else if (diff >= 31 && diff < 120) {
        return ['1h', '1d', '1w'].filter(filterCurrentInterval);
    }
    return ['1d', '1w'].filter(filterCurrentInterval);
};

export const isValidTimeInterval = (startDate, endDate, timeInterval) => (
    !!timeInterval && !!startDate && !!endDate && getTimeIntervals(startDate, endDate).includes(timeInterval)
);

export const convertRelativeDateRange = (date = '') => {
    const regex = /^(now)([ +-][0-9]*[hd])?$/;

    const match = regex.exec(date);
    if (!match) {
        return moment().format();
    }
    const [, , time] = match;
    if (!time) {
        return moment().format();
    }
    const timeSliceRegex = /^([ +-])([0-9]*)([hd])?$/;
    const timeSliceMatch = timeSliceRegex.exec(time);
    const [, sign, num, hd] = timeSliceMatch;

    const unit = hd === 'h' ? 'hours' : 'days';
    return (sign === '+' || sign === ' ')
        ? moment().add(Number(num), unit).format()
        : moment().subtract(Number(num), unit).format();
};

// eslint-disable-next-line complexity
export const getQueryValues = (search) => {
    const {from, to, interval, refresh, brands, lobs, siteUrls, devices, incidents, anomalies} = qs.parse(search);
    const from1 = convertRelativeDateRange(from);
    const to1 = convertRelativeDateRange(to);
    const isValidDateRange = validDateRange(from1, to1);
    const initStart = isValidDateRange ? moment(from1).utc() : startTime();
    const initEnd = isValidDateRange ? moment(to1).utc() : endTime();
    const isValidInterval = isValidTimeInterval(initStart, initEnd, interval);

    return {
        initialStart: initStart,
        initialEnd: initEnd,
        initialInterval: isValidInterval ? interval : getDefaultTimeInterval(initStart, initEnd),
        initialAutoRefresh: refresh === null || refresh !== 'false',
        initialBrands: brands ? brands.split(',').filter((item) => BRANDS.includes(item)) : [],
        initialLobs: lobs ? lobs.split(',').filter((item) => LOBS.includes(item)) : [],
        initialEgSiteUrls: siteUrls ? siteUrls.split(',').filter((item) => EG_SITE_URLS.includes(item)) : [],
        initialDevices: devices ? devices.split(',').filter((item) => DEVICES.includes(item)) : [],
        initialIncidents: incidents ? incidents.split(',').filter((item) => INCIDENT_SELECTOR.includes(item)) : [],
        initialAnomalies: anomalies ? anomalies.split(',').filter((item) => ANOMALY_SELECTOR.includes(item)) : ['Anomaly Detected']
    };
};

export const convertRelativeDateInString = (date) => {
    const regex1 = /^([0-9]{4,4})[-]([0-9]{2,2})[-]([0-9]{2,2})[T]([0-9]{2,2})[:]([0-9]{2,2})[:]([0-9]{2,2})[Z]$/;
    const match1 = regex1.exec(date);
    const match2 = regex1.exec(moment(new Date()).utc().format());

    const [, , , D, H] = match1;
    const [, , , D1, H1] = match2;
    const d = D1 - D;
    const h = H1 - H;
    if (d === 0 && h === 0) {
        return 'now';
    }
    if (d > 0) {
        return `now-${d}d`;
    } else if (d < 0) {
        return `now+${-d}d`;
    } else if (h > 0) {
        return `now-${h}h`;
    }
    return `now+${-h}h`;
};

export const mapActiveIndexToTabName = (idx) => {
    if (idx === 1) {
        return 'by-brands';
    }
    if (idx === 2) {
        return 'by-lobs';
    }
    if (idx === 3) {
        return 'bookings-data';
    }
    if (idx === 4) {
        return 'by-siteUrl';
    }
    return 'booking-trends';
};

export const useAddToUrl = (
    selectedBrands,
    isSubmitClicked,
    chartSliced,
    start,
    end,
    interval,
    refresh,
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
            + `&from=${isSubmitClicked === true || chartSliced === true ? start.format() : convertRelativeDateInString(start.format())}`
            + `&to=${isSubmitClicked === true || chartSliced === true ? end.format() : convertRelativeDateInString((end.format()))}`
            + `&interval=${interval}`
            + `&refresh=${refresh}`
        }${brands.length === 0 ? '' : `&brands=${brands.join(',')}`
        }${lobs.length === 0 ? '' : `&lobs=${lobs.join(',')}`
        }${egSiteUrls.length === 0 ? '' : `&siteUrls=${egSiteUrls.join(',')}`
        }${devices.length === 0 ? '' : `&devices=${devices.join(',')}`
        }${incidents.length === 0 ? '' : `&incidents=${incidents.join(',')}`
        }${anomalies.length === 0 ? '' : `&anomalies=${anomalies.join(',')}`}`
        );
    }, [selectedBrands, isSubmitClicked, chartSliced, start, end, interval, refresh, lobs, brands, egSiteUrls, devices, incidents, anomalies, history, pathname, activeIndex]);
};
