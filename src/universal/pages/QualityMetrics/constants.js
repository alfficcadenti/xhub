import React from 'react';
import Tooltip from '@homeaway/react-tooltip';

export const PORTFOLIOS = [
    {
        text: 'Checkout',
        value: 'checkout',
        projects: ['COPB', 'EPOCH', 'CCAT', 'HBILL', 'HPAY', 'CKOCLD', 'COLT', 'CXP', 'PLT', 'ROCK', 'SCOUTS', 'HCKOSUP', 'HCOMCOP'],
        components: []
    }, {
        text: 'Core Services',
        value: 'coreservices',
        projects: ['BANK', 'BUD', 'PRIME', 'ONEAPI', 'MOB', 'HCR', 'HK'],
        components: []
    }, {
        text: 'Customer',
        value: 'customer',
        projects: ['LOYD', 'CRTC', 'CARTA', 'CRTC', 'CRTR', 'CMLTD'],
        components: []
    }, {
        text: 'H4P',
        value: 'h4p',
        projects: ['PIT', 'HROP'],
        components: []
    }, {
        text: 'Kes',
        value: 'kes',
        projects: ['KES'],
        components: []
    }, {
        text: 'Landing',
        value: 'landing',
        projects: ['LAPLAT', 'FIGS', 'LASER', 'PANDA', 'VIKING', 'COLOSSEO'],
        components: []
    }, {
        text: 'Mobile',
        value: 'mobile',
        projects: ['ALO', 'HLR', 'PDI', 'SHP', 'INCREDIBLE'],
        components: []
    }
];

export const SLA_COLUMNS = [
    'Priority',
    'p1',
    'p2',
    'p3',
    'p4',
    'p5',
    'With Salesforce Cases'
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