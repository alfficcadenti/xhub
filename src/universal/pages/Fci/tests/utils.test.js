import moment from 'moment';
import {expect} from 'chai';
import {validDateRange, getQueryValues, getLineChartData, getErrorCodes} from '../utils';
import {ALL_ERROR_CODES, TOP_10_ERROR_CODES, TOP_20_ERROR_CODES} from '../constants';

describe('Fci Utils', () => {
    it('validDateRange - invalid dates', () => {
        expect(validDateRange(null, null)).to.be.eql(false);
        expect(validDateRange('2020-01-01', null)).to.be.eql(false);
        expect(validDateRange(null, '2020-02-02')).to.be.eql(false);
        expect(validDateRange('abc', '2020-02-02')).to.be.eql(false);
        expect(validDateRange('2020-01-01', 'abc')).to.be.eql(false);
        expect(validDateRange('2020-02-02', '2020-01-01')).to.be.eql(false);
    });

    it('validDateRange - valid', () => {
        expect(validDateRange('2020-01-01', '2020-02-02')).to.be.eql(true);
    });

    it('getQueryValues - default', () => {
        const result = getQueryValues();
        expect(result.initialTimeRange).to.be.eql('Last 1 Hour');
        expect(result.initialLobs).to.be.eql([]);
        expect(result.initialErrorCode).to.be.eql(TOP_20_ERROR_CODES);
        expect(result.initialSite).to.be.eql('travel.chase.com');
    });

    it('getQueryValues - custom', () => {
        const start = '2020-01-01';
        const end = '2020-02-02';
        const lob = 'H';
        const errorCode = '500';
        const site = 'travel.rbcrewards.com';
        const result = getQueryValues(`?from=${start}&to=${end}&lobs=${lob}&errorCode=${errorCode}&siteName=${site}`);
        expect(result.initialStart.isSame(start, 'day')).to.be.eql(true);
        expect(result.initialEnd.isSame(end, 'day')).to.be.eql(true);
        expect(result.initialTimeRange).to.be.eql('Custom');
        expect(result.initialLobs[0].value).to.be.eql(lob);
        expect(result.initialErrorCode).to.be.eql(errorCode);
        expect(result.initialSite).to.be.eql(site);
    });

    it('getLineChartData', () => {
        expect(getLineChartData(moment('2020-01-01T12:00:000Z'), moment('2020-01-01T12:59:000Z'), [{errorCode: 400}, {errorCode: 401}], ALL_ERROR_CODES).keys)
            .to.be.eql(['400', '401']);
    });

    it('getErrorCodes', () => {
        expect(getErrorCodes([{errorCode: 400}, {errorCode: 401}]))
            .to.be.eql([ALL_ERROR_CODES, TOP_10_ERROR_CODES, TOP_20_ERROR_CODES, '400', '401']);
    });
});
