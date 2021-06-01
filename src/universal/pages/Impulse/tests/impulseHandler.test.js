import {expect} from 'chai';
import {getFilters, getQueryParamMulti, getBrandQueryParam, getQueryString, getRevLoss} from '../impulseHandler';
import moment from 'moment';

let endDate = moment().set({second: 0}).format('YYYY-MM-DDTHH:mm:ss');
let startDate = moment().set({second: 0}).subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ss');
const typeofFilter = 'lob';
const filterResult = {label: 'Lodging', value: 'Lodging'};
import mockFilters from './filterMock.test.json';
import mockRevenue from './revenueLossMock.json';
import {
    ALL_BRAND_GROUP,
    EG_BRAND, EGENCIA_BRAND,
    EXPEDIA_BRAND,
    EXPEDIA_PARTNER_SERVICES_BRAND,
    HOTELS_COM_BRAND, VRBO_BRAND,
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
        it('return object of filters for specific lob', () => {
            const result = getFilters(mockFilters, typeofFilter);
            expect(result[0]).to.be.eql(filterResult);
        });
    });

    describe('test getQueryParam', () => {
        it('should return empty string if All LOBs passed', () => {
            expect(getQueryParamMulti('lob', '')).eql('');
        });
        it('should return query string if valid LOB passed', () => {
            expect(getQueryParamMulti('lob', ['Car'])).eql('&lob=Car');
        });
        it('should return query string if valid LOBs if multiple LOBs passed', () => {
            expect(getQueryParamMulti('lob', ['Car', 'Air'])).eql('&lob=Car,Air');
        });
    });
    describe('test brand query string', () => {
        it('should return empty string if All Brand Group passed', () => {
            expect(getBrandQueryParam(IMPULSE_MAPPING, EG_BRAND)).eql('');
        });
        it('should return brandName = Expedia Business Services if Expedia Partner Services passed', () => {
            expect(getBrandQueryParam(IMPULSE_MAPPING, EXPEDIA_PARTNER_SERVICES_BRAND)).eql('&brand_group_names=Expedia%20Business%20Services');
        });
        it('should return brand=Egencia if Egencia passed', () => {
            expect(getBrandQueryParam(IMPULSE_MAPPING, EGENCIA_BRAND)).eql('&brands=Egencia');
        });
    });
    describe('test final query string', () => {
        it('should return string with datetime into query string if no filter has been selected', () => {
            expect(getQueryString(moment().set({second: 0}), moment().set({second: 0}).subtract(1, 'days'), IMPULSE_MAPPING, EG_BRAND, [], [], [], [], [], [], [])).eql(`?start_time=${endDate}Z&end_time=${startDate}Z`);
        });
    });
    describe('test revenue loss calculation method', () => {
        it('should return integer greater than zero on valid revenue impact details', () => {
            expect(getRevLoss(mockRevenue[1])).to.be.above(0);
        });
        it('return string should contain NA on empty revenue loss', () => {
            expect(getRevLoss(mockRevenue[0])).to.include('NA');
        });
        it('return string should contain NA on empty estimatedImpact', () => {
            expect(getRevLoss(mockRevenue[2])).to.include('NA');
        });
    });
});
