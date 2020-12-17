import {expect} from 'chai';
import {formatCRData, formatABTestsData, adjustCRsProperties, buildLink} from '../crUtils';
import mockCRsData from './mock';
import mockResults from './mockResults';


describe('crUtils', () => {
    describe('formatCRData()', () => {
        it('returns empty array if filteredCRs is not passed', () => {
            const result = formatCRData();
            expect(result).to.be.eql([]);
        });
    });

    describe('formatABTestsData()', () => {
        it('returns correct data', () => {
            const data = [{
                abTestDetails: {
                    experimentId: '39648',
                    experimentName: 'LX_3P_Reviews',
                    description: 'Abacus Event: 39648 ABORTED by vbennoli@expediagroup.com',
                    owner: 'vbennoli@expediagroup.com',
                    service: 'Abacus',
                    status: 'ABORTED'
                },
                businessJustification: 'Automated Deployment',
                businessReason: 'Upgrade',
                environmentName: 'Production',
                id: '7d1cd45adb01ac504d6b6f8b13961914',
                number: 'CHG3044926',
                openedAt: '2020-12-14T22:12:39Z',
                platform: 'Expedia',
                serviceName: 'Abacus',
                status: 'ABORTED'
            }];

            const [result] = formatABTestsData(data);
            expect(result.Application).to.be.eql('Abacus');
            expect(result.Brand).to.be.eql('Expedia');
            expect(result['Business Reason']).to.be.eql('Upgrade');
            expect(result.Description).to.be.eql('Abacus Event: 39648 ABORTED by vbennoli@expediagroup.com');
            expect(result.Platform).to.be.eql('Expedia');
            expect(result.status).to.be.eql('ABORTED');
        });
    });

    describe('formatABTestsData()', () => {
        it('returns empty array if abTests is not passed', () => {
            const result = formatABTestsData();
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
