import moment from 'moment';
import {EXPEDIA_BRAND} from '../../constants';
import {SUCCESS_RATES_PAGES_LIST} from './constants';
import {mapBrandNames} from '../utils';

export const getNowDate = () => moment().endOf('minute').toDate();

export const getLastDate = (value, unit) => moment().subtract(value, unit).startOf('minute').toDate();

export const getValue = (value, unit) => ({start: getLastDate(value, unit), end: getNowDate()});

export const getPresets = () => [
    {text: 'Last 15 minutes', value: getValue(15, 'minutes')},
    {text: 'Last 30 minutes', value: getValue(30, 'minutes')},
    {text: 'Last 1 hour', value: getValue(1, 'hour')},
    {text: 'Last 3 hours', value: getValue(3, 'hours')},
    {text: 'Last 6 hours', value: getValue(6, 'hours')},
    {text: 'Last 12 hours', value: getValue(12, 'hours')},
    {text: 'Last 24 hours', value: getValue(24, 'hours')}
];

export const getWidgetXAxisTickGap = (timeRange) => [
    'Last 1 hour',
    'Last 3 hours',
    'Last 6 hours',
    'Last 12 hours',
    'Last 24 hours'
].includes(timeRange) ? 20 : 5;

export const shouldShowTooltip = (pageName, pageBrand, selectedLobs = []) => {
    if (pageBrand === EXPEDIA_BRAND && pageName === SUCCESS_RATES_PAGES_LIST[3]) {
        return 'Only for nonNativeApps';
    } else if (selectedLobs.length && pageName === SUCCESS_RATES_PAGES_LIST[0]) {
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
        const currentSuccessRatesData = fetchedSuccessRates[i];
        if (!currentSuccessRatesData || !currentSuccessRatesData.length) {
            nextRealTimeTotals[label] = 'N/A';
            return;
        }

        for (let counter = 1; counter <= currentSuccessRatesData.length; counter++) {
            const {successRatePercentagesData, brandWiseSuccessRateData} = currentSuccessRatesData[currentSuccessRatesData.length - counter];
            const currentSuccessRates = selectedLobs.length !== 1 || label === 'Home To Search Page (SERP)' ?
                brandWiseSuccessRateData :
                successRatePercentagesData.find((item) => mapBrandNames(item.brand) === selectedBrand && item.lineOfBusiness === selectedLobs[0].value);

            if (currentSuccessRates && currentSuccessRates.rate !== null) {
                nextRealTimeTotals[label] = currentSuccessRates.rate.toFixed(2);
                break;
            }

            if (counter === currentSuccessRatesData.length) {
                nextRealTimeTotals[label] = 0;
                break;
            }
        }
    });

    return nextRealTimeTotals;
};

// eslint-disable-next-line complexity
export const getTimeInterval = (startDate, endDate) => {
    const start = moment(startDate);
    const end = moment(endDate);
    let timeInterval = 5;
    if (!startDate || !endDate) {
        timeInterval = 5;
    } else if (start.isBefore(moment().subtract(1, 'years'))) {
        timeInterval = 2880;
    } else if (start.isBefore(moment().subtract(90, 'days'))) {
        timeInterval = 120;
    } else if (end.diff(start, 'days') > 7) {
        timeInterval = 120;
    } else if (end.diff(start, 'hours') >= 24) {
        timeInterval = 60;
    } else if (end.diff(start, 'hours') < 24) {
        timeInterval = 5;
    }
    return timeInterval;
};
