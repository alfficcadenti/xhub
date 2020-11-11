const moment = require('moment');

const MAX_TRACE_DEPTH = 2;
const LOBS = ['C', 'F', 'H', 'P'];
const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const ENABLE_SUB_TRACES = false;

const generateId = (length) => {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += ALPHANUMERIC.charAt(Math.floor(Math.random() * ALPHANUMERIC.length));
    }
    return result;
};

const generateSessionId = () => generateId(32);

const generateTraceId = () => `${generateId(8)}-${generateId(4)}-${generateId(4)}-${generateId(4)}-${generateId(12)}`;

const generateSpanId = () => generateId(16);

const getRandomInt = (max = 1000) => {
    return Math.floor(Math.random() * max);
};

const getTags = () => {
    const hasError = getRandomInt(10) % 4 === 1;
    let tags = [{
        key: 'error',
        value: String(hasError)
    }];
    if (hasError) {
        tags = [...tags,
            {
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
    }
    return tags;
};

const getTrace = (depth) => ({
    traceId: generateTraceId(),
    spanId: generateSpanId(),
    serviceName: `Service #${getRandomInt(100)}`,
    operationName: `Operation #${getRandomInt(100)}`,
    tags: getTags(),
    traces: (ENABLE_SUB_TRACES && depth <= MAX_TRACE_DEPTH)
        ? (new Array(getRandomInt(4)).fill(0)).map(() => getTrace(depth + 1))
        : []
});

const getFci = (start, end, lobs) => {
    const momentEnd = moment(end);
    const dateTimeRange = momentEnd.diff(start, 'minutes');
    const timestamp = momentEnd.subtract(getRandomInt(dateTimeRange), 'minutes').toISOString();
    const result = {
        timestamp,
        sessionId: generateSessionId(),
        traceId: generateTraceId(),
        failure: 'CheckoutError',
        errorCode: 500 + getRandomInt(5),
        site: 'www.expedia.com',
        tpId: getRandomInt(10),
        eapId: getRandomInt(10),
        siteId: getRandomInt(10),
        lineOfBusiness: lobs && lobs.length
            ? lobs[getRandomInt(lobs.length)]
            : LOBS[getRandomInt(LOBS.length)],
        isIntentional: getRandomInt(13) % 3 === 1,
        traces: (new Array(getRandomInt(3) + 2).fill(0)).map(() => getTrace(0))
    };
    return result;
};

// eslint-disable-next-line complexity
const getFciTestData = async (req) => {
    const defaultStart = moment().subtract(6, 'hours').toISOString();
    const defaultEnd = moment().toISOString();
    const defaultLobs = [];
    if (!req.url || !req.url.query) {
        req.url = {query: {start: defaultStart, end: defaultEnd, lobs: defaultLobs, error: null}};
    }
    const start = req.url.query.start || defaultStart;
    const end = req.url.query.end || defaultEnd;
    const lobs = req.url.query.lobs ? req.url.query.lobs.split(',') : defaultLobs;
    return (new Array(52))
        .fill(0)
        .map(() => getFci(start, end, lobs));
};

module.exports = {
    getFciTestData,
};
