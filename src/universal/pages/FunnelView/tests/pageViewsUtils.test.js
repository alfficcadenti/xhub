import {expect} from 'chai';
import {makePageViewLoBObjects, makePageViewObjects} from '../pageViewsUtils';
import {EXPEDIA_BRAND, PAGES_LIST} from '../../../constants';
import moment from 'moment';
import 'moment-timezone';
import {pageViewLoBEndpoint, pageViewMockData} from '../mockData';
import {emptyMockResults, mockResults, pageViewsMockResults, emptyPageViewsMockResults} from './mockResults';

describe('makePageViewLoBObjects component testing', () => {
    const start = moment('2020-08-10');
    const end = moment('2020-08-11');
    it('creates an array with one element for each page view in PAGES_LIST', () => {
        expect(makePageViewLoBObjects([], start, end, EXPEDIA_BRAND)).to.have.length(PAGES_LIST.length);
    });

    it('returns array with objects if no inputs are passed', () => {
        expect(makePageViewLoBObjects()).to.eql(emptyMockResults);
    });

    test('each array element has lob: true', () => {
        const lobArray = makePageViewLoBObjects([], start, end, EXPEDIA_BRAND);
        lobArray.forEach((x) => expect(x.lob).to.be.true);
    });

    it('creates an array with each object and the expected format', () => {
        expect(makePageViewLoBObjects(pageViewLoBEndpoint, start, end, EXPEDIA_BRAND)).to.eql(mockResults);
    });
});

describe('makePageViewObjects()', () => {
    const start = moment('2020-08-10');
    const end = moment('2020-08-11');
    it('creates an array with one element for each page view in PAGES_LIST', () => {
        expect(makePageViewObjects([], start, end, EXPEDIA_BRAND)).to.have.length(PAGES_LIST.length);
    });

    it('returns array with objects if no inputs are passed', () => {
        expect(makePageViewObjects()).to.eql(emptyPageViewsMockResults);
    });

    test('each array element has lob: undefined', () => {
        const lobArray = makePageViewObjects([], start, end, EXPEDIA_BRAND);
        lobArray.forEach((x) => expect(x.lob).to.be.undefined);
    });

    it('creates an array with each object and the expected format', () => {
        expect(makePageViewObjects(pageViewMockData, start, end, EXPEDIA_BRAND)).to.eql(pageViewsMockResults);
    });
});
