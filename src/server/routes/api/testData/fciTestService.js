import moment from 'moment';

const SITES = [
    'travel.americanexpress.com',
    'travel.rbcrewards.com',
    'travel.chase.com'
];
const CATEGORIES = ['Payments CC', 'User Error', 'Expedia Error', 'Supply Error', 'Inventory Unavailable'];
const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const generateId = (length) => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += ALPHANUMERIC.charAt(Math.floor(Math.random() * ALPHANUMERIC.length));
    }
    return result;
};

const generateTraceId = () => generateId(32);

const generateSessionId = () => `${generateId(8)}-${generateId(4)}-${generateId(4)}-${generateId(4)}-${generateId(12)}`;

const generateSpanId = () => generateId(16);

const getRandomInt = (max = 1000) => {
    return Math.floor(Math.random() * max);
};

const getTags = () => {
    let tags = [
        {
            key: 'error',
            value: 'true'
        }, {
            key: 'ErrorCode',
            value: getRandomInt(1000)
        }, {
            key: 'externalerrorcode_1_1',
            value: getRandomInt(1000)
        }, {
            key: 'externalerrordescription_1_1',
            value: 'MSTERR_TRAVCC_DECLINE'
        }, {
            key: 'ErrorCategory1',
            value: 'ExternalError'
        }, {
            key: 'EventDescription1',
            value: 'Error indicating reservation decline because of double booking.'
        }
    ];
    if (getRandomInt(10) % 4 === 1) {
        tags = [...tags, {
            key: 'externalerrorcode_1_2',
            value: getRandomInt(1000)
        }, {
            key: 'externalerrordescription_1_2',
            value: 'MSTERR_TRAVCC_DECLINE'
        }, {
            key: 'ErrorCategory2',
            value: 'ExternalError'
        }, {
            key: 'EventDescription2',
            value: 'Error indicating reservation decline because of double booking.'
        }];
    }
    return tags;
};

const getTrace = () => ({
    traceId: generateTraceId(),
    spanId: generateSpanId(),
    serviceName: `Service #${getRandomInt(100)}`,
    operationName: `Operation #${getRandomInt(100)}`,
    tags: getTags()
});

const getFci = (start, end, site) => {
    const momentEnd = moment(end);
    const dateTimeRange = momentEnd.diff(start, 'minutes');
    const timestamp = momentEnd.subtract(getRandomInt(dateTimeRange), 'minutes').toISOString();
    const siteName = site || SITES[getRandomInt(SITES.length)];
    const hasComment = getRandomInt(10) % 3 === 1;
    const fci = {
        timestamp,
        traceId: generateTraceId(),
        sessionId: generateSessionId(),
        failure: 'CheckoutError',
        errorCode: 500 + getRandomInt(5),
        site: siteName,
        tpId: getRandomInt(10),
        eapId: getRandomInt(10),
        siteId: getRandomInt(10),
        traces: (new Array(getRandomInt(3) + 2).fill(0)).map(getTrace),
        isIntentional: getRandomInt(13) % 3 === 1,
        xdId: getRandomInt(10) % 3 ? `${generateTraceId()}|${getRandomInt(1000000000)}|${siteName}` : null,
        duaId: generateTraceId(),
        comment: hasComment ? `Comment ${getRandomInt(1000)}` : null,
        isFci: !hasComment
    };
    const category = getRandomInt(10) % 3 === 1
        ? []
        : [CATEGORIES[getRandomInt(CATEGORIES.length)]];
    const recordedSessionUrl = `https://console-eu.bex.glassboxdigital.io/webinterface/webui/#/sessions/Cross_Domain_ID_XDID_cookie:unknown/replay/web?from=${start}&till=${end}`;
    return {
        fci,
        category,
        recordedSessionUrl
    };
};

const getFciTestData = async (req) => {
    const defaultStart = moment().subtract(6, 'hours').toISOString();
    const defaultEnd = moment().toISOString();
    const defaultLobs = [];
    if (!req.url || !req.url.query) {
        req.url = {query: {from: defaultStart, to: defaultEnd, lobs: defaultLobs}};
    }
    const start = req.url.query.from || defaultStart;
    const end = req.url.query.to || defaultEnd;
    const site = req.url.query.site;
    return (new Array(52))
        .fill(0)
        .map(() => getFci(start, end, site));
};

const getComment = (traceId) => ({
    traceId,
    timestamp: moment().subtract(getRandomInt(100), 'hours').format(),
    author: `Author ${getRandomInt(1000)}`,
    comment: `Comment ${getRandomInt(1000)}`,
    isFci: false
});

const getCommentTestData = async (req) => {
    if (!req.url || !req.url.query) {
        req.url = {query: {traceId: generateTraceId()}};
    }
    if (req.url.query.traceId) {
        return (new Array(getRandomInt(5)))
            .fill(0)
            .map(() => getComment(req.url.query.traceId));
    }
    return [];
};

module.exports = {
    getFciTestData,
    getCommentTestData
};
