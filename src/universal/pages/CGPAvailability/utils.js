import React from 'react';
import qs from 'query-string';
import moment from 'moment';
import {getOrDefault} from '../../utils';
import {getPresetValue} from '../utils';
import {THRESHOLDS, DATE_FORMAT} from './constants.js';
import AvailabilityCell from './AvailabilityCell';
import AvailabilityHeader from './AvailabilityHeader';
import {BRANDS, EG_BRAND} from '../../constants';


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

export const periodRequestStats = (availabilities) => {
    const periodSummary = availabilities?.reduce((acc, curr) => {
        acc.totalRequests += (curr.requestCount || 0);
        acc.errorsCount += (curr.errorCount || 0);
        return acc;
    }, {totalRequests: 0, errorsCount: 0});
    return periodSummary;
};

export const extractColumns = (data, dateTimeFormat) => data?.length
    ? ['Application', ...data[0].availabilities?.map((item) => item && moment(item.timestamp).format(dateTimeFormat)) || [], 'Availability']
    : [];


export const getAvailabilityRows = (data, dateTimeFormat, handleHeaderClick, enableHeaderClick) => {
    const timestamps = data?.length ? [...data[0].availabilities?.map((item) => item && moment(item.timestamp))] : [];
    return timestamps.reduce((acc, momentObj) => {
        const headerText = momentObj.format(dateTimeFormat);
        return {
            ...acc,
            [headerText]: (
                <AvailabilityHeader
                    content={headerText}
                    value={momentObj.format()}
                    onHeaderClick={handleHeaderClick}
                    enableHeaderClick={enableHeaderClick}
                />
            )
        };
    }, {
        Application: <AvailabilityHeader content={'Application'} />,
        Availability: <AvailabilityHeader content={'Availability'} />
    });
};

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
                Application: <a href={`https://expediagroup.datadoghq.com/dashboard/yuk-xd8-ik5/sro---cgp-alerting?tpl_var_application=${app}`} target="_blank" rel="noopener noreferrer">{app}</a>,
                app,
                Availability: <AvailabilityCell value={periodAvailability(availabilities)} applicationName={app} handleClick={handleClick}/>,
                avgValue: periodAvailability(availabilities),
                stats: periodRequestStats(availabilities)
            },
            ...availabilities.map((x) => ({[moment(x.timestamp).format(dateTimeFormat)]: <AvailabilityCell value={exactAvailability(x.availability, x.requestCount)} applicationName={app} handleClick={handleClick}/>}))
        );
};

export const getAppErrorsDataForChart = (applicationName = '', availability = [], dateTimeFormat = DATE_FORMAT) => Array.isArray(availability) && availability?.find((x) => x.applicationName === applicationName)?.availabilities?.map((x) => ({name: moment(x?.timestamp).format(dateTimeFormat), '5xx Errors': x?.errorCount})) || [];

const arrayToString = (array) => Array.isArray(array) ? `[\"${array.join('\",\"')}\"]` : '';

export const getSelectedRegions = (regionsObj) => (regionsObj?.length ? arrayToString(regionsObj.filter((x) => x.counted && x.checked).map((x) => x.name)) : '');

export const getPresets = () => [
    {text: 'Last 1 Hour', value: getPresetValue(59, 'minutes', 5, 'minutes')},
    {text: 'Last 24 Hours', value: getPresetValue(1439, 'minutes', 1, 'hour')},
    {text: 'Last 3 days', value: getPresetValue(3, 'days', 1, 'day')},
    {text: 'Last 7 days', value: getPresetValue(7, 'days', 1, 'day')},
    {text: 'Last 15 days', value: getPresetValue(15, 'days', 1, 'day')},
    {text: 'Last 30 days', value: getPresetValue(30, 'days', 1, 'day')},
];

export const getQueryValues = (search) => {
    const {kiosk} = qs.parse(search);
    return {kioskMode: !!kiosk};
};

export const getTotalStats = (data) => data.reduce((acc, curr) => {
    const totalRequests = isNaN(curr?.stats?.totalRequests) ? 0 : curr?.stats?.totalRequests;
    const totalErrors = isNaN(curr?.stats?.errorsCount) ? 0 : curr?.stats?.errorsCount;
    return {totalRequests: acc.totalRequests + totalRequests, totalErrors: acc.totalErrors + totalErrors};
}, {totalRequests: 0, totalErrors: 0});

export const getSelectedBrandForApi = (selectedBrands = [EG_BRAND]) => arrayToString(BRANDS.find((brand) => brand.label === selectedBrands[0]).cgpApi);