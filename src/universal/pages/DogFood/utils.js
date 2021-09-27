import qs from 'query-string';
import {validDateRange, getUrlParam, getValue} from '../utils';
import moment from 'moment';
import {getOrDefault} from '../../utils';
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
        initialTimeRange: isValidDateRange ? 'Custom' : 'Last 7 days',
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

const formatDate = (dateString) => dateString && moment(dateString).isValid ? moment(dateString).format('YYYY-MM-DD HH:mm') : '-';

export const mapIssues = (x) => {
    return ({
        'Ticket Id': `<a href="${x.url}" target="_blank">${x.id}</a>`,
        Priority: getOrDefault(x, 'priority'),
        Severity: getOrDefault(x, 'severity'),
        Brand: getOrDefault(x, 'brand'),
        Summary: getOrDefault(x, 'summary'),
        Project: getOrDefault(x, 'project'),
        'Project Key': getOrDefault(x, 'project_key'),
        Status: getOrDefault(x, 'status'),
        Tag: getOrDefault(x, 'tag'),
        Resolution: getOrDefault(x, 'resolution'),
        'Impacted Brand': getOrDefault(x, 'impacted_brand'),
        'Last Update': formatDate(x.updated_date_time),
        'Open Date': formatDate(x.open_date),
        'Resolved Date': formatDate(x.resolved_date),
        'Labels': x.labels && Array.isArray(x.labels) ? x.labels.slice(',') : []
    });
};

export const getPresets = () => [
    {text: 'Last 24 hours', value: getValue(24, 'hours')},
    {text: 'Last 7 days', value: getValue(7, 'days')},
    {text: 'Last 14 days', value: getValue(14, 'days')},
    {text: 'Last 30 days', value: getValue(30, 'days')},
    {text: 'Last 60 days', value: getValue(60, 'days')},
    {text: 'Last 90 days', value: getValue(90, 'days')},
    {text: 'Last 1 year', value: getValue(1, 'year')}
];