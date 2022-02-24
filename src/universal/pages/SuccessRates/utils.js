import moment from 'moment';
import {EXPEDIA_BRAND, SUCCESS_RATES_PAGES_LIST, LOB_LIST} from '../../constants';
import {AVAILABLE_LOBS} from './constants';
import {mapBrandNames, validDateRange} from '../utils';
import qs from 'query-string';


export const getWidgetXAxisTickGap = (timeRange) => [
    'Last 1 hour',
    'Last 3 hours',
    'Last 6 hours',
    'Last 12 hours',
    'Last 24 hours'
].includes(timeRange) ? 20 : 5;

export const shouldShowTooltip = (chartName, pageBrand, selectedLobs = []) => {
    if (pageBrand === EXPEDIA_BRAND && chartName === SUCCESS_RATES_PAGES_LIST[3]) {
        return 'Only for nonNativeApps';
    } else if (selectedLobs.length && chartName === SUCCESS_RATES_PAGES_LIST[0]) {
        return 'Only aggregated view is available for search';
    }
    return null;
};

export const successRatesRealTimeObject = (fetchedSuccessRates = [], selectedLobs = [], selectedBrand) => {
    const nextRealTimeTotals = SUCCESS_RATES_PAGES_LIST.reduce((acc, label) => {
        acc[label] = 0;
        return acc;
    }, {});

    SUCCESS_RATES_PAGES_LIST.forEach((label, i) => {
        const currentSuccessRates = fetchedSuccessRates[i];

        if (!currentSuccessRates || !currentSuccessRates.length) {
            nextRealTimeTotals[label] = 'N/A';
            return;
        }

        for (let counter = 1; counter <= currentSuccessRates.length; counter++) {
            const {successRatePercentagesData, brandWiseSuccessRateData} = currentSuccessRates[currentSuccessRates.length - counter];
            const isLOBSelected = !!selectedLobs.length;
            const isHomeToSearch = label === SUCCESS_RATES_PAGES_LIST[0];
            let successRates;

            if (isHomeToSearch) {
                successRates = brandWiseSuccessRateData;
            } else if (isLOBSelected) {
                successRates = successRatePercentagesData.filter((item) => {
                    const matchBrand = mapBrandNames(item.brand) === selectedBrand;

                    return matchBrand && selectedLobs.map((selectedLob) => selectedLob.value).includes(item.lineOfBusiness);
                });
            } else {
                successRates = brandWiseSuccessRateData;
            }

            const notEmpty = (value) => {
                return Array.isArray(value) ?
                    value.some((item) => item.rate !== null) :
                    value.rate !== null;
            };

            if (successRates && notEmpty(successRates)) {
                if (Array.isArray(successRates)) {
                    nextRealTimeTotals[label] = successRates.map((item) => ({
                        label: LOB_LIST.find((lob) => lob.value === item.lineOfBusiness).label,
                        rate: item.rate.toFixed(2)
                    }));
                } else {
                    nextRealTimeTotals[label] = successRates.rate.toFixed(2);
                }

                break;
            }

            if (counter === currentSuccessRates.length) {
                nextRealTimeTotals[label] = 0;
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
    const {from, to, lobs} = qs.parse(search, {decoder: (c) => c});
    const initialLobs = lobs
        ? lobs.split(',').map((l) => LOB_LIST.find(({value}) => value === l)).filter((l) => l)
        : getAllAvailableLOBs(AVAILABLE_LOBS);

    return validDateRange(from, to)
        ? {
            initialStart: moment(from),
            initialEnd: moment(to),
            initialTimeRange: 'Custom',
            initialLobs
        } : {
            initialStart: moment().subtract(6, 'hours').startOf('minute'),
            initialEnd: moment(),
            initialTimeRange: 'Last 6 Hours',
            initialLobs
        };
};
