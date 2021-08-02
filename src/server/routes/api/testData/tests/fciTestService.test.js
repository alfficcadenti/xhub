import {expect} from 'chai';
import {
    generateId,
    getTags,
    getTrace,
    getFciSites,
    getFciErrorCodes,
    getFciErrorCategories
} from '../fciTestService';

describe('Fci Test Service', () => {
    it('generateId', () => {
        expect(generateId(0).length).to.eql(0);
        expect(generateId(2).length).to.eql(2);
        expect(generateId(11).length).to.eql(11);
    });

    it('getTags', () => {
        const tagKeys = getTags().map(({key}) => key);
        expect(tagKeys).to.include('error');
        expect(tagKeys).to.include('ErrorCode');
        expect(tagKeys).to.include('externalerrorcode_1_1');
        expect(tagKeys).to.include('externalerrordescription_1_1');
        expect(tagKeys).to.include('ErrorCategory1');
        expect(tagKeys).to.include('EventDescription1');
    });

    it('getTrace', () => {
        const tagKeys = Object.keys(getTrace());
        expect(tagKeys).to.include('trace_id');
        expect(tagKeys).to.include('span_id');
        expect(tagKeys).to.include('service_name');
        expect(tagKeys).to.include('operation_name');
        expect(tagKeys).to.include('tags');
    });

    it('getFciSites', async () => {
        expect(await getFciSites()).to.eql([[
            'travel.americanexpress.com',
            'travel.rbcrewards.com',
            'travel.chase.com'
        ]]);
    });

    it('getFciErrorCodes', async () => {
        expect(await getFciErrorCodes()).to.eql([['502', '1953', '2043', '5011', '9006']]);
    });

    it('getFciErrorCategories', async () => {
        expect(await getFciErrorCategories()).to.eql([['Payments CC', 'User Error', 'Expedia Error', 'Supply Error', 'Inventory Unavailable']]);
    });
});
