import React from 'react';
import moment from 'moment';
import qs from 'query-string';
import {formatDurationForTable} from '../../components/utils';
import {getOrDefault} from '../../utils';
import {DATE_FORMAT} from '../../constants';
import {validDateRange} from '../utils';
import {AGILE_TEAM_PREFIX} from './constants';

export const getQueryValues = (search) => {
    const {start, end, teams} = qs.parse(search);
    const isValidDateRange = validDateRange(start, end);

    return {
        initialStart: isValidDateRange
            ? moment(start).format(DATE_FORMAT)
            : moment().subtract(6, 'months').startOf('minute').format(DATE_FORMAT),
        initialEnd: isValidDateRange
            ? moment(end).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
        initialTeams: teams || ''
    };
};

export const labelFormat = ({count, total, label}) => count ? `${label}  (${count} of ${total} selected)` : `Select ${label}...`;

export const formatPieData = (data) => Array.isArray(data) && data.map((x) => ({name: x.type_of_work, value: x.ticket_count})) || [];

export const formatLeadTimeData = (data) => Array.isArray(data) && data
    .map((x) => ({name: moment(x.openDate).format('MMM-DD'), openDate: x.openDate, 'Mean Lead Time': x.leadTime ? Math.round(x.leadTime / 60) : x.leadTime}));

export const mapAgileInsight = (a) => ({
    ID: <a href={a.url} target="_blank" rel="noopener noreferrer">{getOrDefault(a, 'id')}</a>,
    Project: getOrDefault(a, 'project'),
    Severity: getOrDefault(a, 'severity'),
    Brand: getOrDefault(a, 'brand'),
    Summary: getOrDefault(a, 'summary'),
    'Project Key': getOrDefault(a, 'projectKey'),
    'Open Date': getOrDefault(a, 'openDate'),
    Priority: getOrDefault(a, 'priority'),
    Resolved: getOrDefault(a, 'resolvedDate'),
    Tag: getOrDefault(a, 'tag'),
    Resolution: getOrDefault(a, 'resolution'),
    'Impacted Brand': getOrDefault(a, 'impactedBrand'),
    Labels: getOrDefault(a, 'labels'),
    Teams: a.labels?.split(',')?.filter((x) => x.includes(AGILE_TEAM_PREFIX))?.map((x) => x.replace(AGILE_TEAM_PREFIX, '')).join(',') || '-',
    Updated: getOrDefault(a, 'updatedDateTime'),
    'Issue Type': getOrDefault(a, 'issueType'),
    'Last Closed': getOrDefault(a, 'lastClosed'),
    'Lead Time': formatDurationForTable(a.leadTime, 'minutes')
});

export const formatLineChartData = (data) => Array.isArray(data) && data
    .map((x) => ({name: moment(x.date).format('MMM-DD'), date: x.date, 'open bugs': x.open_bugs_count || 0, 'closed bugs': x.closed_bugs_count || 0}))
    .sort((a, b) => (a.name).localeCompare(b.name)) || [];

export const formatTooltipData = (data) => Array.isArray(data) && data
    .reduce((a, x) => ({...a, [moment(x.date).format('YYYY-MM-DD')]: {'open bugs': x.open_bugs_ticket_ids?.sort(), 'closed bugs': x.closed_bugs_ticket_ids?.sort()}}), {}) || {};

export const listOfBugs = (dataObj, type) => dataObj?.[type] || [];
