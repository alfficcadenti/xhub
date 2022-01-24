import React from 'react';
import {defineClassByValue, formattedValue} from './utils';

const AvailabilityCell = ({value = '', applicationName = '', handleClick}) => {
    if (typeof handleClick === 'function') {
        return <div aria-hidden="true" onClick={() => handleClick(applicationName)} className={defineClassByValue(value)}>{formattedValue(value)}</div>;
    }
    return <div className={defineClassByValue(value)}>{formattedValue(value)}</div>;
};

export default AvailabilityCell;
