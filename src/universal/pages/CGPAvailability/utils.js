import moment from 'moment';
import {getOrDefault} from '../../utils';
import {THRESHOLDS} from './constants.js';
import AvailabilityCell from './AvailabilityCell';
import React from 'react';

export const defineClassByValue = (value) => {
    if (!value) {
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

export const formattedValue = (value) => Math.floor(value * 100) / 100 || '-';

export const extractColumns = (data = []) => ['Application', ...data[0]?.availabilities?.map((item) => item && moment(item.timestamp).format('ll')) || []];

export const mapAvailabilityRow = (row = {}, handleClick) => {
    const app = getOrDefault(row, 'applicationName');
    return Array.isArray(row?.availabilities) && Object.assign({Application: app}, ...row?.availabilities.map((x) => ({[moment(x.timestamp).format('ll')]: <AvailabilityCell value={x.availability} applicationName={app} handleClick={handleClick}/>}))) || {};
};

export const getAppErrorsDataForChart = (applicationName = '', availability = []) => Array.isArray(availability) && availability?.find((x) => x.applicationName === applicationName)?.availabilities?.map((x) => ({name: moment(x?.timestamp).format('ll'), '5xx Errors': x?.errorCount})) || [];

export const filterAvailabilityByMinValue = (applicationAvailability, minValue) => {
    const minAvailability = applicationAvailability?.availabilities?.reduce((min, curr) => min < curr?.availability ? min : curr?.availability);
    if (minAvailability) {
        return minAvailability < parseFloat(minValue);
    } return false;
};