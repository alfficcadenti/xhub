import moment from 'moment';

export const labelFormat = ({count, total, label}) => count ? `${label}  (${count} of ${total} selected)` : `Select ${label}...`;

export const formatPieData = (data) => Array.isArray(data) && data.map((x) => ({name: x.type_of_work, value: x.ticket_count})) || [];

export const formatLineChartData = (data) => Array.isArray(data) && data.map((x) => ({name: moment(x.date).format('Do-MM-YYYY'), 'open bugs': x.open_bugs_count || 0, 'closed bugs': x.closed_bugs_count || 0})) || [];

export const formatTooltipData = (data) => Array.isArray(data) && data.reduce((a, x) => ({...a, [moment(x.date).format('Do-MM-YYYY')]: {'open bugs': x.open_bugs_ticket_ids, 'closed bugs': x.closed_bugs_ticket_ids}}), {}) || {};

export const listOfBugs = (dataObj, type) => dataObj?.[type] || [];
