import qs from 'query-string';
import moment from 'moment';
import {LOB_LIST} from '../../constants';
import {EXPEDIA_BRAND} from '../../constants';
import {SUCCESS_RATES_PAGES_LIST} from './constants';

// eslint-disable-next-line complexity
export const validDateRange = (start, end) => {
    if (!start || !end) {
        return false;
    }
    const startMoment = moment(start);
    const endMoment = moment(end);
    return startMoment.isValid() && endMoment.isValid() && startMoment.isBefore(new Date()) && endMoment.isAfter(startMoment);
};

export const getQueryParams = (search) => {
    const {start, end, lobs} = qs.parse(search);
    const initialLobs = lobs
        ? lobs.split(',').map((l) => LOB_LIST.find(({value}) => value === l)).filter((l) => l)
        : [];
    return (validDateRange(start, end))
        ? {
            initialStart: moment(start),
            initialEnd: moment(end),
            initialTimeRange: 'Custom',
            initialLobs
        } : {
            initialStart: moment().subtract(6, 'hours').startOf('minute'),
            initialEnd: moment(),
            initialTimeRange: 'Last 6 Hours',
            initialLobs
        };
};

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
