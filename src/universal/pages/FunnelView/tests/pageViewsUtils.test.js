import {expect} from 'chai';
import {makePageViewLoBObjects, makePageViewObjects, buildPageViewsApiQueryString} from '../pageViewsUtils';
import {EXPEDIA_BRAND, PAGES_LIST} from '../../../constants';
import moment from 'moment';
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

describe('buildPageViewsApiQueryString()', () => {
    const start = moment('2020-11-12T11:27:00Z');
    const end = moment('2020-11-12T16:27:00Z');
    const baseUrl = '/v1/pageViews';
    const baseLoBUrl = '/v1/pageViewsLoB';
    const expectedExpediaURL = '?brand=expedia&timeInterval=1&startDate=2020-11-12T11:27:00Z&endDate=2020-11-12T16:27:00Z';
    const expectedEpsURL = '/eps?timeInterval=1&startDate=2020-11-12T11:27:00Z&endDate=2020-11-12T16:27:00Z';
    it('returns endpoint for eps', () => {
        expect(buildPageViewsApiQueryString(start, end, 'eps')).to.be.eql(`${baseUrl}${expectedEpsURL}`);
    });

    it('returns endpoint for any other brand', () => {
        expect(buildPageViewsApiQueryString(start, end, 'expedia')).to.be.eql(`${baseUrl}${expectedExpediaURL}`);
    });

    it('returns lob endpoint for eps', () => {
        expect(buildPageViewsApiQueryString(start, end, 'eps', true)).to.be.eql(`${baseLoBUrl}${expectedEpsURL}`);
    });

    it('returns lob endpoint for any other brand', () => {
        expect(buildPageViewsApiQueryString(start, end, 'expedia', true)).to.be.eql(`${baseLoBUrl}${expectedExpediaURL}`);
    });
});

