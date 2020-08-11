import {expect} from 'chai';
import {formatCRData, adjustCRsProperties, buildLink} from '../crUtils';
import mockCRsData from './mock';
import mockResults from './mockResults';


describe('crUtils', () => {
    describe('formatCRData', () => {
        it('returns empty array if filteredCRs is not passed', () => {
            const result = formatCRData();
            expect(result).to.be.eql([]);
        });
    });

    describe('adjustCRsProperties()', () => {
        it('returns empty array if nothing is passed', () => {
            const result = adjustCRsProperties();
            expect(result).to.be.eql([]);
        });

        it('returns ', () => {
            const result = adjustCRsProperties(mockCRsData);
            expect(result).to.be.eql(mockResults);
        });
    });

    describe('buildLink()', () => {
        it('returns - if id not present', () => {
            const result = buildLink('');
            expect(result).to.be.eql('-');
        });

        it('returns - with href if id not present', () => {
            const result = buildLink('', 'https://github.expedia.biz/Brand-Expedia/supply-baggagefees-dwsvc-service');
            expect(result).to.be.eql('<a href=\"https://github.expedia.biz/Brand-Expedia/supply-baggagefees-dwsvc-service\" target=\"_blank\">-</a>');
        });
    });
});