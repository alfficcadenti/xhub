import moment from 'moment';
import qs from 'query-string';
import {DATE_FORMAT} from '../../constants';
import {validDateRange, getTableValue} from '../utils';


// eslint-disable-next-line complexity
export const getQueryValues = (search) => {
    const {start, end} = qs.parse(search);
    const isValidDateRange = validDateRange(start, end);

    return {
        initialStart: isValidDateRange
            ? moment(start).format(DATE_FORMAT)
            : moment().subtract(1, 'years').startOf('minute').format(DATE_FORMAT),
        initialEnd: isValidDateRange
            ? moment(end).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT)
    };
};

const addPercentageSign = (value) => {
    return value === '-' ? '-' : `${value}%`;
};

export const mapDetails = (row) => ({
    Name: getTableValue(row, 'name'),
    P1: getTableValue(row, 'p1IncidentCount'),
    P2: getTableValue(row, 'p2IncidentCount'),
    ['TTD<=15M']: addPercentageSign(getTableValue(row, 'percentIncidentsTtdWithin15MinSlo')),
    ['TTF<=15M']: addPercentageSign(getTableValue(row, 'percentIncidentsTtfWithin15MinSlo')),
    ['TTK<=30M']: addPercentageSign(getTableValue(row, 'percentIncidentsTtkWithin30MinSlo')),
    ['TTR<=30M']: addPercentageSign(getTableValue(row, 'percentIncidentsTtrWithin60MinSlo'))
});

export const detectThreshold = (value) => {
    return value >= 75 ? 'under-threshold' : '';
};
