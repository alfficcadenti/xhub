import React from 'react';

export const getCellStringValue = (value) => {
    if (React.isValidElement(value)) {
        return value.props.children || value.props.value;
    }
    return value
        ? String(value).replace(/(<([^>]+)>)/ig, '')
        : value;
};

const formatString = (x) => (
    (x === '-' || x === null)
        ? ''
        : String(x).replace('%', '').toLowerCase()
);

const formatNumber = (x) => (
    (x === '')
        ? -Number.MAX_VALUE
        : Number(x)
);

export const stringNumComparator = (a, b) => {
    const strA = formatString(a);
    const strB = formatString(b);
    const numA = formatNumber(strA);
    const numB = formatNumber(strB);
    return !Number.isNaN(numA) && !Number.isNaN(numB)
        ? numA - numB
        : strA.localeCompare(strB);
};
