import moment from 'moment';

const getTestData = async (req, appender) => {
    if (!req.query) {
        return [];
    }
    const {startDate, endDate} = req.query;
    const {timeInterval} = req.query || 5;
    let result = [];
    const start = moment(startDate);
    const roundedStart = start.subtract(start.minute() % 5, 'minute').startOf('minute');
    const end = moment(endDate);
    while (roundedStart.isSameOrBefore(end)) {
        result = appender(roundedStart.utc().format('YYYY-MM-DD\THH:mm:ss\\Z'), result);
        roundedStart.add(timeInterval, 'minutes');
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
    getTestData,
    getPageViewsTestData,
    getFunnelTestData,
    getEPSFunnelTestData
};
