import qs from 'query-string';
import moment from 'moment';
import {validDateRange} from '../../utils';
import {ALL_PRIORITIES_OPTION, ALL_STATUSES_OPTION, ALL_TAGS_OPTION} from '../../../constants';


export const convertDateToISOString = (date) => {
    const browserTimezone = moment.tz.guess();
    return moment(date.toString()).tz(browserTimezone).toISOString();
};

// eslint-disable-next-line complexity
export const getQueryValues = (search) => {
    const {from, to, status, priority, tag} = qs.parse(search);
    const isValidDateRange = validDateRange(from, to);
    return {
        initialStart: isValidDateRange ? convertDateToISOString(from) : convertDateToISOString(moment().subtract(14, 'days')),
        initialEnd: isValidDateRange ? convertDateToISOString(to) : convertDateToISOString(moment()),
        initialStatus: status || ALL_STATUSES_OPTION,
        initialPriority: priority || ALL_PRIORITIES_OPTION,
        initialTag: tag || ALL_TAGS_OPTION
    };
};
