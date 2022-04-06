import moment from 'moment';
import {getOrDefault} from '../../utils';
import {getValue} from '../utils';
import {THRESHOLDS, DATE_FORMAT} from './constants.js';
import AvailabilityCell from './AvailabilityCell';
import React from 'react';
import qs from 'query-string';

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

export const periodAvailability = (availabilities) => {
    const periodSummary = availabilities?.reduce((acc, curr) => {
        acc.totalRequests += (curr.requestCount || 0);
        acc.errorsCount += (curr.errorCount || 0);
        return acc;
    }, {totalRequests: 0, errorsCount: 0});
    return formattedValue((periodSummary.totalRequests - periodSummary.errorsCount) / periodSummary.totalRequests * 100);
};

export const extractColumns = (data = [], dateTimeFormat) => ['Application', ...data[0]?.availabilities?.map((item) => item && moment(item.timestamp).format(dateTimeFormat)) || [], 'Availability'];

export const exactAvailability = (availability, requestCount) => {
    if (requestCount) {
        return availability;
    }
    return null;
};

export const mapAvailabilityRow = (row = {}, handleClick, dateTimeFormat = DATE_FORMAT) => {
    const app = getOrDefault(row, 'applicationName');
    const availabilities = row?.availabilities;
    return !Array.isArray(availabilities)
        ? {}
        : Object.assign(
            {
                Application: <a href={`https://expediagroup.datadoghq.com/dashboard/yuk-xd8-ik5/sro---cgp-alerting?tpl_var_application=${app}`} target="_blank">{app}</a>,
                app,
                Availability: <AvailabilityCell value={periodAvailability(availabilities)} applicationName={app} handleClick={handleClick}/>,
                avgValue: periodAvailability(availabilities)
            },
            ...availabilities.map((x) => ({[moment(x.timestamp).format(dateTimeFormat)]: <AvailabilityCell value={exactAvailability(x.availability, x.requestCount)} applicationName={app} handleClick={handleClick}/>}))
        );
};

export const getAppErrorsDataForChart = (applicationName = '', availability = []) => Array.isArray(availability) && availability?.find((x) => x.applicationName === applicationName)?.availabilities?.map((x) => ({name: moment(x?.timestamp).format(DATE_FORMAT), '5xx Errors': x?.errorCount})) || [];

export const getSelectedRegions = (regionsObj) => (regionsObj?.length ? regionsObj.filter((x) => x.counted && x.checked).map((x) => x.name) : '');

export const getPresets = () => [
    {text: 'Last 24 Hours', value: getValue(23.98, 'hours')},
    {text: 'Last 3 days', value: getValue(3, 'days')},
    {text: 'Last 7 days', value: getValue(7, 'days')},
    {text: 'Last 15 days', value: getValue(15, 'days')},
    {text: 'Last 30 days', value: getValue(30, 'days')},
];

export const getQueryValues = (search) => {
    const {kiosk} = qs.parse(search);
    return {kioskMode: !!kiosk};
};