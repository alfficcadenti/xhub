import {expect} from 'chai';
import {makePageViewLoBObjects} from '../pageViewsUtils';
import {EXPEDIA_BRAND, PAGES_LIST} from '../../../constants';
import moment from 'moment';
import 'moment-timezone';
import {pageViewLoBEndpoint} from '../mockData';
import {emptyMockResults, mockResults} from './mockResults';

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
