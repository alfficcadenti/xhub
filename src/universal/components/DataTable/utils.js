import React from 'react';

export const getCellStringValue = (value) => {
    if (React.isValidElement(value)) {
        return value.props.children;
    }
    return value
        ? String(value).replace(/(<([^>]+)>)/ig, '')
        : value;
};
