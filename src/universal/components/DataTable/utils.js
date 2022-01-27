import React from 'react';

export const getCellStringValue = (value) => {
    if (React.isValidElement(value)) {
        return value.props.children || value.props.value;
    }
    return value
        ? String(value).replace(/(<([^>]+)>)/ig, '')
        : value;
};
