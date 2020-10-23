import {expect} from 'chai';
import moment from 'moment';
import {
    getTimeInterval, getTestData, getPageViewsTestData, getFunnelTestData
} from '../userEventsTestService';

describe('getTimeInterval', () => {
    it('defaults to 1 minute given no params', () => {
        expect(getTimeInterval()).to.eql({value: 1, unit: 'minute'});
    });
    it('sets interval to 1 day if start date is over 365 days ago', () => {
        expect(getTimeInterval(moment().subtract(366, 'days').toISOString(), moment().toISOString()))
            .to.eql({value: 1, unit: 'day'});
    });
    it('sets interval to 1 hour if start date is over 90 days ago', () => {
        expect(getTimeInterval(moment().subtract(91, 'days').toISOString(), moment().toISOString()))
            .to.eql({value: 1, unit: 'hour'});
    });
    it('sets interval to 1 hour if start date more than 7 days from end date', () => {
        expect(getTimeInterval(moment().subtract(8, 'days'), moment().toISOString()))
            .to.eql({value: 1, unit: 'hour'});
    });
    it('sets interval to 10 min if start date more than 24 hours from end date', () => {
        expect(getTimeInterval(moment().subtract(25, 'hours').toISOString(), moment().toISOString()))
            .to.eql({value: 10, unit: 'minute'});
    });
    it('sets interval to 1 min if start date within 24 hours ago', () => {
        expect(getTimeInterval(moment().subtract(23, 'hours').toISOString(), moment().toISOString()))
            .to.eql({value: 1, unit: 'minute'});
    });
});

describe('getTestData', () => {
    it('handles empty query params correctly', async () => {
        expect(await getTestData({})).to.eql([]);
        expect(await getTestData({url: {}})).to.eql([]);
    });

    it('handles non-empty query arams correctly', async () => {
        const startDate = '2020-10-19T18:55:00Z';
        const endDate = '2020-10-19T18:59:00Z';
        expect(await getTestData(
            {url: {query: {startDate, endDate}}},
            (time, result) => {
                result.push(time);
                return result;
            }
        )).to.eql([
            '2020-10-19T18:55:00Z',
            '2020-10-19T18:56:00Z',
            '2020-10-19T18:57:00Z',
            '2020-10-19T18:58:00Z',
            '2020-10-19T18:59:00Z'
        ]);
    });
});

describe('getPageViewsTestData', () => {
    const startDate = moment().subtract(2, 'minute').toISOString();
    const endDate = moment().toISOString();
    const req = {url: {query: {startDate, endDate}}};

    it('formats data correctly', async () => {
        const results = await getPageViewsTestData(req);
        expect(Object.keys(results[0])).to.eql(['time', 'pageViewsData']);
        expect(Object.keys(results[0].pageViewsData[0])).to.eql(['page', 'lineOfBusiness', 'views']);
    });
});

describe('getFunnelTestData', () => {
    const startDate = moment().subtract(2, 'minute').toISOString();
    const endDate = moment().toISOString();
    const req = {url: {query: {startDate, endDate}}};

    it('formats data correctly', async () => {
        const results = await getFunnelTestData(req);
        expect(Object.keys(results[0])).to.eql(['time', 'successRatePercentagesData']);
        expect(Object.keys(results[0].successRatePercentagesData[0])).to.eql(['brand', 'rate', 'lineOfBusiness']);
    });
});

