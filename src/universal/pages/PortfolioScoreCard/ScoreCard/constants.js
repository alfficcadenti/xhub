import React from 'react';


export const ORGS = ['l1', 'l2', 'l3', 'l4'];

export const L1_ORGS_LABEL = 'L1 Orgs';

export const SCORECARD_COLUMNS = ['Organization', 'P1', 'P2', 'TTD<=15m', 'TTF<=15m', 'TTK<=30m', 'TTR<=60m', 'Corrective Actions'];

export const SCORECARD_COLUMNS_INFO = {
    'TTD<=15m': <div>{'Time to Detect with >=75% highlighted'}</div>,
    'TTF<=15m': <div>{'Time to Fix with >=75% highlighted'}</div>,
    'TTK<=30m': <div>{'Time to Know with >=75% highlighted'}</div>,
    'TTR<=60m': <div>{'Time to Resolve with >=75% highlighted'}</div>
};

export const setPercentThresholdClass = (val) => Number(`${val}`.match(/\d+/)[0]) >= 75 ? 'success-cell' : '';

export const SCORECARD_RULES = [
    {column: 'TTD<=15m', setClass: setPercentThresholdClass},
    {column: 'TTF<=15m', setClass: setPercentThresholdClass},
    {column: 'TTK<=30m', setClass: setPercentThresholdClass},
    {column: 'TTR<=60m', setClass: setPercentThresholdClass}
];

export const TICKET_DETAILS_COLUMNS = [
    'Number',
    'Priority',
    'Title',
    'Time To Detect',
    'Time To Know',
    'Time To Fix',
    'Time To Restore'
];

export const TICKET_DETAILS_INFO = {
    'Time To Detect': <div>{'Time to Detect in minutes'}<br />{'with <=15m highlighted'}</div>,
    'Time To Fix': <div>{'Time to Fix in minutes'}<br />{'with <=15m highlighted'}</div>,
    'Time To Know': <div>{'Time to Know in minutes'}<br />{'with <=30m highlighted'}</div>,
    'Time To Restore': <div>{'Time to Resolve in minutes'}<br />{'with <=60m highlighted'}</div>
};

export const generateSetThresholdClass = (threshold) => (val) => Number(`${val}`.match(/\d+/)[0]) <= threshold ? 'success-cell' : '';

export const TICKET_DETAILS_RULES = [
    {column: 'Time To Detect', setClass: generateSetThresholdClass(15)},
    {column: 'Time To Fix', setClass: generateSetThresholdClass(15)},
    {column: 'Time To Know', setClass: generateSetThresholdClass(30)},
    {column: 'Time To Restore', setClass: generateSetThresholdClass(60)},
];
