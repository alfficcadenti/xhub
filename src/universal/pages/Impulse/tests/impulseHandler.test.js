import {expect} from 'chai';
import {
    getFilters,
    getQueryParamMulti,
    getBrandQueryParam,
    getQueryString,
    getRevLoss,
    getActiveIndex,
    mapActiveIndexToTabName,
    isValidTimeInterval,
    getTimeIntervals,
    getDefaultTimeInterval,
    getCategory,
    simplifyPredictionData,
    convertRelativeDateInString,
    convertRelativeDateRange,
    getQueryStringYOY,
    mapPosFilterLabels,
    mapPosChartData,

} from '../impulseHandler';
import moment from 'moment';

let endDate = moment().set({second: 0}).format('YYYY-MM-DDTHH:mm:ss');
let startDate = moment().set({second: 0}).subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ss');
const typeofFilter = 'lobs';
const filterResult = {label: 'Lodging', value: 'Lodging'};
import mockFilters from './filterMock.test.json';
import mockRevenue from './revenueLossMock.json';
import {
    ALL_BRAND_GROUP,
    EG_BRAND, EGENCIA_BRAND,
    EXPEDIA_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND,
    HOTELS_COM_BRAND, VRBO_BRAND,
} from '../../../constants';


const IMPULSE_MAPPING = [
    {globalFilter: EG_BRAND, impulseFilter: ALL_BRAND_GROUP},
    {globalFilter: EXPEDIA_BRAND, impulseFilter: 'Brand Expedia Group'},
    {globalFilter: EXPEDIA_PARTNER_SERVICES_BRAND, impulseFilter: 'Expedia Business Services'},
    {globalFilter: HOTELS_COM_BRAND, impulseFilter: HOTELS_COM_BRAND},
    {globalFilter: EGENCIA_BRAND, impulseFilter: EGENCIA_BRAND},
    {globalFilter: VRBO_BRAND, impulseFilter: 'VRBO'}
];


