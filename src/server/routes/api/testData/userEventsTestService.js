import moment from 'moment';

const LAST_YEAR = moment().subtract(365, 'days');
const LASTS_90_DAYS = moment().subtract(90, 'days');


// eslint-disable-next-line complexity
const getTimeInterval = (startDate, endDate) => {
    const start = moment(startDate);
    const end = moment(endDate);
    let timeInterval = {value: 1, unit: 'minute'};
    if (!startDate || !endDate) {
        timeInterval = {value: 1, unit: 'minute'};
    } else if (start.isBefore(LAST_YEAR)) {
        timeInterval = {value: 1, unit: 'day'};
    } else if (start.isBefore(LASTS_90_DAYS)) {
        timeInterval = {value: 1, unit: 'hour'};
    } else if (end.diff(start, 'days') > 7) {
        timeInterval = {value: 1, unit: 'hour'};
    } else if (end.diff(start, 'hours') >= 24) {
        timeInterval = {value: 10, unit: 'minute'};
    } else if (end.diff(start, 'hours') < 24) {
        timeInterval = {value: 1, unit: 'minute'};
    }
    return timeInterval;
};

const getTestData = async (req, appender) => {
    if (!req.url || !req.url.query) {
        return [];
    }
    const {startDate, endDate} = req.url.query;
    const timeInterval = getTimeInterval(startDate, endDate);
    let result = [];
    const start = moment(startDate);
    const end = moment(endDate);
    while (start.isSameOrBefore(end)) {
        result = appender(start.utc().format('YYYY-MM-DD\THH:mm:ss\\Z'), result);
        start.add(timeInterval.value, timeInterval.unit);
    }
    return result;
};

const LOBS = ['A', 'C', 'CR', 'F', 'H', 'P', 'U'];

const getPageViewsTestData = async (req) => {
    const generatePageView = (page, baseViews, lineOfBusiness) => ({
        page,
        lineOfBusiness,
        views: baseViews + Math.floor(Math.random() * 50)
    });
    return getTestData(req, (time, result) => {
        result.push({
            time,
            pageViewsData: LOBS.reduce((acc, lineOfBusiness) => ([
                ...acc,
                generatePageView('bookingform', 500, lineOfBusiness),
                generatePageView('home', 1000, lineOfBusiness),
                generatePageView('property', 2000, lineOfBusiness),
                generatePageView('searchresults', 3000, lineOfBusiness),
                generatePageView('bookingconfirmation', 100, lineOfBusiness)
            ]), [])
        });
        return result;
    });
};

// eslint-disable-next-line complexity
const getFunnelTestData = async (req) => {
    const BRANDS = ['All', 'airnewzealand', 'cheaptickets', 'ebookers', 'expedia', 'hawaiianairlines', 'hotwire', 'nike', 'orbitz', 'travelocity', 'vrbo', 'wotif', 'hcom'];
    return getTestData(req, (time, result) => {
        result.push({
            time,
            brandWiseSuccessRateData: {rate: 95 + (Math.random() * 5)},
            successRatePercentagesData: ['', ...LOBS].reduce((acc, lineOfBusiness) => ([
                ...acc,
                ...BRANDS.map((brand) => ({
                    brand, rate: 95 + (Math.random() * 5), lineOfBusiness
                }))
            ]), [])
        });
        return result;
    });
};

const getEPSFunnelTestData = async (req) => {
    return getTestData(req, (time, result) => {
        result.push({
            time,
            brandWiseSuccessRateData: {rate: 95 + (Math.random() * 5)},
            successRatePercentagesData: ['', ...LOBS].reduce((acc, lineOfBusiness) => ([
                ...acc,
                {brand: null, rate: 95 + (Math.random() * 5), lineOfBusiness}
            ]), [])
        });
        return result;
    });
};

module.exports = {
    getTimeInterval,
    getTestData,
    getPageViewsTestData,
    getFunnelTestData,
    getEPSFunnelTestData
};
