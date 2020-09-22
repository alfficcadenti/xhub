import React from 'react';
import moment from 'moment';
import Tooltip from '@homeaway/react-tooltip';

export const MIN_DATE = moment('2020-01-01').toDate();

export const PORTFOLIOS = [
    {
        text: 'Checkout',
        value: 'checkout',
        projects: ['COPB', 'EPOCH', 'CCAT', 'HBILL', 'HPAY', 'CKOCLD', 'COLT', 'CXP', 'PLT', 'ROCK', 'SCOUTS', 'HCKOSUP', 'HCOMCOP']
    }, {
        text: 'Core Services',
        value: 'coreservices',
        projects: ['BANK', 'BUD', 'PRIME', 'ONEAPI', 'MOB', 'HCR', 'HK']
    }, {
        text: 'Customer',
        value: 'customer',
        projects: ['LOYD', 'CRTC', 'CARTA', 'CRTC', 'CRTR', 'CMLTD']
    }, {
        text: 'H4P',
        value: 'h4p',
        projects: ['PIT', 'HROP']
    }, {
        text: 'Kes',
        value: 'kes',
        projects: ['KES']
    }, {
        text: 'Landing',
        value: 'landing',
        projects: ['LAPLAT', 'FIGS', 'LASER', 'PANDA', 'VIKING', 'COLOSSEO']
    }, {
        text: 'Mobile',
        value: 'mobile',
        projects: ['AND', 'ENG', 'IOS', 'RVN']
    }, {
        text: 'Shopping',
        value: 'shopping',
        projects: ['ALO', 'HLR', 'PDI', 'SHP', 'INCREDIBLE']
    }
];

export const P1_LABEL = 'P1';
export const P2_LABEL = 'P2';
export const P3_LABEL = 'P3';
export const P4_LABEL = 'P4';
export const P5_LABEL = 'P5';
export const NOT_PRIORITIZED_LABEL = 'Not Prioritized';
export const PRIORITY_LABELS = [P1_LABEL, P2_LABEL, P3_LABEL, P4_LABEL, P5_LABEL, NOT_PRIORITIZED_LABEL];
export const PRIORITY_COLORS = {
    [P1_LABEL]: '#dc3912',
    [P2_LABEL]: '#ff9900',
    [P3_LABEL]: '#109618',
    [P4_LABEL]: '#3366cc',
    [P5_LABEL]: '#22aa99',
    [NOT_PRIORITIZED_LABEL]: '#b0b0b0'
};

export const SLA_COLUMNS = [
    'Priority',
    'p1',
    'p2',
    'p3',
    'p4',
    'p5'
];

const getIconHeader = (src, title) => (
    <Tooltip tooltipType="tooltip" content={title} placement="bottom">
        <img src={src} height="16" width="16" alt={title} title={title} />
    </Tooltip>
);

export const PRIORITY_COLUMN_HEADERS = {
    notPrioritized: getIconHeader('https://jira.homeawaycorp.com/images/icons/undefined.gif', 'Not prioritized'),
    p1: getIconHeader('https://jira.homeawaycorp.com/images/icons/priorities/blocker.svg', 'P1 - Blocker'),
    p2: getIconHeader('https://jira.homeawaycorp.com/images/icons/priorities/critical.svg', 'P2 - Major'),
    p3: getIconHeader('https://jira.homeawaycorp.com/images/icons/priorities/major.svg', 'P3 - Normal'),
    p4: getIconHeader('https://jira.homeawaycorp.com/images/icons/priorities/minor.svg', 'P4 - Minor'),
    p5: getIconHeader('https://jira.homeawaycorp.com/images/icons/priorities/trivial.svg', 'P5 - Trivial'),
    totalTickets: '#'
};
