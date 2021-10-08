import React from 'react';
import {getOrDefault} from '../../../../utils';


export const mapDetails = (row) => ({
    ID: <a href={row.url} target="_blank" rel="noop">{getOrDefault(row, 'id')}</a>,
    Assignee: getOrDefault(row, 'assignee'),
    Project: getOrDefault(row, 'project_name'),
    Summary: getOrDefault(row, 'summary'),
    Status: getOrDefault(row, 'status'),
    Priority: getOrDefault(row, 'priority'),
    Department: getOrDefault(row, 'department'),
    Created: getOrDefault(row, 'created_date'),
    Resolved: getOrDefault(row, 'resolved_date'),
    Updated: getOrDefault(row, 'updated_date_time'),
    L1: getOrDefault(row, 'l1'),
    L2: getOrDefault(row, 'l2'),
    L3: getOrDefault(row, 'l3'),
    L4: getOrDefault(row, 'l4'),
    L5: getOrDefault(row, 'l5')
});

// eslint-disable-next-line complexity
export const checkIsRowSelected = (businessOwnerType, selectedL1, selectedL2, selectedL3, selectedL4, name) => (
    (businessOwnerType === 'l1' && selectedL1 !== null && selectedL1.name === name)
    || (selectedL1 !== null && businessOwnerType === 'l2' && selectedL2 !== null && selectedL2.name === name)
    || (selectedL2 !== null && businessOwnerType === 'l3' && selectedL3 !== null && selectedL3.name === name)
    || (selectedL3 !== null && businessOwnerType === 'l4' && selectedL4 !== null && selectedL4.name === name)
);

// eslint-disable-next-line complexity
export const filterDetails = (data, businessOwnerType, businessOwnerValue) => {
    if (!data || !data.length) {
        return [];
    }
    if (!businessOwnerType) {
        return data;
    }
    const businessOwnerValueStr = String(businessOwnerValue);
    if (businessOwnerValueStr.startsWith('Undefined')) {
        const levels = businessOwnerValueStr.split(' < ').reverse().map((a) => a === 'Undefined' ? '' : a);
        return data.filter((x) => levels.reduce((acc, curr, idx) => x[`l${idx + 3}`] === curr && acc, true)) || data;
    }
    return data.filter((x) => x[businessOwnerType] && x[businessOwnerType] === businessOwnerValueStr) || data;
};
