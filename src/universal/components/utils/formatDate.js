import React from 'react';
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
    return Number(moment.duration(Number(duration)).as('hours')).toFixed(2) || '';
}

export function formatDurationForTable(m) {
    const duration = moment.duration(Number(m), 'milliseconds');
    return `<a name='${String(duration.asMinutes()).padStart(6, 0)}'></a>${duration.humanize()}`;
}

export function formatDurationForHomeawayTable(m) {
    const duration = moment.duration(Number(m), 'milliseconds');
    return `${duration.humanize()}`;
}
