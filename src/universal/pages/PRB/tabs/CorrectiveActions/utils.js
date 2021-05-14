import React from 'react';


export const getTableValue = (row, property) => row && property ? row[property] || '-' : '-';

export const mapDetails = (row) => ({
    ID: <a href={row.url} target="_blank" rel="noop">{getTableValue(row, 'id')}</a>,
    Assignee: getTableValue(row, 'assignee'),
    Project: getTableValue(row, 'projectName'),
    Summary: getTableValue(row, 'summary'),
    Status: getTableValue(row, 'status'),
    Priority: getTableValue(row, 'priority'),
    Department: getTableValue(row, 'department'),
    Created: getTableValue(row, 'createdDate'),
    Resolved: getTableValue(row, 'resolvedDate'),
    Updated: getTableValue(row, 'updatedDateTime'),
    L1: getTableValue(row, 'l1'),
    L2: getTableValue(row, 'l2'),
    L3: getTableValue(row, 'l3'),
    L4: getTableValue(row, 'l4'),
    L5: getTableValue(row, 'l5')
});

// eslint-disable-next-line complexity
export const checkIsRowSelected = (businessOwnerType, selectedL1, selectedL2, selectedL3, selectedL4, name) => (
    (businessOwnerType === 'l1' && selectedL1 !== null && selectedL1.name === name)
    || (selectedL1 !== null && businessOwnerType === 'l2' && selectedL2 !== null && selectedL2.name === name)
    || (selectedL2 !== null && businessOwnerType === 'l3' && selectedL3 !== null && selectedL3.name === name)
    || (selectedL3 !== null && businessOwnerType === 'l4' && selectedL4 !== null && selectedL4.name === name)
);

export const filterDetails = (data, businessOwnerType, businessOwnerValue) => data && businessOwnerType && businessOwnerValue && data.length && data.filter((x) => x[businessOwnerType] && x[businessOwnerType] === businessOwnerValue) || data;