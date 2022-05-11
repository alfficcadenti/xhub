import qs from 'query-string';
import moment from 'moment';
import 'moment-timezone';
import {validDateRange} from '../../utils';
import {ALL_PRIORITIES_OPTION, ALL_STATUSES_OPTION} from '../../../constants';


export const convertDateToISOString = (date) => {
    const browserTimezone = moment.tz.guess();
    return moment(date.toString()).tz(browserTimezone).toISOString();
};

// eslint-disable-next-line complexity
export const getQueryValues = (search) => {
    const {from, to, status, priority} = qs.parse(search);
    const isValidDateRange = validDateRange(from, to);
    return {
        initialStart: isValidDateRange ? convertDateToISOString(from) : convertDateToISOString(moment().subtract(14, 'days')),
        initialEnd: isValidDateRange ? convertDateToISOString(to) : convertDateToISOString(moment()),
        initialStatus: status || ALL_STATUSES_OPTION,
        initialPriority: priority || ALL_PRIORITIES_OPTION
    };
};
