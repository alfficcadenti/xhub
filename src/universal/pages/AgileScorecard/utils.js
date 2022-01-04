import moment from 'moment';

export const labelFormat = ({count, total, label}) => count ? `${label}  (${count} of ${total} selected)` : `Select ${label}...`;

export const formatPieData = (data) => Array.isArray(data) && data.map((x) => ({name: x.type_of_work, value: x.ticket_count})) || [];

export const formatLineChartData = (data) => Array.isArray(data) && data
    .map((x) => ({name: moment(x.date).format('YYYY-MM-DD'), 'open bugs': x.open_bugs_count || 0, 'closed bugs': x.closed_bugs_count || 0}))
    .sort((a, b) => (a.name).localeCompare(b.name)) || [];

export const formatTooltipData = (data) => Array.isArray(data) && data
    .reduce((a, x) => ({...a, [moment(x.date).format('YYYY-MM-DD')]: {'open bugs': x.open_bugs_ticket_ids?.sort(), 'closed bugs': x.closed_bugs_ticket_ids?.sort()}}), {}) || {};

export const listOfBugs = (dataObj, type) => dataObj?.[type] || [];
