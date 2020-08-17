import {expect} from 'chai';
import {getFilters, getBrandFromImpulseMapping, getQueryParam} from '../impulseHandler';
const typeofFilter = 'lob';
const filterResult = ['Lodging'];
import mockFilters from './filterMock.test.json';
import {
    ALL_BRAND_GROUP,
    EG_BRAND, EGENCIA_BRAND,
    EXPEDIA_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND,
    HOTELS_COM_BRAND, VRBO_BRAND
} from '../../../constants';

const IMPULSE_MAPPING = [
    {globalFilter: EG_BRAND, impulseFilter: ALL_BRAND_GROUP},
    {globalFilter: EXPEDIA_BRAND, impulseFilter: 'Brand Expedia Group'},
    {globalFilter: EXPEDIA_PARTNER_SERVICES_BRAND, impulseFilter: 'Expedia Business Services'},
    {globalFilter: HOTELS_COM_BRAND, impulseFilter: HOTELS_COM_BRAND},
    {globalFilter: EGENCIA_BRAND, impulseFilter: EGENCIA_BRAND},
    {globalFilter: VRBO_BRAND, impulseFilter: 'VRBO'}
];


describe('impulseHandler', () => {
    describe('get filters in the array', () => {
        it('return array of filters for specific brand', () => {
            const result = getFilters(mockFilters, typeofFilter);
            expect(result[0]).to.be.eql(filterResult);
        });

        it('length of array is greater than 0', () => {
            const result = getFilters(mockFilters, typeofFilter);
            expect(result[0].length).to.be.gt(0);
        });
    });

    describe('test getQueryParam', () => {
        it('should return empty string if All LOBs passed', () => {
            expect(getQueryParam('lob', 'All LOBs', false, '')).eql('');
        });
        it('should return query string if valid LOB passed', () => {
            expect(getQueryParam('lob', 'Car', true, '')).eql('&lob=Car');
        });
    });

    describe('finds brand name from impulse map', () => {
        it('finds in global filters and return impulse filter', () => {
            const result = getBrandFromImpulseMapping(IMPULSE_MAPPING, EXPEDIA_PARTNER_SERVICES_BRAND);
            expect(result.impulseFilter).to.be.eql('Expedia Business Services');
        });
    });
});
