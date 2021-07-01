import React from 'react';
import Tooltip from '@homeaway/react-tooltip';

export const HCOM_PORTFOLIOS = [
    {
        text: 'Checkout',
        value: 'checkout',
        projects: ['COPB', 'EPOCH', 'CCAT', 'HBILL', 'HPAY', 'CKOCLD', 'COLT', 'CXP', 'ROCK', 'SCOUTS', 'HCKOSUP', 'SKYNET']
    }, {
        text: 'Core Services',
        value: 'coreservices',
        projects: ['BANK', 'PRIME', 'ONEAPI', 'MOB', 'HK', 'NUCLEO']
    }, {
        text: 'Customer',
        value: 'customer',
        projects: ['LOYD', 'CARTA', 'CRTR', 'LORD', 'CRUISE']
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
        projects: ['LAPLAT', 'FIGS', 'LASER', 'PANDA', 'HCOMLAND']
    }, {
        text: 'Mobile',
        value: 'mobile',
        projects: ['AND', 'ENG', 'RVN']
    }, {
        text: 'Shopping',
        value: 'shopping',
        projects: ['ALO', 'SHP']
    },
    {
        text: 'Pricing',
        value: 'pricing',
        projects: ['PDI', 'DMI', 'HCR']
    }
];

export const VRBO_PORTFOLIOS = [
    {
        text: 'Vrbo Retail - Tech Enablers',
        value: 'techenabler',
        projects: ['UITK', 'COREAPI']
    }, {
        text: 'Vrbo Retail - Growth Tech',
        value: 'growthtech',
        projects: ['VGT']
    }, {
        text: 'Vrbo Retail - Stay & GX',
        value: 'staygx',
        projects: ['TM', 'SE', 'SHCMP', 'GX', 'GXTRNZ', 'CAMS', 'LOC', 'CAMSUP']
    }, {
        text: 'Vrbo Retail - Core Experiences',
        value: 'coreexperience',
        projects: ['CHK', 'HAVAS', 'FRIENDS', 'VPCM', 'VPCS', 'SHOP', 'VRBOGEO', 'GEODEV', 'VRBODISCO']
    }, {
        text: 'P&M',
        value: 'pm',
        projects: ['AUTH', 'PROFILE']
    }, {
        text: 'TPG',
        value: 'tpg',
        projects: ['YBIDEV', 'PXP', 'VRM', 'PXO', 'PXC', 'PR', 'MAOWN', 'MIOWN', 'PHT']
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
