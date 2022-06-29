import moment from 'moment';
import {OPXHUB_SUPPORT_CHANNEL, EXPEDIA_BRAND, LOB_LIST} from '../../constants';
import {
    AVAILABLE_LOBS,
    LOGIN_METRICS,
    LOGIN_RATES_LABEL,
    RATE_METRICS,
    SELECT_METRIC_LABEL,
    SELECT_VIEW_LABEL,
    SHOPPING_METRICS,
    VIEW_TYPES
} from './constants';
import {mapBrandNames, validDateRange} from '../utils';
import qs from 'query-string';


export const getBrandUnsupportedMessage = (selectedBrand) => {
    return `Success rates for ${selectedBrand} is not yet available.
        If you have any questions, please ping ${OPXHUB_SUPPORT_CHANNEL} or leave a comment via our Feedback form.`;
};

export const getFetchErrorMessage = (err) => err.message && err.message.includes('query-timeout limit exceeded')
    ? `Query has timed out. Try refreshing the page. If the problem persists, please message ${OPXHUB_SUPPORT_CHANNEL} or fill out our Feedback form.`
    : `An unexpected error has occurred. Try refreshing the page. If this problem persists, please message ${OPXHUB_SUPPORT_CHANNEL} or fill out our Feedback form.`;

export const isMetricGroupSelected = (rateMetric) => RATE_METRICS.includes(rateMetric);

export const isViewSelected = (viewType) => VIEW_TYPES.includes(viewType);

export const getRateMetrics = (rateMetric, selectedBrand) => rateMetric === LOGIN_RATES_LABEL ? LOGIN_METRICS.filter((loginMetric) => loginMetric.availableBrands.includes(selectedBrand)) : SHOPPING_METRICS;

export const getWidgetXAxisTickGap = (timeRange) => [
    'Last 1 hour',
    'Last 3 hours',
    'Last 6 hours',
    'Last 12 hours',
    'Last 24 hours'
].includes(timeRange) ? 20 : 5;

export const shouldShowTooltip = (chartName, pageBrand, selectedLobs = []) => {
    if (pageBrand === EXPEDIA_BRAND && chartName === SHOPPING_METRICS[3].chartName) {
        return 'Only for nonNativeApps';
    } else if (selectedLobs.length && chartName === SHOPPING_METRICS[0].chartName) {
        return 'Only aggregated view is available for search';
    }
    return null;
};

const getSuccessRates = (currentSuccessRates, counter, selectedLobs, selectedBrand, chartName) => {
    const {successRatePercentagesData, brandWiseSuccessRateData} = currentSuccessRates[currentSuccessRates.length - counter];
    const isLOBSelected = !!selectedLobs.length;
    const isHomeToSearch = chartName === SHOPPING_METRICS[0].chartName;
    if (isHomeToSearch) {
        return brandWiseSuccessRateData;
    }
    if (isLOBSelected) {
        return successRatePercentagesData.filter((item) => {
            const matchBrand = mapBrandNames(item.brand) === selectedBrand;
            return matchBrand && selectedLobs.map((selectedLob) => selectedLob.value).includes(item.lineOfBusiness);
        });
    }
    return brandWiseSuccessRateData;
};

const getNextRealTimeTotals = (successRates) => {
    if (Array.isArray(successRates)) {
        return successRates.map((item) => ({
            label: LOB_LIST.find((lob) => lob.value === item.lineOfBusiness).label,
            rate: item.rate.toFixed(2)
        }));
    }
    return successRates.rate.toFixed(2);
};

const isSuccessRatesNonEmpty = (successRates) => {
    return Array.isArray(successRates) ?
        successRates.some((item) => item.rate !== null) :
        successRates && successRates.rate !== null;
};


export const successRatesRealTimeObject = (fetchedSuccessRates = [], selectedLobs = [], selectedBrand, metricGroup) => {
    const nextRealTimeTotals = getRateMetrics(metricGroup, selectedBrand).reduce((acc, metric) => {
        acc[metric.chartName] = 0;
        return acc;
    }, {});

    getRateMetrics(metricGroup, selectedBrand).forEach((metric, i) => {
        const currentSuccessRates = fetchedSuccessRates[i];
        const {chartName} = metric;

        if (!currentSuccessRates?.length) {
            nextRealTimeTotals[chartName] = 'N/A';
            return;
        }

        for (let counter = 1; counter <= currentSuccessRates.length; counter++) {
            const successRates = getSuccessRates(currentSuccessRates, counter, selectedLobs, selectedBrand, chartName);

            if (isSuccessRatesNonEmpty(successRates)) {
                nextRealTimeTotals[chartName] = getNextRealTimeTotals(successRates);
                break;
            }

            if (counter === currentSuccessRates.length) {
                nextRealTimeTotals[chartName] = 0;
                break;
            }
        }
    });

    return nextRealTimeTotals;
};

// eslint-disable-next-line complexity
export const getIntervalInMinutes = (startDate, endDate) => {
    const start = moment(startDate);
    const end = moment(endDate);
    let timeInterval = 5;
    if (!startDate || !endDate) {
        timeInterval = 5;
    } else if (end.diff(start, 'years') >= 1) {
        timeInterval = 2880;
    } else if (end.diff(start, 'days') > 7) {
        timeInterval = 120;
    } else if (end.diff(start, 'hours') > 24) {
        timeInterval = 60;
    } else if (end.diff(start, 'hours') <= 24) {
        timeInterval = 5;
    }
    return timeInterval;
};

export const buildSuccessRateApiQueryString = ({start, end, brand, EPSPartner = '', interval = 5}) => {
    const baseUrl = '/user-events-api/v1/funnelView';
    const dateQuery = start && end
        ? `&startDate=${moment(start).utc().format()}&endDate=${moment(end).utc().format()}`
        : '';

    if (brand === 'eps') {
        return `${baseUrl}/eps?timeInterval=${interval}${dateQuery}&tpid=${EPSPartner}`;
    }

    return `${baseUrl}?brand=${brand}&timeInterval=${interval}${dateQuery}`;
};

export const getAllAvailableLOBs = (availableLOBs = []) => {
    return LOB_LIST.filter(({value}) => availableLOBs.includes(value));
};

export const getQueryParams = (search) => {
    const {from, to, lobs, view, metric} = qs.parse(search);
    const initialLobs = lobs
        ? lobs.split(',').map((l) => LOB_LIST.find(({value}) => value === l)).filter((l) => l)
        : getAllAvailableLOBs(AVAILABLE_LOBS);
    const initialDateRangePickerValues = validDateRange(from, to)
        ? {
            initialStart: moment(from),
            initialEnd: moment(to),
            initialTimeRange: 'Custom',
        } : {
            initialStart: moment().subtract(6, 'hours').startOf('minute'),
            initialEnd: moment(),
            initialTimeRange: 'Last 6 Hours',
        };
    return {
        ...initialDateRangePickerValues,
        initialLobs,
        initialViewType: VIEW_TYPES.includes(view) ? view : SELECT_VIEW_LABEL,
        initialMetricGroup: RATE_METRICS.includes(metric) ? metric : SELECT_METRIC_LABEL
    };
};
