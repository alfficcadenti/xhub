export const labelFormat = ({count, total, label}) => count ? `${label}  (${count} of ${total} selected)` : `Select ${label}...`;

export const formatPieData = (data) => Array.isArray(data) && data.map((x) => ({name: x.type_of_work, value: x.ticket_count})) || [];
