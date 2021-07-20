import React from 'react';
import Tooltip from '@homeaway/react-tooltip';

export const HCOM_PORTFOLIOS = [
    {
        text: 'Checkout',
        value: 'checkout',
        projects: ['CCAT', 'CKOCLD', 'COLT', 'COPB', 'CXP', 'EPOCH', 'HBILL', 'HCKOSUP', 'HPAY', 'ROCK', 'SCOUTS', 'SKYNET']
    }, {
        text: 'Core Services',
        value: 'coreservices',
        projects: ['BANK', 'HK', 'MOB', 'NUCLEO', 'ONEAPI', 'PRIME']
    }, {
        text: 'Customer',
        value: 'customer',
        projects: ['CARTA', 'CRTR', 'CRUISE', 'LORD', 'LOYD']
    }, {
        text: 'H4P',
        value: 'h4p',
        projects: ['HROP', 'PIT']
    }, {
        text: 'Kes',
        value: 'kes',
        projects: ['KES']
    }, {
        text: 'Landing',
        value: 'landing',
        projects: ['FIGS', 'HCOMLAND', 'LAPLAT', 'LASER', 'PANDA']
    }, {
        text: 'Mobile',
        value: 'mobile',
        projects: ['AND', 'ENG', 'RVN']
    },
    {
        text: 'Pricing',
        value: 'pricing',
        projects: ['DMI', 'HCR', 'PDI']
    }, {
        text: 'Shopping',
        value: 'shopping',
        projects: ['ALO', 'SHP']
    }
];

export const VRBO_PORTFOLIOS = [
    {
        text: 'P&M',
        value: 'pm',
        projects: ['AUTH', 'PROFILE']
    }, {
        text: 'TPG',
        value: 'tpg',
        projects: ['MAOWN', 'MIOWN', 'PHT', 'PR', 'PXC', 'PXO', 'PXP', 'VRM', 'YBIDEV']
    }, {
        text: 'Vrbo Retail - Core Experiences',
        value: 'coreexperience',
        projects: ['CHK', 'FRIENDS', 'GEODEV', 'HAVAS', 'SHOP', 'VPCM', 'VPCS', 'VRBODISCO', 'VRBOGEO']
    }, {
        text: 'Vrbo Retail - Growth Tech',
        value: 'growthtech',
        projects: ['VGT']
    }, {
        text: 'Vrbo Retail - Stay & GX',
        value: 'staygx',
        projects: ['CAMS', 'CAMSUP', 'GX', 'GXTRNZ', 'LOC', 'SE', 'SHCMP', 'TM']
    }, {
        text: 'Vrbo Retail - Tech Enablers',
        value: 'techenabler',
        projects: ['COREAPI', 'UITK']
    }
];

export const HCOM_PROJECT_KEYS = HCOM_PORTFOLIOS
    .reduce((acc, curr) => [...acc, ...curr.projects], [])
    .sort();

export const VRBO_PROJECT_KEYS = VRBO_PORTFOLIOS
    .reduce((acc, curr) => [...acc, ...curr.projects], [])
    .sort();

export const ALL_PORTFOLIOS = [...HCOM_PORTFOLIOS, ...VRBO_PORTFOLIOS];

export const ALL_PROJECT_KEY_VALUES = [...HCOM_PROJECT_KEYS, ...VRBO_PROJECT_KEYS].sort();

export const PROJECT_PORTFOLIO_MAP = ALL_PROJECT_KEY_VALUES.reduce((acc, curr) => {
    const portfolio = ALL_PORTFOLIOS.find(({projects}) => projects.includes(curr));
    return Object.assign(acc, {[curr]: JSON.parse(JSON.stringify(portfolio))});
}, {});

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