describe('impulseHandler', () => {
    describe('get filters in the array', () => {
        it('return object of filters for specific lob', () => {
            const result = getFilters(mockFilters, typeofFilter);
            expect(result[0]).to.be.eql(filterResult);
        });
    });

    describe('map POS to custom values', () => {
        it('should map POS filter labels when key is found', () => {
            expect(mapPosFilterLabels([{value: 'www.egencia.com', label: 'www.egencia.com'}, {value: 'www.expedia.co.uk', label: 'www.expedia.co.uk'}])).eql([{value: 'www.egencia.com', label: 'Egencia US'}, {value: 'www.expedia.co.uk', label: 'www.expedia.co.uk'}]);
        });
        it('should map POS chart data when key is found', () => {
            expect(mapPosChartData([{time: 0, 'corporateae.expediacustomer.com': 2, 'sg.hotels.com': 5}, {time: 1, 'corporateae.expediacustomer.com': 5, 'sg.hotels.com': 7}])).eql([{time: 0, 'Egencia AE': 2, 'sg.hotels.com': 5}, {time: 1, 'Egencia AE': 5, 'sg.hotels.com': 7}]);
        });
    });

    describe('test getQueryParam', () => {
        it('should return empty string if All LOBs passed', () => {
            expect(getQueryParamMulti('lob', '')).eql('');
        });
        it('should return query string if valid LOB passed', () => {
            expect(getQueryParamMulti('lob', ['Car'])).eql('&lob=Car');
        });
        it('should return query string if valid LOBs if multiple LOBs passed', () => {
            expect(getQueryParamMulti('lob', ['Car', 'Air'])).eql('&lob=Car,Air');
        });
    });
    describe('test brand query string', () => {
        it('should return empty string if All Brand Group passed', () => {
            expect(getBrandQueryParam(IMPULSE_MAPPING, EG_BRAND)).eql('');
        });
        it('should return brandName = Expedia Business Services if Expedia Partner Services passed', () => {
            expect(getBrandQueryParam(IMPULSE_MAPPING, EXPEDIA_PARTNER_SERVICES_BRAND)).eql('&brand_group_names=Expedia%20Business%20Services');
        });
        it('should return brand=Egencia if Egencia passed', () => {
            expect(getBrandQueryParam(IMPULSE_MAPPING, EGENCIA_BRAND)).eql('&brands=Egencia');
        });
    });
    describe('test active index', () => {
        it('should return 0 if /impulse/booking-trends passed in pathname', () => {
            expect(getActiveIndex('impulse/booking-trends')).eql(0);
        });
        it('should return 1 if /impulse/by-brands passed in pathname', () => {
            expect(getActiveIndex('impulse/by-brands')).eql(1);
        });
        it('should return 2 if /impulse/by-lobs passed in pathname', () => {
            expect(getActiveIndex('impulse/by-lobs')).eql(2);
        });
        it('should return 3 if /impulse/by_SiteUrl passed in pathname', () => {
            expect(getActiveIndex('impulse/by-siteUrl')).eql(3);
        });
        it('should return 4 if /impulse/by-device-types passed in pathname', () => {
            expect(getActiveIndex('impulse/by-device-types')).eql(4);
        });
        it('should return 5 if /impulse/by-region passed in pathname', () => {
            expect(getActiveIndex('impulse/by-region')).eql(5);
        });
        it('should return 6 if /impulse/bookings-data passed in pathname', () => {
            expect(getActiveIndex('impulse/bookings-data')).eql(6);
        });
    });
    describe('test mapActiveIndexToTabName ', () => {
        it('should return booking-trends if passed anything', () => {
            expect(mapActiveIndexToTabName(0)).eql('booking-trends');
        });
        it('should return by-brands if passed 1', () => {
            expect(mapActiveIndexToTabName(1)).eql('by-brands');
        });
        it('should return by-lobs if passed 2', () => {
            expect(mapActiveIndexToTabName(2)).eql('by-lobs');
        });
        it('should return by-brands if passed 3', () => {
            expect(mapActiveIndexToTabName(3)).eql('by-siteUrl');
        });
        it('should return by-device-types if passed 4', () => {
            expect(mapActiveIndexToTabName(4)).eql('by-device-types');
        });
        it('should return by-region if passed 5', () => {
            expect(mapActiveIndexToTabName(5)).eql('by-region');
        });
        it('should return by-lobs if passed 6', () => {
            expect(mapActiveIndexToTabName(6)).eql('bookings-data');
        });
    });
    describe('convertRelativeDateRange', () => {
        const isWithinMinutes = (a, b) => moment(a).diff(b, 'minutes') < 2;
        it('should return future date by day', () => {
            const expected = moment().add(1, 'day');
            const result = convertRelativeDateRange('now+1d');
            expect(isWithinMinutes(result, expected)).eql(true);
        });
        it('should return future date by hour', () => {
            const expected = moment().add(1, 'hour');
            const result = convertRelativeDateRange('now+1h');
            expect(isWithinMinutes(result, expected)).eql(true);
        });
        it('should return past date by day', () => {
            const expected = moment().subtract(1, 'day');
            const result = convertRelativeDateRange('now-1d');
            expect(isWithinMinutes(result, expected)).eql(true);
        });
        it('should return past date by hour', () => {
            const expected = moment().subtract(1, 'hour');
            const result = convertRelativeDateRange('now-1h');
            expect(isWithinMinutes(result, expected)).eql(true);
        });
        it('should return current date', () => {
            const expected = moment();
            const result = convertRelativeDateRange('now');
            expect(isWithinMinutes(result, expected)).eql(true);
        });
    });
    describe('convertRelativeDateInString', () => {
        it('should return relative future date by day', () => {
            const expectedDate = moment().add(1, 'day').utc().format();
            expect(convertRelativeDateInString(expectedDate)).eql('now+1d');
        });
        it('should return relative future date by hour', () => {
            const expectedDate = moment().add(1, 'hour').utc().format();
            expect(convertRelativeDateInString(expectedDate)).eql('now+1h');
        });
        it('should return relative past date by day', () => {
            const expectedDate = moment().subtract(1, 'day').utc().format();
            expect(convertRelativeDateInString(expectedDate)).eql('now-1d');
        });
        it('should return relative past date by hour', () => {
            const expectedDate = moment().subtract(1, 'hour').utc().format();
            expect(convertRelativeDateInString(expectedDate)).eql('now-1h');
        });
        it('should return relative current date', () => {
            const expectedDate = moment().utc().format();
            expect(convertRelativeDateInString(expectedDate)).eql('now');
        });
    });
    describe('test final query string', () => {
        it('should return string with datetime into query string if no filter has been selected', () => {
            expect(getQueryString(moment().set({second: 0}).subtract(1, 'days'), moment().set({second: 0}), IMPULSE_MAPPING, EG_BRAND, [], [], [], [], [], [], [], '5m')).eql(`?start_time=${startDate}Z&end_time=${endDate}Z&time_interval=`);
        });
    });
    describe('test final query string', () => {
        it('should return string with datetime into query string if no filter has been selected', () => {
            expect(getQueryStringYOY(moment().set({second: 0}).subtract(1, 'days'), moment().set({second: 0}), IMPULSE_MAPPING, EG_BRAND, [], [], [], [], [], [], '5m')).eql(`?start_time=${startDate}Z&end_time=${endDate}Z&time_interval=`);
        });
    });
    describe('test revenue loss calculation method', () => {
        it('should return integer greater than zero on valid revenue impact details', () => {
            expect(getRevLoss(mockRevenue[1])).to.be.above(0);
        });
        it('return string should contain NA on empty revenue loss', () => {
            expect(getRevLoss(mockRevenue[0])).to.include('NA');
        });
        it('return string should contain NA on empty estimatedImpact', () => {
            expect(getRevLoss(mockRevenue[2])).to.include('NA');
        });
    });
    describe('test final is Valid Time Interval', () => {
        it('should return false with no start or end date or interval', () => {
            expect(isValidTimeInterval()).eql(false);
        });
        it('should return true with start and end date interval', () => {
            expect(isValidTimeInterval(startDate, endDate, '5m')).eql(true);
        });
    });
    describe('test final get time intervals', () => {
        it('should return correct intervals for 1 day diff', () => {
            expect(getTimeIntervals(moment(startDate).add(5, 'minutes'), endDate, '5m')).eql(['1m', '15m', '30m', '1h']);
        });
        it('should return correct intervals for 5 day diff', () => {
            expect(getTimeIntervals(moment(startDate).subtract(5, 'days'), endDate, '5m')).eql(['15m', '30m', '1h']);
        });
        it('should return correct intervals for 25 day diff', () => {
            expect(getTimeIntervals(moment(startDate).subtract(26, 'days'), endDate, '15m')).eql(['30m', '1h', '1d']);
        });
        it('should return correct intervals for 111 day diff', () => {
            expect(getTimeIntervals(moment(startDate).subtract(111, 'days'), endDate, '1h')).eql(['1d', '1w']);
        });
        it('should return correct intervals for 222 day diff', () => {
            expect(getTimeIntervals(moment(startDate).subtract(222, 'days'), endDate, '1d')).eql(['1w']);
        });
        it('should return empty array from last 5 minutes', () => {
            expect(getTimeIntervals(moment(endDate).subtract(2, 'minutes'), endDate, '5m')).eql([]);
        });
        it('should return one element from last 15 minutes', () => {
            expect(getTimeIntervals(moment(endDate).subtract(16, 'minutes'), endDate, '1m')).eql(['5m']);
        });
        it('should return three elements from last 60 minutes', () => {
            expect(getTimeIntervals(moment(endDate).subtract(60, 'minutes'), endDate, '15m')).eql(['1m', '5m', '30m']);
        });
        it('should return four elements from last 24 hours', () => {
            expect(getTimeIntervals(moment(endDate).subtract(23, 'hours'), endDate, '30m')).eql(['1m', '5m', '15m', '1h']);
        });
    });
    describe('test final get default time interval', () => {
        it('should return correct interval for 1 day diff', () => {
            expect(getDefaultTimeInterval(moment(startDate).add(5, 'minutes'), endDate)).eql('1m');
        });
        it('should return correct interval for 5 day diff', () => {
            expect(getDefaultTimeInterval(moment(startDate).subtract(5, 'days'), endDate)).eql('5m');
        });
        it('should return correct interval for 25 day diff', () => {
            expect(getDefaultTimeInterval(moment(startDate).subtract(26, 'days'), endDate)).eql('15m');
        });
        it('should return correct interval for 111 day diff', () => {
            expect(getDefaultTimeInterval(moment(startDate).subtract(111, 'days'), endDate)).eql('1h');
        });
        it('should return correct interval for 222 day diff', () => {
            expect(getDefaultTimeInterval(moment(startDate).subtract(222, 'days'), endDate)).eql('1d');
        });
        it('should return correct interval for 444 day diff', () => {
            expect(getDefaultTimeInterval(moment(startDate).subtract(444, 'days'), endDate)).eql('1w');
        });
    });
    describe('test final get category', () => {
        it('should return Anomaly Detected when state is IMPULSE_ALERT_DETECTED', () => {
            expect(getCategory({state: 'IMPULSE_ALERT_DETECTED', isLatencyHealthy: true})).eql('Anomaly Detected');
        });
        it('should return Upstream Unhealthy when state is IMPULSE_ALERT_DETECTED', () => {
            expect(getCategory({state: 'IMPULSE_ALERT_DETECTED', isLatencyHealthy: false})).eql('Upstream Unhealthy');
        });
        it('should return Upstream Unhealthy when state is IMPULSE_ALERT_RECOVERED', () => {
            expect(getCategory({state: 'IMPULSE_ALERT_RECOVERED', isLatencyHealthy: true})).eql('Anomaly Recovered');
        });
    });
    describe('get simplify prediction data', () => {
        it('return empty object', () => {
            expect(simplifyPredictionData([])).eql([]);
        });
    });
});
