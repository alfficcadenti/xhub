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
    Updated: getTableValue(row, 'updatedDateTime')
});

// eslint-disable-next-line complexity
export const checkIsRowSelected = (businessOwnerType, selectedL1, selectedL2, name) => (
    (businessOwnerType === 'l1' && selectedL1 && selectedL1.name === name)
    || (selectedL1 && businessOwnerType === 'l2' && selectedL2 && selectedL2.name === name)
);
