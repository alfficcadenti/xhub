import {expect} from 'chai';
import moment from 'moment';
import {EXPEDIA_BRAND} from '../../../constants';
import {SUCCESS_RATES_PAGES_LIST} from '../constants';
import {
    validDateRange,
    getQueryParams,
    shouldShowTooltip,
    successRatesRealTimeObject
} from '../utils';
import {successRateRealTimeMock} from '../mockData';

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
        const {initialStart, initialEnd, initialTimeRange, initialLobs} = getQueryParams(`?from=${start}&to=${end}&lobs=${lobs}`);
        expect(initialStart.isSame(start, 'hour')).to.equal(true);
        expect(initialEnd.isSame(end, 'hour')).to.equal(true);
        expect(initialTimeRange).to.equal('Custom');
        expect(initialLobs.map(({value}) => value)).to.eql(['H', 'C']);
    });

    it('getQueryParams - default', () => {
        const {initialStart, initialEnd, initialTimeRange, initialLobs} = getQueryParams('');
        expect(initialStart.isSame(moment().subtract(6, 'hours'), 'hour')).to.equal(true);
        expect(initialEnd.isSame(moment(), 'hour')).to.equal(true);
        expect(initialTimeRange).to.equal('Last 6 Hours');
        expect(initialLobs.map(({value}) => value)).to.eql([]);
    });

    it('shouldShowTooltip', () => {
        expect(shouldShowTooltip(SUCCESS_RATES_PAGES_LIST[3], EXPEDIA_BRAND, [])).to.equal('Only for nonNativeApps');
        expect(shouldShowTooltip(SUCCESS_RATES_PAGES_LIST[0], null, [{value: 'H', label: 'Hotels'}])).to.equal('Only aggregated view is available for search');
        expect(shouldShowTooltip()).to.eql(null);
    });
});

describe('successRatesRealTimeObject()', () => {
    it('render object with N/A if fetched data is missing', () => {
        const expectedResult = {'Checkout (CKO) To Checkout Confirmation Page': 'N/A', 'Home To Search Page (SERP)': 'N/A', 'Property (PDP) To Checkout Page (CKO)': 'N/A', 'Search (SERP) To Property Page (PDP)': 'N/A'};
        expect(successRatesRealTimeObject()).to.eql(expectedResult);
    });

    it('render object with real time success rate from fetched data', () => {
        const expectedResult = {'Checkout (CKO) To Checkout Confirmation Page': '78.92', 'Home To Search Page (SERP)': '77.92', 'Property (PDP) To Checkout Page (CKO)': '75.92', 'Search (SERP) To Property Page (PDP)': '76.92'};
        expect(successRatesRealTimeObject(successRateRealTimeMock)).to.eql(expectedResult);
    });

    it('render object with LoB selected real time success rate from fetched data', () => {
        const expectedResult = {'Checkout (CKO) To Checkout Confirmation Page': '79.25', 'Home To Search Page (SERP)': '77.92', 'Property (PDP) To Checkout Page (CKO)': '69.25', 'Search (SERP) To Property Page (PDP)': '59.25'};
        expect(successRatesRealTimeObject(successRateRealTimeMock, [{value: 'H', label: 'Hotels'}], 'Expedia')).to.eql(expectedResult);
    });

    it('render object with brand values if multiple LoB are selected', () => {
        const expectedResult = {'Checkout (CKO) To Checkout Confirmation Page': '78.92', 'Home To Search Page (SERP)': '77.92', 'Property (PDP) To Checkout Page (CKO)': '75.92', 'Search (SERP) To Property Page (PDP)': '76.92'};
        expect(successRatesRealTimeObject(successRateRealTimeMock, [{value: 'H', label: 'Hotels'}, {value: 'C', label: 'Cars'}], 'Expedia')).to.eql(expectedResult);
    });
});