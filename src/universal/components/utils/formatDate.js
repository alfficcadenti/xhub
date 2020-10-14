import moment from 'moment';

export function formatDurationToHours(duration) {
    const durationString = moment.duration(Number(duration)).get('days') > 0 ?
        `${String(moment.duration(Number(duration)).get('days'))}d ${
            String(moment.duration(Number(duration)).get('hours'))}h ${
            String(moment.duration(Number(duration)).get('minutes'))}m ` :
        `${String(moment.duration(Number(duration)).get('hours'))}h ${
            String(moment.duration(Number(duration)).get('minutes'))}m `;
    return durationString || '';
}

export function formatDurationToH(duration) {
    return Number(moment.duration(Number(duration), 'milliseconds').as('hours')).toFixed(2) || '';
}

export function formatDuration(m, unit = 'milliseconds') {
    const value = Number(m);
    const duration = moment.duration(value, unit);
    const dd = Math.floor(duration.asDays());
    const remainingDuration = duration.subtract(dd, 'days');
    const hh = remainingDuration.hours();
    const mm = remainingDuration.minutes();
    if (dd > 0) {
        return `${dd}d ${hh}h ${mm}m`;
    }
    if (hh > 0) {
        return `${hh}h ${mm}m`;
    }
    return `${mm}m`;
}

export function formatDurationForTable(m, unit = 'milliseconds') {
    const value = Number(m);
    const paddedStrValue = String(value).padStart(12);
    return `<div value=${paddedStrValue}>${formatDuration(m, unit)}</div>`;
}
