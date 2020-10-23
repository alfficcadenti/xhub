import {expect} from 'chai';
import moment from 'moment';
import {EXPEDIA_BRAND} from '../../../constants';
import {SUCCESS_RATES_PAGES_LIST} from '../constants';
import {
    validDateRange,
    getQueryParams,
    shouldShowTooltip
} from '../utils';

describe('SuccessRates Util', () => {
    it('validDateRange - valid start date and after date', () => {
        expect(validDateRange('2020-01-01', '2020-01-02')).to.be.eql(true);
    });

    it('validDateRange - invalid start date after now', () => {
        expect(validDateRange(moment().add(1, 'day').format(), moment().add(2, 'day').format())).to.be.eql(false);
    });

    it('validDateRange - invalid start date', () => {
        expect(validDateRange(moment('asdfasdf', '2020-01-01'))).to.be.eql(false);
    });

    it('validDateRange - invalid end date', () => {
        expect(validDateRange(moment('2020-01-01', 'asdfasdf'))).to.be.eql(false);
    });

    it('getQueryParams - valid date range', () => {
        const start = '2020-10-22T12:15:00-05:00';
        const end = '2020-10-22T12:20:00-05:00';
        const lobs = 'H,C,INVALID';
        const {initialStart, initialEnd, initialTimeRange, initialLobs} = getQueryParams(`?start=${start}&end=${end}&lobs=${lobs}`);
        expect(initialStart.isSame(start, 'day')).to.equal(true);
        expect(initialEnd.isSame(end, 'day')).to.equal(true);
        expect(initialTimeRange).to.equal('Custom');
        expect(initialLobs.map(({value}) => value)).to.eql(['H', 'C']);
    });

    it('getQueryParams - default', () => {
        const {initialStart, initialEnd, initialTimeRange, initialLobs} = getQueryParams('');
        expect(initialStart.isSame(moment(), 'day')).to.equal(true);
        expect(initialEnd.isSame(moment().subtract(6, 'hours'), 'day')).to.equal(true);
        expect(initialTimeRange).to.equal('Last 6 Hours');
        expect(initialLobs.map(({value}) => value)).to.eql([]);
    });

    it('shouldShowTooltip', () => {
        expect(shouldShowTooltip(SUCCESS_RATES_PAGES_LIST[3], EXPEDIA_BRAND, [])).to.equal('Only for nonNativeApps');
        expect(shouldShowTooltip(SUCCESS_RATES_PAGES_LIST[0], null, [{value: 'H', label: 'Hotels'}])).to.equal('Only aggregated view is available for search');
        expect(shouldShowTooltip()).to.eql(null);
    });
});
