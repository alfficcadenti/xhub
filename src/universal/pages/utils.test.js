import {expect} from 'chai';
import {
    divisionToBrand, getListOfUniqueProperties, isNotEmptyString, isNotDuplicate, sortArrayByMostRecentDate, getVisiblePages
} from './utils';
import {VRBO_BRAND, HOTELS_COM_BRAND, EXPEDIA_BRAND, EGENCIA_BRAND} from '../constants';


describe('divisionToBrand', () => {
    it('returns Egencia when the input value is EGENCIA - CONSOLIDATED', () => {
        const result = divisionToBrand('EGENCIA - CONSOLIDATED');
        expect(result).to.be.eql(EGENCIA_BRAND);
    });

    it('returns Vrbo when the input value is VRBO or HOME AWAY', () => {
        const result = divisionToBrand('VRBO');
        expect(result).to.be.eql(VRBO_BRAND);
        const result2 = divisionToBrand('HOME AWAY');
        expect(result2).to.be.eql(VRBO_BRAND);
    });

    it('returns Hotels.com when the input value is HOTELS WORLDWIDE (HWW)', () => {
        const result = divisionToBrand('HOTELS WORLDWIDE (HWW)');
        expect(result).to.be.eql(HOTELS_COM_BRAND);
        const result2 = divisionToBrand('HCOM');
        expect(result2).to.be.eql(HOTELS_COM_BRAND);
    });

    it('returns BEX - Expedia Group as default when the input value doesn t match', () => {
        const result = divisionToBrand('random text');
        expect(result).to.be.eql(EXPEDIA_BRAND);
    });

    it('returns Expedia Group if division is empty', () => {
        const result = divisionToBrand();
        expect(result).to.be.eql(EXPEDIA_BRAND);
    });

    it('returns Expedia Group if division is null', () => {
        const result = divisionToBrand(null);
        expect(result).to.be.eql(EXPEDIA_BRAND);
    });
});

describe('getListOfUniqueProperties', () => {
    it('returns list of unique properties', () => {
        const mockRawIncidents = [
            {tag: 't0', priority: 'p0'},
            {tag: ['t0', 't1'], priority: 'p1'},
            {tag: ['t2'], priority: 'p1'},
            {tag: [], priority: 'p2'},
            {tag: '', priority: ''}
        ];
        const expectedTags = ['t0', 't1', 't2'];
        const expectedPriorities = ['p0', 'p1', 'p2'];
        expect(getListOfUniqueProperties(mockRawIncidents, 'tag')).to.be.eql(expectedTags);
        expect(getListOfUniqueProperties(mockRawIncidents, 'priority')).to.be.eql(expectedPriorities);
    });
});

describe('isNotEmptyString', () => {
    it('removes empty strings from array', () => {
        const arr = ['', 'a', 'b', '', 'c', ''];
        expect(arr.filter(isNotEmptyString)).to.be.eql(['a', 'b', 'c']);
    });
});

describe('isNotDuplicate', () => {
    it('removes duplicates from array', () => {
        const arr = ['', 'a', 'A', '', 11, 'a', 11, 'A', 'b', 'c'];
        expect(arr.filter(isNotDuplicate)).to.be.eql(['', 'a', 'A', 11, 'b', 'c']);
    });
});

describe('sortArrayByMostRecentDate', () => {
    it('sorts array by most recent date by specified property', () => {
        const arr = [
            {a: '2020-05-01', b: '2020-02-02'},
            {a: '2020-06-21', b: '2020-03-03'},
            {a: '2020-05-11', b: '2010-05-02'}
        ];
        expect(sortArrayByMostRecentDate(arr, 'a').map((obj) => obj.a)).to.be.eql(['2020-06-21', '2020-05-11', '2020-05-01']);
        expect(sortArrayByMostRecentDate(arr, 'b').map((obj) => obj.b)).to.be.eql(['2020-03-03', '2020-02-02', '2010-05-02']);
    });
});

describe('getVisiblePages', () => {
    it('displays only visible pages', () => {
        const visibleIds = ['visible-a', 'visible-b'];
        const pages = [{id: 'hidden', hidden: true}, {id: visibleIds[0], hidden: false}, {id: visibleIds[1]}];
        const result = getVisiblePages([VRBO_BRAND], pages);
        expect(result.length).to.be.equal(2);
        expect(result[0].id).to.be.equal(visibleIds[0]);
        expect(result[1].id).to.be.equal(visibleIds[1]);
    });
    it('displays pages be whitelisted brands', () => {
        const visibleIds = ['brand-a', 'brand-b'];
        const pages = [{id: visibleIds[0], brands: [VRBO_BRAND]}, {id: 'hidden', brands: [HOTELS_COM_BRAND]}, {id: visibleIds[1]}];
        const result = getVisiblePages([VRBO_BRAND], pages);
        expect(result.length).to.be.equal(2);
        expect(result[0].id).to.be.equal(visibleIds[0]);
        expect(result[1].id).to.be.equal(visibleIds[1]);
    });
});
