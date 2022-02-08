import {expect} from 'chai';
import moment from 'moment';
import {EXPEDIA_BRAND, SUCCESS_RATES_PAGES_LIST} from '../../../constants';
import {AVAILABLE_LOBS} from '../constants';
import {
    shouldShowTooltip,
    successRatesRealTimeObject,
    getIntervalInMinutes,
    buildSuccessRateApiQueryString,
    getAllAvailableLOBs,
    getQueryParams
} from '../utils';
import {successRateRealTimeMock} from '../mockData';


describe('SuccessRates Util', () => {
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
        const expectedResult = {'Checkout (CKO) To Checkout Confirmation Page': [{'label': 'Hotels', 'rate': '79.25'}], 'Home To Search Page (SERP)': '77.92', 'Property (PDP) To Checkout Page (CKO)': [{'label': 'Hotels', 'rate': '69.25'}], 'Search (SERP) To Property Page (PDP)': [{'label': 'Hotels', 'rate': '59.25'}]};
        expect(successRatesRealTimeObject(successRateRealTimeMock, [{value: 'H', label: 'Hotels'}], 'Expedia')).to.eql(expectedResult);
    });

    it('render object with brand values if multiple LoB are selected', () => {
        const expectedResult = {'Checkout (CKO) To Checkout Confirmation Page': [{'label': 'Cars', 'rate': '52.73'}, {'label': 'Hotels', 'rate': '79.25'}], 'Home To Search Page (SERP)': '77.92', 'Property (PDP) To Checkout Page (CKO)': [{'label': 'Cars', 'rate': '42.73'}, {'label': 'Hotels', 'rate': '69.25'}], 'Search (SERP) To Property Page (PDP)': [{'label': 'Cars', 'rate': '32.73'}, {'label': 'Hotels', 'rate': '59.25'}]};
        expect(successRatesRealTimeObject(successRateRealTimeMock, [{value: 'H', label: 'Hotels'}, {value: 'C', label: 'Cars'}], 'Expedia')).to.eql(expectedResult);
    });
});

describe('getIntervalInMinutes', () => {
    it('defaults to 5 minutes given no or missing params', () => {
        expect(getIntervalInMinutes()).to.eql(5);
        expect(getIntervalInMinutes('2021-01-01T12:05:00Z', null)).to.equal(5);
        expect(getIntervalInMinutes(null, '2021-01-01T12:05:00Z')).to.equal(5);
    });
    it('sets interval to 1 day if start date is over 365 days ago', () => {
        expect(getIntervalInMinutes(moment().subtract(366, 'days').toISOString(), moment().toISOString()))
            .to.eql(2880);
    });
    it('sets interval to 2 hours if start date more than 7 days from end date', () => {
        expect(getIntervalInMinutes(moment().subtract(8, 'days'), moment().toISOString()))
            .to.eql(120);
    });
    it('sets interval to 1 hours if start date more than 24 hours from end date', () => {
        expect(getIntervalInMinutes(moment().subtract(25, 'hours').toISOString(), moment().toISOString()))
            .to.eql(60);
    });
    it('sets interval to 5 mins if start date within 24 hours ago', () => {
        expect(getIntervalInMinutes(moment().subtract(24, 'hours').toISOString(), moment().toISOString()))
            .to.eql(5);
    });
});

describe('buildSuccessRateApiQueryString()', () => {
    const start = moment('2020-11-12T11:27:00Z');
    const end = moment('2020-11-12T16:27:00Z');
    const baseUrl = '/user-events-api/v1/funnelView';
    const expectedExpediaURL = '?brand=expedia&timeInterval=1&startDate=2020-11-12T11:27:00Z&endDate=2020-11-12T16:27:00Z';
    const expectedEpsURL = '/eps?timeInterval=1&startDate=2020-11-12T11:27:00Z&endDate=2020-11-12T16:27:00Z&tpid=';
    const expectedTimeInterval = '?brand=expedia&timeInterval=5&startDate=2020-11-12T11:27:00Z&endDate=2020-11-12T16:27:00Z';
    const EPSPartner = 'orbitz';
    it('returns endpoint for eps', () => {
        expect(buildSuccessRateApiQueryString({start, end, brand: 'eps', interval: 1})).to.be.eql(`${baseUrl}${expectedEpsURL}`);
    });

    it('returns endpoint for eps with partner', () => {
        expect(buildSuccessRateApiQueryString({start, end, brand: 'eps', EPSPartner, interval: 1})).to.be.eql(`${baseUrl}${expectedEpsURL}${EPSPartner}`);
    });

    it('returns endpoint for any other brand', () => {
        expect(buildSuccessRateApiQueryString({start, end, brand: 'expedia', interval: 1})).to.be.eql(`${baseUrl}${expectedExpediaURL}`);
    });

    it('returns time interval = 5 as default', () => {
        expect(buildSuccessRateApiQueryString({start, end, brand: 'expedia'})).to.be.eql(`${baseUrl}${expectedTimeInterval}`);
    });
});

describe('getAllAvailableLOBs()', () => {
    const currentLOBs = ['H', 'C', 'F', 'CR'];

    it('returns correctly filtered LOBs', () => {
        expect(getAllAvailableLOBs(currentLOBs)).to.have.length(4);
    });
});

describe('getAllAvailableLOBs()', () => {
    const currentLOBs = ['C', 'CR', 'F', 'H'];

    it('returns currently supported LOBs', () => {
        expect(getAllAvailableLOBs(AVAILABLE_LOBS).map(({value}) => value)).to.eql(currentLOBs);
    });
});

describe('getQueryParams()', () => {
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
        expect(initialLobs.map(({value}) => value)).to.eql(['C', 'CR', 'F', 'H']);
    });
});
