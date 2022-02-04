import moment from 'moment';
import {getOrDefault} from '../../utils';
import {THRESHOLDS} from './constants.js';
import AvailabilityCell from './AvailabilityCell';
import React from 'react';

// eslint-disable-next-line complexity
export const defineClassByValue = (value) => {
    if (typeof value !== 'number') {
        return '';
    } else if (value >= THRESHOLDS.high) {
        return 'positive';
    } else if (value >= THRESHOLDS.medium) {
        return 'attention';
    } else if (value < THRESHOLDS.medium) {
        return 'negative';
    }
    return '';
};

export const formattedValue = (value) => Number.isFinite(value) ? Math.floor(value * 100) / 100 : '-';

export const periodAvailabilityAvg = (availabilities) => {
    const periodSummary = availabilities?.reduce((acc, curr) => {
        acc.totalRequests += (curr.requestCount || 0);
        acc.errorsCount += (curr.errorCount || 0);
        return acc;
    }, {totalRequests: 0, errorsCount: 0});
    return formattedValue((periodSummary.totalRequests - periodSummary.errorsCount) / periodSummary.totalRequests * 100);
};

export const extractColumns = (data = []) => ['Application', ...data[0]?.availabilities?.map((item) => item && moment(item.timestamp).format('ll')) || [], 'Average'];

export const exactAvailability = (availability, requestCount) => {
    if (requestCount) {
        return availability;
    }
    return null;
};

export const mapAvailabilityRow = (row = {}, handleClick) => {
    const app = getOrDefault(row, 'applicationName');
    const res = Array.isArray(row?.availabilities) &&
        Object.assign(
            {Application: app},
            {Average: <AvailabilityCell value={periodAvailabilityAvg(row?.availabilities)} applicationName={app} handleClick={handleClick}/>},
            {avgValue: periodAvailabilityAvg(row?.availabilities)},
            ...row?.availabilities.map((x) => ({[moment(x.timestamp).format('ll')]: <AvailabilityCell value={exactAvailability(x.availability, x.requestCount)} applicationName={app} handleClick={handleClick}/>}))) || {};
    return res;
};

export const getAppErrorsDataForChart = (applicationName = '', availability = []) => Array.isArray(availability) && availability?.find((x) => x.applicationName === applicationName)?.availabilities?.map((x) => ({name: moment(x?.timestamp).format('ll'), '5xx Errors': x?.errorCount})) || [];
