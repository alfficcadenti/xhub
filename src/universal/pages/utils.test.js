import {expect} from 'chai';
import {divisionToBrand, getListOfUniqueProperties} from './utils';
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