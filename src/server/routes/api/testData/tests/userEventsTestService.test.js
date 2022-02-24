import {expect} from 'chai';
import moment from 'moment';
import {
    getTestData, getPageViewsTestData, getFunnelTestData, getEPSFunnelTestData
} from '../userEventsTestService';

describe('getTestData', () => {
    it('handles empty query params correctly', async () => {
        expect(await getTestData({})).to.eql([]);
        expect(await getTestData({url: {}})).to.eql([]);
    });

    it('handles non-empty query params correctly', async () => {
        const startDate = moment().utc().startOf('minute').subtract(5, 'minute').format();
        const endDate = moment().utc().startOf('minute').format();
        const expectedArray = Array.from({length: 6}, (v, i) => moment().utc().startOf('minute').subtract(i, 'minutes').format()).reverse();
        expect(await getTestData(
            {url: {query: {startDate, endDate, timeInterval: 1}}},
            (time, result) => {
                result.push(time);
                return result;
            }
        )).to.eql(expectedArray);
    });
});

describe('getPageViewsTestData', () => {
    const startDate = moment().subtract(2, 'minute').toISOString();
    const endDate = moment().toISOString();
    const req = {url: {query: {startDate, endDate, timeInterval: 1}}};

    it('formats data correctly', async () => {
        const results = await getPageViewsTestData(req);
        expect(Object.keys(results[0])).to.eql(['time', 'pageViewsData']);
        expect(Object.keys(results[0].pageViewsData[0])).to.eql(['page', 'lineOfBusiness', 'views']);
    });
});

describe('getFunnelTestData', () => {
    const startDate = moment().subtract(2, 'minute').toISOString();
    const endDate = moment().toISOString();
    const req = {url: {query: {startDate, endDate, timeInterval: 1}}};

    it('formats data correctly', async () => {
        const results = await getFunnelTestData(req);
        expect(Object.keys(results[0])).to.eql(['time', 'brandWiseSuccessRateData', 'successRatePercentagesData']);
        expect(Object.keys(results[0].successRatePercentagesData[0])).to.eql(['brand', 'rate', 'lineOfBusiness']);
    });
});

describe('getEPSFunnelTestData', () => {
    const startDate = moment().subtract(2, 'minute').toISOString();
    const endDate = moment().toISOString();
    const req = {url: {query: {startDate, endDate, timeInterval: 1}}};

    it('formats data correctly', async () => {
        const results = await getEPSFunnelTestData(req);
        expect(Object.keys(results[0])).to.eql(['time', 'brandWiseSuccessRateData', 'successRatePercentagesData']);
        expect(Object.keys(results[0].successRatePercentagesData[0])).to.eql(['brand', 'rate', 'lineOfBusiness']);
    });
});