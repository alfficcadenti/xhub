export const DEFAULT_PAGE_INFO = {
    title: 'OpxHub',
    team: 'opex',
    owner: 'Ranjith Peddi',
    slack: {
        name: 'opxhub-support',
        id: 'C01A9U8GY2G'
    },
    email: 'opex-opxhub-team@expediacorp.onmicrosoft.com',
    description: ''
};

export const IMPULSE_PAGE_INFO = {
    title: 'Impulse',
    team: 'opex',
    owner: 'Praveen Kumar Singh',
    slack: {
        name: 'eg-impulse-support',
        id: 'C01BL3Z44V8'
    },
    email: 'reo-opex-gurgaon@expedia.com',
    description: ''
};

export const getPageInfo = (url) => {
    switch (url) {
        case '/impulse':
            return IMPULSE_PAGE_INFO;
        default:
            return DEFAULT_PAGE_INFO;
    }
};
