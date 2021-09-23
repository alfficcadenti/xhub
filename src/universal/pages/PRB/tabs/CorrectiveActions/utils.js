import React from 'react';
import {getOrDefault} from '../../../../utils';


export const mapDetails = (row) => ({
    ID: <a href={row.url} target="_blank" rel="noop">{getOrDefault(row, 'id')}</a>,
    Assignee: getOrDefault(row, 'assignee'),
    Project: getOrDefault(row, 'projectName'),
    Summary: getOrDefault(row, 'summary'),
    Status: getOrDefault(row, 'status'),
    Priority: getOrDefault(row, 'priority'),
    Department: getOrDefault(row, 'department'),
    Created: getOrDefault(row, 'createdDate'),
    Resolved: getOrDefault(row, 'resolvedDate'),
    Updated: getOrDefault(row, 'updatedDateTime'),
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

export const filterDetails = (data, businessOwnerType, businessOwnerValue) => data && businessOwnerType && businessOwnerValue && data.length && data.filter((x) => x[businessOwnerType] && x[businessOwnerType] === businessOwnerValue) || data;