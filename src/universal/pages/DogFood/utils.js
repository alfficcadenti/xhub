import qs from 'query-string';
import {validDateRange, getUrlParam} from '../utils';
import moment from 'moment';
import {DATE_FORMAT, ALL_PROJECTS_OPTION, ALL_STATUSES_OPTION} from '../../constants';


// eslint-disable-next-line complexity
export const getQueryValues = (search) => {
    const {
        start,
        end,
        status,
        project
    } = qs.parse(search);
    const isValidDateRange = validDateRange(start, end);
    return {
        initialStart: isValidDateRange
            ? moment(start).format(DATE_FORMAT)
            : moment().subtract(1, 'month').startOf('minute').format(DATE_FORMAT),
        initialEnd: isValidDateRange
            ? moment(end).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
        initialStatus: status || ALL_STATUSES_OPTION,
        initialProject: project || ALL_PROJECTS_OPTION,
    };
};

export const getActiveIndex = (pathname = '') => {
    if (pathname.includes('dog-food/overview')) {
        return 0;
    }
    if (pathname.includes('dog-food/issues')) {
        return 1;
    }
    return 0;
};

export const mapActiveIndexToTabName = (idx) => {
    if (idx === 1) {
        return 'issues';
    }
    return 'overview';
};

export const generateUrl = (
    activeIndex,
    selectedBrands,
    startDate,
    endDate,
    selectedStatus,
    selectedProject
) => {
    return `/dog-food/${mapActiveIndexToTabName(activeIndex)}`
        + `?selectedBrand=${selectedBrands[0]}`
        + `&start=${startDate}`
        + `&end=${endDate}`
        + `${getUrlParam('project', selectedProject, ALL_PROJECTS_OPTION)}`
        + `${getUrlParam('status', selectedStatus, ALL_STATUSES_OPTION)}`;
};